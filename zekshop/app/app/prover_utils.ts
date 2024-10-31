import { generateEmailVerifierInputs } from "@mach-34/zkemail-nr";
import { type Noir, type CompiledCircuit, InputMap } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@noir-lang/backend_barretenberg";
import { simpleParser } from 'mailparser';
import { toast } from 'sonner';


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

let proverPromise: Promise<ProverModules> | null = null;
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

async function extractEmailDetailsFromFile(file: File): Promise<ParsedEmailInfo> {
    // Read the file as an ArrayBuffer
    const emlBuffer = await file.arrayBuffer();

    const email = await simpleParser(Buffer.from(emlBuffer));
    const fromEmail = email.from?.value[0]?.address || 'No sender found';
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

async function getEmailContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);  // Return the raw content as a string
            } else {
                reject('File content is not readable as text');
            }
        };

        reader.onerror = () => {
            reject('Error reading file');
        };

        // Read the file content as text
        reader.readAsText(file);
    });
}

export async function verifyProof(emailContent: File) {
    const emailDetails = await extractEmailDetailsFromFile(emailContent);
    const emailString = await getEmailContent(emailContent);

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

    const headerLength = 574;
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

    const { Noir, UltraHonkBackend, circuit } = await initProver();

    // Initialize Noir JS
    const backend = new UltraHonkBackend(circuit as CompiledCircuit);
    const noir = new Noir(circuit as CompiledCircuit);

    console.log('Starting to proove...')
    // Generate witness and prove
    const startTime = performance.now();
    const { witness } = await noir.execute(correctInputParams as InputMap);
    const proof_promise = backend.generateProof(witness);
    toast.promise(proof_promise, {
        loading: 'Generating proof...',
        success: () => {
            return `Proof generated, let's verify it!`;
        },
        error: 'Error',
    });
    const { proof, publicInputs } = await proof_promise;
    const provingTime = performance.now() - startTime;

    console.log('proofResult:', proof);
    console.log('Proof generation time:', provingTime);

    console.log('Proof is successsful!');

    console.log('Starting to verify...')
    toast.info("Verifying proof...");
    const verification_promise = backend.verifyProof({ proof, publicInputs });
    toast.promise(verification_promise, {
        loading: 'Verifying proof...',
        success: () => {
            return `Verification successful! 🎉`;
        },
        error: 'Error',
    });
    console.log('Verification result:', await verification_promise);
}