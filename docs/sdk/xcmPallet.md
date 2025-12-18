# Send XCM messages across Paraverse 🪐
### You can use our SDK in five different cross-chain scenarios:
- Relay chain to Parachain XCM transfer 
- Parachain to Relay chain XCM transfer
- Parachain to Parachain XCM transfer
- Parachain to Ethereum transfer
- Polkadot to Kusama ecosystem transfer and vice versa (DOT & KSM)

## Relay chain to Parachain

```ts
const builder = Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
      .from(TRelaychain) // 'Kusama' | 'Polkadot' | 'Paseo' | 'Westend'
      .to(TChain/*,customParaId - optional*/ | Location object) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .currency({symbol: 'DOT', amount: amount /*Use "ALL" to transfer everything*/})
      .address(address | Location object)

const tx = await builder.build()

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Example**
<details>
<summary>Following example will perform 1 DOT transfer from Polkadot to Hydration </summary>

```ts
const builder = await Builder()
  .from('Polkadot')
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

</details>

**Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

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

</details>

**Advanced settings**
<details>
<summary>You can add following details to the builder to further customize your call</summary>

```ts
.xcmVersion(Version.V3/V4/V5)  // Optional parameter for manual override of XCM Version used in call
.customPallet('Pallet','pallet_function') // Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some CHAIN but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.
```

</details>

## Parachain to Relay chain

```ts
const builder = Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
      .from(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TRelaychain) // 'Kusama' | 'Polkadot' | 'Paseo' | 'Westend' 
      .currency({symbol: 'DOT', amount: amount /*Use "ALL" to transfer everything*/})
      .address(address | Location object)

const tx = await builder.build()

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Example**
<details>
<summary>Following example will perform 1 DOT transfer from Hydration to Polkadot </summary>

```ts
const builder = await Builder()
  .from('Hydration')
  .to('Polkadot')
  .currency({
    symbol: 'DOT',
    amount: '10000000000'
  })
  .address(address)

const tx = await builder.build()

// Disconnect API after TX
await builder.disconnect()
```

</details>

**Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

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

</details>

**Advanced settings**
<details>
<summary>You can add following details to the builder to further customize your call</summary>

```ts
.xcmVersion(Version.V3/V4/V5)  // Optional parameter for manual override of XCM Version used in call
.customPallet('Pallet','pallet_function') // Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some CHAIN but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.
```

</details>

## Parachain to Parachain

```ts
const builder = Builder(/*client | builder_config |ws_url | [ws_url, ws_url,..] - Optional*/)
      .from(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TChain /*,customParaId - optional*/ | Location object /*Only works for PolkadotXCM pallet*/) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address | Location object /*If you are sending through xTokens, you need to pass the destination and address location in one object (x2)*/)
      .senderAddress(address) // - OPTIONAL but strongly recommended as it is automatically ignored when not needed - Used when origin is AssetHub/Hydration with feeAsset or when sending to AssetHub to prevent asset traps by auto-swapping to DOT to have DOT ED.

const tx = await builder.build()

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

**Notes**
<details>
<summary>Quick note for transfers when selecting by ID and it is long </summary>

When transferring from Parachain that uses long IDs for example Moonbeam make sure to add character 'n' at the end of currencyID. For example: `.currency(42259045809535163221576417993425387648n)` will mean that you have selected to transfer xcDOT.

</details>

**Example**
<details>
<summary>Following example will perform 1 USDT transfer from Hydration to AssetHubPolkadot </summary>

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

</details>

**Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

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

</details>

**Advanced settings**
<details>
<summary>You can add following details to the builder to further customize your call</summary>

```ts
.ahAddress(ahAddress) - OPTIONAL - used when origin is EVM CHAIN and XCM goes through AssetHub (Multihop transfer where we are unable to convert Key20 to ID32 address eg. origin: Moonbeam & destination: Ethereum (Multihop goes from Moonbeam > AssetHub > BridgeHub > Ethereum)
.feeAsset({symbol: 'symbol'} || {id: 'id'} || {location: 'location'}) // Optional parameter used when multiple assets are provided or when origin is AssetHub/Hydration - so user can pay fees with asset different than DOT
.xcmVersion(Version.V3/V4/V5)  // Optional parameter for manual override of XCM Version used in call
.customPallet('Pallet','pallet_function') // Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some CHAIN but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.
```

