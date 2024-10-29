# Send XCM messages across Paraverse 🪐
### You can use our SDK in all three scenarios:
- Relay chain to Parachain XCM transfer 
- Parachain to Relay chain XCM transfer
- Parachain to Parachain XCM transfer

### Video guide for this section:
[
![xcmPallet](https://user-images.githubusercontent.com/55763425/238154617-0b57c5c8-76cf-490c-812d-481f097f4977.png)
](https://youtu.be/MoCrt2vYJJU)


## Relay chain to Parachain
Only the `to` parameter is provided, thus the Relay chain to Parachain scenario will be used.

### Builder pattern

```js
  await Builder(api)        //Api parameter is optional
      .to('Basilisk')       // Destination Parachain //You can now add custom ParachainID eg. .to('Basilisk', 2024) or use custom Multilocation
      .amount(amount)       // Token amount
      .address(address)     // AccountId32 or AccountKey20 address or custom Multilocation
      /*.xcmVersion(Version.V1/V2/V3/V4)  //Optional parameter for manual override of XCM Version used in call*/
      .build()              // Function called to build call
```

### Function pattern 

```js
await paraspell.xcmPallet.transferRelayToPara(
  {
    api?,                 //Api parameter (Optional)
    destination,          // Destination Parachain or custom Multilocation
    amount,               // Token amount
    to                    // AccountId32 or AccountKey20 address or custom Multilocation
    paraIdTo?,            //Custom destination parachain ID (Optional)
    destApiForKeepAlive?  //Api parameter for keep alive check (Optional)
  }
)
```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

To find out more about custom multilocations reffer to the [following PR](https://github.com/paraspell/xcm-tools/pull/199).


## Parachain to Relay chain
Only the `from` parameter is provided, thus the Parachain to Relay chain scenario will be used.

### Builder pattern

```js
  await Builder(api)            //Api parameter is optional
      .from('Acala')            // Origin Parachain
      .amount(amount)           // Token amount
      .address(address)         // AccountId32 address or custom Multilocation
      /*.xcmVersion(Version.V1/V2/V3/V4)  //Optional parameter for manual override of XCM Version used in call*/
      .build()                  // Function called to build call
```

### Function pattern

```js
await paraspell.xcmPallet.send(
  {
    api?,                 //Api parameter (Optional)
    origin,               // Origin Parachain
    amount,               // Token amount
    to                    // AccountId32 or AccountKey20 address or custom Multilocation
    paraIdTo?,            //Custom destination parachain ID (Optional)
    destApiForKeepAlive?  //Api parameter for keep alive check (Optional)
  }
)
```
AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

To find out more about custom multilocations reffer to the [following PR](https://github.com/paraspell/xcm-tools/pull/199).

## Parachain to Parachain
Both `from` and `to` parameters are provided, thus the Parachain to Parachain scenario will be used.

**NOTE** If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `.currency(42259045809535163221576417993425387648n)` will mean you transfer xcDOT.

### Builder pattern

```js
  await Builder(api)            //Api parameter is optional
      .from('Karura')           // Origin Parachain
      .to('Basilisk')           // Destination Parachain //You can now add custom ParachainID eg. .to('Basilisk', 2024) or use custom Multilocation
      .currency({symbol: 'KSM'}) //{id: currencyID} | {symbol: currencySymbol}, | {multilocation: multilocationJson} | {multiasset: multilocationJsonArray}   
      /*.feeAsset(feeAsset) - Parameter required when using MultilocationArray*/
      .amount(amount)           // Token amount
      .address(address)         // AccountId32 or AccountKey20 address or custom Multilocation
      /*.xcmVersion(Version.V1/V2/V3/V4)  //Optional parameter for manual override of XCM Version used in call*/
      .build()                  // Function called to build call
```

### Function pattern

```js
await paraspell.xcmPallet.send(
  {
    api?,                 //Api parameter (Optional)
    origin,               // Origin Parachain
    currency,             // {id: currencyID} | {symbol: currencySymbol}, | {multilocation: multilocationJson} | {multiasset: multilocationJsonArray}
    feeAsset?             // Fee asset select id,
    amount,               // Token amount
    to,                   // AccountId32 or AccountKey20 address or custom Multilocation
    destination,          // Destination Parachain or custom Multilocation
    paraIdTo?,            //Custom destination parachain ID (Optional)
    destApiForKeepAlive?  //Api parameter for keep alive check (Optional)
  }
)
```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

To find out more about custom multilocations reffer to the [following PR](https://github.com/paraspell/xcm-tools/pull/199).

## Ecosystem Bridges
This section sums up currently available and implemented ecosystem bridges that are offered in the XCM SDK. Implementing cross-ecosystem asset transfers was never this easy!

### Polkadot <> Kusama bridge
Latest SDK versions support Polkadot <> Kusama bridge in very native and intuitive way. You just construct the Polkadot <> Kusama transfer as standard Parachain to Parachain scenario transfer.

```js
  await Builder(api)            //Api parameter is optional
        .from('AssetHubPolkadot')  //Either AHP or AHK
        .to('AssetHubKusama')     //Either AHP or AHK
        .currency({symbol: 'DOT'})        // Either KSM or DOT 
        .amount(amount)
        .address(address)
        .build()
```

### Polkadot <> Ethereum bridge (Snowbridge)
Just like Polkadot <> Kusama bridge the Snowbridge is implemented in as intuitive and native form as possible. The implementations for Polkadot -> Ethereum and Ethereum -> Polkadot differ due to different architecure so we will mention both scenarios.

#### Polkadot -> Ethereum transfer
```js
await Builder(api)
          .from('AssetHubPolkadot')
          .to('Ethereum')           
          .currency({symbol: 'WETH'})   //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .amount(amount)
          .address(eth_address)  //AccountKey20 recipient address
          .build()
```

#### Ethereum -> Polkadot transfer
```js
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

await EvmBuilder(provider)      //Ethereum provider
  .to('AssetHubPolkadot')
  .amount(amount)
  .currency({symbol: 'WETH'})    //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
  .address(address)   //AccountID32 recipient address
  .signer(signer)     //Ethereum signer address
  .build();
```
## Batch calls
You can batch XCM calls and execute multiple XCM calls within one call. All three scenarios (Para->Para, Para->Relay, Relay->Para) can be used and combined.
```js
await Builder(/*node api - optional*/)
      .from(NODE) //Ensure, that origin node is the same in all batched XCM Calls.
      .to(NODE_2) //Any compatible Parachain
      .currency(currency) //Currency to transfer (If Para->Para), otherwise you do not need to specify .currency()
      .amount(amount) 
      .address(address | Multilocation object)
      .addToBatch()

      .from(NODE) //Ensure, that origin node is the same in all batched XCM Calls.
      .to(NODE_3) //Any compatible Parachain
      .currency(currency) //Currency to transfer (If Para->Para), otherwise you do not need to specify .currency()
      .amount(amount)
      .address(address | Multilocation object)
      .addToBatch()
      .buildBatch({ 
          // This settings object is optional and batch all is the default option
          mode: BatchMode.BATCH_ALL //or BatchMode.BATCH
      })
```

## Query existential deposit
Latest SDK versions now offer ability to query existential deposit on implemented chains using simple call:

```ts
//PJS
import { getExistentialDeposit } from "@paraspell/sdk";
//PAPI
import { getExistentialDeposit } from "@paraspell/sdk/papi";

const ed = getExistentialDeposit('Acala')
```

## XCM Transfer info
You can now query all important information about your XCM call including information about fees (If your balance is sufficient to transfer XCM message) and more.

```ts
//PJS
import { getTransferInfo, getBalanceForeign, getBalanceNative, getOriginFeeDetails } from "@paraspell/sdk";
//PAPI
import { getTransferInfo, getBalanceForeign, getBalanceNative, getOriginFeeDetails } from "@paraspell/sdk/papi";

//Get balance of foreign currency
await getBalanceForeign(address, Parachain name, currency /*- {id: currencyID} | {symbol: currencySymbol}*/)

//Get balance of native currency
await getBalanceNative(address, Parachain name)

//Get fee information regarding XCM call
await getOriginFeeDetails(from, to, currency /*- {id: currencyID} | {symbol: currencySymbol}*/, amount, originAddress, api /* optional */, feeMargin /* 10% by default */)

//Get all the information about XCM transfer
await getTransferInfo(from, to, address, destinationAddress, currency /*- {id: currencyID} | {symbol: currencySymbol}*/, amount)
```

## Developer experience

### Builder pattern experience
When developing with the Builder pattern, the developer is guided by the typescript and thus knows which parameter can be added next. This increases the developer experience and makes SDK easier to use.
<img width="459" alt="builder" src="https://user-images.githubusercontent.com/55763425/214562882-dd1a052e-c420-4131-bb50-3b656fabd10c.png">


### Control messages into the console 
Once the call is being constructed developer is warned about major details regarding the call into the console. This way they can ensure, that the call they wanted to create is being created.
<img width="409" alt="212045110-c001fcb7-8cc2-421c-9cd0-6d8205b3b11f" src="https://user-images.githubusercontent.com/55763425/212065770-48ff4b35-2463-48b3-bd51-bae56b2105a8.png">
