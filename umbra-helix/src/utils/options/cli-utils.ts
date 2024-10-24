import { WalletDB, AliasType } from '../../storage/wallet_db.js'
import { AztecAddress, TxHash } from '@aztec/aztec.js'

export function prettyPrintJSON(data: Record<string, any>): string {
  return JSON.stringify(
    data,
    (_key, val) => {
      if (typeof val === 'bigint') {
        return String(val)
      } else if (val && typeof val === 'object' && 'toBuffer' in val) {
        return '0x' + val.toBuffer().toString('hex')
      } else {
        return val
      }
    },
    2
  )
}

export function parseTxHash(txHash: string): TxHash {
  try {
    return TxHash.fromString(txHash)
  } catch {
    throw new Error(`Invalid transaction hash: ${txHash}`)
  }
}
export function aliasedTxHashParser(txHash: string, db?: WalletDB) {
  try {
    return parseTxHash(txHash)
  } catch (err) {
    const prefixed = txHash.includes(':') ? txHash : `transactions:${txHash}`
    const rawTxHash = db ? db.tryRetrieveAlias(prefixed) : txHash
    return parseTxHash(rawTxHash)
  }
}

export function parseBigint(bigint: string): bigint | undefined {
  return bigint ? BigInt(bigint) : undefined
}

export function parseAztecAddress(address: string): AztecAddress {
  try {
    return AztecAddress.fromString(address)
  } catch {
    throw new Error(`Invalid address: ${address}`)
  }
}

export function aliasedAddressParser(defaultPrefix: AliasType, address: string, db?: WalletDB) {
  if (address.startsWith('0x')) {
    return parseAztecAddress(address)
  } else {
    const prefixed = address.includes(':') ? address : `${defaultPrefix}:${address}`
    const rawAddress = db ? db.tryRetrieveAlias(prefixed) : address
    return parseAztecAddress(rawAddress)
  }
}
