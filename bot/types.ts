
export type WatchList = {
   contract: string,
   tokenId?: string,
   network: string
   mintAvailable?: boolean,
   minted?: boolean,
   timeline: Date,
   trxHash?: string
}

export type Wallet = {
   default: boolean,
   account: any
}

export type User = {
   username: string | undefined,
   wallets: Array<Wallet>,
   watchList: Array<WatchList>
}