use dep::string_search::{StringBody, SubString, StringBody512, SubString32, SubString64, StringBody1024};

pub fn find_from_index<let M: u32, let N: u32>(
    header: [u8; M],
    padded_recipient_local: [u8; N],
    recipient_local_length: u32
) -> (bool, u32) {
    let needle_text_init: [u8; 5] = "from:".as_bytes();
    let needle_start: SubString32 = SubString::new(needle_text_init, needle_text_init.len());
    let needle_end: SubString64 = SubString::new(padded_recipient_local, recipient_local_length);
    let needle = needle_start.concat_into(needle_end);

    // init the search domain
    let haystack: StringBody1024 = StringBody::new(header, M);

    // find the index of the position
    haystack.substring_match(needle)
}

pub fn extract_expected_sender_domain<let M: u32, let N: u32>(
    header: [u8; M],
    recipient_local_length: u32,
    index: u32
) -> [u8; N] {
    let mut recipient_domain = [0 as u8; N];
    for i in 0..N {
        // iterator + found index starting the to search + length of recipient local address + len(from:)
        // should start at `@`
        recipient_domain[i] = header[i + index + recipient_local_length + 5];
    }
    recipient_domain
}
