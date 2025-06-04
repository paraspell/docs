# Ready to make cross-chain swap messages with ease? 🤝

XCM Router can perform cross-chain transactions between Polkadot/Kusama Parachains and Relay chains as well. 
It works across 8 open-source Parachain DEXes.

**These are:**
- Acala / 36 Pools available
- Basilisk / 15 Pools available
- BifrostKusama / 66 Pools available / Requires native token for swaps
- BifrostPolkadot / 45 Pools available / Requires native token for swaps
- HydraDX / 210 Pools available
- Karura / 136 Pools available
- AssetHubPolkadot / 32 Pools available / Requires specific native tokens for swaps
- AssetHubKusama / 16 Pools available / Requires specific native tokens for swaps


Totalling to 556 pools available for cross-chain swap transactions.

**NOTE: Some exchanges require native tokens to proceed with swaps.**

## Automatic exchange selection
If you wish to have an exchange chain selection based on the best price outcome, you can opt for the automatic exchange selection method. This method can be selected by **not using** `.exchange()` parameter in the call. The router will then automatically select the best exchange chain for you based on the best price outcome.

```ts
await RouterBuilder
        .from('Polkadot')   //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        .to('Astar')    //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        .currencyFrom({symbol: 'DOT'})    // Currency to send - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} 
        .currencyTo({symbol: 'ASTR'})    // Currency to receive - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .senderAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(signer)    //PAPI Signer
        //.evmSenderAddress(evmInjector address)   //Optional parameters when origin node is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin node is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TRouterEvent) => {  //This is how we subscribe to calls that need signing
          console.log(status.type);   // Current transaction type
          console.log(status.routerPlan);   // Array of all transactions to execute
          console.log(status.node);   // Current transaction origin node
          console.log(status.destinationNode);    // Current transaction destination node
          console.log(status.currentStep);    // 0-based step index of current transaction
        })
        .buildAndSend()
```

## Whitelist exchange selection
If you wish to have specific exchanges selection and select the best one among them based on the best price outcome, you can opt for the whitelist automatic exchange selection method. This method can be selected by **using** `.exchange()` parameter in the call and feeding it with **array of exchanges**. The router will then automatically select the best exchange chain for you based on the best price outcome.

```ts
await RouterBuilder
        .from('Polkadot')   //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        .exchange(['HydrationDex','AcalaDex','AssetHubPolkadotDex'])    //Exchange Parachains
        .to('Astar')    //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        .currencyFrom({symbol: 'DOT'})    // Currency to send - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} 
        .currencyTo({symbol: 'ASTR'})    // Currency to receive - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .senderAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(signer)    //PAPI Signer
        //.evmSenderAddress(evmInjector address)   //Optional parameters when origin node is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin node is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TRouterEvent) => {  //This is how we subscribe to calls that need signing
          console.log(status.type);   // Current transaction type
          console.log(status.routerPlan);   // Array of all transactions to execute
          console.log(status.node);   // Current transaction origin node
          console.log(status.destinationNode);    // Current transaction destination node
          console.log(status.currentStep);    // 0-based step index of current transaction
        })
        .buildAndSend()
```

## Manual exchange selection
If you wish to select your exchange chain manually you can do that by providing additional parameter `.exchange()` in the call. The router will then use the exchange chain of your choice.

```ts
await RouterBuilder
        .from('Polkadot')   //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        .exchange('HydrationDex')    //Exchange Parachain
        .to('Astar')    //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        .currencyFrom({symbol: 'DOT'})    // Currency to send - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} 
        .currencyTo({symbol: 'ASTR'})    // Currency to receive - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .senderAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(signer)    //PAPI Signer
        //.evmSenderAddress(evmInjector address)   //Optional parameters when origin node is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin node is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TRouterEvent) => {  //This is how we subscribe to calls that need signing
          console.log(status.type);   // Current transaction type
          console.log(status.routerPlan);   // Array of all transactions to execute
          console.log(status.node);   // Current transaction origin node
          console.log(status.destinationNode);    // Current transaction destination node
          console.log(status.currentStep);    // 0-based step index of current transaction
        })
        .buildAndSend()
```

## Get amount out for your currency pair

To retrieve exchange amount, that you receive for your desired asset pair you can use following function. This function returns 2 parameters. Name of best fitting DEX (Automatic selection - can be further used for manual selection) and Amount out

```ts
const result = await RouterBuilder()
      .from('Astar') //Optional parameter
      .to('Acala') //Optional parameter
      .exchange('Hydration') //Optional parameter
      .currencyFrom({ symbol: 'ASTR' }) 
      .currencyTo({ symbol: 'DOT' })
      .amount(10000000000n)
      .getBestAmountOut();

console.log(result.amountOut)
console.log(result.exchange)
```

## Get Router fees

You can retrieve fees for all operations XCM Router performs. Keep in mind, that they are not as accurate for transfer from exchange to destination as the currency that is planned to be routed after the swap is not yet available on that account (Thus it uses payment info method instead of dryrun in that scenario).

```ts
const fees = await RouterBuilder()
      .from(from) //Optional parameter based on scenario
      .exchange(exchange) //Optional parameter based on scenario
      .to(to) //Optional parameter based on scenario
      .currencyFrom(currencyFrom)
      .currencyTo(currencyTo)
      .amount(amount)
      .senderAddress(senderAddress)
      .recipientAddress(recipientAddress)
      .slippagePct(slippagePct)
      .getXcmFees();
```

**Possible output objects:**
```
sendingChain - Present when origin is specified
exchangeChain - Always present
receivingChain - Present when destination is specified
```

