import 'dotenv/config';
import * as fs from "fs";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { publicKey, unwrapOptionRecursively } from '@metaplex-foundation/umi'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

import {
    updateV1,
    fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const umi = createUmi(process.env.RPC_URL_SOLANA).use(mplTokenMetadata())

// Use fs to navigate the filesystem till you reach
// the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./deployer.json', 'utf-8');
console.log(walletFile);

// Usually Keypairs are saved as Uint8Array, so you  
// need to transform it into a usable keypair.  
let keypair = umi.eddsa.createKeypairFromSecretKey(
    Uint8Array.from(JSON.parse(walletFile))
);
console.log(keypair);
// Before Umi can use this Keypair you need to generate
// a Signer type with it.
const signer = createSignerFromKeypair(umi, keypair);
console.log(signer);

// Tell Umi to use the new signer.
umi.use(signerIdentity(signer));

// The Mint ID from MINT_ID in .env
const mintId = publicKey(process.env.MINT_ID);
console.log(mintId);

const data = {
    // name: '',
    // symbol: 'New Symbol',
    uri: 'https://meta.aspecta.id/metadata.json',
    // sellerFeeBasisPoints: 500,
    // creators: [],
}

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint: mintId })

console.log('Initial Metadata:', initialMetadata);
// let tx = await updateV1(umi, {
//     mint: mintId,
//     authority: signer.publicKey,
//     data: { ...initialMetadata, uri: data.uri },
// }).sendAndConfirm(umi)

// console.log('Transaction Signature:', tx.signature);