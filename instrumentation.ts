

export async function register() {
   console.log("I ran on server launch")

   const { BOT_TOKEN, BOT_WEBHOOK_BASE } = process.env;
   if (!BOT_TOKEN) {
      console.error("ensure bot token is assigned in environment");
      return
   }
   const bot = (await import('@/bot')).Bot();

   bot.launch({
      webhook: {
         domain: BOT_WEBHOOK_BASE as string,
         path: `/api/telegraf/snipe_webhook`,
         secretToken: BOT_TOKEN.split(':')[1]
      }
   }, () => {console.log('bot launched')})
}