import { Bot } from "@/bot";
import { NextApiRequest, NextApiResponse } from "next";

import { userData } from "@/bot/user";
import moment from "moment";
import { mintNft, nftInfo } from "@/bot/erc";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const bot = Bot()
   userData.forEach((user, key) => {
      const username = user?.username as string
      const account = user?.wallets.filter(w => w.default)[0].account
      user?.watchList
         .forEach(async w => {
            const now = new Date().getTime()
            const snipeDate = w.timeline.getTime()
            const fiveMins = 5 * 60 * 1000
            const timeToSnipe = snipeDate - now
            const isFiveMinsToSnipeDate = timeToSnipe <= fiveMins

            if(!isFiveMinsToSnipeDate) return

            const timeInMin = moment.duration(timeToSnipe).asMinutes()
            const info = await nftInfo(w.contract, account, w.network)
            bot.telegram.sendMessage(
               username, 
               `Time left for contract ${w.contract} to be minted is ${timeInMin} minutes.\nMint Price = ${info.price > 0 ? info.price + 'ETH' : 'free mint'}\n\nEnsure to have suffficient funds in default wallet account.`
            )
            setTimeout(async () => {
               try {
                     const nftMint = await mintNft(w.contract, account, w.network)
               } catch (error: any) {
                     bot.telegram.sendMessage(username, 'could not mint nft cause an error occured')
               }
            }, timeToSnipe)
         })
  })
  res.status(200)
}