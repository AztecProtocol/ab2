const pad = (arr: number[], padStr: number, len: number): number[] => {
  const newStr = [...arr];
  while (newStr.length < len) {
    newStr.push(padStr);
  }
  return newStr;
};

const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
const payload =
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJiaXJ0aGRhdGUiOjEwOTg2NDE2MDN9';
const signature = 'MFLNcbOEVB4lFSvMIP-RKXXYCphJC22SmS07iX0RM6k';

const paddedHeader = pad(
  Array.from(Buffer.from(header)).map((e) => e),
  0,
  64
);

const paddedPayload = pad(
  Array.from(Buffer.from(payload)).map((e) => e),
  0,
  256
);

const paddedSignature = pad(
  Array.from(Buffer.from(signature)).map((e) => e),
  0,
  64
);

const jwt = [...paddedHeader, 46, ...paddedPayload, 46, ...paddedSignature];
const header_length = header.length;
const payload_length = payload.length;
const signature_length = signature.length;

const secret = 'secret_key';

const secret_key = pad(
  Array.from(Buffer.from(secret)).map((e) => e),
  0,
  64
);

const timestamp = Math.floor(Date.now() / 1000);

import toToml from 'json2toml';

export const data = {
  header_length,
  payload_length,
  signature_length,
  jwt,
  secret_key,
  timestamp,
};

const yaml = toToml(data);
import { writeFileSync } from 'node:fs';
writeFileSync('./kyc_age_verify/Prover.toml', yaml);
