use dep::zkemail::{dkim::verify_dkim_2048, get_body_hash_by_index, base64::body_hash_base64_decode};
use dep::std::hash::sha256_var;
use crate::utils::find_from_index;

global EMAIL_HEADER_LENGTH: u32 = 576;
global EMAIL_BODY_LENGTH: u32 = 16384;
global FROM_EMAIL_LENGTH: u32 = 14;
global FROM_EMAIL: [u8; FROM_EMAIL_LENGTH] = "X <info@x.com>".as_bytes(); // example of string search

pub fn verify_x(
    header: [u8; EMAIL_HEADER_LENGTH],
    header_length: u32,
    body_hash_index: u32,
    body: [u8; EMAIL_BODY_LENGTH],
    body_length: u32,
    pubkey: [Field; 18],
    pubkey_redc: [Field; 18],
    signature: [Field; 18]
) {
    verify_dkim_2048(header, header_length, pubkey, pubkey_redc, signature);

    let body_hash_encoded: [u8; 44] = get_body_hash_by_index(header, body_hash_index);
    let signed_body_hash: [u8; 32] = body_hash_base64_decode(body_hash_encoded);

    let computed_body_hash: [u8; 32] = sha256_var(body, body_length as u64);

    assert(
        signed_body_hash == computed_body_hash, "SHA256 hash computed over body does not match body hash found in DKIM-signed header"
    );

    let (found, _) = find_from_index(header, FROM_EMAIL, FROM_EMAIL_LENGTH);
    assert(found, "Email is not sent by Official X Email");
    // TODO: Verify Twitter Username from Email Body
}
