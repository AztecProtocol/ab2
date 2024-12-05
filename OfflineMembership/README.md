# Offline Membership

The circuit and the helper contract to prove ownership of a valid NFT via a standalone proof.

It's a tool one can use for a wide variety of use cases up to verification of prepared proofs in a place that have no Internet connection at all. The project utilize quite a number of Aztec specific 
features: the logic of private NFT (for public the solution is trivial with just the look-up of the block of interest), leverage of the archive and nullifier trees tool, running Noir circuits on Aztec data stand alone.

## Challenge Selection
- [ ] ZKEmail Guardian
- [x] Social Cipher

## Team information
@skaunov

## Technical Approach
(The thing [was published](https://github.com/skaunov/note_historical_offline) as early as possible to enable other AB builders to use it; so there was no format to follow at that point, now the code is copied from that repo to be aligned to the submission format.)

Here's Noir circuit to prove and verify ownership of a NFT from a particular collection (i.e. address) on Aztec. \
The circuit takes block number as a point for which assertions are made and bunch of data required for proving. The proof asserts that the address has a note from the contract and it's not nullified. \
For proving user needs access to a PXE with their data and the preimage of a note they'd like to use for proving. For verification it's only the exported data of the block is needed, so it could be done *completely without access to the chain* (or even Internet if user can handover the proof).

## Expected Outcomes

Enabling a wide variety of use cases up to verification of prepared proofs in a place that have no Internet connection at all.

Those who'd like to use it [were invited](https://github.com/skaunov/note_historical_offline/blob/db858da3580a9725a1948aa1f5cddf78be8244fa/README.MD?plain=1#L8) to add an issue so I could facilitate usage of the thing.

## Lessons Learned (For Submission)

It's a great example of working with the archive tree and its nodes. An interesting blend of a standalone circuit and the blockchain data. 

In a way this highlights DA and publication since getting the notes is on the one hand a subtle process easy to miss, on the other hand with enough industry it can be extracted from own PXE. And things gets even more interesting when user wants to hop between devices.

Also I tend to stay on the safe side to publish the thing as early as possible and stick to just a lot of `[Field]` for arguments. I noticed that Noir now can intake structs and <Prover.toml> have been improved, but it's not obvious from current docs how to used. So this implementation went cumbersome but reliable way for this part.

Next step would be a circuit to fold the proofs at different blocks into one proof and to verify it.

### generalization
There's a blocker for making the circuit generic over a note type. `NullifiableNote` leaves with only two choice: `PrivateContext` or `unconstrained`. Current implementation just copy a trait method code in the contrained environment; it seems to me that the root cause is the same reason making the trait to be a boilerplate. (And making up a whole `PrivateContext` in this circuit is just unreasonable.)

## Project Links (For Submission)

Check out subdirs READMEs with the relevant details!

<./artifacts>       contains compiled items. \
The contract dir    contains the helper contract needed to get witnesses from PXE while proving. \
<./circuit>         contains the Noir app. \
<./tests>           contains script and data useful for development. 

There're couple of ways to run a circuit. <https://noir-lang.org/docs/dev/tutorials/noirjs_app#some-noirjs> describes a JS way to use it.

### example
The circuit takes quite a number of arguments, let's see a way to get those. *Note that* public items are needed for a verifier to process a proof.

#### Header of the block of interest #header_root
*public* \
Notice it contains the block number of interest among the other info. \
`await pxe.getBlock(blockNumberOfInterest).header.toFields()`

#### master nullifying secret
```js
const nsk_m = deriveKeys(theWallet.getSecretKey().masterNullifierSecretKey);
[nsk_m.lo, nsk_m.hi]
```

#### The note 
For proving an user will need to present *the full* note, which they should have somewhere. \
PXE kinda don't store/provide a note content. Aztec examples/tests offer a following way, notice the note should be saved while created.
```ts
const theReceipt = await theContract.methods.create_note([...args]).send().wait({
    debug: true, waitForNotesSync: true,
});
({ visibleIncomingNotes } = theReceipt.debugInfo!);
```
##### content
`visibleIncomingNotes[theNoteDebugIndex].note`
##### metadata
###### the contract address as a `Field`
*public* \
###### `nonce`
`visibleIncomingNotes[theNoteDebugIndex].nonce`
###### the storage slot
`visibleIncomingNotes[theNoteDebugIndex].storageSlot`

#### an Aztec witness

Here the helper contract comes into play, since PXE has only on-chain API for getting a value.
```ts
import { GetMembershipWitnessContract } from './artifacts/GetMembershipWitness';
const getMembershipWitness = await GetMembershipWitnessContract.at(
    await GetMembershipWitnessContract.deploy(wallet)
        .send({ contractAddressSalt }).wait()
        .contract.address, 
    theWallet
);
```

This needs the note hashed _for nullifying_ variant. You can compute that or get/save along with the note itself as in the previous section.
```ts
/// see "The note" section
({ noteHashes } = theReceipt.debugInfo!);
const theNoteHashed = noteHashes[theNoteDebugIndex]
```

##### membership
it , which you can produce or get/save along with the note itself (as `` - see the previous section).
```js
await getMembershipWitness.methods.get_the(
    blockNumberOfInterest,
    theNoteHashed
).simulate()
```
##### low nullifier
Find `nsk_m` and `theContract.address` above.
(I didn't found an util computing the nullifier, if you can straighten this - pls, add the correct API.)
```js
await getMembershipWitness.methods.low_nullifier(
    blockNumberOfInterest,
    poseidon2HashWithSeparator(
        [
            theNoteHashed, 
            computeAppNullifierSecretKey(nsk_m, theContract.address)
        ],
        53
    )
).simulate()
```

## Video Demo (For Submission)
Not planned.
