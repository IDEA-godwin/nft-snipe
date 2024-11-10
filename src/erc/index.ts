
import { english, generateMnemonic, mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import arb_abi from './arb-nft.abi.json'
import { Hex } from 'viem'

export const createAccount = () => {
   const mnemonic = generateMnemonic(english)
   return {mnemonic, account: mnemonicToAccount(mnemonic)}
}

export const importAccountByMnemonic = (mnemonic: string): any => {
   try {
      return mnemonicToAccount(mnemonic)
   } catch(error) {
      console.log(error)
      return {
         err: true,
         message: 'invalid mnemonic'
      }
   }
}

export const importAccountByPrivateKey = (key: Hex): any => {
   try {
      return privateKeyToAccount(key)
   } catch(error) {
      console.log(error)
      return {
         err: true,
         message: 'invalid private key format'
      }
   }
}

export const mintNft = (signer: any) => {

}

export const getNftUri = (constract: string, signer: any, tokenId: string) => {

}