use zkemail::{KEY_LIMBS_2048, dkim::RSAPubkey};
use zkemail::Sequence;
use zkemail::headers::email_address::get_email_address;

global MAX_EMAIL_HEADER_LENGTH: u32 = 512; // Consider further redusing it
pub global FROM_EMAIL_LENGTH: u32 = 19;
pub global FROM_EMAIL: [u8; FROM_EMAIL_LENGTH] = "noreply@aboutyou.bg".as_bytes();

fn main(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    signature: [Field; KEY_LIMBS_2048],
    pubkey: RSAPubkey<KEY_LIMBS_2048>
) {}

// subject_header_sequence: Sequence,
// subject_address_sequence: Sequence,
// purchase_number: [u8; 18],
// purchase_number_length: u32
fn verify_purchase(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048],
    from_header_sequence: Sequence,
    from_address_sequence: Sequence,
    to_header_sequence: Sequence,
    to_address_sequence: Sequence
) -> BoundedVec<u8, 320> {
    // Check that the header's length is within bounds
    assert(header.len() <= MAX_EMAIL_HEADER_LENGTH);

    // Verify the dkim signature over the header
    pubkey.verify_dkim_signature(header, signature);

    let from = comptime {
        "from".as_bytes()
    };

    let to = comptime {
        "to".as_bytes()
    };

    let subject = comptime {
        "subject".as_bytes()
    };

    let from_address: BoundedVec<u8, 320> = get_email_address(header, from_header_sequence, from_address_sequence, from);

    assert(from_address.is_eq(FROM_EMAIL));

    let to_address: BoundedVec<u8, 320> = get_email_address(header, to_header_sequence, to_address_sequence, to);

    to_address
}

pub trait BoundedVecExtentions {
    fn is_eq<let M: u32>(self, array: [u8;M]) -> bool;
}

impl BoundedVecExtentions for BoundedVec<u8,320> {
    fn is_eq<let M: u32>(self, array: [u8; M]) -> bool {
        if (self.len != M) {
            false
        }
        for i in 0..M {
            if {
                self.get_unchecked(i) != array[i]
            } {
                false
            }
        }
        true
    }
}
