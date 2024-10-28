import { generateEmailVerifierInputs } from "@mach-34/zkemail-nr";
import { type Noir, type CompiledCircuit, InputMap } from "@noir-lang/noir_js";
import {
    UltraHonkBackend,
    UltraHonkVerifier,
} from "@noir-lang/backend_barretenberg";

import * as fs from 'fs';

type ProverModules = {
    Noir: typeof Noir;
    UltraHonkBackend: typeof UltraHonkBackend;
    circuit: object;
};

type VerifierModules = {
    UltraHonkVerifier: typeof UltraHonkVerifier;
    vkey: number[];
};

let proverPromise: Promise<ProverModules> | null = null;
let verifierPromise: Promise<VerifierModules> | null = null;

// Lazy load prover libs to avoid initial page load delay
export async function initProver(): Promise<ProverModules> {
    if (!proverPromise) {
        proverPromise = (async () => {
            const [{ Noir }, { UltraHonkBackend }] = await Promise.all([
                import("@noir-lang/noir_js"),
                import("@noir-lang/backend_barretenberg"),
            ]);
            const circuit = await import("./assets/circuit.json");
            return { Noir, UltraHonkBackend, circuit: circuit.default };
        })();
    }
    return proverPromise;
}

export async function initVerifier(): Promise<VerifierModules> {
    if (!verifierPromise) {
        verifierPromise = (async () => {
            const { UltraHonkVerifier } = await import(
                "@noir-lang/backend_barretenberg"
            );
            const vkey = await import("./assets/circuit-vkey.json");
            return { UltraHonkVerifier, vkey: vkey.default };
        })();
    }
    return verifierPromise;
}

export async function verifyProof(
    proof: Uint8Array,
    publicInputs: string[]
): Promise<boolean> {
    await initVerifier();

    const { UltraHonkVerifier, vkey } = await initVerifier();

    const proofData = {
        proof: proof,
        publicInputs,
    };

    const verifier = new UltraHonkVerifier({ crsPath: process.env.TEMP_DIR });
    const result = await verifier.verifyProof(proofData, Uint8Array.from(vkey));

    return result;
}

export async function demoGenerateProof() {
    var text = fs.readFileSync('tests/test-data/attempt_without_exclamation.eml', 'utf8')
    const { proof, provingTime } = await generateProof(
        text
    );
}

export async function generateProof(
    emailContent: string
) {
    try {
        // Generate common inputs using ZK Email SDK
        const zkEmailInputs = await generateEmailVerifierInputs(emailContent, {
            maxBodyLength: 1216, // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit
            maxHeadersLength: 576, // Same as MAX_EMAIL_HEADER_LENGTH in circuit
        });

        const fromEmailString = "nikossta4@gmail.com";
        const toEmailString = "nikolaykostadinov21@gmail.com";
        const purchaseNumberString = "1294352407";

        const fromEmailAddressPadded = new Uint8Array(60);
        fromEmailAddressPadded.set(
            Uint8Array.from(new TextEncoder().encode(fromEmailString))
        );

        const toEmailAddressPadded = new Uint8Array(60);
        toEmailAddressPadded.set(
            Uint8Array.from(new TextEncoder().encode(toEmailString))
        );

        const purchaseNumberPadded = new Uint8Array(20);
        purchaseNumberPadded.set(
            Uint8Array.from(new TextEncoder().encode(purchaseNumberString))
        );


        const inputs = {
            ...zkEmailInputs,
            header: zkEmailInputs.header,
            header_length: zkEmailInputs.header.len,
            body: zkEmailInputs.body,
            pubkey: zkEmailInputs.pubkey,
            signature: zkEmailInputs.signature,
            purchase_number: Array.from(purchaseNumberPadded).map((s) => s.toString()),
            purchase_number_length: purchaseNumberString.length.toString(),
            from_email_address: Array.from(fromEmailAddressPadded).map((s) => s.toString()),
            from_email_address_length: fromEmailString.length.toString(),
            to_email_address: Array.from(toEmailAddressPadded).map((s) => s.toString()),
            to_email_address_length: toEmailString.length.toString(),
        };


        const { Noir, UltraHonkBackend, circuit } = await initProver();

        // Initialize Noir JS
        const backend = new UltraHonkBackend(circuit as CompiledCircuit);
        const noir = new Noir(circuit as CompiledCircuit);

        // Generate witness and prove
        const startTime = performance.now();
        const { witness } = await noir.execute(inputs as InputMap);
        const proofResult = await backend.generateProof(witness);
        const provingTime = performance.now() - startTime;

        return { ...proofResult, provingTime };
    } catch (error) {
        console.error("Error generating proof:", error);
        throw new Error("Failed to generate proof");
    }
}