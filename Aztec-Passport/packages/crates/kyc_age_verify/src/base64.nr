pub global INVALID_VALUE: u8 = 255;
pub global MAX_MESSAGE_LENGTH: u32 = 256;
pub global MAX_MESSAGE_LENGTH_URL: u32 = 64;
pub global MAX_OUTPUT_LENGTH: u32 = ((MAX_MESSAGE_LENGTH * 3) / 4);
pub global MAX_OUTPUT_LENGTH_URL: u32 = ((MAX_MESSAGE_LENGTH_URL * 3) / 4);

struct Base64DecodeBE {
    table: [u8; 256]
}

impl Base64DecodeBE {
    /// Creates a new decoder that uses the standard Base64 Alphabet (base64) specified in RFC 4648
    /// https://datatracker.ietf.org/doc/html/rfc4648#section-4
    fn new() -> Self {
        Base64DecodeBE {
            table: [
                // 0-42
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                62,// 43
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,// 44-46
                63,// 47
                52, 53, 54, 55, 56, 57, 58, 59, 60, 61,// 48-57
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,// 58-64
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,// 65-90 (A-Z)
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,// 91-96
                26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,// 97-122 (a-z)
                // 123-255
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE
            ]
        }
    }

    fn get(self, idx: Field) -> u8 {
        self.table[idx]
    }
}

struct Base64URLDecodeBE {
    table: [u8; 256]
}

impl Base64URLDecodeBE {
    /// Creates a new decoder that uses the standard Base64 with URL and Filename safe (base64) specified in RFC 4648
    /// https://datatracker.ietf.org/doc/html/rfc4648#page-7
    fn new() -> Self {
        Base64URLDecodeBE {
            table: [
                // 0-42
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,
                INVALID_VALUE, INVALID_VALUE,
                62,// 45
                INVALID_VALUE, INVALID_VALUE,
                52, 53, 54, 55, 56, 57, 58, 59, 60, 61,// 48-57
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,// 58-64
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,// 65-90 (A-Z)
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE,// 91-94
                63,// 95
                INVALID_VALUE,// 96
                26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,// 97-122 (a-z)
                // 123-255
                INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE, INVALID_VALUE
            ]
        }
    }

    fn get(self, idx: Field) -> u8 {
        self.table[idx]
    }
}

pub fn base64_decode_elements(input: [u8; MAX_MESSAGE_LENGTH], length: u32) -> [u8; MAX_MESSAGE_LENGTH] {
    let mut Base64Decoder = Base64DecodeBE::new();

    let mut result: [u8; MAX_MESSAGE_LENGTH] = [32; MAX_MESSAGE_LENGTH]; // Whitespace Pad

    for i in 0..MAX_MESSAGE_LENGTH {
        if (i < length) {
            let input_byte = input[i];
            result[i] = Base64Decoder.get(input_byte as Field);
            assert(result[i] != INVALID_VALUE, f"DecodeError: invalid symbol {input_byte}, offset {i}.");
        }
    }
    result
}

pub fn base64_decode(input: [u8; MAX_MESSAGE_LENGTH], length: u32) -> [u8; MAX_OUTPUT_LENGTH] {
    let decoded: [u8; MAX_MESSAGE_LENGTH] = base64_decode_elements(input, length);
    let mut result: [u8; MAX_OUTPUT_LENGTH] = [32; MAX_OUTPUT_LENGTH];
    let out_len = (length * 3) / 4;
    let BASE64_ELEMENTS_PER_CHUNK: u32 = 40;
    let BYTES_PER_CHUNK: u32 = 30;
    let num_chunks = (length / BASE64_ELEMENTS_PER_CHUNK)
        + (length % BASE64_ELEMENTS_PER_CHUNK != 0) as u32;

    if num_chunks > 0 {
        for i in 0..num_chunks - 1 {
            let mut slice: Field = 0;
            for j in 0..BASE64_ELEMENTS_PER_CHUNK {
                slice *= 64;
                slice += decoded[i * BASE64_ELEMENTS_PER_CHUNK + j] as Field;
            }
            let slice_bytes: [u8; 30] = slice.to_be_bytes();
            for j in 0..BYTES_PER_CHUNK {
                result[i * BYTES_PER_CHUNK + j] = slice_bytes[j];
            }
        }

        let base64_elements_in_final_chunk = length - ((num_chunks - 1) * BASE64_ELEMENTS_PER_CHUNK);

        let mut slice: Field = 0;
        for j in 0..base64_elements_in_final_chunk {
            slice *= 64;
            slice += decoded[(num_chunks - 1) * BASE64_ELEMENTS_PER_CHUNK + j] as Field;
        }
        for _ in base64_elements_in_final_chunk..BASE64_ELEMENTS_PER_CHUNK {
            slice *= 64;
        }
        let slice_bytes: [u8; 30] = slice.to_be_bytes();
        let num_bytes_in_final_chunk = out_len - ((num_chunks - 1) * BYTES_PER_CHUNK);
        for i in 0..num_bytes_in_final_chunk {
            result[(num_chunks - 1) * BYTES_PER_CHUNK + i] = slice_bytes[i];
        }
    }

    result
}

