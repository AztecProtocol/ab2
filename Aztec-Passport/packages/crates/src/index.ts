import { Prover } from './prover';

import kycVerify from '../target/kyc_age_verify.json';
import { CompiledCircuit } from '@noir-lang/backend_barretenberg';

let prover: Prover = new Prover(kycVerify as CompiledCircuit, 'plonk');

import { data } from './generate-inputs';
import { toHex } from 'viem';

const witness = await prover.simulateWitness(data);
const proof = await prover.prove(witness.witness);

const v = await prover.verify(proof, 'plonk');

console.log(v);
