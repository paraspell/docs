# Send XCM messages across Paraverse 🪐
### You can use our SDK in all three scenarios:
- Relay chain to Parachain XCM transfer 
- Parachain to Relay chain XCM transfer
- Parachain to Parachain XCM transfer

## Relay chain to Parachain

```ts
const builder = Builder(/*node api/ws_url_string/ws_url_array - optional*/)
      .from(RELAY_NODE) //Kusama or Polkadot
      .to(NODE/*,customParaId - optional*/ | Multilocation object)
      .currency({symbol: 'DOT', amount: amount})
      .address(address | Multilocation object)
      /*.xcmVersion(Version.V1/V2/V3/V4)  //Optional parameter for manual override of XCM Version used in call
        .customPallet('Pallet','pallet_function') //Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some node but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.*/

const tx = await builder.build()

//Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()

/*
EXAMPLE:
const builder = await Builder()
  .from('Polkadot')
  .to('Astar')
  .currency({
    symbol: 'DOT',
    amount: '1000000000'
  })
  .address(address)

const tx = await builder.build()

//Disconnect API after TX
await builder.disconnect()
*/
```

## Parachain to Relay chain

```ts
const builder = Builder(/*node api/ws_url_string/ws_url_array - optional*/)
      .from(NODE)
      .to(RELAY_NODE) //Kusama or Polkadot
      .currency({symbol: 'DOT', amount: amount})
      .address(address | Multilocation object)
      /*.xcmVersion(Version.V1/V2/V3/V4)  //Optional parameter for manual override of XCM Version used in call
        .customPallet('Pallet','pallet_function') //Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some node but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.*/

const tx = await builder.build()

//Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()

/*
EXAMPLE:
const builder = await Builder()
  .from('Astar')
  .to('Polkadot')
  .currency({
    symbol: 'DOT',
    amount: '1000000000'
  })
  .address(address)

const tx = await builder.build()

//Disconnect API after TX
await builder.disconnect()
*/
```

## Parachain to Parachain

**NOTE** If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `.currency(42259045809535163221576417993425387648n)` will mean you transfer xcDOT.

### Builder pattern

```ts
const builder = Builder(/*node api/ws_url_string/ws_url_array - optional*/)
      .from(NODE)
      .to(NODE /*,customParaId - optional*/ | Multilocation object /*Only works for PolkadotXCM pallet*/) 
      .currency({id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}})
      .address(address | Multilocation object /*If you are sending through xTokens, you need to pass the destination and address multilocation in one object (x2)*/)
      /*.senderAddress(address) - OPTIONAL - used when origin is AssetHub and feeAsset parameter is provided*/
      /*.feeAsset({symbol: 'symbol'} || {id: 'id'} || {multilocation: 'multilocation'}) // Optional parameter used when multiasset is provided or when origin is AssetHub - so user can pay in fees different than DOT
        .xcmVersion(Version.V1/V2/V3/V4)  //Optional parameter for manual override of XCM Version used in call
        .customPallet('Pallet','pallet_function') //Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some node but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.*/

const tx = await builder.build()

//Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()

/*
EXAMPLE:
const builder = Builder()
  .from('Acala')
  .to('Astar')
  .currency({
    symbol: 'ACA',
    amount: '1000000000'
  })
  .address(address)

const tx = await builder.build()

//Disconnect API after TX
await builder.disconnect()
*/
```

