import { type DeployAccountOptions, type PXE } from '@aztec/aztec.js'
import { prettyPrintJSON } from '../utils/options/cli-utils.js'
import { Fr } from '@aztec/foundation/fields'
import { type DebugLogger, type LogFn } from '@aztec/foundation/log'

import { type AccountType, createOrRetrieveAccount } from '../utils/accounts.js'
import { type IFeeOpts, printGasEstimates } from '../utils/options/fees.js'

type CreateAccountParamsType = {
  client: PXE
  accountType: AccountType
  secretKey?: Fr | undefined
  publicKey?: string | undefined
  alias?: string | undefined
  registerOnly?: boolean
  publicDeploy?: boolean
  skipInitialization: boolean
  wait: boolean
  feeOpts: IFeeOpts
  json?: boolean
  debugLogger?: DebugLogger
  log?: LogFn
}
export async function createAccount(params: CreateAccountParamsType) {
  let {
    client,
    accountType,
    secretKey,
    publicKey,
    alias,
    registerOnly,
    publicDeploy = true,
    skipInitialization,
    wait,
    feeOpts,
    json,
    debugLogger,
    log,
  } = params

  secretKey ??= Fr.random()

  const account = await createOrRetrieveAccount(
    client,
    undefined /* address, we don't have it yet */,
    undefined /* db, as we want to create from scratch */,
    accountType,
    secretKey,
    Fr.ZERO,
    publicKey
  )
  const salt = account.getInstance().salt
  const { address, publicKeys, partialAddress } = account.getCompleteAddress()

  const out: Record<string, any> = {}
  if (json) {
    out.address = address
    out.publicKey = publicKeys
    if (secretKey) {
      out.secretKey = secretKey
    }
    out.partialAddress = partialAddress
    out.salt = salt
    out.initHash = account.getInstance().initializationHash
    out.deployer = account.getInstance().deployer
  } else {
    console.log(`\nNew account:\n`)
    console.log(`Address:         ${address.toString()}`)
    console.log(`Public key:      0x${publicKeys.toString()}`)
    if (secretKey) {
      console.log(`Secret key:     ${secretKey.toString()}`)
    }
    console.log(`Partial address: ${partialAddress.toString()}`)
    console.log(`Salt:            ${salt.toString()}`)
    console.log(`Init hash:       ${account.getInstance().initializationHash.toString()}`)
    console.log(`Deployer:        ${account.getInstance().deployer.toString()}`)
  }

  let tx
  let txReceipt
  if (registerOnly) {
    await account.register()
  } else {
    const wallet = await account.getWallet()
    const sendOpts: DeployAccountOptions = {
      ...feeOpts.toSendOpts(wallet),
      skipClassRegistration: !publicDeploy,
      skipPublicDeployment: !publicDeploy,
      skipInitialization: skipInitialization,
    }
    if (feeOpts.estimateOnly) {
      const gas = await (await account.getDeployMethod()).estimateGas({ ...sendOpts })
      if (json) {
        out.fee = {
          gasLimits: {
            da: gas.gasLimits.daGas,
            l2: gas.gasLimits.l2Gas,
          },
          teardownGasLimits: {
            da: gas.teardownGasLimits.daGas,
            l2: gas.teardownGasLimits,
          },
        }
      } else {
        // printGasEstimates(feeOpts, gas, log)
      }
    } else {
      tx = account.deploy({ ...sendOpts })
      const txHash = await tx.getTxHash()
      // debugLogger.debug(`Account contract tx sent with hash ${txHash}`)
      out.txHash = txHash
      if (wait) {
        if (!json) {
          console.log(`\nWaiting for account contract deployment...`)
        }
        txReceipt = await tx.wait()
        out.txReceipt = {
          status: txReceipt.status,
          transactionFee: txReceipt.transactionFee,
        }
      }
    }
  }

  if (json) {
    console.log(prettyPrintJSON(out))
  } else {
    if (tx) {
      console.log(`Deploy tx hash:  ${await tx.getTxHash()}`)
    }
    if (txReceipt) {
      console.log(`Deploy tx fee:   ${txReceipt.transactionFee}`)
    }
  }

  return { alias, address, secretKey, salt }
}
