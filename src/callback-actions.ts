
import { keyboard } from "telegraf/typings/markup"
import { createAccountsKeyboard, createAcctBoard, WatchlistMenu } from "./keyboard"

export const executeAction = (callback_data: string, user: any): any => {
    const [action, query] = callback_data.split(':')
    switch (action) {
        case 'start_wal': 
            return walletsAction(user)
        case 'start_wat': 
            return { text: "Menu -> Watchlist", keyboard: WatchlistMenu }
        case 'acct': 
            return acctAction(user, query)
        case 'balance': 
            return getAcctBalance(user, query)
        case 'default': 
            return changeWalletDefault(user, query)
        default:
            return {text: "can not recognize option"}
    }
}

const walletsAction = (user: any) => {
    const wallets: Array<any> = user.wallets
    const reply = `To create a new account use the /create command.\nTo import an account using a mnemonic phrase use the /import_mnemonic command.\nTo import using a private key use the /import_privateKey command.${wallets.length === 0 ? '\n\nNo account connected to this user, create new account.' : '\n\nTo view all accounts use the /view_accounts command'}`
    if (wallets.length > 0) {
        const walletsKeyboard = createAccountsKeyboard(wallets)
        return { text: reply, keyboard: walletsKeyboard }
    }
    return {text: reply, keyboard: undefined, user}
}

const acctAction = (user: any, acctAddr: string) => {
    const wallet = user.wallets.filter((wallet: any) => wallet.account.address === acctAddr)[0]
    const acctActionBoard = createAcctBoard(acctAddr, wallet.default)
    return {
        text: `Interact with the board to perform action on account ${acctAddr}`,
        keyboard: acctActionBoard, user
    }
}

const getAcctBalance = (user: any, acctAddr: string) => {
    return {
        text: 'Balance: 0.0005ETH',
        keyboard: undefined, user
    }
}

const changeWalletDefault = (user: any, acctAddr: string) => {
    let wallets: any[] = user.wallets
    let indexOfDefault = wallets.findIndex(value => value.default)
    let indexOfNewDefault = wallets.findIndex(value => value.account.address === acctAddr)
    wallets[indexOfDefault].default = false
    wallets[indexOfNewDefault].default = true

    user.wallets = wallets
    return {
        text: `Default wallet account is ${wallets[indexOfNewDefault].account.address}`,
        keyboard: undefined, user
    }
}