use dep::aztec::macros::aztec;
#[aztec]
contract ENSModule {
    use aztec::{
        prelude::{AztecAddress, PublicMutable, SharedMutable}, protocol_types::{address::EthAddress},
        macros::{storage::storage, functions::{initializer, public, private, view}}
    };

    use dep::passport::AztecPassport;

    #[storage]
    struct Storage<Context> {
        // Admin of Contract
        admin: PublicMutable<AztecAddress, Context>,
        // Mock ENS Address
        ens_registry: SharedMutable<EthAddress, 1, Context>,
        // Passport Contract Address
        passport_address: SharedMutable<AztecAddress, 1, Context>,
    }

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
    #[view]
    fn is_admin() -> bool {
        storage.admin.read().eq(context.msg_sender())
    }

    #[public]
    #[view]
    fn get_passport_address() -> AztecAddress {
        storage.passport_address.get_current_value_in_public()
    }

    #[public]
    fn set_passport_address(_passport_address: AztecAddress) {
        let _ = storage.passport_address.schedule_value_change(_passport_address);
    }

    #[public]
    fn set_ens_registry(_registry: EthAddress) {
        let _ = storage.ens_registry.schedule_value_change(_registry);
    }

    #[public]
    #[view]
    fn get_ens_registry() -> EthAddress {
        storage.ens_registry.get_current_value_in_public()
    }

    #[private]
    fn verify(address: AztecAddress, content: Field, secret: Field) {
        let passport_address = storage.passport_address.get_current_value_in_private();
        let sender = storage.ens_registry.get_current_value_in_private();

        context.consume_l1_to_l2_message(content, secret, sender);

        assert(content as u32 == 1, "Aztec Passport: Invalid Content");

        let index = AztecPassport::at(passport_address).get_service_index_private(context.this_address()).view(&mut context);
        let _ = AztecPassport::at(passport_address).verify_service(address, index, context.this_address()).call(&mut context);
    }
}
