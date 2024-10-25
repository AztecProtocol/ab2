import { DefaultAccountContract } from "@aztec/accounts/defaults";
import { AuthWitnessProvider, AuthWitness, ContractArtifact } from "@aztec/aztec.js";
import { CompleteAddress, GrumpkinScalar } from "@aztec/circuits.js";
import { Fr } from "@aztec/circuits.js";
import { Schnorr } from "@aztec/circuits.js/barretenberg";
import { SchnorrAccountContractArtifact } from '../artifacts/SchnorrAccount.js';


export class SchnorrAccountContract extends DefaultAccountContract {
  constructor(private signingPrivateKey: GrumpkinScalar) {
    super(SchnorrAccountContractArtifact as ContractArtifact);
  }
  getDeploymentArgs() {
    const signingPublicKey = new Schnorr().computePublicKey(this.signingPrivateKey);
    return [signingPublicKey.x, signingPublicKey.y];
  }

  getAuthWitnessProvider(_address: CompleteAddress): AuthWitnessProvider {
    return new SchnorrAuthWitnessProvider(this.signingPrivateKey);
  }
}

/** Creates auth witnesses using Schnorr signatures. */
class SchnorrAuthWitnessProvider implements AuthWitnessProvider {
  constructor(private signingPrivateKey: GrumpkinScalar) { }

  createAuthWit(messageHash: Fr): Promise<AuthWitness> {
    const schnorr = new Schnorr();
    const signature = schnorr.constructSignature(messageHash.toBuffer(), this.signingPrivateKey).toBuffer();
    return Promise.resolve(new AuthWitness(messageHash, [...signature]));
  }
}