</details>

## Ecosystem Bridges
This section sums up currently available and implemented ecosystem bridges that are offered in the XCM SDK. Implementing cross-ecosystem asset transfers was never this easy!

### Polkadot <> Kusama bridge
Latest SDK versions support Polkadot <> Kusama bridge in very native and intuitive way. You just construct the Polkadot <> Kusama transfer as standard Parachain to Parachain scenario transfer.

```ts
await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)       
      .from('AssetHubPolkadot')  // 'AssetHubPolkadot' | 'AssetHubKusama'
      .to('AssetHubKusama')     // 'AssetHubPolkadot' | 'AssetHubKusama'
      .currency({symbol: 'DOT', amount: amount /*Use "ALL" to transfer everything*/})        // 'KSM' | 'DOT'
      .address(address)
      .build()
```

**Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

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

</details>

### Polkadot <> Ethereum bridge (Snowbridge)
Just like Polkadot <> Kusama bridge the Snowbridge is implemented in as intuitive and native form as possible. The implementations for Polkadot -> Ethereum and Ethereum -> Polkadot differ due to different architecure so we will mention both scenarios.

#### Polkadot -> Ethereum transfer

```ts
await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .to('Ethereum')           
          .currency({symbol: 'WETH', amount: amount /*Use "ALL" to transfer everything*/})   // Any supported asset by bridge - WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .address(eth_address)  // AccountKey20 recipient address
          .senderAddress(sender_address) // Injector SS58 address
          .ahAddress(ahAddress) // Recommended! ahAddress is optional but should be used always, as in scenarios where it isn't necessary it will be ignored. It is used when origin chain is EVM style because we are unable to convert your sender Key20 address to ID32 address.
          .build()
```

**Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

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

</details>

#### Ethereum -> Polkadot transfer

Currently only available in PJS version of XCM SDK (Until Snowbridge migrates to PAPI and VIEM).

```ts
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

await EvmBuilder(provider)   // Ethereum provider
  .from('Ethereum')   
  .to(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
  .currency({symbol: 'WETH', amount: amount /*Use "ALL" to transfer everything*/})    // Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
  .address(address)   // AccountID32 recipient address
  //.ahAddress(ahAddress) - ahAddress is optional and used in Ethereum>EVM Substrate chain (eg. Moonbeam) transfer.
  .signer(signer)     // Ethereum signer address
  .build();
```

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

## Local transfers
```ts
const builder = Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
      .from(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TChain) // Has to be same as origin (from)
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address)

const tx = await builder.build()

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

**Example**
<details>
<summary>Following example will perform 1 DOT transfer from one account to another on Hydration</summary>

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

</details>

**Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

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

</details>


## Batch calls
You can batch XCM calls and execute multiple XCM calls within one call. All three scenarios (Para->Para, Para->Relay, Relay->Para) can be used and combined.
```ts
await Builder(/*CHAIN api/ws_url_string - optional*/)
      .from(TChain) // Ensure, that origin CHAIN is the same in all batched XCM Calls. 
      .to(Tchain2) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address | Location object)
      .addToBatch()

      .from(TChain) // Ensure, that origin CHAIN is the same in all batched XCM Calls.
      .to(TChain3) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address | Location object)
      .addToBatch()
      .buildBatch({ 
          // This settings object is optional and batch all is the default option
          mode: BatchMode.BATCH_ALL // or BatchMode.BATCH
      })
```


**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

## Moonbeam xTokens smart-contract
If you need to sign Moonbeam / Moonriver transactions with other than Polkadot wallets (eg. Metamask), you can interact with their smart contract to perform operations with other wallets. Both Ethers and Viem are supported.

```ts
const hash = await EvmBuilder()
      .from('Moonbeam') // 'Moonbeam' | 'Moonriver'
      .to(TChain) // 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .currency({id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} | {symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/}) //Select currency by ID or Symbol
      .address(address)
      .signer(signer) // Ethers Signer or Viem Wallet Client
      .build()
```

### Asset claim:
Claim XCM trapped assets from the selected chain.

```ts
const builder = Builder(/*client | ws_url | [ws_url, ws_url,..] - Optional*/)
      .claimFrom(TChain) // 'AssetHubPolkadot' | 'AssetHubKusama' | 'Polkadot' | 'Kusama' 
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .address(address | Location object)
      /*.xcmVersion(Version.V3) Optional parameter, by default chain specific version. XCM Version ENUM if a different XCM version is needed (Supported V3, V4, V5). Requires importing Version enum.*/

