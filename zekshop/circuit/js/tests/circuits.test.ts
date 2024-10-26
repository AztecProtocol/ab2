import fs from "fs";
import path from "path";
import { ZKEmailProver } from "../src/prover";
import { generateEmailVerifierInputs } from "../src/index";
import circuitPurchaseNumber from "../../target/circuit.json";
import { toProverToml } from "../src/utils";
import { Uint8ArrayToCharArray } from "@zk-email/helpers";

function numberToBytes(num: number): Uint8Array {
    const buffer = new ArrayBuffer(4); // 4 bytes for a 32-bit integer
    const view = new DataView(buffer);
    view.setUint32(0, num, false); // Use `false` for big-endian, `true` for little-endian
    return new Uint8Array(buffer);
}

const purchaseNumber = Uint8ArrayToCharArray(numberToBytes(1294352407)).reverse();
const email = {
    data: fs.readFileSync(path.join(__dirname, "./test-data/attempt_without_exclamation.eml")),
};

const inputParams = {
    maxHeadersLength: 576,
    maxBodyLength: 1216,
    purchaseNumber
};

describe("Email verification tests", () => {
    let proverPurchaseNumber: ZKEmailProver;

    beforeAll(() => {
        //@ts-ignore
        proverPurchaseNumber = new ZKEmailProver(circuitPurchaseNumber, "all");
    });

    afterAll(async () => {
        await proverPurchaseNumber.destroy();
    });
    it("Verify successful purchase", async () => {
        console.log('purchaseNumber', purchaseNumber);
        const inputs = await generateEmailVerifierInputs(
            email.data,
            inputParams
        );
        await proverPurchaseNumber.simulateWitness(inputs);
        console.log(toProverToml(inputs));
    });
});