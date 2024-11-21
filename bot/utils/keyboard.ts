import { InlineKeyboardMarkup } from "telegraf/types"

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

export const watchlistBoard = (watchlist: Array<any>) => {
    return watchlist
        .filter((item: any) => !item.minted)
        .map((item: any, index: number, list: any[]) => `${index + 1} ${item.contract}, time to mint ${timeBeforeMint(item.timeline)}${list.length - 1 != index ? '\n' : ''}`)
        .join('')
}

const timeBeforeMint = (timeline: Date) => {
    const now = new Date().getTime();
    const due = timeline.getTime();
    const timeLeft = due - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds left`;
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