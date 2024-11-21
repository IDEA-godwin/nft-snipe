
import { 
   english, generateMnemonic, 
   mnemonicToAccount, privateKeyToAccount 
} from 'viem/accounts'
import {
   mainnet, arbitrum, base,
   sepolia, arbitrumSepolia, baseSepolia
} from 'viem/chains'
import { createPublicClient, createWalletClient, formatEther, getContract, Hex, http } from 'viem'
// import { whatsabi } from '@shazow/whatsabi'

import abi_1 from './nft.abi.json'
import abi_2 from './arb-nft.abi.json'

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
   try {
      const contract = await getNftContract(contractAddr, signer, network)
      if(contract.err)
         return contract
      const hash = await contract.write.batchMint([1, 0, '0x0000000000000000000000000000000000000000'])
      console.log(hash)
   } catch (error: any) {
      console.log(error)
      return {
         err: true, message: error.details ? error.details : error.shortMessage
      }
   }
}

export const simulateContract = async (contractAddr: any, network: string, signer: any) => {
   try {
      const chainConfig = getChainConfig(network)
      if(chainConfig.err)
         return chainConfig
      const client = createPublicClient({chain: chainConfig, transport: http()})
      console.log(contractAddr, signer.address)
      const result = await client.simulateContract({
         address: contractAddr,
         abi: abi_1,
         functionName: 'batchMint',
         account: signer.address,
         args: [1, 0, '0x0000000000000000000000000000000000000000']
      })

      console.log(result)
   } catch (error: any) {
      console.log(error)
      return {
         err: true, message: error.details ? error.details : error.shortMessage
      }
   }
}

export const nftInfo = async (contractAddr: any, signer: any, network: string) => {
   const contract = await getNftContract(contractAddr, signer, network)
   if(contract.err)
      return contract

   try {
      const mintLive = await contract.read?.mintLive()
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
   } catch (error) {
      console.log(error)
      return {err: true, message: 'could not get nft info'}
   }
}

export const getNftUri = (contract: string, signer: any, tokenId: string) => {

}

export const getAccountBalance = async (addr: any) => {

   const publicClient = createPublicClient({chain: arbitrum, transport: http()})
   const balance = await publicClient.getBalance({address: addr})
   return formatEther(balance)
} 

const getNftContract = async (contractAddr: any, signer: any, network: string) => {
   const chainConfig = getChainConfig(network)
   if(chainConfig.err)
      return chainConfig

   const client = createWalletClient({account: signer, chain: chainConfig, transport: http()})
   const abi = await getContractAbi(contractAddr, client, chainConfig.id)
   if(abi.err)
      return abi

   return getContract({abi, address: contractAddr, client})
}

const getContractAbi = async (contractAddr: string, provider: any, chainId: number): Promise<any> => {
   // try {
   //    const result = await whatsabi.autoload(contractAddr, {
   //    provider, abiLoader: new whatsabi.loaders.SourcifyABILoader({chainId: chainId})
   //     })
   //    return result.abi
   // } catch (error) {
   //    return {err: true, message: 'could not decode contract, try again'}
   // }

   // return nft_abi

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