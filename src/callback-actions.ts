
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
                \nTo set password use the /password command e.g /password <YOUR_PASSWORD>`
            }
        default:
            return {text: "can not recognize option"}
    }
}