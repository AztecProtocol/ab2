use dep::aztec::macros::aztec;

#[aztec]
contract Counter {
    use aztec::prelude::{AztecAddress, Map};
    use value_note::balance_utils;
    use easy_private_state::EasyPrivateUint;
    use aztec::macros::{storage::storage, functions::{initializer, private}};

    #[storage]
    struct Storage<Context> {
        counters: Map<AztecAddress, EasyPrivateUint<Context>, Context>,
    }

    #[initializer]
    #[private]
    fn initialize(headstart: u64, owner: AztecAddress, outgoing_viewer: AztecAddress) {
        let counters = storage.counters;
        counters.at(owner).add(headstart, owner, outgoing_viewer);
    }
    // docs:end:constructor

    // docs:start:increment
    #[private]
    fn increment(owner: AztecAddress, outgoing_viewer: AztecAddress) {
        unsafe {
            dep::aztec::oracle::debug_log::debug_log_format("Incrementing counter for owner {0}", [owner.to_field()]);
        }
        let counters = storage.counters;
        counters.at(owner).add(1, owner, outgoing_viewer);
    }
    // docs:end:increment
    // docs:start:get_counter
    unconstrained fn get_counter(owner: AztecAddress) -> pub Field {
        let counters = storage.counters;
        balance_utils::get_balance(counters.at(owner).set)
    }
}
