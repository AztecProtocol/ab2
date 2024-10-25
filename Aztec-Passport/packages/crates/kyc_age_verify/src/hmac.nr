use std::hash::sha256::{sha256_var, sha256};

pub fn xor_key(key: [u8; 64], pad_byte: u8) -> [u8; 64] {
    let mut result: [u8; 64] = [0 as u8; 64];
    for i in 0..64 {
        result[i] = key[i] ^ pad_byte;
    }
    result
}

pub fn hmac_sha256<let M: u32>(key: [u8; 64], message: [u8; M], length: u64) -> [u8; 32] {
    let inner_key_pad: [u8; 64] = xor_key(key, 0x36);
    let outer_key_pad: [u8; 64] = xor_key(key, 0x5C);

    // Step 3: Perform the inner hash (SHA256(key XOR ipad || message))
    let inner_input: [u8; M + 64] = inner_key_pad.concat(message);
    let inner_hash: [u8; 32] = sha256_var(inner_input, length + 64);

    // Step 4: Perform the outer hash (SHA256(key XOR opad || inner_hash))
    let outer_input: [u8; 64 + 32] = outer_key_pad.concat(inner_hash);
    let hmac_result: [u8; 32] = sha256(outer_input);

    hmac_result
}

trait ArrayExtentions {
    fn concat<let N: u32>(self, other: [u8; N]) -> [u8; N + 64];
}

impl ArrayExtentions for [u8; 64] {
    fn concat<let N: u32>(self, other: [u8; N]) -> [u8; N + 64] {
        let mut result: [u8; N + 64] = [0 as u8; N + 64];
        for i in 0..64 {
            result[i] = self[i];
        }
        for i in 0..N {
            result[i + 64] = other[i];
        }
        result
    }
}
