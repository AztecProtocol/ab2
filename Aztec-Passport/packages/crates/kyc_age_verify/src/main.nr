pub mod jwt;
pub mod base64;
pub mod hmac;
use base64::base64_decode;

use jwt::{JWT, Payload, SecretKey, verify_jwt, split_jwt};
use json::JSON1kb::JSON;

pub global EIGHTEEN_YEARS_IN_SECONDS: u64 = 18 * 365 * 24 * 60 * 60;

unconstrained pub fn main(
    timestamp: pub u64,
    jwt: JWT,
    secret_key: SecretKey,
    header_length: u32,
    payload_length: u32,
    signature_length: u32
) -> pub bool {
    let (verified, payload): (bool, Payload) = verify_jwt(jwt, secret_key, header_length, payload_length, signature_length);
    let decoded = base64_decode(payload, payload_length);
    assert(verified, "JWT verification failed");
    let json: JSON = JSON::parse_json(decoded);
    let birthdate = json.get_number_unchecked("birthdate".as_bytes());
    let is_above_eighteen = timestamp - EIGHTEEN_YEARS_IN_SECONDS > birthdate;
    assert(is_above_eighteen, "Not above 18 years old");
    true
}

#[test]
fn test_valid_jwt() {
    let header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9".as_bytes();
    let payload = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJiaXJ0aGRhdGUiOjEwOTg2NDE2MDN9".as_bytes();

    let signature = "MFLNcbOEVB4lFSvMIP-RKXXYCphJC22SmS07iX0RM6k".as_bytes();

    let mut padded_header = [0; 64];
    let mut padded_payload = [0; 256];
    let mut padded_signature = [0; 64];

    let mut jwt = [0; 64 + 1 + 256 + 1 + 64];

    for i in 0..header.len() {
        padded_header[i] = header[i];
    }
    for i in 0..payload.len() {
        padded_payload[i] = payload[i];
    }
    for i in 0..signature.len() {
        padded_signature[i] = signature[i];
    }

    for i in 0..padded_header.len() {
        jwt[i] = padded_header[i];
    }

    jwt[64] = 46;

    for i in 0..padded_payload.len() {
        jwt[64 + 1 + i] = padded_payload[i];
    }

    jwt[64 + 1 + 256] = 46;

    for i in 0..padded_signature.len() {
        jwt[64 + 1 + 256 + 1 + i] = padded_signature[i];
    }

    let mut secret_key = [0; 64];
    let key = "secret_key".as_bytes();
    for i in 0..key.len() {
        secret_key[i] = key[i];
    }

    unsafe {
        main(
            1729793701,
            jwt,
            secret_key,
            header.len(),
            payload.len(),
            signature.len()
        )
    };
}
