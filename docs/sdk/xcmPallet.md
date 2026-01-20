# Send XCM messages across Paraverse 🪐
### You can use our SDK in five different cross-chain scenarios:
- Relay chain to Parachain XCM transfer 
- Parachain to Relay chain XCM transfer
- Parachain to Parachain XCM transfer
- Parachain to Ethereum transfer
- Polkadot to Kusama ecosystem transfer and vice versa

## Substrate to Substrate

```ts
const builder = Builder(/*client | builder_config |ws_url | [ws_url, ws_url,..] - Optional*/)
      .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TChain /*,customParaId - optional*/ | Location object /*Only works for PolkadotXCM pallet*/) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address | Location object /*If you are sending through xTokens, you need to pass the destination and address location in one object (x2)*/)
      .senderAddress(address) // - OPTIONAL but strongly recommended as it is automatically ignored when not needed - Used when origin is AssetHub/Hydration with feeAsset or when sending to AssetHub to prevent asset traps by auto-swapping to DOT to have DOT ED.

const tx = await builder.build()

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} // Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} // Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} // Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

:::

::: details Advanced settings

These can be added to further customize your calls.

```ts
.ahAddress(ahAddress) - OPTIONAL - used when origin is EVM CHAIN and XCM goes through AssetHub (Multihop transfer where we are unable to convert Key20 to ID32 address eg. origin: Moonbeam & destination: Ethereum (Multihop goes from Moonbeam > AssetHub > BridgeHub > Ethereum)
.feeAsset({symbol: 'symbol'} || {id: 'id'} || {location: 'location'}) // Optional parameter used when multiple assets are provided or when origin is AssetHub/Hydration - so user can pay fees with asset different than DOT
.xcmVersion(Version.V3/V4/V5)  // Optional parameter for manual override of XCM Version used in call
.customPallet('Pallet','pallet_function') // Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some CHAIN but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await Builder({
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await Builder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Format check**

Following setting will perform dryrun bypass for each call under the hood. This will ensure XCM Format is correct and will prevent SDK from opening wallet if dryrun bypass does not pass - meaning, that the XCM Format is incorrect.

```ts
const builder = await Builder({
  xcmFormatCheck: true // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

:::

**Notes**

::: details Transfers selecting currency by long Asset ID

When transferring from Parachain that uses long IDs for example Moonbeam make sure to add character `n` at the end of currencyID. For example: `.currency({id: 42259045809535163221576417993425387648n, amount: 123})` will mean that you have selected to transfer xcDOT.

:::

**Builder example**

::: details Transfering 1 USDT transfer from Hydration to AssetHubPolkadot 
```ts
const builder = Builder()
  .from('Hydration')
  .to('AssetHubPolkadot')
  .currency({
    id: 10,
    amount: '1000000'
  })
  .address(address)

const tx = await builder.build()

// Disconnect API after TX
await builder.disconnect()
```

:::


## Ecosystem Bridges
List of available bridges in XCM SDK. Implementing cross-ecosystem asset transfers was never this easy!

### Polkadot <> Kusama bridge

```ts
await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)       
      .from('AssetHubPolkadot')  // 'AssetHubPolkadot' | 'AssetHubKusama'
      .to('AssetHubKusama')     // 'AssetHubPolkadot' | 'AssetHubKusama'
      .currency({symbol: 'DOT', amount: amount /*Use "ALL" to transfer everything*/})        // 'KSM' | 'DOT' | 'USDC' | 'USDT'
      .address(address)
      .build()
