import { generateEmailVerifierInputs } from "@mach-34/zkemail-nr";
import { type Noir, type CompiledCircuit, InputMap } from "@noir-lang/noir_js";
import {
    BarretenbergBackend,
    BarretenbergVerifier,
    ProofData,
    UltraHonkBackend,
    UltraHonkVerifier,
} from "@noir-lang/backend_barretenberg";
import circuitPurchaseNumber from "./assets/verify_purchase.json";
import { AddressObject, simpleParser } from 'mailparser';
import fs from 'fs';
import { ZKEmailProver } from "./proving_helpers/prover";
import path from "path";

interface ParsedEmailInfo {
    fromEmail: string;
    toEmail: string;
    purchaseNumber: string | null;
}

type ProverModules = {
    Noir: typeof Noir;
    UltraHonkBackend: typeof UltraHonkBackend;
    circuit: object;
};

type UltraHonkBackendModules = {
    Noir: typeof Noir;
    UltraHonkBackend: typeof UltraHonkBackend;
    circuit: object;
}

type VerifierModules = {
    UltraHonkVerifier: typeof UltraHonkVerifier;
    vkey: number[];
};

type BarretenbergVerifierModules = {
    BarretenbergVerifier: typeof BarretenbergVerifier;
    vkey: number[];
}

// const text = fs.readFileSync('tests/test-data/attempt_without_exclamation.eml', 'utf8')
let proverPromise: Promise<ProverModules> | null = null;
let verifierPromise: Promise<VerifierModules> | null = null;
let barretenbergVerifierPromise: Promise<BarretenbergVerifierModules> | null = null;
let ultraHonkBackendPromise: Promise<UltraHonkBackendModules> | null = null;

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

export async function initVerifier(): Promise<UltraHonkBackendModules> {
    if (!ultraHonkBackendPromise) {
        ultraHonkBackendPromise = (async () => {
            const [{ Noir }, { UltraHonkBackend }] = await Promise.all([
                import("@noir-lang/noir_js"),
                import("@noir-lang/backend_barretenberg"),
            ]);
            const circuit = await import("./assets/circuit.json");
            return { Noir, UltraHonkBackend, circuit: circuit.default };
        })();
    }
    return ultraHonkBackendPromise;
}

// export async function verifyProofUltraHonk(
//     proof: Uint8Array,
//     publicInputs: string[]
// ): Promise<boolean> {
//     await initVerifier();

//     const { Noir, UltraHonkBackend, circuit } = await initVerifier();

//     const proofData = {
//         proof: proof,
//         publicInputs,
//     };

//     const verifier = new BarretenbergBackend(proofData);
//     const result = await verifier.verifyProof(proofData);

//     return result;
// }

async function extractEmailDetailsFromFile(file: File): Promise<ParsedEmailInfo> {
    // Read the file as an ArrayBuffer
    const emlBuffer = await file.arrayBuffer();

    // Parse the .eml content using mailparser
    const email = await simpleParser(Buffer.from(emlBuffer));

    // Extract 'from' email address
    const fromEmail = email.from?.value[0]?.address || 'No sender found';

    // Extract 'to' email address
    const toEmail = (email.to as any).value[0]?.address || 'No recipient found';

    // First, try to extract Purchase number from the headers
    const purchaseNumberFromHeader = extractPurchaseNumberFromHeader(email.headers as any);

    // If not found in header, fall back to body
    const purchaseNumber = purchaseNumberFromHeader || extractPurchaseNumberFromBody(email.text || email.html || '');

    return {
        fromEmail,
        toEmail,
        purchaseNumber
    };
}
// Helper function to extract Purchase number from headers
function extractPurchaseNumberFromHeader(headers: Map<string, string>): string | null {
    const subject = headers.get('subject') || '';
    const match = subject.match(/Purchase number[:\s]*([A-Za-z0-9\-]+)/i);
    return match ? match[1] : null;
}

// Helper function to find Purchase number in the email body
function extractPurchaseNumberFromBody(content: string): string | null {
    const match = content.match(/purchase number(?:\s+is)?:?\s*([\d\-]+)/i);
    return match ? match[1] : null;
}

export const file2Base64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.onerror = error => reject(error);
    })
}

async function getEmailContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Event listener for successfully reading the file
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);  // Return the raw content as a string
            } else {
                reject('File content is not readable as text');
            }
        };

        // Event listener for errors
        reader.onerror = () => {
            reject('Error reading file');
        };

        // Read the file content as text
        reader.readAsText(file);
    });
}

export async function verifyProof(_emailString: string, emailContent: File) {
    const headerLength = 574;
    const maxHeadersLength = 576;
    const maxBodyLength = 1216;

    const emailDetails = await extractEmailDetailsFromFile(emailContent);
    console.log(emailDetails)
    console.log('emailDetails', emailDetails);

    const emailString = await getEmailContent(emailContent);
    console.log('Email Content:', emailContent)

    // Generate common inputs using ZK Email SDK
    const zkEmailInputs = await generateEmailVerifierInputs(emailString, {
        maxBodyLength: 1216, // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit
        maxHeadersLength: 576, // Same as MAX_EMAIL_HEADER_LENGTH in circuit
    });

    const fromEmailAddressPadded = new Uint8Array(60);
    fromEmailAddressPadded.set(
        Uint8Array.from(new TextEncoder().encode((emailDetails).fromEmail as any))
    );

    const toEmailAddressPadded = new Uint8Array(60);
    toEmailAddressPadded.set(
        Uint8Array.from(new TextEncoder().encode((emailDetails).toEmail as any))
    );

    const purchaseNumberPadded = new Uint8Array(20);
    purchaseNumberPadded.set(
        Uint8Array.from(new TextEncoder().encode((emailDetails).purchaseNumber as any))
    );

    const correctInputParams = {
        ...zkEmailInputs,
        header_length: headerLength.toString(),
        purchase_number: Array.from(purchaseNumberPadded).map((s) => s.toString()),
        purchase_number_length: (emailDetails).purchaseNumber?.length,
        from_email_address: Array.from(fromEmailAddressPadded).map((s) => s.toString()),
        from_email_address_length: (emailDetails).fromEmail?.length,
        to_email_address: Array.from(toEmailAddressPadded).map((s) => s.toString()),
        to_email_address_length: (emailDetails).toEmail?.length,
    };

    console.log('correctInputParams', correctInputParams)
    console.log('inputs: ', zkEmailInputs)


    const { Noir, UltraHonkBackend, circuit } = await initProver();

    // Initialize Noir JS
    const backend = new UltraHonkBackend(circuit as CompiledCircuit);
    const noir = new Noir(circuit as CompiledCircuit);

    console.log('Starting to proove...')
    // Generate witness and prove
    const startTime = performance.now();
    const { witness } = await noir.execute(correctInputParams as InputMap);
    const { proof, publicInputs } = await backend.generateProof(witness);
    const provingTime = performance.now() - startTime;

    console.log('proofResult:', proof);
    console.log('Proof generation time:', provingTime);

    console.log('Proof is successsful!');

    console.log('Starting to verify...')
    const x = await backend.verifyProof({ proof, publicInputs });
    console.log('Verification result:', x);

    // let prover = new ZKEmailProver(circuitPurchaseNumber as any, "all");
    // console.log('prover', prover)
    // const proof = await prover.fullProve(zkEmailInputs);
    // console.log('proof', proof)
    // const result = await prover.verify(proof);

    // console.log('result', result)

    // return result;
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

        console.log("Generating proof with inputs:", inputs);

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