
import { getAccountBalance } from "../erc"
import { createAccountsKeyboard, createAcctBoard, watchlistBoard } from "./keyboard"

export const executeAction = (callback_data: string, user: any): any => {
    const [action, query] = callback_data.split(':')
    switch (action) {
        case 'start_wal': 
            return walletsAction(user)
        case 'start_wat': 
            return watchListAction(user)
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

const watchListAction = (user: any) => {
    const watchList: Array<any> = user.watchList
    console.log(watchList)
    const reply = `To create a snipe action use the /snipe command.\nTo mint an nft use the /mint command.\nTo get nft info use the /info command.${watchList.length === 0 ? '\n\nNo NFT in watch list for sniping' : '\n\nTo view all accounts use the /view_watchlist command'}`
    if (watchList.length > 0) {
        const watchlistKeyoard = watchlistBoard(watchList)
        return { text: `${reply}\n\n${watchlistKeyoard}`, keyboard: undefined }
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

const getAcctBalance = async (user: any, acctAddr: string) => {
    const balance = await getAccountBalance(acctAddr)
    return {
        text: `${balance}ETH`,
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