```

**Initial setup:**
::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await Builder({
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await Builder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Format check**

Following setting will perform dryrun bypass for each call under the hood. This will ensure XCM Format is correct and will prevent SDK from opening wallet if dryrun bypass does not pass - meaning, that the XCM Format is incorrect.

```ts
const builder = await Builder({
  xcmFormatCheck: true // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

:::

### Polkadot <> Ethereum bridge (Snowbridge)
The transfers from Ethereum to Polkadot differ in setup from the opposite route, thus we mention both.

#### Polkadot -> Ethereum transfer

```ts
await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .to('Ethereum')           
          .currency({symbol: 'WETH', amount: amount /*Use "ALL" to transfer everything*/})   // Any supported asset by bridge - WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .address(eth_address)  // AccountKey20 recipient address
          .senderAddress(sender_address) // Injector SS58 address
          .ahAddress(ahAddress) // Recommended! ahAddress is optional but should be used always, as in scenarios where it isn't necessary it will be ignored. It is used when origin chain is EVM style because we are unable to convert your sender Key20 address to ID32 address.
          .build()
```

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await Builder({
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await Builder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Format check**

Following setting will perform dryrun bypass for each call under the hood. This will ensure XCM Format is correct and will prevent SDK from opening wallet if dryrun bypass does not pass - meaning, that the XCM Format is incorrect.

```ts
const builder = await Builder({
  xcmFormatCheck: true // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

:::

#### Ethereum -> Polkadot transfer

Currently only available in PJS version of XCM SDK (Until Snowbridge migrates to PAPI and VIEM).

```ts
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

await EvmBuilder(provider)   // Ethereum provider
  .from('Ethereum')   
  .to(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
  .currency({symbol: 'WETH', amount: amount /*Use "ALL" to transfer everything*/})    // Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
  .address(address)   // AccountID32 recipient address
  //.ahAddress(ahAddress) - ahAddress is optional and used in Ethereum>EVM Substrate chain (eg. Moonbeam) transfer.
  .signer(signer)     // Ethereum signer address
  .build();
```


::: tip
**Helper functions:**
```js
await depositToken(signer: Signer, amount: bigint, symbol: string); // Deposit token to contract
await getTokenBalance(signer: Signer, symbol: string); // Get token balance
await approveToken(signer: Signer, amount: bigint, symbol: string); // Approve token
```

#### Snowbridge status check
Query for Snowbridge status 

```ts
const status = await getBridgeStatus(/*optional parameter Bridge Hub API*/)
```

:::

## Local transfers
```ts
const builder = Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
      .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TChain) // Has to be same as origin (from)
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address)

const tx = await builder.build()

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} // Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} // Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} // Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await Builder({
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await Builder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```


**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```
:::

**Builder example**
::: details Transfering 1 DOT from one account to another on Hydration

```ts  
const builder = Builder()
  .from('Hydration')
  .to('Hydration')
  .currency({
    symbol: 'DOT',
    amount: '10000000000'
  })
  .address(address)

const tx = await builder.build()

// Disconnect API after TX
await builder.disconnect()
```

:::

## Batch calls
You can batch XCM calls and execute multiple XCM calls within one call. All three scenarios (Para->Para, Para->Relay, Relay->Para) can be used and combined.
```ts
await Builder(/*CHAIN api/ws_url_string - optional*/)
      .from(TSubstrateChain) // Ensure, that origin CHAIN is the same in all batched XCM Calls. 
      .to(Tchain2) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address | Location object)
      .addToBatch()

      .from(TSubstrateChain) // Ensure, that origin CHAIN is the same in all batched XCM Calls.
      .to(TChain3) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address | Location object)
      .addToBatch()
      .buildBatch({ 
          // This settings object is optional and batch all is the default option
          mode: BatchMode.BATCH_ALL // or BatchMode.BATCH
      })
```


**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 
```

:::

## Moonbeam xTokens smart-contract
If you need to sign Moonbeam or Moonriver transactions using wallets other than Polkadot-native wallets (for example, MetaMask), you can interact directly with their smart contracts to perform the required operations. Both `ethers.js` and `viem` libraries are supported for this purpose.

```ts
const hash = await EvmBuilder()
      .from('Moonbeam') // 'Moonbeam' | 'Polkadot' |  'Moonriver'
      .to(TChain) // 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .currency({id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} | {symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/}) //Select currency by ID or Symbol
      .address(address)
      .signer(signer) // Ethers Signer or Viem Wallet Client
      .build()
```

## Asset claim
Claim XCM trapped assets from the selected chain.

```ts
const builder = Builder(/*client | ws_url | [ws_url, ws_url,..] - Optional*/)
      .claimfrom(TSubstrateChain) // 'AssetHubPolkadot' | 'AssetHubKusama' | 'Polkadot' | 'Kusama' 
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address | Location object)
      /*.xcmVersion(Version.V3) Optional parameter, by default chain specific version. XCM Version ENUM if a different XCM version is needed (Supported V3, V4, V5). Requires importing Version enum.*/

const tx = await builder.build()

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} // Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} // Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

:::


## Dry run your XCM Calls

Dry running allows you to verify whether an XCM call will execute successfully before submitting it. This provides an opportunity to correct issues such as improper construction, incorrect account or asset selection, or insufficient balance. The call is constructed in the same manner as a standard XCM message, using the `.dryRun()` parameter instead of `.build()`.

```ts
const result = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
        .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .to(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .currency(CURRENCY_SPEC) // Refer to currency spec options below
        .address(ADDRESS)
        .senderAddress(SENDER_ADDRESS)
        .dryRun()
```

::: tip
```ts
// Check Parachain for DryRun support - returns true/false
// PAPI
import { hasDryRunSupport } from "@paraspell/sdk";
// PJS
import { hasDryRunSupport } from "@paraspell/sdk-pjs";

const result = hasDryRunSupport(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
```
:::

**Initial setup:**

::: details Currency spec options
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} // Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} // Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} // Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