## XCM Fee (Origin and Dest.)
Following queries allow you to query fee from both Origin and Destination of the XCM Message. You can get accurate result from DryRun query(Requires token balance) or less accurate from Payment info query (Doesn't require token balance).

### More accurate query using DryRun
The query is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by either origin or destination. This query requires user to have token balance (Token that they are sending and origin native asset to pay for execution fees on origin).

```
NOTICE: When Payment info query is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price. DryRun returns fees in currency that is being transferred, so no additional calculations necessary in that case.
```

```ts
const fee = await Builder(/*node api/ws_url_string/ws_url_array - optional*/)
          .from(ORIGIN_CHAIN)
          .to(DESTINATION_CHAIN)
          .currency(CURRENCY)
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getXcmFee(/*{disableFallback: true / false}*/)  //Fallback is optional. When fallback is disabled, you only get notified of DryRun error, but no Payment info query fallback is performed. Payment info is still performed if Origin or Destination chain do not support DryRun out of the box.
```

### Less accurate query using Payment info
This query is designed to retrieve you approximate fee and doesn't require any token balance.

```
NOTICE: When Payment info query is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price. 
```

```ts
const fee = await Builder(/*node api/ws_url_string/ws_url_array - optional*/)
          .from(ORIGIN_CHAIN)
          .to(DESTINATION_CHAIN)
          .currency(CURRENCY)
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)          
          .getXcmFeeEstimate()
```

## Ecosystem Bridges
This section sums up currently available and implemented ecosystem bridges that are offered in the XCM SDK. Implementing cross-ecosystem asset transfers was never this easy!

### Polkadot <> Kusama bridge
Latest SDK versions support Polkadot <> Kusama bridge in very native and intuitive way. You just construct the Polkadot <> Kusama transfer as standard Parachain to Parachain scenario transfer.

```ts
  await Builder(api)            //Api parameter is optional and can also be ws_url_string
        .from('AssetHubPolkadot')  //Either AHP or AHK
        .to('AssetHubKusama')     //Either AHP or AHK
        .currency({symbol: 'DOT', amount: amount})        // Either KSM or DOT 
        .address(address)
        .build()
```

### Polkadot <> Ethereum bridge (Snowbridge)
Just like Polkadot <> Kusama bridge the Snowbridge is implemented in as intuitive and native form as possible. The implementations for Polkadot -> Ethereum and Ethereum -> Polkadot differ due to different architecure so we will mention both scenarios.

#### Polkadot -> Ethereum transfer

**AssetHub**
```ts
await Builder(api)
          .from('AssetHubPolkadot')
          .to('Ethereum')           
          .currency({symbol: 'WETH', amount: amount})   //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .address(eth_address)  //AccountKey20 recipient address
          .build()
```
**Other non-evm Parachains**
```ts
await Builder(api)
          .from('Hydration') //Non-evm Parachain
          .to('Ethereum')           
          .currency({symbol: 'WETH', amount: amount})   //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .address(eth_address)  //AccountKey20 recipient address
          .senderAddress(sender_address) // Injector SS58 address
          .build()
```

**Other evm Parachains**
```ts
await EvmBuilder(provider)
          .from('Moonbeam') //EVM Parachain
          .to('Ethereum')           
          .currency({symbol: 'WETH', amount: amount})   //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .address(eth_address)  //AccountKey20 recipient address
          .senderAddress(sender_address) //Asset hub address (Needs to be sender address)
          .build()
```

#### Ethereum -> Polkadot transfer
```ts
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

await EvmBuilder(provider)   //Ethereum provider
  .from('Ethereum')   
  .to('AssetHubPolkadot')
  .currency({symbol: 'WETH', amount: amount})    //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
  .address(address,ahAddress /*optional*/)   //AccountID32 recipient address //ahAddress is optional and used in Moonbeam>Ethereum transfer.
  .signer(signer)     //Ethereum signer address
  .build();
```

**Helper functions:**
```js
await depositToken(signer: Signer, amount: bigint, symbol: string); //Deposit token to contract
await getTokenBalance(signer: Signer, symbol: string); //Get token balance
await approveToken(signer: Signer, amount: bigint, symbol: string); //Approve token
```

### Snowbridge status check
Query for Snowbridge status 

```ts
const status = await getBridgeStatus(/*optional parameter Bridge Hub API*/)
```

## Dry run your XCM Calls

Dry running let's you check whether your XCM Call will execute, giving you a chance to fix it if it is constructed wrongly or you didn't select correct account/asset or don't have enough balance. It is constructed in same way as standard XCM messages with parameter `.dryRun()` instead of `.build()`

```ts
const result = await Builder(API /*optional*/)
        .from(NODE)
        .to(NODE_2)
        .currency({id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}})
        .address(ADDRESS)
        .senderAddress(SENDER_ADDRESS)
        .dryRun()

//Check Parachain for DryRun support - returns true/false
import { hasDryRunSupport } from "@paraspell/sdk-pjs";

const result = hasDryRunSupport(node)
```

## Batch calls
You can batch XCM calls and execute multiple XCM calls within one call. All three scenarios (Para->Para, Para->Relay, Relay->Para) can be used and combined.
```ts
await Builder(/*node api/ws_url_string - optional*/)
      .from(NODE) //Ensure, that origin node is the same in all batched XCM Calls.
      .to(NODE_2) //Any compatible Parachain
      .currency({currencySelection, amount}) //Currency to transfer - options as in scenarios above
      .address(address | Multilocation object)
      .addToBatch()

      .from(NODE) //Ensure, that origin node is the same in all batched XCM Calls.
      .to(NODE_3) //Any compatible Parachain
      .currency({currencySelection, amount}) //Currency to transfer - options as in scenarios above
      .address(address | Multilocation object)
      .addToBatch()
      .buildBatch({ 
          // This settings object is optional and batch all is the default option
          mode: BatchMode.BATCH_ALL //or BatchMode.BATCH
      })
```

## Moonbeam xTokens smart-contract
If you need to sign Moonbeam / Moonriver transactions with other than Polkadot wallets (eg. Metamask), you can interact with their smart contract to perform operations with other wallets. Both Ethers and Viem are supported.

```ts
const hash = await EvmBuilder()
      .from('Moonbeam') // Moonbeam or Moonriver
      .to(node) //Parachain | Relay chain
      .currency(({id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount}) //Select currency by ID or Symbol
      .address(address)
      .signer(signer) // Ethers Signer or Viem Wallet Client
      .build()
```

## Local transfers
```ts
const builder = Builder(/*node api/ws_url_string/ws_url_array - optional*/)
      .from(NODE)
      .to(NODE) //Has to be same as origin (from)
      .currency({id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}})
      .address(address)

const tx = await builder.build()

//Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()

/*
EXAMPLE:
const builder = Builder()
  .from('Hydration')
  .to('Hydration')
  .currency({
    symbol: 'DOT',
    amount: '1000000000'
  })
  .address(address)

const tx = await builder.build()

//Disconnect API after TX
await builder.disconnect()
*/
```

## Query existential deposit
Latest SDK versions now offer ability to query existential deposit on implemented chains using simple call:

```ts
//PAPI
import { getExistentialDeposit } from "@paraspell/sdk";
//PJS
import { getExistentialDeposit } from "@paraspell/sdk-pjs";

//Currency is an optional parameter. If you wish to query native asset, currency parameter is not necessary.
//Currency can be either {symbol: assetSymbol}, {id: assetId}, {multilocation: assetMultilocation}.
const ed = getExistentialDeposit(node, currency?)
```

## XCM Transfer info
You can now query all important information about your XCM call including information about fees (If your balance is sufficient to transfer XCM message) and more.

```ts
//PAPI
import { getTransferInfo, getBalanceForeign, getBalanceNative, getOriginFeeDetails, getMaxNativeTransferableAmount, getMaxForeignTransferableAmount, getTransferableAmount } from "@paraspell/sdk";
//PJS
import { getTransferInfo, getBalanceForeign, getBalanceNative, getOriginFeeDetails, getMaxNativeTransferableAmount, getMaxForeignTransferableAmount, getTransferableAmount } from "@paraspell/sdk-pjs";

//Get balance of foreign currency
await getBalanceForeign({address, node, currency /*- {id: currencyID} | {symbol: currencySymbol} | {symbol: Native('currencySymbol')} | {symbol: Foreign('currencySymbol')} | {symbol: ForeignAbstract('currencySymbol')} | {multilocation: AssetMultilocationString | AssetMultilocationJson}*/, api /* api/ws_url_string optional */})

//Get balance of native currency
await getBalanceNative({address, node, api /* api/ws_url_string optional */})

//Get fee information regarding XCM call
await getOriginFeeDetails({from, to, currency /*- {id: currencyID} | {symbol: currencySymbol} | {symbol: Native('currencySymbol')} | {symbol: Foreign('currencySymbol')} | {symbol: ForeignAbstract('currencySymbol')} | {multilocation: AssetMultilocationString | AssetMultilocationJson}*/, amount, originAddress, destinationAddress, ahAddress /* optional parameter when destination is Ethereum and origin is Parachain other than AssetHub*/, api /* api/ws_url_string optional */, feeMargin /* 10% by default */})

//Retrieves the asset balance for a given account on a specified node (You do not need to specify if it is native or foreign).
await getAssetBalance({address, node, currency /*- {id: currencyID} | {symbol: currencySymbol} | {symbol: Native('currencySymbol')} | {symbol: Foreign('currencySymbol')} | {symbol: ForeignAbstract('currencySymbol')} | {multilocation: AssetMultilocationString | AssetMultilocationJson}*/, api /* api/ws_url_string optional */});

//Retrieves maximal transferable balance of chain's native asset (Balance-AssetED) (If a node has more native assets, the asset selection has to be provided. Otherwise the parameter is optional).
await getMaxNativeTransferableAmount({address, node, currency /*- {symbol: currencySymbol} */})

//Retrives maximal transferable balance of chain's foreign asset (Balance-AssetED)
await getMaxForeignTransferableAmount({address, node, currency /*- {id: currencyID} | {symbol: currencySymbol} | {symbol: Native('currencySymbol')} | {symbol: Foreign('currencySymbol')} | {symbol: ForeignAbstract('currencySymbol')} | {multilocation: AssetMultilocationString | AssetMultilocationJson}*/});

//Combines the getMaxNative and getMaxForeign transferable amount functions into one, so you don't have to specify whether you want a native or foreign asset.
await getTransferableAmount({address, node, currency /*- {id: currencyID} | {symbol: currencySymbol} | {symbol: Native('currencySymbol')} | {symbol: Foreign('currencySymbol')} | {symbol: ForeignAbstract('currencySymbol')} | {multilocation: AssetMultilocationString | AssetMultilocationJson}*/});

//Get all the information about XCM transfer
await getTransferInfo({from, to, address, destinationAddress, currency /*- {id: currencyID} | {symbol: currencySymbol} | {symbol: Native('currencySymbol')} | {symbol: Foreign('currencySymbol')} | {symbol: ForeignAbstract('currencySymbol')} | {multilocation: AssetMultilocationString | AssetMultilocationJson}*/, amount, api /* api/ws_url_string optional */})

//Get bridge and execution fee for transfer from Parachain to Ethereum. Returns as an object of 2 values - [bridgeFee, executionFee]
await getParaEthTransferFees(/*api - optional (Can also be WS port string or array o WS ports. Must be AssetHubPolkadot WS!)*/)

//Verify whether XCM message you wish to send will reach above existential deposit on destination chain.
await verifyEdOnDestination(node,  currency: {symbol: || id: || multilocation: .. ,amount: 100000n}, address)
```

## Developer experience

### Builder pattern experience
When developing with the Builder pattern, the developer is guided by the typescript and thus knows which parameter can be added next. This increases the developer experience and makes SDK easier to use.
<img width="459" alt="builder" src="https://user-images.githubusercontent.com/55763425/214562882-dd1a052e-c420-4131-bb50-3b656fabd10c.png">
