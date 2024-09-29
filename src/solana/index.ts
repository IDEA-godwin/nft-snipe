import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";

export const getKeypair = (password: string, mnemonic: string) => {
    // arguments: (mnemonic, password)
    const seed = bip39.mnemonicToSeedSync(mnemonic, password);
    const keypair = Keypair.fromSeed(seed.slice(0, 32));
    
    console.log(`${keypair.publicKey.toBase58()}`);
    return keypair;
}

export const createNewKeypair = (password: string) => {
    const generateMnemonic = bip39.generateMnemonic();
    return getKeypair(password, generateMnemonic)
}

export class SolanaNFT {

    umi;

    constructor() {
        this.umi = createUmi('https://api.testnet.solana.com')
    }

    

}
 
