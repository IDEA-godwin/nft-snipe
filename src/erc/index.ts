
import { english, generateMnemonic, mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import arb_abi from './arb-nft.abi.json'
import { Hex } from 'viem'

export const createAccount = () => {
   const mnemonic = generateMnemonic(english)
   return {mnemonic, account: mnemonicToAccount(mnemonic)}
}

export const importAccountByMnemonic = (mnemonic: string) => {
   return mnemonicToAccount(mnemonic)
}

export const importAccountByPrivateKey = (key: Hex) => {
   return privateKeyToAccount(key)
}

export const mintNft = (signer: any) => {

}

export const getNftUri = (constract: string, signer: any, tokenId: string) => {

}