const tx = await builder.build()

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>


## Dry run your XCM Calls

Dry running let's you check whether your XCM Call will execute, giving you a chance to fix it if it is constructed wrongly or you didn't select correct account/asset or don't have enough balance. It is constructed in same way as standard XCM messages with parameter `.dryRun()` instead of `.build()`

```ts
const result = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
        .from(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .to(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .currency(CURRENCY_SPEC) // Refer to currency spec options below
        .address(ADDRESS)
        .senderAddress(SENDER_ADDRESS)
        .dryRun()

// Check Parachain for DryRun support - returns true/false
// PAPI
import { hasDryRunSupport } from "@paraspell/sdk";
// PJS
import { hasDryRunSupport } from "@paraspell/sdk-pjs";

const result = hasDryRunSupport(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
```


**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

**Possible output objects:**

<details>
<summary>The dryrun will return following objects</summary>

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

</details>

**Example output:**

<details>
<summary>Example of an output for transfer of 10 ASTR - Astar > Hydration</summary>

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

</details>

**Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

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

</details>

**Advanced settings**
<details>
<summary>You can add following details to the builder to further customize your call</summary>

```ts
.feeAsset({symbol: 'symbol'} || {id: 'id'} || {location: 'location'}) // Optional parameter used when multiple assets are provided or when origin is AssetHub/Hydration - so user can pay fees with asset different than DOT
```

</details>

## Preview your call results

Using preview with dry-run you can find out the result of the call for fictional amount of the currency. Essentially allowing you to demo calls with custom asset amounts. 

```ts
const result = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
        .from(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .to(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .currency(CURRENCY_SPEC) // Refer to currency spec options below
        .address(ADDRESS)
        .senderAddress(SENDER_ADDRESS)
        .dryRunPreview(/*{ mintFeeAssets: true } - false by default - Mints fee assets also, if user does not have enough to cover fees on origin.*/)
```


**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

**Possible output objects:**

<details>
<summary>The dryrun will return following objects</summary>

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

</details>

**Example output:**

<details>
<summary>Example of an output for transfer of 10 KSM - Encointer > AssetHubKusama</summary>

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

</details>

**Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

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

</details>

**Advanced settings**
<details>
<summary>You can add following details to the builder to further customize your call</summary>

```ts
.feeAsset({symbol: 'symbol'} || {id: 'id'} || {location: 'location'}) // Optional parameter used when multiple assets are provided or when origin is AssetHub/Hydration - so user can pay fees with asset different than DOT
```

</details>

## Localhost testing setup

SDK offers enhanced localhost support. You can pass an object containing overrides for all WS endpoints (Including hops) used in the test transfer. This allows for advanced localhost testing such as localhost dry-run or xcm-fee queries.

```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /*client | ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /*client | ws_url | [ws_url, ws_url,..]*/
    // ChainName: ...
  }
})
  .from(TChain)
  .to(TChain)
  .currency(CURRENCY_SPEC) // Refer to currency spec options below
  .address(address)

const tx = await builder.build()

// Disconnect API after TX
await builder.disconnect()
```

**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

**Example**
<details>
<summary>Following example will perform 10 USDC transfer from Hydration to Ethereum (With enforced endpoint specification). </summary>

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

</details>

**Additional information ℹ️**
<details>
<summary>Following dropdown contains information about apiOverrides object and development mode parameter.</summary>

```
- apiOverrides property is a map where keys are chain names (e.g., Hydration, BridgeHubPolkadot) and values are the corresponding WS endpoint URL / array of WS URLs or an API client instance.
- development Mode parameter: When development flag is set to true, the SDK will throw a MissingChainApiError if an operation involves a chain for which an override has not been provided in apiOverrides. This ensures that in a testing environment, the SDK does not fall back to production endpoints.
```

</details>


## Developer experience

### Builder pattern experience
When developing with the Builder pattern, the developer is guided by the typescript and thus knows which parameter can be added next. This increases the developer experience and makes SDK easier to use.
<img width="459" alt="builder" src="https://user-images.githubusercontent.com/55763425/214562882-dd1a052e-c420-4131-bb50-3b656fabd10c.png">
