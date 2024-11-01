// https://github.com/AztecProtocol/aztec-packages/blob/aztec-packages-v0.56.0/yarn-project/end-to-end/src/flakey_e2e_inclusion_proofs_contract.test.ts

import {
    type AccountWallet,
    AztecAddress,
    type ExtendedNote,
    Fr,
    INITIAL_L2_BLOCK_NUM,
    type PXE,
    computeSecretHash,
    createPXEClient,
    deriveKeys,
    deriveMasterNullifierSecretKey,
    getContractInstanceFromDeployParams,
    DeployMethod,
    waitForPXE,
    computeAppNullifierSecretKey,
} from '@aztec/aztec.js';
import { InclusionProofsContract } from '@aztec/noir-contracts.js';
import {
    getInitialTestAccountsWallets,
    // deployInitialTestAccounts, getDeployedTestAccountsWallets 
} from '@aztec/accounts/testing';
import '../aztec_part/GetMembershipWitness';
import { GetMembershipWitnessContract } from '../aztec_part/GetMembershipWitness';
import { poseidon2HashWithSeparator } from '@aztec/foundation/crypto';

let pxe: PXE = createPXEClient('http://localhost:8080');
await waitForPXE(pxe);

let contract: InclusionProofsContract;
// let deploymentBlockNumber: number;
const publicValue = 236n;
const contractAddressSalt = Fr.fromString("0x236");

// beforeAll(async () => {
console.debug("initial `getRegisteredAccounts()`");
// (await pxe.getRegisteredAccounts()).forEach(ca => console.debug(ca.address));
// await deployInitialTestAccounts(pxe); // #testingWallet
// let wallets = await getDeployedTestAccountsWallets(pxe); // #testingWallet
let wallets = await getInitialTestAccountsWallets(pxe);
// console.debug("`wallets` are ready");
// wallets.forEach(w => console.debug(w.getAddress()));

const hardcodedGetMembershipWitnessAddr = AztecAddress.fromString(
    "0x28ec641af7fb7840288233e886bb1e45036e6d5fece868dbf6d76c95c311762b"
);
const hardcodedContractAddr = AztecAddress.fromString(
    "0x032bbcab02bd60ba8839420e411caa8e3b9c73c89042a4a3d2cf1bd5a5b449bc"
);
const theRegistry = (await pxe.getRegisteredAccounts()).map(v => v.address);
let getMembershipWitness;
if (theRegistry.indexOf(hardcodedGetMembershipWitnessAddr) === -1) {
    console.log("`hardcodedGetMembershipWitnessAddr` *not* found and will be deployed");
    const receiptGetMembershipWitness = await GetMembershipWitnessContract.deploy(wallets[0])
        .send({ contractAddressSalt }).wait();
    getMembershipWitness = await GetMembershipWitnessContract.at(receiptGetMembershipWitness.contract.address, wallets[0]);
    console.log('the helper MembershipWitness oracle contract:', receiptGetMembershipWitness.contract.address);
} else {
    console.log("`hardcodedGetMembershipWitnessAddr` found and will be used");
    getMembershipWitness =
        await GetMembershipWitnessContract.at(hardcodedGetMembershipWitnessAddr, wallets[0]);
}
if (theRegistry.indexOf(hardcodedContractAddr) === -1) {
    const receiptBeforeAll = await InclusionProofsContract.deploy(wallets[0], publicValue)
        .send(
            { contractAddressSalt }
        ).wait();
    // contract = receiptBeforeAll.contract;
    contract =
        await InclusionProofsContract.at(receiptBeforeAll.contract.address, wallets[1]);
    // deploymentBlockNumber = receiptBeforeAll.blockNumber!;
    console.log('the `contract`:', contract.address);
} else {
    contract = await InclusionProofsContract.at(hardcodedContractAddr, wallets[1]);
    // deploymentBlockNumber = await pxe.getBlockNumber();
}

// describe('note inclusion and nullifier non-inclusion', () => {
// beforeAll(() => {
const owner_wallet = wallets[1];
let owner_address: AztecAddress = wallets[1].getAddress(); // #testingWallet
// let owner: AztecAddress = (await pxe.getRegisteredAccounts())[1].address;
console.log('note `owner` is set');
console.debug(owner_address);

/* describe('proves note existence and its nullifier non-existence 
and nullifier non-existence failure case', () => { */
let noteCreationBlockNumber: number;
let noteHashes, visibleIncomingNotes: ExtendedNote[];
const value = 100n;
let validNoteBlockNumber: any;

