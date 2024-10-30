import fs from "fs";
import path from "path";
import { ZKEmailProver } from "../src/prover";
import { generateEmailVerifierInputs } from "../src/index";
import circuitPurchaseNumber from "../../verify_purchase/target/verify_purchase.json";

const email = {
    data: fs.readFileSync(path.join(__dirname, "./test-data/attempt_without_exclamation.eml")),
};

const fromEmailString = "nikossta4@gmail.com";
const toEmailString = "nikolaykostadinov21@gmail.com";
const purchaseNumberString = "1294352407";
const headerLength = 574;
const maxHeadersLength = 576;
const maxBodyLength = 1216;

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

const correctInputParams = {
    maxHeadersLength,
    maxBodyLength,
    headerLength: headerLength.toString(),
    purchaseNumber: Array.from(purchaseNumberPadded).map((s) => s.toString()),
    purchaseNumberLength: purchaseNumberString.length.toString(),
    fromEmailAddress: Array.from(fromEmailAddressPadded).map((s) => s.toString()),
    fromEmailAddressLength: fromEmailString.length.toString(),
    toEmailAddress: Array.from(toEmailAddressPadded).map((s) => s.toString()),
    toEmailAddressLength: toEmailString.length.toString(),
};

describe("E2E Tests", () => {
    describe("Verify purchase circuit", () => {
        let prover: ZKEmailProver;
        beforeAll(async () => {
            //@ts-ignore
            prover = new ZKEmailProver(circuitPurchaseNumber, "plonk");
        });
        afterAll(async () => {
            prover.destroy();
        });
        it("Standart email from ZeKshop", async () => {
            const inputs = await generateEmailVerifierInputs(
                email.data,
                correctInputParams
            );
            const proof = await prover.fullProve(inputs);
            const result = await prover.verify(proof);
            expect(result).toBeTruthy();
        });
    });
});