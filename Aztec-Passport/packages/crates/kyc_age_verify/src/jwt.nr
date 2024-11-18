use crate::base64::base64_url_decode;
use crate::hmac::hmac_sha256;

pub global MAX_HEADER_LENGTH: u32 = 64;
pub global MAX_PAYLOAD_LENGTH: u32 = 256;
pub global MAX_SIGNATURE_LENGTH: u32 = 64;

// Header + . + Payload + . + Signature
pub type JWT = [u8; MAX_HEADER_LENGTH + 1 + MAX_PAYLOAD_LENGTH + 1 + MAX_SIGNATURE_LENGTH];
pub type Header = [u8; MAX_HEADER_LENGTH];
pub type Payload = [u8; MAX_PAYLOAD_LENGTH];
pub type Signature = [u8; MAX_SIGNATURE_LENGTH];
pub type SecretKey = [u8; 64];

pub fn split_jwt(
    jwt: JWT,
    header_length: u32,
    payload_length: u32,
    signature_length: u32
) -> (Header, Payload, Signature) {
    let mut header = [0; MAX_HEADER_LENGTH];
    let mut payload = [32; MAX_PAYLOAD_LENGTH]; // Fill with Whitespaces
    let mut signature = [0; MAX_SIGNATURE_LENGTH];

    let header_start = 0;
    let header_end = header_length;
    let payload_start = MAX_HEADER_LENGTH + 1;
    let payload_end = payload_start + payload_length;
    let signature_start = MAX_HEADER_LENGTH + 1 + MAX_PAYLOAD_LENGTH + 1;
    let signature_end = signature_start + signature_length;

    for i in header_start..header_end {
        header[i] = jwt[i];
    }

    for i in payload_start..payload_end {
        payload[i - payload_start] = jwt[i];
    }

    for i in signature_start..signature_end {
        signature[i - signature_start] = jwt[i];
    }

    (header, payload, signature)
}

pub fn verify_jwt(
    jwt: JWT,
    secret_key: SecretKey,
    header_length: u32,
    payload_length: u32,
    signature_length: u32
) -> (bool, Payload) {
    // Step 1: Split the JWT (header.payload.signature)
    let (encoded_header,encoded_payload, encoded_signature): (Header,Payload,Signature) = split_jwt(jwt, header_length, payload_length, signature_length);

    // Step 2: Base64 decode the Signature
    let decoded_signature= base64_url_decode(encoded_signature, signature_length);

    // Step 3: Create the signing input
    let input_length: u32 = header_length + 1 + payload_length;
    // header + . + payload
    let mut signing_input: [u8; MAX_HEADER_LENGTH + 1 + MAX_PAYLOAD_LENGTH] = [0; MAX_HEADER_LENGTH + 1 + MAX_PAYLOAD_LENGTH];

    for i in 0..header_length {
        signing_input[i] = encoded_header[i];
    }

    signing_input[header_length] = 46; // ASCII value of .
    for i in 0..payload_length {
        signing_input[header_length + 1 + i] = encoded_payload[i];
    }

    // Step 4: Compute HMAC of the signing input and Secret Key
    let hmac_signature: [u8; 32] = hmac_sha256(secret_key, signing_input, input_length as u64);

    let  mut verified: bool = true;

    for i in 0..32 {
        if hmac_signature[i] != decoded_signature[i] {
            verified = false;
        }
    }

    (verified, encoded_payload)
}
