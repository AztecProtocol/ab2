
/* Autogenerated file, do not edit! */

/* eslint-disable */
import {
  type AbiType,
  AztecAddress,
  type AztecAddressLike,
  CompleteAddress,
  Contract,
  type ContractArtifact,
  ContractBase,
  ContractFunctionInteraction,
  type ContractInstanceWithAddress,
  type ContractMethod,
  type ContractStorageLayout,
  type ContractNotes,
  decodeFromAbi,
  DeployMethod,
  EthAddress,
  type EthAddressLike,
  EventSelector,
  type FieldLike,
  Fr,
  type FunctionSelectorLike,
  L1EventPayload,
  loadContractArtifact,
  type NoirCompiledContract,
  NoteSelector,
  Point,
  type PublicKey,
  type UnencryptedL2Log,
  type Wallet,
  type WrappedFieldLike,
} from '@aztec/aztec.js';
import GetMembershipWitnessContractArtifactJson from './target/aztec_part-GetMembershipWitness.json' assert { type: 'json' };
export const GetMembershipWitnessContractArtifact = loadContractArtifact(GetMembershipWitnessContractArtifactJson as NoirCompiledContract);



/**
 * Type-safe interface for contract GetMembershipWitness;
 */
export class GetMembershipWitnessContract extends ContractBase {
  
  private constructor(
    instance: ContractInstanceWithAddress,
    wallet: Wallet,
  ) {
    super(instance, GetMembershipWitnessContractArtifact, wallet);
  }
  

  
  /**
   * Creates a contract instance.
   * @param address - The deployed contract's address.
   * @param wallet - The wallet to use when interacting with the contract.
   * @returns A promise that resolves to a new Contract instance.
   */
  public static async at(
    address: AztecAddress,
    wallet: Wallet,
  ) {
    return Contract.at(address, GetMembershipWitnessContract.artifact, wallet) as Promise<GetMembershipWitnessContract>;
  }

  
  /**
   * Creates a tx to deploy a new instance of this contract.
   */
  public static deploy(wallet: Wallet, ) {
    return new DeployMethod<GetMembershipWitnessContract>(Fr.ZERO, wallet, GetMembershipWitnessContractArtifact, GetMembershipWitnessContract.at, Array.from(arguments).slice(1));
  }

  /**
   * Creates a tx to deploy a new instance of this contract using the specified public keys hash to derive the address.
   */
  public static deployWithPublicKeysHash(publicKeysHash: Fr, wallet: Wallet, ) {
    return new DeployMethod<GetMembershipWitnessContract>(publicKeysHash, wallet, GetMembershipWitnessContractArtifact, GetMembershipWitnessContract.at, Array.from(arguments).slice(2));
  }

  /**
   * Creates a tx to deploy a new instance of this contract using the specified constructor method.
   */
  public static deployWithOpts<M extends keyof GetMembershipWitnessContract['methods']>(
    opts: { publicKeysHash?: Fr; method?: M; wallet: Wallet },
    ...args: Parameters<GetMembershipWitnessContract['methods'][M]>
  ) {
    return new DeployMethod<GetMembershipWitnessContract>(
      opts.publicKeysHash ?? Fr.ZERO,
      opts.wallet,
      GetMembershipWitnessContractArtifact,
      GetMembershipWitnessContract.at,
      Array.from(arguments).slice(1),
      opts.method ?? 'constructor',
    );
  }
  

  
  /**
   * Returns this contract's artifact.
   */
  public static get artifact(): ContractArtifact {
    return GetMembershipWitnessContractArtifact;
  }
  

  

  public static get notes(): ContractNotes<'NFTNote' | 'ValueNote'> {
    return {
      NFTNote: {
          id: new NoteSelector(3595710486),
        },
ValueNote: {
          id: new NoteSelector(1038582377),
        }
    } as ContractNotes<'NFTNote' | 'ValueNote'>;
  }
  

  /** Type-safe wrappers for the public methods exposed by the contract. */
  public declare methods: {
    
    /** compute_note_hash_and_optionally_a_nullifier(contract_address: struct, nonce: field, storage_slot: field, note_type_id: field, compute_nullifier: boolean, serialized_note: array) */
    compute_note_hash_and_optionally_a_nullifier: ((contract_address: AztecAddressLike, nonce: FieldLike, storage_slot: FieldLike, note_type_id: FieldLike, compute_nullifier: boolean, serialized_note: FieldLike[]) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** get_the(block_num: integer, hashed: field) */
    get_the: ((block_num: (bigint | number), hashed: FieldLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** low_nullifier(block_number: integer, nullifier: field) */
    low_nullifier: ((block_number: (bigint | number), nullifier: FieldLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
  };

  
}