:::

::: details **Advanced settings**

These can be added to further customize your calls.

```ts
.feeAsset({symbol: 'symbol'} || {id: 'id'} || {location: 'location'}) // Optional parameter used when multiple assets are provided or when origin is AssetHub/Hydration - so user can pay fees with asset different than DOT
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await Builder({
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await Builder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Format check**

Following setting will perform dryrun bypass for each call under the hood. This will ensure XCM Format is correct and will prevent SDK from opening wallet if dryrun bypass does not pass - meaning, that the XCM Format is incorrect.

```ts
const builder = await Builder({
  xcmFormatCheck: true // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```
:::

**Example output:**

::: details **Possible output objects**

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

:::


::: details Example of an output for transfer of 10 ASTR from Astar to Hydration

```json
{
  "origin": {
    "success": true,
    "fee": "49373869690754320",
    "asset": {
      "symbol": "ASTR",
      "isNative": true,
      "decimals": 18,
      "existentialDeposit": "1000000",
      "location": {
        "parents": 1,
        "interior": {
          "X1": [
            {
              "Parachain": 2006
            }
          ]
        }
      }
    },
    "forwardedXcms": [
      {
        "type": "V3",
        "value": {
          "parents": 1,
          "interior": {
            "type": "X1",
            "value": {
              "type": "Parachain",
              "value": 2034
            }
          }
        }
      },
      [
        {
          "type": "V3",
          "value": [
            {
              "type": "ReserveAssetDeposited",
              "value": [
                {
                  "id": {
                    "type": "Concrete",
                    "value": {
                      "parents": 1,
                      "interior": {
                        "type": "X1",
                        "value": {
                          "type": "Parachain",
                          "value": 2006
                        }
                      }
                    }
                  },
                  "fun": {
                    "type": "Fungible",
                    "value": "10000000000000000000"
                  }
                }
              ]
            },
            {
              "type": "ClearOrigin"
            },
            {
              "type": "BuyExecution",
              "value": {
                "fees": {
                  "id": {
                    "type": "Concrete",
                    "value": {
                      "parents": 1,
                      "interior": {
                        "type": "X1",
                        "value": {
                          "type": "Parachain",
                          "value": 2006
                        }
                      }
                    }
                  },
                  "fun": {
                    "type": "Fungible",
                    "value": "10000000000000000000"
                  }
                },
                "weight_limit": {
                  "type": "Unlimited"
                }
              }
            },
            {
              "type": "DepositAsset",
              "value": {
                "assets": {
                  "type": "Wild",
                  "value": {
                    "type": "AllCounted",
                    "value": 1
                  }
                },
                "beneficiary": {
                  "parents": 0,
                  "interior": {
                    "type": "X1",
                    "value": {
                      "type": "AccountId32",
                      "value": {
                        "id": {}
                      }
                    }
                  }
                }
              }
            }
          ]
        }
      ]
    ],
    "destParaId": 2034
  },
  "destination": {
    "success": true,
    "fee": "25201230559034411",
    "asset": {
      "assetId": "9",
      "symbol": "ASTR",
      "decimals": 18,
      "existentialDeposit": "147058823529412000",
      "location": {
        "parents": 1,
        "interior": {
          "X1": [
            {
              "Parachain": 2006
            }
          ]
        }
      },
      "isFeeAsset": true
    },
    "weight": {
      "refTime": "400000000",
      "proofSize": "0"
    },
    "forwardedXcms": []
  },
  "hops": []
}
```

:::


## Preview your call results

By using preview (dryrun bypass), you can determine the outcome of a call using a hypothetical amount of a given currency. This effectively allows you to simulate and demonstrate calls with custom asset amounts without needing to own them.

```ts
const result = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
        .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .to(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .currency(CURRENCY_SPEC) // Refer to currency spec options below
        .address(ADDRESS)
        .senderAddress(SENDER_ADDRESS)
        .dryRunPreview(/*{ mintFeeAssets: true } - false by default - Mints fee assets also, if user does not have enough to cover fees on origin.*/)
```


**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} // Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} // Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} // Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 
```

:::

::: details **Advanced settings**

These can be added to further customize your calls.

```ts
.feeAsset({symbol: 'symbol'} || {id: 'id'} || {location: 'location'}) // Optional parameter used when multiple assets are provided or when origin is AssetHub/Hydration - so user can pay fees with asset different than DOT
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await Builder({
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await Builder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Format check**

Following setting will perform dryrun bypass for each call under the hood. This will ensure XCM Format is correct and will prevent SDK from opening wallet if dryrun bypass does not pass - meaning, that the XCM Format is incorrect.

```ts
const builder = await Builder({
  xcmFormatCheck: true // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
```
:::

**Example output:**

::: details **Possible output objects**

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

:::

::: details Example of an output for transfer of 10 KSM from Encointer to AssetHubKusama

```json
{
  "origin": {
    "success": true,
    "fee": "1137942333",
    "asset": {
      "symbol": "KSM",
      "isNative": true,
      "decimals": 12,
      "existentialDeposit": "33333333",
      "location": {
        "parents": 1,
        "interior": {
          "Here": null
        }
      },
      "isFeeAsset": true
    },
    "weight": {
      "refTime": "815932166",
      "proofSize": "10824"
    },
    "forwardedXcms": [
      {
        "type": "V3",
        "value": {
          "parents": 1,
          "interior": {
            "type": "X1",
            "value": {
              "type": "Parachain",
              "value": 1000
            }
          }
        }
      },
      [
        {
          "type": "V3",
          "value": [
            {
              "type": "ReceiveTeleportedAsset",
              "value": [
                {
                  "id": {
                    "type": "Concrete",
                    "value": {
                      "parents": 1,
                      "interior": {
                        "type": "Here"
                      }
                    }
                  },
                  "fun": {
                    "type": "Fungible",
                    "value": "10000000000000"
                  }
                }
              ]
            },
            {
              "type": "ClearOrigin"
            },
            {
              "type": "BuyExecution",
              "value": {
                "fees": {
                  "id": {
                    "type": "Concrete",
                    "value": {
                      "parents": 1,
                      "interior": {
                        "type": "Here"
                      }
                    }
                  },
                  "fun": {
                    "type": "Fungible",
                    "value": "10000000000000"
                  }
                },
                "weight_limit": {
                  "type": "Unlimited"
                }
              }
            },
            {
              "type": "DepositAsset",
              "value": {
                "assets": {
                  "type": "Wild",
                  "value": {
                    "type": "AllCounted",
                    "value": 1
                  }
                },
                "beneficiary": {
                  "parents": 0,
                  "interior": {
                    "type": "X1",
                    "value": {
                      "type": "AccountId32",
                      "value": {
                        "id": {}
                      }
                    }
                  }
                }
              }
            },
            {
              "type": "SetTopic",
              "value": {}
            }
          ]
        }
      ]
    ],
    "destParaId": 1000
  },
  "destination": {
    "success": true,
    "fee": "291800000",
    "asset": {
      "symbol": "KSM",
      "isNative": true,
      "decimals": 12,
      "existentialDeposit": "3333333",
      "location": {
        "parents": 1,
        "interior": {
          "Here": null
        }
      },
      "isFeeAsset": true
    },
    "weight": {
      "refTime": "608679000",
      "proofSize": "8754"
    },
    "forwardedXcms": []
  },
  "hops": []
}
```
:::

## Localhost testing setup

The SDK provides enhanced localhost support by allowing you to supply an object with overrides for all WebSocket endpoints—including intermediate hops—used during a test transfer. This enables advanced localhost testing scenarios, such as local dry runs and XCM fee queries.

```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    // ChainName: ...
  }
})
  .from(TSubstrateChain)
  .to(TChain)
  .currency(CURRENCY_SPEC) // Refer to currency spec options below
  .address(address) //You can also use prederived accounts - //Alice, //Bob... //Alith, //Balthathar...
  .senderAddress(address) //You can also use prederived accounts //Alice, //Bob... //Alith, //Balthathar...

const tx = await builder.build()
//Or if you use prederived account as senderAddress:
//await builder.signAndSubmit()

// Disconnect API after TX
await builder.disconnect()
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
{multiasset: {currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}}
```
:::

**Notes:**
::: details Information about apiOverrides object and development mode parameter

- **`apiOverrides`**  
  A mapping where the keys are chain identifiers (for example, `Hydration`, `BridgeHubPolkadot`) and the values define how the SDK connects to those chains. Each value may be:
  - A single WebSocket endpoint URL
  - An array of WebSocket endpoint URLs
  - A pre-initialized API client instance

- **Development Mode (`development: true`)**  
  When the development flag is enabled, the SDK enforces strict endpoint usage. If an operation references a chain for which no entry exists in `apiOverrides`, the SDK will throw a `MissingChainApiError`.  
  This behavior guarantees that, in testing and local development environments, the SDK never falls back to production WebSocket endpoints.

:::

**Builder example**
::: details Example of 10 USDC transfer from Hydration to Ethereum (With enforced endpoint specification). 

```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
  }
})
  .from('Hydration')
  .to('Ethereum')
  .currency({ symbol: 'USDC.e', amount: '1' })
  .address('0x24D18dbFBcEd732EAdF98EE520853e13909fE258')

const tx = await builder.build()

// Disconnect API after TX
await builder.disconnect()
```
:::
