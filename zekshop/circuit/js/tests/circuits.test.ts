import fs from "fs";
import path from "path";
import { ZKEmailProver } from "../src/prover";
import { generateEmailVerifierInputs } from "../src/index";
import circuitPurchaseNumber from "../../target/circuit.json";
import { toProverToml } from "../src/utils";
import { Uint8ArrayToCharArray } from "@zk-email/helpers";

let utf8Encode = new TextEncoder();
const purchaseNumber = Uint8ArrayToCharArray(utf8Encode.encode("1294352407"));
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