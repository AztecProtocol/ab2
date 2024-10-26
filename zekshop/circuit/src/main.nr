use zkemail::{KEY_LIMBS_2048, dkim::RSAPubkey};
use dep::string_search::{StringBody, SubString128, SubString};

global MAX_PARTIAL_EMAIL_BODY_LENGTH: u32 = 1216;
global MAX_EMAIL_HEADER_LENGTH: u32 = 576; // Consider further redusing it
type StringBody1280 = StringBody<1302, 42, 1280>;

fn main(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    body: BoundedVec<u8, MAX_PARTIAL_EMAIL_BODY_LENGTH>,
    purchase_number: [u8; 10],
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048]
) {
    verify_purchase(header, body, pubkey, signature, purchase_number)
}

fn verify_purchase(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    body: BoundedVec<u8, MAX_PARTIAL_EMAIL_BODY_LENGTH>,
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048],
    purchase_number: [u8; 10]
) {
    // Check that the header's length is within bounds
    assert(header.len() <= MAX_EMAIL_HEADER_LENGTH);

    // Verify the dkim signature over the header
    pubkey.verify_dkim_signature(header, signature);

    // Construct haystack from header to search for substrings
    let haystack: StringBody1280 = StringBody::new(body.storage, body.len);

    assert_purchase_number_in_header(haystack, purchase_number, purchase_number.len());
}

fn assert_purchase_number_in_header(
    haystack: StringBody1280,
    purchase_number: [u8; 10],
    purchase_number_length: u32
) {
    // String search in body
    let purchase_number_substring: SubString128 = SubString::new(purchase_number, purchase_number_length);
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
