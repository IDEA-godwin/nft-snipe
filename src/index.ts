
import { exit } from 'process';
import 'dotenv/config';

import { Telegraf } from "telegraf";
import { StartMenu } from './keyboard';
import { executeAction } from './callback-actions';
import { 
    createAccount, 
    importAccountByMnemonic, 
    importAccountByPrivateKey 
} from './erc';

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

var userData: Map<number, User | undefined> = new Map();

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

async function displayMnemonic(ctx: any, mnemonic: string) {
    const display = await ctx.reply(`store mnemonic properly, message would be deleted in 3mins\n\n${mnemonic}`);
    setTimeout(() => {
        ctx.deleteMessage(display.message_id)
    }, 60 * 1000)
}

bot.start((ctx => {
    addUserToDataSet(ctx.from)
    ctx.reply("welcome how can we help you", {
        reply_markup: StartMenu
    })
}));

bot.command('create', async ctx => {
    const { mnemonic, account} = createAccount()
    let user = userData?.get(ctx.from.id)
    if(!user) {
        addUserToDataSet(ctx.from);
    }
    user = userData?.get(ctx.from.id)
    user?.wallets.push(account);
    userData.set(ctx.from.id, user)
    console.log(userData)
    ctx.reply(`new ERC account has been create with address ${account.address}`)
    displayMnemonic(ctx, mnemonic);
})

bot.command('view_accounts', async ctx => {
    const user = userData.get(ctx.from.id)
    console.log(user)
    if(!user?.wallets || user?.wallets.length === 0) {
        ctx.reply('No account created yet, use the /create commant to create your first account')
        return
    }
    const accountAddrs = user?.wallets
        .map((acct, index, accts) => `${index + 1}. ${acct.address}${index < accts.length - 1 ? '\n' : ''}`);
    ctx.reply(`${accountAddrs}`)
})

bot.command('import_mnemonic', async ctx => {
    const mnemonic = ctx.payload
    ctx.deleteMessage(ctx.message.message_id)
    const acct = importAccountByMnemonic(mnemonic)
    if(acct.err) {
        ctx.reply(`${acct.message}`)
        return
    }
    const user = userData.get(ctx.from.id)
    user?.wallets.push(acct)
    userData.set(ctx.from.id, user)
    ctx.reply(`Account with address ${acct.address} has been imported`)
})

bot.command('import_privateKey', async ctx => {
    const privateKey: any = ctx.payload
    ctx.deleteMessage(ctx.message.message_id)
    if(!privateKey.startsWith('0x')){
        ctx.reply('private key should start with 0x')
    }
    const acct = importAccountByPrivateKey(privateKey)
    if(acct.err) {
        ctx.reply(`${acct.message}`)
        return
    }
    const user = userData.get(ctx.from.id)
    user?.wallets.push(acct)
    userData.set(ctx.from.id, user)
    ctx.reply(`Account with address ${acct.address} has been imported`)
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