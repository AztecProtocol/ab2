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

import { u8ToU32 } from './utils';

export interface CircuitInput {
  header: string[];
  header_length: string;
  pubkey: string[];
  pubkey_redc: string[];
  signature: string[];
  body?: string[];
  body_length?: string;
  partial_body_length?: string;
  partial_body_hash?: string[];
  body_hash_index?: string;
}

export interface InputGenerationArgs {
  ignoreBodyHashCheck?: boolean;
  shaPrecomputeSelector?: string;
  maxHeadersLength?: number; // Max length of the email header including padding
  maxBodyLength?: number; // Max length of the email body after shaPrecomputeSelector including padding
  removeSoftLineBreaks?: boolean;
}

/**
 * Generate circuit inputs for the EmailVerifier circuit from raw email content
 * @param rawEmail - Full email content as a buffer or string
 * @param params - Arguments to control the input generation
 * @returns Circuit inputs for the EmailVerifier circuit
 */
export async function generateEmailVerifierInputs(
  rawEmail: Buffer | string,
  params: InputGenerationArgs = {}
) {
  const dkimResult = await verifyDKIMSignature(rawEmail);

  return generateEmailVerifierInputsFromDKIMResult(dkimResult, params);
}

/**
 * Generate circuit inputs for the EmailVerifier circuit from DKIMVerification result
 * @param dkimResult - DKIMVerificationResult containing email data and verification result
 * @param params - Arguments to control the input generation
 * @returns Circuit inputs for the EmailVerifier circuit
 */
export function generateEmailVerifierInputsFromDKIMResult(
  dkimResult: DKIMVerificationResult,
  params: InputGenerationArgs = {}
): CircuitInput {
  const { headers, body, bodyHash, publicKey, signature } = dkimResult;
  console.log(dkimResult);

  // SHA add padding
  const [messagePadded] = sha256Pad(
    headers,
    params.maxHeadersLength ?? MAX_HEADER_PADDED_BYTES
  );

  const circuitInputs: CircuitInput = {
    header: Uint8ArrayToCharArray(messagePadded), // Packed into 1 byte signals
    // modified from original: can use exact email header length
    header_length: headers.length.toString(),
    // modified from original: use noir bignum to format
    pubkey: NoirBignum.bnToLimbStrArray(publicKey),
    // not in original: add barrett reduction param for efficient rsa sig verification
    pubkey_redc: NoirBignum.bnToRedcLimbStrArray(publicKey),
    // modified from original: use noir bignum to format
    signature: NoirBignum.bnToLimbStrArray(signature),
  };

  // removed: header mask

  if (!params.ignoreBodyHashCheck) {
    if (!bodyHash) {
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

    // can use exact body lengths
    circuitInputs.body_length = body.length.toString();
    circuitInputs.body_hash_index = bodyHashIndex.toString();
    circuitInputs.body = Uint8ArrayToCharArray(bodyRemaining);

    if (params.shaPrecomputeSelector) {
      // can use exact body lengths
      const selector = new TextEncoder().encode(params.shaPrecomputeSelector);
      const selectorIndex = findIndexInUint8Array(body, selector);
      const shaCutoffIndex = Math.floor(selectorIndex / 64) * 64;
      const remainingBodyLength = body.length - shaCutoffIndex;
      circuitInputs.partial_body_length = remainingBodyLength.toString();

      // format back into u32 so noir doesn't have to do it
      circuitInputs.partial_body_hash = Array.from(u8ToU32(precomputedSha)).map(
        (x) => x.toString()
      );
    }
  }

  return circuitInputs;
}
