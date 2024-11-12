
import { exit } from 'process';
import 'dotenv/config';

import { Telegraf } from "telegraf";
import { createAccountsKeyboard, StartMenu } from './keyboard';
import { executeAction } from './callback-actions';
import { 
    createAccount, 
    importAccountByMnemonic, 
    importAccountByPrivateKey, 
    mintNft,
    nftInfo
} from './erc';

type WatchList = {
    contract: string,
    tokenId?: string,
    network?: string
    mintAvailable?: boolean,
    minted?: boolean,
}

type Wallet = {
    default: boolean,
    account: any
}

type User = {
    username: string | undefined,
    wallets: Array<Wallet>,
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
    user = userData.get(ctx.from.id)
    if(user?.wallets.length === 0) 
        user.wallets.push({default: true, account})
    else
        user?.wallets.push({default: false, account});
    userData.set(ctx.from.id, user)
    ctx.reply(`new ERC account has been create with address ${account.address}`)
    displayMnemonic(ctx, mnemonic);
})

bot.command('view_accounts', async ctx => {
    const user = userData.get(ctx.from.id)
    if(!user?.wallets || user?.wallets.length === 0) {
        ctx.reply('No account created yet, use the /create commant to create your first account')
        return
    }
    const accountAddrs = createAccountsKeyboard(user.wallets)
    ctx.reply('Interact with the keyboard to see performable actions', {
        reply_markup: accountAddrs
    })
})

bot.command('import_mnemonic', async ctx => {
    const mnemonic = ctx.payload
    ctx.deleteMessage(ctx.message.message_id)
    const account = importAccountByMnemonic(mnemonic)
    if(account.err) {
        ctx.reply(`${account.message}`)
        return
    }
    let user = userData?.get(ctx.from.id)
    if(!user) {
        addUserToDataSet(ctx.from);
    }
    user = userData.get(ctx.from.id)
    if(user?.wallets.length === 0) 
        user.wallets.push({default: true, account})
    else
        user?.wallets.push({default: false, account});
    userData.set(ctx.from.id, user)
    // console.log(userData)
    ctx.reply(`Account with address ${account.address} has been imported`)
})

bot.command('import_privateKey', async ctx => {
    const privateKey: any = ctx.payload
    ctx.deleteMessage(ctx.message.message_id)
    if(!privateKey.startsWith('0x')){
        ctx.reply('private key should start with 0x')
    }
    const account = importAccountByPrivateKey(privateKey)
    if(account.err) {
        ctx.reply(`${account.message}`)
        return
    }   
    
    let user = userData?.get(ctx.from.id)
    if(!user) {
        addUserToDataSet(ctx.from);
    }

    user = userData.get(ctx.from.id)
    if(user?.wallets.length === 0) 
        user.wallets.push({default: true, account})
    else
        user?.wallets.push({default: false, account});
    userData.set(ctx.from.id, user)
    ctx.reply(`Account with address ${account.address} has been imported`)
})

bot.command('info', async ctx => {
    const [contractAddr, network] = ctx.payload.split(' ')
    const user = userData.get(ctx.from.id)
    if(!user?.wallets || user.wallets.length === 0) {
        ctx.reply('create account to proceed')
        return
    }
    const account = user?.wallets.filter(wallet => wallet.default)
    const result = await nftInfo(contractAddr, account, network)
    if(result.err) {
        ctx.reply(result.message)
        return
    }
    ctx.reply(`Mint Status: ${result.message}\nMint Price: ${result.price}`)
})

bot.command('mint', async ctx => {
    const [contractAddr, network] = ctx.payload.split(' ')
    const user = userData.get(ctx.from.id)
    if(!user?.wallets || user.wallets.length === 0) {
        ctx.reply('create account to mint')
        return
    }
    const account = user?.wallets.filter(wallet => wallet.default)
    const result = await mintNft(contractAddr, account, network)
    // if(result && result.err) {
    //     ctx.reply(result.message)
    //     return
    // }
})


bot.on('callback_query', async (ctx) => {
    const query: any = ctx.callbackQuery
    const user = userData.get(ctx.from.id)
    const result = executeAction(query.data, user);
    userData.set(ctx.from.id, result.user)
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