pub mod service;
pub mod math;

use dep::aztec::macros::aztec;

#[aztec]
contract AztecPassport {
    use aztec::prelude::{AztecAddress, PublicMutable, Map};
    use aztec::macros::{storage::storage, functions::{initializer, public, private, view}};

    use crate::service::Service;
    use crate::math::{SCALE, log, exp};

    #[storage]
    struct Storage<Context> {
        // Admin of Contract
        admin: PublicMutable<AztecAddress, Context>,
        // Track Count of Total Services
        total_services: PublicMutable<u64, Context>,
        // Service ID => Service
        services: Map<u64, PublicMutable<Service, Context>, Context>,
        //  Address => Service ID => verified(boolean)
        scores: Map<AztecAddress, Map<u64, PublicMutable<bool, Context>, Context>, Context>
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
    fn is_admin() -> bool {
        storage.admin.read().eq(context.msg_sender())
    }

    #[public]
    fn add_service(address: AztecAddress, weight: u64, base_score: u64, max_score: u64) {
        assert(is_admin(), "Aztec Passport: Only Admin");
        let service_id = storage.total_services.read();
        storage.services.at(service_id).write(Service { address, weight, base_score, max_score });
        storage.total_services.write(service_id + 1);
    }

    #[public]
    fn get_service(service_id: u64) -> Service {
        storage.services.at(service_id).read()
    }

    #[public]
    fn get_service_index(address: AztecAddress) -> u64 {
        let total_services = storage.total_services.read();
        for i in 0..total_services {
            let service = get_service(i);
            if {
                {
                    (service.address.eq(address))
                }
            } {
                i
            }
        }
        0
    }

    #[public]
    fn is_verified(address: AztecAddress, service_id: u64) -> bool {
        storage.scores.at(address).at(service_id).read()
    }

    #[public]
    fn get_total_score(address: AztecAddress) -> u64 {
        let mut total_weight: u64 = 0;
        let mut total_base_contribution: u64 = 0;
        let mut total_max_contribution: u64 = 0;
        let mut verified_count: u64 = 0;

        let total_services = storage.total_services.read();

        for i in 0..total_services {
            let service = get_service(i);
            total_weight += service.weight;
            if (is_verified(address, i)) {
                total_base_contribution += (service.base_score * service.weight) / SCALE;
                total_max_contribution += (service.max_score * service.weight) / SCALE;
                verified_count += 1;
            }
        }

        if (verified_count == 0) {
            0
        }

        let adjusted_score: u64 = (total_max_contribution * log(verified_count)) / log(total_services);
        let bonus_multiplier: u64 = exp(10 * (((verified_count * SCALE) / total_services) - SCALE / 2));

        let final_score: u64 = (total_base_contribution + adjusted_score) * bonus_multiplier / (SCALE * SCALE);

        final_score
    }
}
