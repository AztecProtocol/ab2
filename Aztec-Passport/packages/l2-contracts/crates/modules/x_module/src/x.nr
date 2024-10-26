use dep::string_search::{SubString, SubString128, StringBody16384, SubString64};
use dep::string_search::StringBody;

trait Equal<T> {
    fn is_eq(self, array: T) -> bool;
}

impl<let MaxLen: u32, let M: u32> Equal<[u8; M]> for BoundedVec<u8, MaxLen> {
    fn is_eq(self, array: [u8; M]) -> bool {
        let mut res = true;
        if (self.len != array.len()) {
            res = false;
        }

        for i in 0..MaxLen {
            if (i < self.len) {
                if (self.storage[i] != array[i]) {
                    res = false;
                }
            }
        }

        res
    }
}

pub fn find_x_username(
    data: [u8; 16384],
    data_length: u32,
    padded_username: [u8; 64],
    username_length: u32
) -> (bool, u32) {
    let needle_text_init = "If you requested a password reset for ".as_bytes();

    let needle_start: SubString64 = SubString::new(needle_text_init, needle_text_init.len());
    let needle_end: SubString128 = SubString::new(padded_username, username_length);
    // use concat_into because SubString128 > SubString32
    let needle = needle_start.concat_into(needle_end);

    let haystack: StringBody16384 = StringBody::new(data, data_length);
    let (result, match_position): (bool, u32) = haystack.substring_match(needle);

    (result, match_position)
}

use dep::zkemail::{
    KEY_LIMBS_2048, dkim::RSAPubkey, headers::body_hash::get_body_hash, Sequence,
    headers::email_address::get_email_address
};
use dep::std::hash::sha256_var;

pub global MAX_EMAIL_HEADER_LENGTH: u32 = 576;
pub global MAX_EMAIL_BODY_LENGTH: u32 = 16384;
pub global FROM_EMAIL_LENGTH: u32 = 10;
pub global MAX_USERNAME_LENGTH: u32 = 64;
pub global FROM_EMAIL: [u8; FROM_EMAIL_LENGTH] = "info@x.com".as_bytes(); // example of string search

pub global SEARCH_STRING_LENGTH: u32 = 38;
pub global SEARCH_STRING_START: [u8; 38] = "If you requested a password reset for ".as_bytes();

pub fn verify_x(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    body: BoundedVec<u8, MAX_EMAIL_BODY_LENGTH>,
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048],
    body_hash_index: u32,
    dkim_header_sequence: Sequence,
    from_header_sequence: Sequence,
    from_address_sequence: Sequence,
    username: BoundedVec<u8, MAX_USERNAME_LENGTH>
) -> BoundedVec<u8, MAX_USERNAME_LENGTH> {
    assert(header.len() <= MAX_EMAIL_HEADER_LENGTH);
    assert(body.len() <= MAX_EMAIL_BODY_LENGTH);

    pubkey.verify_dkim_signature(header, signature);

    // let signed_body_hash = get_body_hash(header, dkim_header_sequence, body_hash_index);
    // let computed_body_hash: [u8; 32] = sha256_var(body.storage, body.len() as u64);
    // assert(
    //     signed_body_hash == computed_body_hash, "Social Verify Error: SHA256 hash computed over body does not match body hash found in DKIM-signed header"
    // );

    let from = comptime {
        "from".as_bytes()
    };

    let from_address: BoundedVec<u8, 320> = get_email_address(header, from_header_sequence, from_address_sequence, from);

    assert(from_address.is_eq(FROM_EMAIL));

    let (found,_): (bool,u32) = find_x_username(body.storage, body.len, username.storage, username.len());

    assert(found, "Social Verify Error: Cannot Find Username in Email Body");

    username
}
