import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export const StartMenu: InlineKeyboardMarkup = {
    inline_keyboard: [
        [
            { callback_data: "wallets", text: "Wallets" },
            { callback_data: "watchlist", text: "Watchlist" }
        ]
    ]
}

export const WalletMenu: InlineKeyboardMarkup = {
    inline_keyboard: [
        [
            { callback_data: "create wallet", text: "Create new wallet" },
            { callback_data: "import", text: "Import by seed phrase" }
        ],
        [ { callback_data: "view all", text: "View all wallets" } ]
    ]
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