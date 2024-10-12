import { type ClassValue, clsx } from 'clsx';
import { serializeError } from 'serialize-error';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (
  str: string,
  length?: number,
  fromMiddle?: boolean
) => {
  const middle = fromMiddle ?? true;
  const len = length ?? 20;
  if (str.length <= len) {
    return str;
  }
  if (middle) {
    return `${str.slice(0, len / 2)}...${str.slice(-len / 2)}`;
  }
  return `${str.slice(0, len)}...`;
};

export const errorHandler = (error: unknown) => {
  const serialized = serializeError(error);
  const cause =
    typeof serialized.cause === 'string'
      ? serialized.cause
      : 'An unknown error occurred';

  return serialized.message ?? cause;
};
