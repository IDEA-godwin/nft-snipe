
import { exit } from 'process';
import 'dotenv/config';

import { Telegraf } from "telegraf";
import { StartMenu } from './keyboard';
import { executeAction } from './callback-actions';
import { validatePasswordStrenght } from './util';
import { createNewKeypair } from './solana';
import { createAccount } from './erc';

type WatchList = {
    contract: string,
    tokenId?: string,
    network?: string
    mintAvailable?: boolean,
    minted?: boolean,
}

type User = {
    username: string | undefined,
    wallets: Array<any>,
    watchList: Array<WatchList>
}

var userData: Map<number, User> = new Map();

const { BOT_TOKEN } = process.env;
if (!BOT_TOKEN) {
    console.error("ensure bot token is assigned in environment");
    exit(1);
}

const bot: Telegraf = new Telegraf(BOT_TOKEN);

function addUserToDataSet(user: any) {
    const userInfo = {username: user.username, wallets: [], watchList: []}
    userData.set(user.id, userInfo)
}

function displayMnemonic(ctx: any, mnemonic: string) {
    ctx.reply(`store mnemonic properly, message would be deleted in 3mins\n\n${mnemonic}`)
        .then((value: any) => {
            setTimeout(() => {
                ctx.deleteMessage(value.message_id)
            }, 60 * 60 * 1000)
        })
}

bot.start((ctx => {
    addUserToDataSet(ctx.from)
    ctx.reply("welcome how can we help you", {
        reply_markup: StartMenu
    })
}));

bot.command('create', async ctx => {
    const { mnemonic, account} = createAccount();
    let user;
    try {
        user = userData.get(ctx.from.id);
    } catch (error) {
        addUserToDataSet(ctx.from);
        user = userData.get(ctx.from.id);
    }
    user?.wallets.push(account);
    ctx.reply(`new ERC account has been create with address ${account.address}`)
    displayMnemonic(ctx, mnemonic);
})

bot.on('callback_query', async (ctx) => {
    const query: any = ctx.callbackQuery
    const result = executeAction(query.data);
    ctx.reply(result.text, {
        reply_markup: result.keyboard
    })
});



bot.launch(() => {
    console.log("we all set to guild to nft brilliance")
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));