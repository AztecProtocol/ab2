use dep::protocol_types::{
    header::{Header, HEADER_LENGTH}, address::{AztecAddress},
    utils::{arr_copy_slice, field::{full_field_less_than, full_field_greater_than}},
    merkle_tree::root::root_from_sibling_path,
    constants::{GENERATOR_INDEX__NOTE_NULLIFIER, GENERATOR_INDEX__OUTER_NULLIFIER},
    hash::poseidon2_hash_with_separator
};
use dep::nft_contract::types::nft_note::NFTNote;
use aztec::{
    note::{
        utils::compute_note_hash_for_nullify,
        note_header::NoteHeader,
    },
    // is it possible to connect to `sandbox` via `aztec-nargo`? #oracleresolve
    oracle::{
        // get_membership_witness::MembershipWitness,
        get_nullifier_membership_witness::{
            NullifierMembershipWitness,
            NULLIFIER_MEMBERSHIP_WITNESS // 24
        }
    },
};
use std::embedded_curve_ops::fixed_base_scalar_mul as derive_public_key;
use protocol_types::scalar::Scalar;

fn main(
    // TODO looks like it's possible to leave just the root from this #header_root
    //      it's also #hidingprecise since at least global vars should be included as a `pub`
    blockheader_serd: pub [Field; 24],
    // TODO I guess it's possible to invent a context when sharing `nsk_m` is ok; though it will be narrow
    nsk_m: [Field; 2],
    // TODO should hash of the nullifier key be private? #hashednotehiding
    //      seems it would be beneficial to deconstruct this with different hiding #hidingprecise
    note_content: [Field; 3],
    contract_address_as_field: pub Field,
    nonce: Field,
    // TODO is it possible to leverage this further?
    storage_slot: Field,
    // TODO check hiding #hidingprecise
    //      #hashednotehiding
    witness_membership_serd: [Field; 33],
    // TODO check hiding #hidingprecise
    //      my concern is that no problem for showing the root, but below that it starts leaking
    low_nullifier_membership_witness_serd: [Field; NULLIFIER_MEMBERSHIP_WITNESS],
    // debug_notehash: Field,
    // debug_nsk_app: Field
) {
    let contract_address = AztecAddress::from_field(contract_address_as_field);

    let mut note_the = NFTNote::deserialize_content(note_content);
    note_the.set_header(NoteHeader::new(
        contract_address,
        nonce,
        storage_slot
    ));
    let nsk_m = Scalar::new(nsk_m[0], nsk_m[1]);
    assert_eq(
        note_content[1], 
        derive_public_key(nsk_m).hash(),
        "wrong nullifier key"
    );
    // #oracleresolve
    // Header::deserialize(blockheader).prove_note_inclusion(note_the);
    // let witness_membership = MembershipWitness { 
    //     index: witness_membership_serd[0], path: arr_copy_slice(
    //         witness_membership_serd, [0; 32], 1
    //     ) 
    // };

    let blockheader = Header::deserialize(blockheader_serd);
    let note_hashed_for_nullify = compute_note_hash_for_nullify(note_the);

    // assert_eq(note_hashed_for_nullify, debug_notehash, "wrong note-hashing");
    
    assert_eq(
        // TODO optimize by leaving only a root in the data exchange #header_root
        blockheader.state.partial.note_hash_tree.root, 
        root_from_sibling_path(
            note_hashed_for_nullify, 
            witness_membership_serd[0], 
            arr_copy_slice(
                witness_membership_serd, [0; 32], 1
            ) 
        ), 
        "Proving note inclusion failed"
    );

    // assert_eq(debug_nsk_app, poseidon2_hash_with_separator(
    //     [nsk_m.hi, nsk_m.lo, contract_address_as_field],
    //     48
    // ), "bad `nsk_app` algorithm");

    let nullifier = poseidon2_hash_with_separator([
        contract_address_as_field,
        poseidon2_hash_with_separator(
            [
                note_hashed_for_nullify,
                poseidon2_hash_with_separator(
                    [nsk_m.hi, nsk_m.lo, contract_address_as_field],
                    48
                )
            ], 
            GENERATOR_INDEX__NOTE_NULLIFIER as Field
        )
    ], GENERATOR_INDEX__OUTER_NULLIFIER);
    // pasta of `prove_nullifier_non_inclusion` from </home/serge/nargo/github.com/AztecProtocol/aztec-packages/aztec-packages-v0.57.0/noir-projects/aztec-nr/aztec/src/history/nullifier_non_inclusion.nr>
    let witness = NullifierMembershipWitness::deserialize(low_nullifier_membership_witness_serd);
    let low_nullifier_leaf = witness.leaf_preimage;
    assert_eq(
        blockheader.state.partial.nullifier_tree.root, // #header_root
        root_from_sibling_path(
            low_nullifier_leaf.hash(), 
            witness.index, witness.path
        ), 
        "Proving nullifier non-inclusion failed: Could not prove low nullifier inclusion"
    );
    assert(
        full_field_less_than(low_nullifier_leaf.nullifier, nullifier), "Proving nullifier non-inclusion failed: low_nullifier.value < nullifier.value check failed"
    );
    assert( 
        full_field_greater_than(low_nullifier_leaf.next_nullifier, nullifier)
        | (low_nullifier_leaf.next_index == 0), "Proving nullifier non-inclusion failed: low_nullifier.next_value > nullifier.value check failed"
    );
}
