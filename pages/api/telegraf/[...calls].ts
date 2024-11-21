import { Bot } from "@/bot";
import { NextApiRequest, NextApiResponse } from "next";
import { Update } from "telegraf/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const bot = Bot()
   const update: Update = req.body

   await bot.handleUpdate(update, res)
}