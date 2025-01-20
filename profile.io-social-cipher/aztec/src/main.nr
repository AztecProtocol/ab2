use dep::aztec::macros::aztec;

#[aztec]
contract Profile {
    use dep::aztec::{
        note::utils::compute_note_hash_for_nullify, keys::getters::get_nsk_app, oracle::random::random,
        encrypted_logs::encrypted_note_emission::encode_and_encrypt_note,
        note::constants::MAX_NOTES_PER_PAGE,
        keys::getters::get_public_keys, prelude::{AztecAddress, PrivateSet, SharedImmutable, Map, NullifiableNote, NoteHeader, PrivateContext, NoteViewerOptions},
        protocol_types::{constants::GENERATOR_INDEX__NOTE_NULLIFIER, hash::poseidon2_hash_with_separator, traits::{Empty, Eq}},
        macros::notes::partial_note
    };
    use dep::value_note::balance_utils;
    use dep::easy_private_state::EasyPrivateUint;
    use dep::aztec::macros::{storage::storage, functions::{initializer, private}};
    use dep::value_note::value_note::ValueNote;
    
    // TODO: remove from this file and import from outside
    #[partial_note(quote { token_id})]
    struct ProfileNFT {
        token_id: Field,
        is_adult: bool,
        npk_m_hash: Field,
    }

    // TODO: remove from this file and import from outside
    impl ProfileNFT {
        pub fn new(token_id: Field, is_adult: bool, npk_m_hash: Field) -> Self {
            ProfileNFT { token_id, is_adult, npk_m_hash, header: NoteHeader::empty() }
        }
    }

    // TODO: remove from this file and import from outside
    impl Eq for ProfileNFT {
        fn eq(self, other: Self) -> bool {
            (self.token_id == other.token_id)
                & (self.npk_m_hash == other.npk_m_hash)
        }
    }
    
    // TODO: remove from this file and import from outside
    impl NullifiableNote for ProfileNFT {
    fn compute_nullifier(self, context: &mut PrivateContext, note_hash_for_nullify: Field) -> Field {
        let secret = context.request_nsk_app(self.npk_m_hash);
        poseidon2_hash_with_separator(
            [
            note_hash_for_nullify,
            secret
        ],
            GENERATOR_INDEX__NOTE_NULLIFIER as Field
        )
    }

    // TODO: remove from this file and import from outside
    unconstrained fn compute_nullifier_without_context(self) -> Field {
        let note_hash_for_nullify = compute_note_hash_for_nullify(self);
        let secret = get_nsk_app(self.npk_m_hash);
        poseidon2_hash_with_separator(
            [
            note_hash_for_nullify,
            secret
        ],
            GENERATOR_INDEX__NOTE_NULLIFIER as Field
        )
    }
}

    #[storage]
    struct Storage<Context> {
        profile_nfts: Map<AztecAddress, PrivateSet<ProfileNFT, Context>, Context>,
    }

    /**
     * initialize the contract's initial state variables.
     */
    #[private]
    #[initializer]
    fn constructor(initial_supply: u64, owner: AztecAddress, outgoing_viewer: AztecAddress) {
        // leave it in case
    }

     // TODO: requester might not need since there is msg.sender
    #[public]
    fn request_age_verification(target_user: AztecAddress, requester: AztecAddress) {  
        // WIP
    }

    #[private]
    fn mintNFT(to: AztecAddress, token_id: Field, is_adult: bool) {
        let profile_nfts = storage.profile_nfts;
        let to_keys = get_public_keys(to);
        let mut nft_note = ProfileNFT::new(token_id, is_adult, to_keys.npk_m.hash());
        
        // TODO: sending an event to the NFT owner after update storage. Is this meaningful? Can it be a proof?
        // TODO: emitting event is a way to send message to someone?
        profile_nfts.at(to).insert(&mut nft_note).emit(encode_and_encrypt_note( 
            &mut context, 
            to_keys.ovpk_m,
            to_keys.ivpk_m,
            to
        ));
    }

    // get nft note info such as token_id, is_adult
    unconstrained fn get_profile_nfts(owner: AztecAddress, page_index: u32) -> [(Field, bool); 10] {
        let offset = page_index * MAX_NOTES_PER_PAGE;
        let mut options = NoteViewerOptions::new();
        let profile_nfts = storage.profile_nfts;
        let notes = profile_nfts.at(owner).view_notes(options.set_offset(offset));
        let mut owned_nft_ids = [(0, false); MAX_NOTES_PER_PAGE];

        for i in 0..options.limit {
            if i < notes.len() {
                owned_nft_ids[i] = (notes.get_unchecked(i).token_id, notes.get_unchecked(i).is_adult);  // returns as [token_id, is_adult]
            }
        }

        (owned_nft_ids)
    }
}