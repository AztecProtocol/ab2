use dep::aztec::macros::aztec;
pub mod x;
#[aztec]
contract XModule {
    use aztec::{
        prelude::{AztecAddress, PublicMutable, SharedMutable},
        macros::{storage::storage, functions::{initializer, public, private, view}}
    };

    use dep::passport::AztecPassport;

    #[storage]
    struct Storage<Context> {
        // Admin of Contract
        admin: PublicMutable<AztecAddress, Context>,
        // Passport Contract Address
        passport_address: SharedMutable<AztecAddress, 1, Context>,
    }

    use crate::x::verify_x;
    use dep::noir_social_verify::zkemail::{KEY_LIMBS_2048, dkim::RSAPubkey, Sequence};

    pub global MAX_EMAIL_HEADER_LENGTH: u32 = 576;
    pub global MAX_EMAIL_BODY_LENGTH: u32 = 16384;
    pub global MAX_USERNAME_LENGTH: u32 = 64;

    #[public]
    #[initializer]
    fn constructor(_admin: AztecAddress) {
        assert(!_admin.is_zero(), "Aztec Passport: Invalid Address");
        storage.admin.write(_admin);
    }

    #[public]
    fn set_admin(new_admin: AztecAddress) {
        assert(storage.admin.read().eq(context.msg_sender()), "Aztec Passport: Unauthorized Admin Change");
        storage.admin.write(new_admin);
    }

    #[public]
    #[view]
    fn get_admin_public() -> Field {
        storage.admin.read().to_field()
    }

    #[public]
    fn is_admin() -> bool {
        storage.admin.read().eq(context.msg_sender())
    }

    #[public]
    fn get_passport_address() -> AztecAddress {
        storage.passport_address.get_current_value_in_public()
    }

    #[public]
    fn set_passport_address(_passport_address: AztecAddress) {
        // assert(is_admin(), "Aztec PasspoPrt: Only Admin");

        let _ = storage.passport_address.schedule_value_change(_passport_address);
    }

    #[private]
    fn verify(
        address: AztecAddress,
        header_array: [u8; MAX_EMAIL_HEADER_LENGTH],
        body_array: [u8; MAX_EMAIL_BODY_LENGTH],
        pubkey_modulus: [Field; KEY_LIMBS_2048],
        pubkey_redc: [Field; KEY_LIMBS_2048],
        signature: [Field; KEY_LIMBS_2048],
        body_hash_index: u32,
        dkim_header_sequence_index: u32,
        dkim_header_sequence_length: u32,
        from_header_sequence_index: u32,
        from_header_sequence_length: u32,
        from_address_sequence_index: u32,
        from_address_sequence_length: u32,
        username_array: [u8; MAX_USERNAME_LENGTH]
    ) {
        let passport_address = storage.passport_address.get_current_value_in_private();

        let expected_username: BoundedVec<u8, MAX_USERNAME_LENGTH> = BoundedVec::from(username_array);
        let header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH> = BoundedVec::from(header_array);
        let body: BoundedVec<u8, MAX_EMAIL_BODY_LENGTH> = BoundedVec::from(body_array);

        let pubkey = RSAPubkey { modulus: pubkey_modulus, redc: pubkey_redc };

        let from_address_sequence = Sequence { index: from_address_sequence_index, length: from_address_sequence_length };

        let from_header_sequence = Sequence { index: from_header_sequence_index, length: from_header_sequence_length };

        let dkim_header_sequence = Sequence { index: dkim_header_sequence_index, length: dkim_header_sequence_length };

        let extracted_username = verify_x(
            header,
            body,
            pubkey,
            signature,
            body_hash_index,
            dkim_header_sequence,
            from_header_sequence,
            from_address_sequence,
            expected_username
        );

        assert(extracted_username.eq(expected_username));

        let index = AztecPassport::at(passport_address).get_service_index_private(context.this_address()).view(&mut context);
        let _ = AztecPassport::at(passport_address).verify_service(address, index, context.this_address()).call(&mut context);
    }
}
