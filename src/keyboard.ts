import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export const StartMenu: InlineKeyboardMarkup = {
    inline_keyboard: [
        [
            { callback_data: "start_wal:wallets", text: "Wallets" },
            { callback_data: "start_wat:watchlist", text: "Watchlist" }
        ]
    ]
}

export const createAccountsKeyboard = (wallets: any[]): InlineKeyboardMarkup => {
    const inline_keyboard = wallets.map(value => [
        {callback_data: `acct:${value.account.address}`, text: `${value.account.address}${value.default ? ' (default)' : ''}`}
    ])
    return {
        inline_keyboard
    }
}

export const createAcctBoard = (acct: string, isDefault: boolean): InlineKeyboardMarkup => {
    let inline_keyboard = [
        [{ callback_data: `balance:${acct}`, text: 'Check Balance' }]
    ]
    if (!isDefault) inline_keyboard.push([{ callback_data: `default:${acct}`, text: 'Make Default' }])
    return { inline_keyboard }
} 

export const WatchlistMenu: InlineKeyboardMarkup = {
    inline_keyboard: [
        [
            { callback_data: "add NFT", text: "Add nft to watchlist" },
            { callback_data: "mint NFT", text: "Mint nft" },
        ],
        [ { callback_data: "list all", text: "View all nft in watchlist" } ]
    ]
}