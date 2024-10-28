import { generateProof } from "../utils";

import * as fs from 'fs';

describe("Email verification tests", () => {
    it("Verify successful mail", async () => {
        var emailContent = fs.readFileSync('tests/test-data/attempt_without_exclamation.eml', 'utf8')
        const { proof, provingTime } = await generateProof(
            emailContent
        );
        console.log('Generated proof:', proof);
        console.log('Proving time:', provingTime);
    });
});