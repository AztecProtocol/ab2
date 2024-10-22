import { AccountManager, Fr, GrumpkinScalar, PXE } from '@aztec/aztec.js'
import { Salt } from '@aztec/aztec.js/account'
import { SchnorrAccountContract } from '../artifacts/SchnorrAccount.js'
import { deriveSigningKey } from '@aztec/circuits.js'

export function getSchnorrAccount(
  pxe: PXE,
  secretKey: Fr,
  signingPrivateKey: GrumpkinScalar,
  salt?: Salt
): AccountManager {
  return new AccountManager(pxe, secretKey, new SchnorrAccountContract(signingPrivateKey), salt)
}

export const createNewCustomAccount = async (pxe: PXE) => {
  let secretKey = Fr.random()
  let salt = Fr.ZERO
  let account = getSchnorrAccount(pxe, secretKey, deriveSigningKey(secretKey), salt)
  let wallet = account.waitSetup()
  console.log(`Created new custom account ${(await wallet).getCompleteAddress()}`)
  return wallet
}