**Example output**
We suggest running this query twice. First time to get Origin > Exchange chain transfer fee and second time to get Swap + Exchange > Destination chain fee. This is because DryRun requires currency to be on selected account in order to check for result. While the currency is on origin at the start we are unable to perform the DryRun on exchange chain because user doesn't yet have the asset there.

**First DryRun - Origin > Exchange example**
```
{
  "sendingChain": {
    "origin": {
      "fee": "50128149010235121",
      "feeType": "dryRun",
      "currency": "ASTR"
    },
    "destination": {
      "fee": "25667006681694993",
      "feeType": "dryRun",
      "currency": "ASTR"
    }
  },
  "exchangeChain": {
    "fee": "727836696700",
    "feeType": "paymentInfo",
    "currency": "HDX",
    "dryRunError": "FundsUnavailable",
    "selectedExchange": "HydrationDex"
  },
}
```

**Second DryRun - Swap fee + Exchange > Destination example**

NOTE: We are unable to perform XCM DryRun because the asset is not exchanged yet thus fees for XCM are estimated in payment info. 

The origin fee is **exchangeChain.fee + receivingChain.origin.fee**

The destination fee is **receivingChain.destination.fee**

In some occasions user has the exchanged asset already so DryRun might be also performed for receivingChain.origin.fee parameter. This will result in more precise fees, but they shouldn't differ too much in general - The switch between DryRun and PaymentInfo is automatic and internal so no action from your side required (DryRun is always performed first and only if it fails we switch to PaymentInfo).

```
{
  "exchangeChain": {
    "fee": "19468364",
    "feeType": "dryRun",
    "currency": "DOT",
    "selectedExchange": "AssetHubPolkadotDex"
  },
  "receivingChain": {
    "origin": {
      "fee": "733054560",
      "feeType": "paymentInfo",
      "currency": "DOT",
      "dryRunError": "LocalExecutionIncomplete"
    },
    "destination": {
      "fee": "44916179205536000",
      "feeType": "paymentInfo",
      "currency": "GLMR"
    }
  }
}
```

## Helpful functions

Below, you can find helpful functions that are exported from XCM Router to help you enhance front end usability of XCM Router.

```ts
import {getExchangeAssets, getExchangePairs} from @paraspell/xcm-router

//Returns all assets that DEX supports
const assets = getExchangeAssets('AssetHubPolkadotDex')

//Returns asset pairs supported by selected exchanges
const pairs = getExchangePairs(exchange) // Exchange can be also array of exchanges such as [“HydrationDex”, “AcalaDex”] or undefined which will return all available pairs for all dexes
```

## Ready to use in SpellRouter

| DEX | Can send to/receive from | Supported assets | Notes |
| ------------- | ------------- | ------------- |------------- |
| Acala DEX |Polkadot Relay, Astar, HydraDX, Interlay, Moonbeam, Parallel, AssetHubPolkadot, Unique network|ACA, DOT, aSEED, USDCet, UNQ, IBTC, INTR, lcDOT, LDOT| Fees are paid by either ACA or DOT|
|Karura DEX| Kusama Relay, Altair, Basilisk, BifrostKusama, Calamari, Crab, Parallel Heiko, Kintsugi, Moonriver, Quartz, Crust Shadow, Shiden, AssetHubKusama| BNC, USDCet, RMRK, ARIS, AIR, QTZ, CSM, USDT, KAR, KBTC, KINT, KSM, aSEED, LKSM, PHA, tKSM, TAI | Fees are paid by either KAR or KSM|
|Hydration DEX| Polkadot Relay, Acala, Interlay, AssetHubPolkadot, Zeitgeist, Astar, Centrifuge, BifrostPolkadot, Mythos | USDT, MYTH, HDX, WETH, GLMR, IBTC, BNC, WBTC, vDOT, DAI, CFG, DOT, DAI, ZTG, WBTC, INTR, ASTR, LRNA, USDC| Chain automatically gives you native asset to pay for fees.|
| Basilisk DEX | Kusama Relay, Karura, AssetHubKusama, Tinkernet, Robonomics| BSX, USDT, aSEED, XRT, KSM, TNKR| Chain automatically gives you native asset to pay for fees.|
|Bifrost Kusama DEX| Kusama Relay, AssetHubKusama, Karura, Moonriver, Kintsugi| BNC, vBNC, vsKSM, vKSM, USDT, aSEED, KAR, ZLK, RMRK, KBTC, MOVR, vMOVR| Chain requires native BNC asset for fees.|
|Bifrost Polkadot DEX| Polkadot Relay, AssetHubPolkadot, Moonbeam, Astar, Interlay| BNC, vDOT, vsDOT, USDT, FIL, vFIL, ASTR, vASTR, GLMR, vGLMR, MANTA, vMANTA|Chain requires native BNC asset for fees.|
|AssetHubPolkadot| Polkadot Relay, Any Parachain it has HRMP channel with | DOT, WETH.e, USDC, USDT, LAOS, MYTH, WBBTC.e, ASX, BILL, DEMO, TATE, PINK, MODE, MVPW, PIGS, DED, wstETH.e, TTT, KSM, tBTC.e, PEPE.e, SHIB.e, TON.e, NAT, NT2, DOTA, STINK, MTC, AJUN, GGI, GLMR, NIN | Requires specific native tokens for swaps |
|AssetHubKusama| Kusama Relay, Any Parachain it has HRMP channel with | KSM, DOT, USDC, USDT, BILLCOIN, WOOD, dUSD, TACP, TSM, MA42, USDT, DMO, JAM | Requires specific native tokens for swaps |
