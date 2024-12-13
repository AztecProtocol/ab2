pub mod service;

use dep::aztec::macros::aztec;

pub global SCALE: u64 = 1000000;

#[aztec]
pub contract AztecPassport {
    use aztec::{
        prelude::{AztecAddress, PublicMutable, Map, SharedMutable},
        macros::{storage::storage, functions::{initializer, public, private, view}},
        keys::getters::get_public_keys
    };

    use dep::value_note::{balance_utils::get_balance};

    use dep::easy_private_state::EasyPrivateUint;
    use crate::service::Service;

    pub global SCALE: u64 = 1000000;

    #[storage]
    struct Storage<Context> {
        // Admin of Contract
        admin: PublicMutable<AztecAddress, Context>,
        // Track Count of Total Services
        total_services: SharedMutable<u64, 1, Context>,
        // Service ID => Service
        services: Map<u64, PublicMutable<Service, Context>, Context>,
        // Service Address -> ID
        service_indexes: Map<AztecAddress, SharedMutable<u64, 1, Context>, Context>,
        //  Address => Service ID => verified(boolean)
        scores: Map<AztecAddress, Map<u64, EasyPrivateUint<Context>, Context>, Context>,
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
    fn add_service(address: AztecAddress, weight: u64, base_score: u64, max_score: u64) {
        assert(storage.admin.read().eq(context.msg_sender()), "Aztec Passport: Only Admin");
        let service_id = storage.total_services.get_current_value_in_public();
        storage.services.at(service_id).write(Service { address, weight, base_score, max_score });
        storage.service_indexes.at(address).schedule_value_change(service_id);
        storage.total_services.schedule_value_change(service_id + 1);
    }

    #[public]
    #[view]
    fn get_service(service_id: u64) -> Service {
        storage.services.at(service_id).read()
    }

    #[public]
    #[view]
    fn get_total_services() -> u64 {
        storage.total_services.get_current_value_in_public()
    }

    #[private]
    #[view]
    fn get_total_services_private() -> u64 {
        storage.total_services.get_current_value_in_private()
    }

    #[public]
    #[view]
    fn get_service_index(address: AztecAddress) -> u64 {
        storage.service_indexes.at(address).get_current_value_in_public()
    }

    #[private]
    #[view]
    fn get_service_index_private(address: AztecAddress) -> u64 {
        storage.service_indexes.at(address).get_current_value_in_private()
    }

    unconstrained fn is_verified(address: AztecAddress, service_id: u64) -> bool {
        let res = storage.scores.at(address).at(service_id).set;
        let balance = get_balance(res);
        balance as u32 >= 1
    }

    unconstrained fn get_all_verified(address: AztecAddress) -> [Service; 10] {
        let mut verified_services: [Service; 10] = [Service { address: AztecAddress::zero(), weight: 0, base_score: 0, max_score: 0 }; 10];

        let total = storage.total_services.get_current_value_in_unconstrained();

        for i in 0..total {
            let service = storage.services.at(i).read();
            let res = storage.scores.at(address).at(i).set;
            let balance = get_balance(res);
            let verified = balance as u32 >= 1;
            if (verified) {
                verified_services[i] = service;
            }
        }
        verified_services
    }

    #[private]
    fn verify_service(address: AztecAddress, service_id: u64, service_address: AztecAddress) {
        assert(service_address.eq(context.msg_sender()), "Aztec Passport: Only Service");
        let res = storage.service_indexes.at(service_address).get_current_value_in_private();
        assert(res == service_id, "Aztec Passport: Invalid Service");
        storage.scores.at(address).at(service_id).add(1, address, address);
    }

    unconstrained fn get_total_score(address: AztecAddress) -> u64 {
        // Total Score Calculation based on weighed average of verified services and honoring diminishing returns and bonus multiplier and rounding it to 0-100

        // Total Base = Sum of Base Scores of Verified Services
        // Total Max = Sum of Max Scores of Verified Services

        // Diminishing Factor = (Verified Services * SCALE) / Total Services
        // Bonus Multiplier = (Verified Services * SCALE * Total Weight) / Total Services

        // User Will get the whole base score
        // Diminishing Factor will reduce the max score based on the number of verified services
        // Bonus Multiplier will increase the max score based on the number of verified services and the weight of the services so a service will more weight will have more impact on the score.
        let mut total_weight: u64 = 0;
        let mut total_base_contribution = 0;
        let mut total_max_contribution = 0;
        let mut total_verified_base_contribution: u64 = 0;
        let mut total_verified_max_contribution: u64 = 0;
        let mut verified_count: u64 = 0;

        let total_services: u64 = storage.total_services.get_current_value_in_unconstrained();

        for i in 0..total_services {
            let service = storage.services.at(i).read();
            total_weight += service.weight;
            total_base_contribution += service.base_score;
            total_max_contribution += ((service.max_score - service.base_score) * service.weight) / SCALE;
            let res = storage.scores.at(address).at(i).set;
            let balance = get_balance(res);
            let verified = balance as u32 >= 1;
            if (verified) {
                total_verified_base_contribution += service.base_score;
                total_verified_max_contribution += ((service.max_score - service.base_score) * service.weight) / SCALE;
                verified_count += 1;
            }
        }

        if (verified_count == 0) {
            0
        }

        let diminishing_factor = (verified_count * SCALE) / total_services;
        let bonus_multiplier = (verified_count * total_weight) / total_services;

        let adjusted_max_score = (total_verified_max_contribution * diminishing_factor) / SCALE;
        let bonus_score = (adjusted_max_score * bonus_multiplier / SCALE);
        let final_score = total_verified_base_contribution + bonus_score;

        let max_theortical = total_base_contribution + ((total_max_contribution * total_weight) / SCALE);

        let mut rounded_score = final_score;

        if (rounded_score > SCALE * 100) {
            rounded_score = (final_score * 100 * SCALE) / max_theortical;
        }

        rounded_score
    }
}
