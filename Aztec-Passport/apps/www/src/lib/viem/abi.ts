export const PASSPORT_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_registry', type: 'address', internalType: 'address' },
      { name: '_ens', type: 'address', internalType: 'address' },
      { name: '_verifier', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: '_lastMessageId',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ens',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract MockENS' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'registry',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract IRegistry' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'verifier',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract UltraVerifier' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'verifyAge',
    inputs: [
      { name: 'proof', type: 'bytes', internalType: 'bytes' },
      { name: '_secretHash', type: 'bytes32', internalType: 'bytes32' },
      { name: '_l2Address', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'verifyBalance',
    inputs: [
      { name: '_secretHash', type: 'bytes32', internalType: 'bytes32' },
      { name: '_l2Address', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'verifyENS',
    inputs: [
      { name: '_secretHash', type: 'bytes32', internalType: 'bytes32' },
      { name: '_l2Address', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', name: 'KYCAgeVerificationFailed', inputs: [] },
  { type: 'error', name: 'NoENSFound', inputs: [] },
  { type: 'error', name: 'NotEnoughBalance', inputs: [] },
] as const;

export const MOCK_ENS_ABI = [
  {
    type: 'function',
    name: '_exists',
    inputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_names',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_totalNames',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasEns',
    inputs: [{ name: '_owner', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isRegistered',
    inputs: [{ name: '_name', type: 'bytes', internalType: 'bytes' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nameOf',
    inputs: [
      { name: '_owner', type: 'address', internalType: 'address' },
      { name: 'index', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'register',
    inputs: [{ name: '_name', type: 'bytes', internalType: 'bytes' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'NameRegistered',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      { name: 'name', type: 'bytes', indexed: true, internalType: 'bytes' },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'InvalidName', inputs: [] },
  { type: 'error', name: 'NameAlreadyExists', inputs: [] },
  { type: 'error', name: 'NameAlreadyTaken', inputs: [] },
] as const;
