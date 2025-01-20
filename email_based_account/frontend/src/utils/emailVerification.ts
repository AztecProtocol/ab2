import { generateEmailVerifierInputs } from "@zk-email/zkemail-nr"
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg'
import { Noir } from '@noir-lang/noir_js'
import circuit from "../../../target/use zkemail.json"

export async function verifyEmail(emlContent: string) {
  try {
    // Generate inputs from email content
    const emailVerifierInputs = await generateEmailVerifierInputs(emlContent, {
      maxBodyLength: 1280,
      maxHeadersLength: 1408
    })

    // Prepare header with padding
    const header_padded = [
      ...Array.from(emailVerifierInputs.header.storage).slice(0, emailVerifierInputs.header.len),
      ...Array(512 - Number(emailVerifierInputs.header.len)).fill('0')
    ]

    // Prepare inputs structure
    const inputs = {
      header: {
        storage: header_padded,
        len: emailVerifierInputs.header.len
      },
      pubkey: emailVerifierInputs.pubkey,
      signature: emailVerifierInputs.signature
    }
    console.log("inputs created!")
    // Initialize backend and noir
    const backend = new BarretenbergBackend(circuit)
    const noir = new Noir(circuit)

    // Generate witness and proof
    const { witness } = await noir.execute(inputs)
    const proof = await backend.generateProof(witness)

    // Verify proof
    const isValid = await backend.verifyProof(proof)

    return {
      isValid,
      proof,
      inputs
    }

  } catch (error) {
    console.error('Email verification error:', error)
    throw error
  }
} 