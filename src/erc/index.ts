
import { 
   english, generateMnemonic, 
   mnemonicToAccount, privateKeyToAccount 
} from 'viem/accounts'
import {
   mainnet, arbitrum, base,
   sepolia, arbitrumSepolia, baseSepolia
} from 'viem/chains'
import { createPublicClient, createWalletClient, formatEther, getContract, Hex, http } from 'viem'
import { whatsabi } from '@shazow/whatsabi'

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

export const mintNft = async (contractAddr: any, signer: any, network: string) => {
   const contract = getNftContract(contractAddr, signer, network)
}

export const nftInfo = async (contractAddr: any, signer: any, network: string) => {
   const contract = await getNftContract(contractAddr, signer, network)
   const mintLive = await contract.read.mintLive()
   const mintPrice = await contract.read.mintPrice([0])
   if(!mintLive) return {
      err: false, message: 'mint pending', 
      price: formatEther(mintPrice) 
   }
   const totalSupply = await contract.read.totalSupply()
   const maxSupply = await contract.read.maxSupply()
   if (totalSupply === maxSupply) {
      return {
         err: false, message: 'sold out', 
         price: formatEther(mintPrice) 
      }
   } else return {
      err: false, message: 'mint live', 
      price: formatEther(mintPrice)
   }
}

export const getNftUri = (constract: string, signer: any, tokenId: string) => {

}

const getNftContract = async (contractAddr: any, signer: any, network: string) => {
   const chainConfig = getChainConfig(network)
   if(chainConfig.err)
      return chainConfig

   const client = createWalletClient({account: signer, chain: chainConfig, transport: http()})
   const abi = await getContractAbi(contractAddr, client, chainConfig.id)

   return getContract({abi, address: contractAddr, client})
}

const getContractAbi = async (contractAddr: string, provider: any, chainId: number) => {
   const result = await whatsabi.autoload(contractAddr, {
      provider, abiLoader: new whatsabi.loaders.SourcifyABILoader({chainId: chainId})
    })
   return result.abi
}

const getChainConfig = (network: string): any => {
   switch(network) {
      case 'arbitrum': return arbitrum
      case 'arbitrumSepolia': return arbitrumSepolia
      case 'base': return base
      case 'baseSepolia': return baseSepolia
      case 'mainnet': return mainnet
      case 'sepolia': return sepolia
      default: return {err: true, message: 'network not supported'}
   }
}