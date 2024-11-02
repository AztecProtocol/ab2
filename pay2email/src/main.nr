// let's assume a reasonable username and a domain are both a `FieldCompressedString` (31 ASCII)

use dep::aztec::macros::aztec;
#[aztec]
contract EmailBalances {
    use dep::aztec::prelude::{AztecAddress, Map, PublicImmutable};
    use zkemail::{KEY_LIMBS_1024, dkim::RSAPubkey};

    use dep::aztec::macros::{storage::storage, functions::{private, public, initializer, internal}};
    
    global ZERO_INDEX: u8 = 48; // https://github.com/madztheo/noir-string-utils/blob/main/src/lib.nr#L232
    // TODO find a good value for this, it's just a guess now.
    global MAX_HEADER_LENGTH: u32 = 1024;
    
    // use dep::compressed_string::CompressedString;
    // pub struct SelectedDomain<
    //     let DN: u32, 
    //     let DM: u32, 
    //     let SN: u32, 
    //     let SM: u32
    // > {
    //     domain: CompressedString<DN, DM>,
    //     // TODO can it be limited more effectively?
    //     selector: CompressedString<SN, SM>,
    // }

    #[storage]
    struct Storage<Context> {
        /* 
        * admin controlled
        * let's forget for a moment how that could change and endulge simplicity of the prototype */
        pubkeys: Map<Field, PublicImmutable<Field, Context>, Context>,
        // let's be simple yet
        signatures_hashed: Map<Field, PublicImmutable<bool, Context>, Context>
    }
    #[public]
    #[initializer]
    fn constructor_test(
        // admin: AztecAddress
    ) {}

    /* an example of an `AztecAddress`
    0x11f14cd0aa0bbf9210a5aaef237be9b672f5d0e8b21daed01882c2ab618f99cb
    0x0000000000000000000000000000000000000000000000000000000000000000 */
    /* 
    p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmmx1FS5zycLSUYBmcGT3EWD84Uq+5MfwtxkYDAWcKDKhVhfV1vh0MA7oRZKvWEXPKj9qm1vSDNR/oB0ZSvKNqptCIpKwLzzrglqqZRCenP/xof07N6LX31Gl5pWM5uT8PkeqxFpP1SoRX3crz7VHjokg8qzIA6aNkzus+XE1v4/SDA41/Odsd6zLqr1XJR3AGIpr1Ky+d78QSw3iYkK83BpFC9Zau/Wza/BRIwMxm7VvRikJwosGrPrx2at4igwHOqRoRRtJhwLyhQJTx6haLjz/E6Ss8/YR4CzhO+GRllgi2puS3a3qz7u51wWRcK5QB+VrY+5DtZvNtKdk4yefbwIDAQAB */

    // #[derive_deserialize]
    // pub struct FromAddress {
    //     user: ([u8; 31], u8),
    //     domain: ([u8; 31], u8),
    // }
    // impl FromAddress {
    //     pub fn get(Self) -> (BoundedVec<u8, 31>, BoundedVec<u8, 31>) {
    //         ()
    //     }
    // }

    
    /// this one is more precise as it's aimed to those who chose to have an own `AztecAddress`, so they're ready to produce a precise email
    #[public]
    // `<let HeadersLen: u32, let BodyLen: u32>` // https://github.com/olehmisar/zkemail/blob/ef63deecd11adf4a53416bd10132a07264989f69/src/lib.nr#L18C37-L18C76
    pub fn link(
        address_the: AztecAddress,
        // from: (BoundedVec<u8, 31>, BoundedVec<u8, 31>),
        // from: FromAddress,
        header_from_ind: u32,
        from_name: [u8; 31], 
        from_name_ind: u8, 
        from_domain: [u8; 31], 
        from_domain_ind: u8,
        // subject: ...
        body_hash_base64: str<44>,
        msg: [u8; 64+77], 
        // header: BoundedVec<u8, MAX_HEADER_LENGTH>, 
        // header: BoundedVec<u8, HeadersLen>, 
        header: [u8; MAX_HEADER_LENGTH],
        header_ind: u32,
        pubkey: [Field; KEY_LIMBS_1024],
        pubkey_redc: [Field; KEY_LIMBS_1024],
        signature: [Field; KEY_LIMBS_1024]
    ) {
        let address_bytes = address_the.to_field().to_be_bytes(); // this kinda can be optimized into one `mut` array
        assert_eq(address_bytes.len(), 32, "debug: can it be less for small elements?");
        let mut address_charcodes = [0; 64];
        for i in 0..32 {
            let j = i * 2;
            let charcodes = hex_two(address_bytes[i]);
            address_charcodes[j] = charcodes[0];
            address_charcodes[j+1] = charcodes[1];
        }
            
        let body_required = "beware, this will enable control of all your tokens from the Aztec address 0x";
        assert_eq(msg.as_slice(), body_required.as_bytes().as_slice().append(address_charcodes.as_slice()));

        // https://github.com/olehmisar/zkemail/blob/main/src/body_hash.nr
        // https://github.com/olehmisar/zkemail/blob/ef63deecd11adf4a53416bd10132a07264989f69/src/lib.nr#L31
        assert_eq(std::hash::sha256(msg), noir_base64::base64_encode(body_hash_base64.as_bytes()));

        // let signature_record = 
        //     storage.signatures_hashed.at(signature.hash(state));
        // assert(signature_record.read(), "message can be used only once");
        // signature_record.initialize(true);
        
        // assert(from_name_ind < 31 & from_domain_ind < 31);
        // // TODO check that there's no way "from" can have no "\r\n" prepended
        // //      TODO and postpended too
        // let charcodes_rn = "\r\n".as_bytes().as_slice(); // TODO move to constants
        // assert_eq(
        //     charcodes_rn.append(
        //         "from:".as_bytes().as_slice(), 
        //         from_name[..from_name_ind], 
        //         "@".as_bytes().as_slice(), 
        //         from_domain[..from_domain_ind], 
        //         charcodes_rn
        //     ),
        //     header[header_from_ind - 4..header_from_ind+5+from_name_ind+1+1+from_domain_ind+1+4],
        //     "`from` doesn't match the one indexed in the `header`"
        // );

        // linking date is a factor! but the date isn't reliable in emails, so it's best to include and `assert` data of current linking that is replaced now
        
        // subject_required

        // check the contract address
        /* end symbol
        nothing under the line affects the operation */
    }

    // fn hex_digit_at<N>(s: str<N>, index: u64) -> u8 { // https://github.com/madztheo/noir-string-utils/blob/main/src/lib.nr#L232
    fn hex_two(byte: pub u8) -> pub [u8; 2] {
        let hi = byte / 16;
        let lo = byte % 16;
        [hex_one(hi), hex_one(lo)]
    }
    global HEX_CODES: [u8; 16] = [
        48, 49, 50, 51, 52, 
        53, 54, 55, 56, 57, 
        65, 66, 67, 68, 69, 70
    ];
    fn hex_one(hex: pub u8) -> pub u8 {HEX_CODES[hex]}
}

