import * as NoirBignum from '@mach-34/noir-bignum-paramgen';
import {
  MAX_BODY_PADDED_BYTES,
  MAX_HEADER_PADDED_BYTES,
  Uint8ArrayToCharArray,
  findIndexInUint8Array,
  generatePartialSHA,
  sha256Pad,
} from '@zk-email/helpers';
import {
  type DKIMVerificationResult,
  verifyDKIMSignature,
} from '@zk-email/helpers/dist/dkim';

import {
  type BoundedVec,
  type Sequence,
  getAddressHeaderSequence,
  getHeaderSequence,
  u8ToU32,
} from './utils';

export { verifyDKIMSignature } from '@zk-email/helpers/dist/dkim';

// This file is essentially https://github.com/zkemail/zk-email-verify/blob/main/packages/helpers/src/input-generators.ts
// modified for noir input generation

export interface CircuitInput {
  // required inputs for all zkemail verifications
  header: BoundedVec;
  pubkey: {
    modulus: string[];
    redc: string[];
  };
  signature: string[];
  dkim_header_sequence: Sequence;
  // inputs used for verifying full or partial hash
  body?: BoundedVec;
  body_hash_index?: string;
  // inputs used for only partial hash
  partial_body_real_length?: string;
  partial_body_hash?: string[];
  // inputs used for only masking
  header_mask?: string[];
  body_mask?: string[];
  // inputs used for address extraction
  from_header_sequence?: Sequence;
  from_address_sequence?: Sequence;
  to_header_sequence?: Sequence;
  to_address_sequence?: Sequence;
}

export interface InputGenerationArgs {
  ignoreBodyHashCheck?: boolean;
  shaPrecomputeSelector?: string;
  maxHeadersLength?: number;
  maxBodyLength?: number;
  removeSoftLineBreaks?: boolean;
  headerMask?: number[];
  bodyMask?: number[];
  // todo: probably move these out into a separate extended type?
  extractFrom?: boolean;
  extractTo?: boolean;
}

export async function generateEmailVerifierInputs(
  rawEmail: Buffer | string,
  params: InputGenerationArgs = {}
) {
  const dkimResult = await verifyDKIMSignature(rawEmail);

  return generateEmailVerifierInputsFromDKIMResult(dkimResult, params);
}

export function generateEmailVerifierInputsFromDKIMResult(
  dkimResult: DKIMVerificationResult,
  params: InputGenerationArgs = {}
): CircuitInput {
  const { headers, body, bodyHash, publicKey, signature } = dkimResult;

  // SHA add padding
  const [messagePadded] = sha256Pad(
    headers,
    params.maxHeadersLength ?? MAX_HEADER_PADDED_BYTES
  );

  // set inputs used in all cases
  const circuitInputs: CircuitInput = {
    header: {
      storage: Uint8ArrayToCharArray(messagePadded),
      len: headers.length.toString(),
    },
    pubkey: {
      modulus: NoirBignum.bnToLimbStrArray(publicKey),
      redc: NoirBignum.bnToRedcLimbStrArray(publicKey),
    },
    // modified from original: use noir bignum to format
    signature: NoirBignum.bnToLimbStrArray(signature),
    dkim_header_sequence: getHeaderSequence(headers, 'dkim-signature'),
  };

  // removed: header mask

  if (!params.ignoreBodyHashCheck) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- safe
    if (!body || !bodyHash) {
      throw new Error(
        'body and bodyHash are required when ignoreBodyHashCheck is false'
      );
    }

    const bodyHashIndex = headers.toString().indexOf(bodyHash);
    const maxBodyLength = params.maxBodyLength ?? MAX_BODY_PADDED_BYTES;

    // 65 comes from the 64 at the end and the 1 bit in the start, then 63 comes from the formula to round it up to the nearest 64.
    // see sha256algorithm.com for a more full explanation of padding length
    const bodySHALength = Math.floor((body.length + 63 + 65) / 64) * 64;
    const [bodyPadded, bodyPaddedLen] = sha256Pad(
      body,
      Math.max(maxBodyLength, bodySHALength)
    );

    const { precomputedSha, bodyRemainingLength, ...rest } = generatePartialSHA(
      {
        body: bodyPadded,
        bodyLength: bodyPaddedLen,
        selectorString: params.shaPrecomputeSelector,
        maxRemainingBodyLength: maxBodyLength,
      }
    );

    // code smell but it passes the linter
    let { bodyRemaining } = rest;
    // idk why this gets out of sync, todo: fix
    if (
      params.shaPrecomputeSelector &&
      bodyRemaining.length !== bodyRemainingLength
    ) {
      bodyRemaining = bodyRemaining.slice(0, bodyRemainingLength);
    }

    circuitInputs.body = {
      storage: Uint8ArrayToCharArray(bodyRemaining),
      len: body.length.toString(),
    };
    circuitInputs.body_hash_index = bodyHashIndex.toString();

    if (params.shaPrecomputeSelector) {
      // can use exact body lengths
      const selector = new TextEncoder().encode(params.shaPrecomputeSelector);
      const selectorIndex = findIndexInUint8Array(body, selector);
      const shaCutoffIndex = Math.floor(selectorIndex / 64) * 64;
      const remainingBodyLength = body.length - shaCutoffIndex;
      circuitInputs.partial_body_real_length = body.length.toString();
      circuitInputs.body.len = remainingBodyLength.toString();

      // format back into u32 so noir doesn't have to do it
      circuitInputs.partial_body_hash = Array.from(u8ToU32(precomputedSha)).map(
        (x) => x.toString()
      );
    }

    // masking
    if (params.headerMask)
      circuitInputs.header_mask = params.headerMask.map((x) => x.toString());
    if (params.bodyMask)
      circuitInputs.body_mask = params.bodyMask.map((x) => x.toString());

    // address extraction
    if (params.extractFrom) {
      const fromSequences = getAddressHeaderSequence(headers, 'from');
      circuitInputs.from_header_sequence = fromSequences[0];
      circuitInputs.from_address_sequence = fromSequences[1];
    }
    if (params.extractTo) {
      const toSequences = getAddressHeaderSequence(headers, 'to');
      circuitInputs.to_header_sequence = toSequences[0];
      circuitInputs.to_address_sequence = toSequences[1];
    }
  }

  return circuitInputs;
}
