use zkemail::{KEY_LIMBS_2048, dkim::RSAPubkey};
use zkemail::Sequence;
use zkemail::headers::email_address::get_email_address;
use dep::string_search::{StringBody, SubString128, SubString};

pub global FROM_EMAIL_LENGTH: u32 = 19;
pub global FROM_EMAIL: [u8; FROM_EMAIL_LENGTH] = "noreply@aboutyou.bg".as_bytes();
global MAX_EMAIL_HEADER_LENGTH: u32 = 512; // Consider further redusing it
type StringBody1280 = StringBody<1302, 42, 1280>;

fn main(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    header_length: u32,
    purchase_number: [u8; 18],
    purchase_number_length: u32,
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048],
    from_header_sequence: Sequence,
    from_address_sequence: Sequence,
    to_header_sequence: Sequence,
    to_address_sequence: Sequence
) -> pub BoundedVec<u8, 320> {
    verify_purchase(
        header,
        header_length,
        purchase_number,
        purchase_number_length,
        pubkey,
        signature,
        from_header_sequence,
        from_address_sequence,
        to_header_sequence,
        to_address_sequence
    )
}

fn verify_purchase(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    header_length: u32,
    purchase_number: [u8; 18],
    purchase_number_length: u32,
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

    let from_address: BoundedVec<u8, 320> = get_email_address(header, from_header_sequence, from_address_sequence, from);

    assert(from_address.is_eq(FROM_EMAIL));

    let to_address: BoundedVec<u8, 320> = get_email_address(header, to_header_sequence, to_address_sequence, to);

    // Construct haystack from header to search for substrings
    let haystack: StringBody1280 = StringBody::new(header.storage, header_length);

    assert_purchase_number_in_header(haystack, purchase_number, purchase_number_length);

    to_address
}

fn assert_purchase_number_in_header(
    haystack: StringBody1280,
    purchase_number: [u8; 18],
    purchase_number_length: u32
) {
    let mut purchase_number_string = purchase_number;

    // String search in body
    let purchase_number_substring: SubString128 = SubString::new(purchase_number_string, purchase_number_length);
    let (match_found2, _): (bool, u32) = haystack.substring_match(purchase_number_substring);

    assert(match_found2, "header does not contain this purchase number");
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
