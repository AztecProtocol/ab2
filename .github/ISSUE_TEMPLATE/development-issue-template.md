---
name: Development Issue Template
about: Use this template to file issues you encounter while working on your challenges.
title: "Generics accept unary operators"
labels: "Noir issue"
---

## Issue Description

**The code compiles but it shouldn't**

## Project Context

**Project Name: ZeKshop**

**Challenge:** ZKEmail Guardian

**GitHub Repository: [ZeKshop](https://github.com/NikolayKostadinov21/ZeKshop)**

## Environment

**Aztec Version: 0.55.1** (it doesn't matter since it's Noir issue)

**Noir Version (if applicable): 0.35.0**

**Operating System: Ubuntu**

## Steps to Reproduce

1. Paste the snippet from below
2. Execute `nargo compile --silence-warnings` in the root of your nargo project
3. The code will compile but it shouldn't.

## Expected Behavior

**The code had to return an error like: `cannot apply unary operator - to type u32`**

## Actual Behavior

**The code compiled**

## Code Snippet

```
use zkemail::dkim::RSAPubkey;

global MAX_EMAIL_HEADER_LENGTH: u32 = 1408;

fn main(header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>, pubkey: RSAPubkey<----23>) {}
```

## Error Messages
-

## Additional Context

**I've managed to isolate the issue to pure this snippet where I create a very simple struct that accepts a simple `u32` number as a generic parameter. Yet, the symbols aren't being detected by the compiler.**

```
pub struct Test<let n: u32> {
    modulus: [Field; n]
}

fn main(_n: Test<-----------------------32>) {}
```

## Impact on Development

**Negligibly low**
