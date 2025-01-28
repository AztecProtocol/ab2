/* eslint-disable @typescript-eslint/no-explicit-any -- safe */

/* eslint-disable @typescript-eslint/no-unnecessary-condition -- safe */

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion -- safe */

/* eslint-disable @typescript-eslint/no-unsafe-argument -- safe */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */

/* eslint-disable no-bitwise -- safe */
import { Uint8ArrayToCharArray, sha256Pad } from '@zk-email/helpers';

export interface Sequence {
  index: string;
  length: string;
}

export interface BoundedVec {
  storage: string[];
  len: string;
}

export function u8ToU32(input: Uint8Array): Uint32Array {
  const out = new Uint32Array(input.length / 4);
  for (let i = 0; i < out.length; i++) {
    out[i] =
      (input[i * 4 + 0]! << 24) |
      (input[i * 4 + 1]! << 16) |
      (input[i * 4 + 2]! << 8) |
      (input[i * 4 + 3]! << 0);
  }
  return out;
}

export function toProverToml(inputs: any): string {
  const lines: string[] = [];
  const structs: string[] = [];
  for (const [key, value] of Object.entries(inputs)) {
    if (Array.isArray(value)) {
      const valueStrArr = value.map((val) => `'${val}'`);
      lines.push(`${key} = [${valueStrArr.join(', ')}]`);
    } else if (typeof value === 'string') {
      lines.push(`${key} = '${value}'`);
    } else {
      let values = '';
      for (const [k, v] of Object.entries(value!)) {
        values = values.concat(`${k} = '${v}'\n`);
      }
      structs.push(`[${key}]\n${values}`);
    }
  }
  return lines.concat(structs).join('\n');
}

export function getHeaderSequence(
  header: Buffer,
  headerField: string
): Sequence {
  const regex = new RegExp(
    `[${headerField[0]!.toUpperCase()}${headerField[0]!.toLowerCase()}]${headerField
      .slice(1)
      .toLowerCase()}:.*(?:\r?\n)?`
  );
  const match = header.toString().match(regex);
  if (match === null)
    throw new Error(`Field "${headerField}" not found in header`);
  return { index: match.index!.toString(), length: match[0].length.toString() };
}

export function getAddressHeaderSequence(header: Buffer, headerField: string) {
  const regexPrefix = `[${headerField[0]!.toUpperCase()}${headerField[0]!.toLowerCase()}]${headerField
    .slice(1)
    .toLowerCase()}`;
  const regex = new RegExp(
    `${regexPrefix}:.*?<([^>]+)>|${regexPrefix}:.*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})`
  );
  const headerStr = header.toString();
  const match = headerStr.match(regex);
  if (match === null)
    throw new Error(`Field "${headerField}" not found in header`);
  if (match[1] === null && match[2] === null)
    throw new Error(`Address not found in "${headerField}" field`);
  const address = match[1] ?? match[2];
  const addressIndex = headerStr.indexOf(address!);
  return [
    { index: match.index!.toString(), length: match[0].length.toString() },
    { index: addressIndex.toString(), length: address!.length.toString() },
  ];
}

/**
 * Build a ROM table for allowable email characters
 */
export function makeEmailAddressCharTable(): string {
  // max value: z = 122
  const tableLength = 123;
  const table = new Array(tableLength).fill(0);
  const emailChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-@';
  const precedingChars = '<: ';
  const proceedingChars = '>\r\n';
  // set valid email chars
  for (let i = 0; i < emailChars.length; i++) {
    table[emailChars.charCodeAt(i)] = 1;
  }
  // set valid preceding chars
  for (let i = 0; i < precedingChars.length; i++) {
    table[precedingChars.charCodeAt(i)] = 2;
  }
  // set valid proceding chars
  for (let i = 0; i < proceedingChars.length; i++) {
    table[proceedingChars.charCodeAt(i)] = 3;
  }
  let tableStr = `global EMAIL_ADDRESS_CHAR_TABLE: [u8; ${tableLength}] = [\n`;
  console.log();
  for (let i = 0; i < table.length; i += 10) {
    const end = i + 10 < table.length ? i + 10 : table.length;
    tableStr += `    ${table.slice(i, end).join(', ')},\n`;
  }
  tableStr += '];';
  return tableStr;
}

export const padEmail = (email: string) => {
  const arr = Array.from(Buffer.from(email).map((v) => v)).map((v) =>
    v.toString()
  );
  while (arr.length < 320) {
    arr.push('0');
  }

  return arr.map((e) => BigInt(e));
};

export const getXUsername = (username: string) => {
  const arr = Array.from(Buffer.from(username).map((v) => v)).map((v) =>
    v.toString()
  );
  while (arr.length < 64) {
    arr.push('0');
  }
  return {
    storage: arr,
    len: username.length.toString(),
  } as BoundedVec;
};

export const extractDataFromVec = (data: BoundedVec): string => {
  const len = data.len;
  const storage = data.storage.slice(0, parseInt(len));
  const intArray = storage.map((x) => parseInt(x, 16));
  return Buffer.from(intArray).toString('utf-8');
};
