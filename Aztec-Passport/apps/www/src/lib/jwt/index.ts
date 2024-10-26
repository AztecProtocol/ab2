const pad = (arr: number[], padStr: number, len: number): number[] => {
  const newStr = [...arr];
  while (newStr.length < len) {
    newStr.push(padStr);
  }
  return newStr;
};

export * from './prover';

export const generateJWTInputs = (jwt: string, secretKey: string) => {
  const [header, payload, signature] = jwt.split('.');
  if (!header || !payload || !signature) {
    throw new Error('Invalid JWT');
  }

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

  const paddedKey = pad(
    Array.from(Buffer.from(secretKey)).map((e) => e),
    0,
    64
  );

  const paddedJwt = [
    ...paddedHeader,
    46,
    ...paddedPayload,
    46,
    ...paddedSignature,
  ];
  const headerLength = header.length;
  const payloadLength = payload.length;
  const signatureLength = signature.length;

  const timestamp = 1729830622;

  return {
    jwt: paddedJwt,
    header_length: headerLength,
    payload_length: payloadLength,
    signature_length: signatureLength,
    secret_key: paddedKey,
    timestamp,
  };
};
