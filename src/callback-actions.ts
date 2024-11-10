
import { Keypair } from "@solana/web3.js"
import { WalletMenu, WatchlistMenu } from "./keyboard"

export const executeAction = (action: string, user?: any): any => {
    switch (action) {
        case 'wallets': 
            return { text: "Menu -> Wallets", keyboard: WalletMenu }
        case 'watchlist': 
            return { text: "Menu -> Watchlist", keyboard: WatchlistMenu }
        case 'create wallet':
            return {
                text: `
                To create new wallet, enter wallet password. This password would be use to create and authenticaticate manual transaction, so use something you can remember.
                \nTo set password use the /password command e.g\n/password pass1234`
            }
        case 'import':
            return {
                text: `Feature not available yet.`
            }
        case 'view all':
            let text;
            if (!user.wallets || user.wallets.length === 0)
                text = 'No wallet connected to user'
            else
                text = user.wallets.map((element: Keypair, index: number) => {
                    return `${index + 1}. ${element.publicKey.toBase58()}\n`
                })
            return { text }
        default:
            return {text: "can not recognize option"}
    }
}