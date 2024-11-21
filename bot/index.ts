
import { Telegraf } from "telegraf";
import { createAccountsKeyboard, StartMenu, watchlistBoard } from './utils/keyboard';
import { executeAction } from './utils/callback-actions';
import { 
    createAccount, 
    importAccountByMnemonic, 
    importAccountByPrivateKey, 
    mintNft,
    nftInfo,
    simulateContract
} from './erc';

import { userData } from "./user";

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

const helpText = '1. Create new wallet account; /create\n\n' +
'2. Import account using seed phrase; /import_mnemonic {mnemonic}\n\n' +
'3. Import account using privateKey; /import_privateKey {privateKey}\n\n' +
'4. View all user wallet view_accounts; /view_accounts\n\n' +
'5. View all contract in watch list pending mint; /view_watchlist\n\n' +
'6. Check nft contract status and price; /info {contractAddress} {network}\n\n' +
'7. Mint nft using default account; /mint {contractAddress} {network}\n\n' +
'8. Add nft contract to watch list to be minted when stipulated; /snipe {contractAddress} {network} {timeline:YYYY-MM-DDTHH:mm:ss}'

export const Bot = () => {
   const bot: Telegraf = new Telegraf(process.env.BOT_TOKEN as string)
   
   bot.start(async ctx => {
      addUserToDataSet(ctx.from)
      ctx.reply(`welcome how can we help you\n\n${helpText}`, {
         reply_markup: StartMenu
      })     
   });

   bot.help(async ctx => {
      ctx.reply(`${helpText}`)
   })
   
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
   
   bot.command('view_watchlist', async ctx => {
      const user = userData.get(ctx.from.id)
      if(!user?.watchList || user.watchList.length === 0) {
         ctx.reply('No item in watchlist, use the /snipe command add to watchlist')
         return
      }
      const watchlist = user.watchList
      ctx.reply(watchlistBoard(watchlist))
   })
   
   bot.command('import_mnemonic', async ctx => {
      const mnemonic = ctx.payload
      if (ctx.message.message_id)
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
      const wallet = user?.wallets.filter(wallet => wallet.default)[0]
      const result = await mintNft(contractAddr, wallet.account, network)
      if(result && result.err) {
            ctx.reply(result.message)
            return
      }
      
   })
  
   bot.command('simulate_mint', async ctx => {
      const [contractAddr, network] = ctx.payload.split(' ')
      const user = userData.get(ctx.from.id)
      if(!user?.wallets || user.wallets.length === 0) {
         ctx.reply('create account to proceed')
         return
      }
      const wallet = user?.wallets.filter(wallet => wallet.default)[0]
      const result = await simulateContract(contractAddr, network, wallet.account)
      if(result && result.err) {
         ctx.reply(result.message)
         return
      }
   })
  
   bot.command('snipe', async ctx => {
      const [contractAddr, network, timeline] = ctx.payload.split(' ')
      const user = userData.get(ctx.from.id)
      if(!user?.wallets || user.wallets.length === 0) {
         ctx.reply('create account to proceed')
         return
      }
      const mintInfo = await nftInfo(contractAddr, user?.wallets.filter(wallet => wallet.default)[0].account, network)
      if(mintInfo.err) {
         ctx.reply(mintInfo.message)
         return
      }
      const mintDate = new Date(timeline)
      user?.watchList.push({
         contract: contractAddr,
         timeline: new Date(timeline),
         network: network,
         mintAvailable: mintInfo.status === 'mint pending' || mintInfo.status === 'mint live',
         minted: false
      })
      userData.set(ctx.from.id, user)
      ctx.reply(`contract ${contractAddr} added to watchlist. To be minted on ${mintDate.toDateString()}`)
   })
  
   bot.on('callback_query', async (ctx) => {
      const query: any = ctx.callbackQuery
      const user = userData.get(ctx.from.id)
      const result = await executeAction(query.data, user);
      userData.set(ctx.from.id, result.user)
      ctx.reply(result.text, {
         reply_markup: result.keyboard
      })
   });


  return bot;
}