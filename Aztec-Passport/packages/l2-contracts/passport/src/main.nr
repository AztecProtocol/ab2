use dep::aztec::macros::aztec;

#[aztec]
contract AztecPassport {
    use aztec::prelude::{AztecAddress, PublicMutable};
    use aztec::macros::{storage::storage, functions::{initializer, public}};

    #[storage]
    struct Storage<Context> {
        admin: PublicMutable<AztecAddress, Context>,
    }

    #[public]
    #[initializer]
    fn constructor(_admin: AztecAddress) {
        assert(!_admin.is_zero(), "Aztec Passport: Invalid Address");
        storage.admin.write(_admin);
    }
}