pub fn base64_url_decode_elements(
    input: [u8; MAX_MESSAGE_LENGTH_URL],
    length: u32
) -> [u8; MAX_MESSAGE_LENGTH_URL] {
    let mut Base64URLDecoder = Base64URLDecodeBE::new();

    let mut result: [u8; MAX_MESSAGE_LENGTH_URL] = [0; MAX_MESSAGE_LENGTH_URL];

    for i in 0..MAX_MESSAGE_LENGTH_URL {
        if (i < length) {
            let input_byte = input[i];
            result[i] = Base64URLDecoder.get(input_byte as Field);
            assert(result[i] != INVALID_VALUE, f"DecodeError: invalid symbol {input_byte}, offset {i}.");
        }
    }
    result
}

pub fn base64_url_decode(
    input: [u8; MAX_MESSAGE_LENGTH_URL],
    length: u32
) -> [u8; MAX_OUTPUT_LENGTH_URL] {
    let decoded: [u8; MAX_MESSAGE_LENGTH_URL] = base64_url_decode_elements(input, length);
    let mut result: [u8; MAX_OUTPUT_LENGTH_URL] = [0; MAX_OUTPUT_LENGTH_URL];
    let BASE64_ELEMENTS_PER_CHUNK: u32 = 40;
    let BYTES_PER_CHUNK: u32 = 30;
    let num_chunks = (MAX_MESSAGE_LENGTH_URL / BASE64_ELEMENTS_PER_CHUNK)
        + (MAX_MESSAGE_LENGTH_URL % BASE64_ELEMENTS_PER_CHUNK != 0) as u32;

    if num_chunks > 0 {
        for i in 0..num_chunks - 1 {
            let mut slice: Field = 0;
            for j in 0..BASE64_ELEMENTS_PER_CHUNK {
                slice *= 64;
                slice += decoded[i * BASE64_ELEMENTS_PER_CHUNK + j] as Field;
            }
            let slice_bytes: [u8; 30] = slice.to_be_bytes();
            for j in 0..BYTES_PER_CHUNK {
                result[i * BYTES_PER_CHUNK + j] = slice_bytes[j];
            }
        }

        let base64_elements_in_final_chunk = MAX_MESSAGE_LENGTH_URL - ((num_chunks - 1) * BASE64_ELEMENTS_PER_CHUNK);

        let mut slice: Field = 0;
        for j in 0..base64_elements_in_final_chunk {
            slice *= 64;
            slice += decoded[(num_chunks - 1) * BASE64_ELEMENTS_PER_CHUNK + j] as Field;
        }
        for _ in base64_elements_in_final_chunk..BASE64_ELEMENTS_PER_CHUNK {
            slice *= 64;
        }
        let slice_bytes: [u8; 30] = slice.to_be_bytes();
        let num_bytes_in_final_chunk = MAX_OUTPUT_LENGTH_URL - ((num_chunks - 1) * BYTES_PER_CHUNK);
        for i in 0..num_bytes_in_final_chunk {
            result[(num_chunks - 1) * BYTES_PER_CHUNK + i] = slice_bytes[i];
        }
    }

    result
}
