
import { exit } from 'process';
import 'dotenv/config';

import { Telegraf } from "telegraf";
import { StartMenu } from './keyboard';
import { executeAction } from './callback-actions';
import { validatePasswordStrenght } from './util';
import { createNewKeypair } from './solana';

var user: any = {
    wallets: []
}

const { BOT_TOKEN } = process.env;
if (!BOT_TOKEN) {
    console.error("ensure bot token is assigned in environment");
    exit(1);
}

const bot: Telegraf = new Telegraf(BOT_TOKEN);

bot.start((ctx => {
    ctx.reply("welcome how can we help you", {
        reply_markup: StartMenu
    })
}));

bot.command('password', async ctx => {
    const password = ctx.payload
    if (!validatePasswordStrenght(password)){
        await ctx.reply("password should be alphanumeric and have lenght greater the 6")
        return;
    }
    const keypair = createNewKeypair(password)
    user.wallets.push(keypair)
    ctx.reply(`wallet has been create with publickey ${keypair.publicKey.toBase58()}`)
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