use dep::aztec::test::{
    helpers::{cheatcodes, test_environment::TestEnvironment}
};
#[test]
unconstrained fn smoke() {
    /* 
    public_key_limbs [0xe56b63ee43b59bcdb4a764e3279f6f,0x9b92ddadeacfbbb9d7059170ae5007,0xa4acf3f611e02ce13be191965822da,0x1b498702f2850253c7a85a2e3cff13,0x8b06acfaf1d9ab788a0c073aa46845,0xf5b36bf0512303319bb56f462909c2,0xbf104b0de26242bcdc1a450bd65abb,0xaccbaabd57251dc0188a6bd4acbe77,0x3bacf97135bf8fd20c0e35fce76c77,0x772bcfb5478e8920f2acc803a68d93,0x958ce6e4fc3e47aac45a4fd52a115f,0x109e9cfff1a1fd3b37a2d7df51a5e6,0xf28daa9b422292b02f3ceb825aaa65,0x45cf2a3f6a9b5bd20cd47fa01d194a,0x32a15617d5d6f874300ee84592af58,0x60fce14abee4c7f0b719180c059c28,0x6c75152e73c9c2d25180667064f711,0x9a]
    public_key_redc_limbs [0x19c868334abfcb61d60c6f03d1ec26,0x175e8ba85b4bd6b335c40db95dd223,0x93d323d38c85b062251e37703f5f4f,0xe6f603e750d3f2f76d170b5c06fec0,0x0dc2d864264fbe42d10594e518af8b,0x5c9d8996f7a44b82550b341aefea09,0x03b31d19a2a99bc623425591214d42,0x2edc4e9a9aba4964b4cdc0649c8448,0x9e5e008018be0da77e45f27549e131,0x5ac08d1c7715d83542b522558be958,0x0246da002399a9c3942384845dac14,0x41d7407aa211b88ded61d197dd507a,0xe845d8151f8a14387ad2b1dfc8b5d4,0x47b60c213b8338a5fc6e4447ebae1b,0x4f8603cb43379f86d296a96a9d23c5,0xf11e994859013105d02c4870f2d662,0x64136bf9f08289b275d225a746642d,0x01a8]
    signature_limbs [0xfcd41f9fe89ae5175649b7064f32c1,0x824da2b82aaf61a6eb88b729069c3c,0xb98dfa622bf0150b6fff18bda09e31,0xe0f05be66ff5ce536834bf61f2eda0,0x59a5e9e8c7f0b3ce4edf0e8546ea97,0x95807527894c9ca72fe949c0faa3ab,0x53d4380069fbe8be95aedbb8aa679f,0xf5d7cc70fccc4d796d0c69d214a38c,0x4b4a2135fd5085d63563ecb1ac6025,0xd6dd6dd1157be02054068330d06c9d,0xa3cf814c17fed87aaf7c6588e2d59d,0x4aa762d6f3a1cb9327e56902b8bb26,0xc602091939654b8ce1b616bb444ddc,0xa6df09f9a272120b90bc89cedcfa4b,0x988853aeb2d1caaf549894ba3a51cc,0x0f19159ac89174bf907d19736650ac,0x70b77860ba4631ec59de01e0ec2545,0x96] */
    
    // let h = [ 100, 97, 116, 101, 58, 83, 97, 116, 44, 32, 49, 57, 32, 79, 99, 116, 32, 50, 48, 50, 52, 32, 48, 48, 58, 52, 49, 58, 48, 56, 32, 43, 48, 51, 48, 48, 13, 10, 102, 114, 111, 109, 58, 115, 107, 97, 117, 110, 111, 118, 32, 60, 115, 107, 97, 117, 110, 111, 118, 64, 100, 105, 115, 114, 111, 111, 116, 46, 111, 114, 103, 62, 13, 10, 115, 117, 98, 106, 101, 99, 116, 58, 116, 101, 115, 116, 13, 10, 116, 111, 58, 115, 107, 97, 117, 110, 111, 118, 64, 100, 105, 115, 114, 111, 111, 116, 46, 111, 114, 103, 13, 10, 100, 107, 105, 109, 45, 115, 105, 103, 110, 97, 116, 117, 114, 101, 58, 118, 61, 49, 59, 32, 97, 61, 114, 115, 97, 45, 115, 104, 97, 50, 53, 54, 59, 32, 99, 61, 114, 101, 108, 97, 120, 101, 100, 47, 115, 105, 109, 112, 108, 101, 59, 32, 100, 61, 100, 105, 115, 114, 111, 111, 116, 46, 111, 114, 103, 59, 32, 115, 61, 109, 97, 105, 108, 59, 32, 116, 61, 49, 55, 50, 57, 50, 56, 55, 54, 55, 53, 59, 32, 98, 104, 61, 72, 80, 72, 100, 87, 55, 87, 120, 56, 55, 118, 114, 106, 74, 55, 104, 54, 56, 78, 122, 90, 115, 106, 82, 102, 48, 48, 88, 47, 70, 112, 76, 122, 122, 119, 76, 80, 54, 57, 76, 109, 103, 65, 61, 59, 32, 104, 61, 68, 97, 116, 101, 58, 70, 114, 111, 109, 58, 83, 117, 98, 106, 101, 99, 116, 58, 84, 111, 59, 32, 98, 61 ];
    // zkemail::dkim::verify_dkim_2048(
    //     h,
    //     h.len(),
    //     [0xe56b63ee43b59bcdb4a764e3279f6f,0x9b92ddadeacfbbb9d7059170ae5007,0xa4acf3f611e02ce13be191965822da,0x1b498702f2850253c7a85a2e3cff13,0x8b06acfaf1d9ab788a0c073aa46845,0xf5b36bf0512303319bb56f462909c2,0xbf104b0de26242bcdc1a450bd65abb,0xaccbaabd57251dc0188a6bd4acbe77,0x3bacf97135bf8fd20c0e35fce76c77,0x772bcfb5478e8920f2acc803a68d93,0x958ce6e4fc3e47aac45a4fd52a115f,0x109e9cfff1a1fd3b37a2d7df51a5e6,0xf28daa9b422292b02f3ceb825aaa65,0x45cf2a3f6a9b5bd20cd47fa01d194a,0x32a15617d5d6f874300ee84592af58,0x60fce14abee4c7f0b719180c059c28,0x6c75152e73c9c2d25180667064f711,0x9a],
    //     [0x19c868334abfcb61d60c6f03d1ec26,0x175e8ba85b4bd6b335c40db95dd223,0x93d323d38c85b062251e37703f5f4f,0xe6f603e750d3f2f76d170b5c06fec0,0x0dc2d864264fbe42d10594e518af8b,0x5c9d8996f7a44b82550b341aefea09,0x03b31d19a2a99bc623425591214d42,0x2edc4e9a9aba4964b4cdc0649c8448,0x9e5e008018be0da77e45f27549e131,0x5ac08d1c7715d83542b522558be958,0x0246da002399a9c3942384845dac14,0x41d7407aa211b88ded61d197dd507a,0xe845d8151f8a14387ad2b1dfc8b5d4,0x47b60c213b8338a5fc6e4447ebae1b,0x4f8603cb43379f86d296a96a9d23c5,0xf11e994859013105d02c4870f2d662,0x64136bf9f08289b275d225a746642d,0x01a8],
    //     [0xfcd41f9fe89ae5175649b7064f32c1,0x824da2b82aaf61a6eb88b729069c3c,0xb98dfa622bf0150b6fff18bda09e31,0xe0f05be66ff5ce536834bf61f2eda0,0x59a5e9e8c7f0b3ce4edf0e8546ea97,0x95807527894c9ca72fe949c0faa3ab,0x53d4380069fbe8be95aedbb8aa679f,0xf5d7cc70fccc4d796d0c69d214a38c,0x4b4a2135fd5085d63563ecb1ac6025,0xd6dd6dd1157be02054068330d06c9d,0xa3cf814c17fed87aaf7c6588e2d59d,0x4aa762d6f3a1cb9327e56902b8bb26,0xc602091939654b8ce1b616bb444ddc,0xa6df09f9a272120b90bc89cedcfa4b,0x988853aeb2d1caaf549894ba3a51cc,0x0f19159ac89174bf907d19736650ac,0x70b77860ba4631ec59de01e0ec2545,0x96]
    // );
    RSAPubkey{
        modulus: [0xe56b63ee43b59bcdb4a764e3279f6f,0x9b92ddadeacfbbb9d7059170ae5007,0xa4acf3f611e02ce13be191965822da,0x1b498702f2850253c7a85a2e3cff13,0x8b06acfaf1d9ab788a0c073aa46845,0xf5b36bf0512303319bb56f462909c2,0xbf104b0de26242bcdc1a450bd65abb,0xaccbaabd57251dc0188a6bd4acbe77,0x3bacf97135bf8fd20c0e35fce76c77,0x772bcfb5478e8920f2acc803a68d93,0x958ce6e4fc3e47aac45a4fd52a115f,0x109e9cfff1a1fd3b37a2d7df51a5e6,0xf28daa9b422292b02f3ceb825aaa65,0x45cf2a3f6a9b5bd20cd47fa01d194a,0x32a15617d5d6f874300ee84592af58,0x60fce14abee4c7f0b719180c059c28,0x6c75152e73c9c2d25180667064f711,0x9a],
        redc: [0x19c868334abfcb61d60c6f03d1ec26,0x175e8ba85b4bd6b335c40db95dd223,0x93d323d38c85b062251e37703f5f4f,0xe6f603e750d3f2f76d170b5c06fec0,0x0dc2d864264fbe42d10594e518af8b,0x5c9d8996f7a44b82550b341aefea09,0x03b31d19a2a99bc623425591214d42,0x2edc4e9a9aba4964b4cdc0649c8448,0x9e5e008018be0da77e45f27549e131,0x5ac08d1c7715d83542b522558be958,0x0246da002399a9c3942384845dac14,0x41d7407aa211b88ded61d197dd507a,0xe845d8151f8a14387ad2b1dfc8b5d4,0x47b60c213b8338a5fc6e4447ebae1b,0x4f8603cb43379f86d296a96a9d23c5,0xf11e994859013105d02c4870f2d662,0x64136bf9f08289b275d225a746642d,0x01a8],
    }.verify_dkim_2048(
        [ 100, 97, 116, 101, 58, 83, 97, 116, 44, 32, 49, 57, 32, 79, 99, 116, 32, 50, 48, 50, 52, 32, 48, 48, 58, 52, 49, 58, 48, 56, 32, 43, 48, 51, 48, 48, 13, 10, 102, 114, 111, 109, 58, 115, 107, 97, 117, 110, 111, 118, 32, 60, 115, 107, 97, 117, 110, 111, 118, 64, 100, 105, 115, 114, 111, 111, 116, 46, 111, 114, 103, 62, 13, 10, 115, 117, 98, 106, 101, 99, 116, 58, 116, 101, 115, 116, 13, 10, 116, 111, 58, 115, 107, 97, 117, 110, 111, 118, 64, 100, 105, 115, 114, 111, 111, 116, 46, 111, 114, 103, 13, 10, 100, 107, 105, 109, 45, 115, 105, 103, 110, 97, 116, 117, 114, 101, 58, 118, 61, 49, 59, 32, 97, 61, 114, 115, 97, 45, 115, 104, 97, 50, 53, 54, 59, 32, 99, 61, 114, 101, 108, 97, 120, 101, 100, 47, 115, 105, 109, 112, 108, 101, 59, 32, 100, 61, 100, 105, 115, 114, 111, 111, 116, 46, 111, 114, 103, 59, 32, 115, 61, 109, 97, 105, 108, 59, 32, 116, 61, 49, 55, 50, 57, 50, 56, 55, 54, 55, 53, 59, 32, 98, 104, 61, 72, 80, 72, 100, 87, 55, 87, 120, 56, 55, 118, 114, 106, 74, 55, 104, 54, 56, 78, 122, 90, 115, 106, 82, 102, 48, 48, 88, 47, 70, 112, 76, 122, 122, 119, 76, 80, 54, 57, 76, 109, 103, 65, 61, 59, 32, 104, 61, 68, 97, 116, 101, 58, 70, 114, 111, 109, 58, 83, 117, 98, 106, 101, 99, 116, 58, 84, 111, 59, 32, 98, 61 ],
        [0xfcd41f9fe89ae5175649b7064f32c1,0x824da2b82aaf61a6eb88b729069c3c,0xb98dfa622bf0150b6fff18bda09e31,0xe0f05be66ff5ce536834bf61f2eda0,0x59a5e9e8c7f0b3ce4edf0e8546ea97,0x95807527894c9ca72fe949c0faa3ab,0x53d4380069fbe8be95aedbb8aa679f,0xf5d7cc70fccc4d796d0c69d214a38c,0x4b4a2135fd5085d63563ecb1ac6025,0xd6dd6dd1157be02054068330d06c9d,0xa3cf814c17fed87aaf7c6588e2d59d,0x4aa762d6f3a1cb9327e56902b8bb26,0xc602091939654b8ce1b616bb444ddc,0xa6df09f9a272120b90bc89cedcfa4b,0x988853aeb2d1caaf549894ba3a51cc,0x0f19159ac89174bf907d19736650ac,0x70b77860ba4631ec59de01e0ec2545,0x96]
    );
}
#[test]
unconstrained fn smoke_deployed() {
    let mut env = TestEnvironment::new();
    let owner = env.create_account();
    env.impersonate(owner);

    let contract_the = env.deploy_self("EmailBalances").without_initializer();
    let contract_address = contract_the.to_address();

    let t = crate::EmailBalances::at(contract_address);
}