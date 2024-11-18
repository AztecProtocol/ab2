use dep::aztec::prelude::AztecAddress;

use dep::aztec::protocol_types::traits::{Serialize, Deserialize};

pub struct Service {
    address: AztecAddress,
    weight: u64,
    base_score: u64,
    max_score: u64,
}

impl Serialize<4> for Service {
    fn serialize(self) -> [Field; 4] {
        [
            self.address.to_field(), self.weight as Field, self.base_score as Field, self.max_score as Field
        ]
    }
}

impl Deserialize<4> for Service {
    fn deserialize(data: [Field; 4]) -> Self {
        Service {
            address: AztecAddress::from_field(data[0]),
            weight: data[1] as u64,
            base_score: data[2] as u64,
            max_score: data[3] as u64
        }
    }
}
