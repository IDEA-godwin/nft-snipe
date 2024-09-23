
import { exit } from 'process';
import 'dotenv/config';

import { Telegraf } from "telegraf";



const { BOT_TOKEN } = process.env;
if (!BOT_TOKEN) {
    console.error("ensure bot token is assigned in environment");
    exit(1);
}

const bot: Telegraf = new Telegraf(BOT_TOKEN);

bot.start((ctx => { ctx.reply("welcome how can we help you") }));

bot.launch();

function close() {
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
}