// it('should return the correct values for creating a note', async () => {
const receipt = await contract.methods.create_note(owner_address, value).send().wait({
    debug: true, waitForNotesSync: true,
});
noteCreationBlockNumber = receipt.blockNumber!;
({ noteHashes, visibleIncomingNotes } = receipt.debugInfo!);
const theUniqueNote = receipt.debugInfo!.visibleIncomingNotes[0];

// it('should return the correct values for creating a note', () => {
console.assert(noteHashes.length == 1);
console.assert(visibleIncomingNotes.length == 1);
const [receivedValue, receivedOwner, _randomness] = visibleIncomingNotes[0].note.items;
console.assert(receivedValue.toBigInt() == value, "receivedValue");
// this was corrected to an `assert` below
// console.assert(receivedOwner == owner_address.toField(), "receivedOwner");
// console.debug(receivedOwner);
// console.debug(visibleIncomingNotes[0].owner);
// console.debug(receivedOwner.toBigInt(), owner.toBigInt());
// 13049350717727321700829179174503669019044832640368915089269329586528622189832n
// 15681339540822514736164191669109505094294068228643931465257384659261532665763n

// it('should not throw because the note is included', async () => {
try {
    await contract.methods
        .test_note_inclusion(owner_address, true, noteCreationBlockNumber, false).send().wait();
    await contract.methods
        .test_note_inclusion(owner_address, false, 0n, false).send().wait();
    console.log("no errors for note inclusion");
} catch (e) {
    console.assert(false, "error on note inclusion test");
    console.error(e);
}

const theBlock = await pxe.getBlock(noteCreationBlockNumber);
const blockHeaderSerd = theBlock?.header.toFields();
// console.debug(blockHeaderSerd?.length);
console.log(blockHeaderSerd, "blockHeader");
const theSk = owner_wallet.getSecretKey();
// const theNSkM = deriveMasterNullifierSecretKey(theSk);
const theSkM = deriveKeys(theSk);
// console.debug(theSkM.masterNullifierSecretKey);
// console.debug(deriveMasterNullifierSecretKey(theSk));
console.assert(theSkM.masterNullifierSecretKey.toBigInt() ==
    deriveMasterNullifierSecretKey(theSk).toBigInt(), "nsk_m derived differently");
console.log(theSkM.masterNullifierSecretKey.lo, theSkM.masterNullifierSecretKey.hi, "nsk_m");
const theNSkMHash = theSkM.publicKeys.masterNullifierPublicKey.hash();
// console.debug(theNSkMHash);
// console.debug(receivedOwner);
console.assert(theNSkMHash.toBigInt() == receivedOwner.toBigInt(), "nsk_m_hash doesn't match the one note has");
console.log(visibleIncomingNotes[0].note, "the note content");
console.log("the note header:")
console.log(visibleIncomingNotes[0].contractAddress, "contractAddress");
console.log(theUniqueNote.nonce, "nonce");
console.log(visibleIncomingNotes[0].storageSlot, "storageSlot");

console.log(theSk, "secret key");

console.debug(noteHashes[0], "noteHashed");
console.log(await getMembershipWitness.methods.get_the(
    // visibleIncomingNotes[0].note.items, 
    noteCreationBlockNumber,
    // [
    //     visibleIncomingNotes[0].contractAddress, 
    //     theUniqueNote.nonce, 
    //     visibleIncomingNotes[0].storageSlot
    // ]
    noteHashes[0]
).simulate(), "MembershipWitness");
const NSkApp = computeAppNullifierSecretKey(
    theSkM.masterNullifierSecretKey, contract.address
);
console.log(NSkApp, "NSkApp");
const theNullifier = poseidon2HashWithSeparator(
    [noteHashes[0], NSkApp],
    53 // GENERATOR_INDEX__NOTE_NULLIFIER as Field
);
console.log(await getMembershipWitness.methods.low_nullifier(
    noteCreationBlockNumber,
    theNullifier
).simulate(), "LowNullifierMembershipWitness");

// ~~TODO~~ test nullifying the note with the `nullifier`
//      ok, I see why this doesn't test anything, but the nullifier seems to be working and I don't have an alternative testing on my mind
// contract.methods.nullify_note(owner_address).send().wait();
// try {
//     await getMembershipWitness.methods.low_nullifier(
//         await pxe.getBlockNumber(), 
//         theNullifier
//     ).simulate();
//     console.assert(false, "if the nullifier is correct this branch should be failing");
// } catch(e) {
//     console.debug(e);
// }

console.debug("the end is reached");