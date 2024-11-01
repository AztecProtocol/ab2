use dep::aztec::macros::aztec;
#[aztec]
contract GetMembershipWitness {
    use dep::aztec::{oracle::{
        get_membership_witness::get_membership_witness_oracle,
        get_nullifier_membership_witness::{
            get_low_nullifier_membership_witness_oracle, 
            NULLIFIER_MEMBERSHIP_WITNESS // 24
        }
    }};

    unconstrained pub fn low_nullifier(
        block_number: u32,
        nullifier_the: Field
    ) -> pub [Field; NULLIFIER_MEMBERSHIP_WITNESS] {
        get_low_nullifier_membership_witness_oracle(block_number, nullifier_the)
    }

    unconstrained pub fn get_the(
        block_num: u32,
        note_hashed: Field
    ) -> pub [Field; 33] {
        get_membership_witness_oracle(block_num, 1, note_hashed)
    }
}
