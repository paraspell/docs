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
      .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .to(TChain /*,customParaId - optional*/ | Location object /*Only works for PolkadotXCM pallet*/) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .recipient(address | Location object /*If you are sending through xTokens, you need to pass the destination and address location in one object (x2)*/)
      .sender(address | PAPI_SIGNER /*Only in PAPI SDK*/ | {address, PJS_SIGNER} /*Only in PJS SDK*/) // - OPTIONAL but strongly recommended as it is automatically ignored when not needed - Used when origin is AssetHub/Hydration with feeAsset or when sending to AssetHub to prevent asset traps by auto-swapping to DOT to have DOT ED.

const tx = await builder.build()
// Or if you use signers in senderAddress:
// await builder.signAndSubmit() - Signs and submits the transaction; returns TX hash for tracking

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
.ahAddress(ahAddress) // - OPTIONAL - used when origin is EVM CHAIN and XCM goes through AssetHub (Multihop transfer where we are unable to convert Key20 to ID32 address eg. origin: Moonbeam & destination: Ethereum (Multihop goes from Moonbeam > AssetHub > BridgeHub > Ethereum)
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

**TURNED ON BY DEFAULT** Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

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
    amount: '1'
  })
  .recipient(address)

const tx = await builder.build()

// Disconnect API after TX
await builder.disconnect()
```

:::

## Local transfers
```ts
const builder = Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
      .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .to(TChain) // Has to be same as origin (from)
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .recipient(address)

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

::: details Advanced settings

These can be added to further customize your calls.

```ts
.keepAlive(bool) // Optional: Allows draining the account below the existential deposit.
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

**TURNED ON BY DEFAULT** Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

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
    amount: '1'
  })
  .recipient(address)

const tx = await builder.build()

// Disconnect API after TX
await builder.disconnect()
```

:::

## Transact
The SDK gives the ability to perform Transact, which enables execution of calls on a remote chain in the context of the destination environment. This allows applications to trigger cross-chain actions without direct interaction from users on the target chain.

```ts
const builder = Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
      .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .to(TChain) // Has to be same as origin (from)
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .sender(senderAddress)
      .recipient(address)
      .transact(hex, /* originType, TWeight - Optional */) // Reffer to transact spec below

const tx = await builder.build()

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Initial setup:**

::: details Transact spec

Transact option in builder consists of three parameters
- **Hex**: Hex of an operation that should execute on destination chain - Needs to be created on destination chain
- **originType**: Optional parameter defaulted to "SovereignAccount", but can optionally be set to "Native", "XCM" or "SuperUser"
- **TWeight**: Optional parameter, autofilled if not specified. If specified it is used as maxFallbackWeight parameter in V3 and V4 transact transfers.

> [!NOTE]
>`V3` and `V4` Transact cannot transfer currency and transact in same call. You need to deposit currencies into sovereign account of the origin account on destination chain - its location is `(Parent, Parachain: Original Parachain, Account)`. This address can be calculated with following API: `locationToAccountApi.convert_location`. The `.currency()` parameter serves for specifying in which currency should the SDK buy execution, so amount parameter can be random number (Only applies for calls to/from V3/V4 chains).
>
>`V5` is able to transfer and transact at the same time, so `amount` parameter in `.currency()` needs to be filled accordingly because the amount being transferred is also used to buy execution.

:::

::: details Currency spec options

> [!NOTE]
>
>For `V3` and `V4` chains the `.currency()` parameter specifies in which currency should the Sovereign account of Origin account purchase execution in on destination chain. For `V5` it specifies which asset should be transferred and how much. For more information see Transact spec above.



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

**TURNED ON BY DEFAULT** Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

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
::: details Transfering 1 DOT and performing transact which transfers all native currency on Bifrost

```ts  
const builder = Builder()
  .from('AssetHubPolkadot')
  .to('BifrostPolkadot')
  .currency({
    symbol: 'DOT',
    amount: '1'
  })
  .sender(senderAddress)
  .recipient(address)
  .transact(0x0a040042ac083419496cb97115aff8f79eb7bb96ceaad18e99e310f526503fdd161b7500)


const tx = await builder.build()

// Disconnect API after TX
await builder.disconnect()
```

:::

## Swap
If you [installed Swap package](https://paraspell.github.io/docs/xcm-sdk/getting-started.html#install-swap-extension) you can create Swap XCMs. Doing so, you can send one asset and receive another on the destination. The caveat to using this method is, that some transfers are one click (Like the rest of XCM Transfers) while others are two click (Majority - Send from origin to exchange is one signature and then exchange + transfer to destination is second signature). You need specialized method to build these - `.buildAll()`.

```ts
const builder = Builder(/*client | builder_config |ws_url | [ws_url, ws_url,..] - Optional*/)
      .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .to(TChain /*,customParaId - optional*/ | Location object /*Only works for PolkadotXCM pallet*/) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .recipient(address | Location object /*If you are sending through xTokens, you need to pass the destination and address location in one object (x2)*/)
      .sender(address | PAPI_SIGNER /*Only in PAPI SDK*/ | {address, PJS_SIGNER} /*Only in PJS SDK*/) // - OPTIONAL but strongly recommended as it is automatically ignored when not needed - Used when origin is AssetHub/Hydration with feeAsset or when sending to AssetHub to prevent asset traps by auto-swapping to DOT to have DOT ED.
      .swap({
          currencyTo: CURRENCY_SPEC, //Reffer to currency spec options above
          // exchange: ['AssetHubPolkadot'], - Optional parameter - 'Hydration' | 'Acala' | 'AssetHubPolkadot' | ...
          // slippage: 1, - Optional - 1 by default
          // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
          // evmSigner: Signer, - Optional parameter when origin CHAIN is EVM based (Required with evmInjectorAddress)
          // onStatusChange: (event) => void - Optional parameter for callback events when sender address is supplied as signer
      })

const tx = await builder.buildAll()
// Or if you use signers in senderAddress:
// await builder.signAndSubmit() - Signs and submits the transaction (only working in 1click scenarios); returns TX hash for tracking
// await builder.signAndSubmitAll() - Signs and submits transactions (required in 2click scenarios); returns array of TX hashes for tracking

// Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

**Initial setup:**

::: details List of available exchanges

| Swap Type   | DEX               | Pools | Notes                                |
|------------|-------------------|-------|--------------------------------------|
| One-click  | AssetHub Polkadot | 58    | Requires specific native tokens      |
| One-click  | AssetHub Kusama   | 19    | Requires specific native tokens      |
| One-click  | AssetHub Westend   | 110    | Requires specific native tokens      |
| One-click  | AssetHub Paseo   | 13    | Requires specific native tokens      |
| Two-click  | Hydration         | 210   | —                                    |
| Two-click  | Bifrost Polkadot  | 45    | Requires native token                |
| Two-click  | Bifrost Kusama    | 66    | Requires native token                |
| Two-click  | Acala             | 36    | Requires native token                                    |
| Two-click  | Karura            | 136   | Requires native token                                    |

**Total pools available:** 693

> [!Note]
> One click transfers are only one click if origin chain supports execute extrinsics.

:::

::: details Selecting an exchange

There are **three** options in specifying exchange chain:

#### Automatic exchange selection

You can leave automatic exchange selection on SDK if you do not want to choose manually. SDK will pick based on best price outcome. You can do so by not providing exchange object into `.swap()` parameter.

```
.swap({
  currencyTo: CURRENCY_SPEC, //Reffer to currency spec options below
})
```

#### Whitelisted exchange selection

You can whitelist exchange selection if you have preferred exchanges. SDK will pick based on best price outcome from selected exchanges. You can do so by providing an array of exchanges into `.swap()` parameter.

```
.swap({
  currencyTo: CURRENCY_SPEC, //Reffer to currency spec options below
  exchange: ['AssetHubPolkadotDex', 'HydrationDex']
})
```

#### Manual exchange selection

If you want to manually specify exchange there is an option to do so by providing exact exchange into `.swap()` parameter.

```
.swap({
  currencyTo: CURRENCY_SPEC, //Reffer to currency spec options below
  exchange: ['AssetHubPolkadotDex'] // Or just 'AssetHubPolkadotDex' without an array
})
```


:::

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

::: details Advanced settings

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

**TURNED ON BY DEFAULT** Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

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

::: details Swapping 1 USDT to USDC sending from Hydration to AssetHubPolkadot 
```ts
const builder = Builder()
  .from('Hydration')
  .to('AssetHubPolkadot')
  .currency({
    id: 10,
    amount: '1'
  })
  .recipient(address)
  .swap({
    currencyTo: { symbol: 'USDC' }
  })

const tx = await builder.buildAll()

// Disconnect API after TX
await builder.disconnect()
```

:::

## Dry run

Dry running allows you to verify whether an XCM call will execute successfully before submitting it. This provides an opportunity to correct issues such as improper construction, incorrect account or asset selection, or insufficient balance. The call is constructed in the same manner as a standard XCM message, using the `.dryRun()` parameter instead of `.build()`.

```ts
const result = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
        .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
        .to(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
        .currency(CURRENCY_SPEC) // Refer to currency spec options below
        .recipient(ADDRESS)
        .sender(SENDER_ADDRESS)
        .dryRun()
```

::: tip
```ts
// Check Parachain for DryRun support - returns true/false
// PAPI
import { hasDryRunSupport } from "@paraspell/sdk";
// PJS
import { hasDryRunSupport } from "@paraspell/sdk-pjs";
// Dedot
import { hasDryRunSupport } from "@paraspell/sdk-dedot";

const result = hasDryRunSupport(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
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
.swap({
    currencyTo: CURRENCY_SPEC, //Reffer to currency spec options above
    // exchange: ['AssetHubPolkadotDex'], - Optional parameter - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
    // slippage: 1, - Optional - 1 by default
    // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
    // evmSigner: Signer, - Optional parameter when origin CHAIN is EVM based (Required with evmInjectorAddress)
    // onStatusChange: (event) => void - Optional parameter for callback events when sender address is supplied as signer
})
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

**TURNED ON BY DEFAULT** Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

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


## Dry run preview

By using preview (dryrun bypass), you can determine the outcome of a call using a hypothetical amount of a given currency. This effectively allows you to simulate and demonstrate calls with custom asset amounts without needing to own them.

```ts
const result = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
        .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
        .to(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
        .currency(CURRENCY_SPEC) // Refer to currency spec options below
        .recipient(ADDRESS)
        .sender(SENDER_ADDRESS)
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

**TURNED ON BY DEFAULT** Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

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

## Ecosystem bridges
List of available bridges in XCM SDK. Implementing cross-ecosystem asset transfers was never this easy!

### Polkadot <> Kusama bridge

```ts
await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)       
      .from('AssetHubPolkadot')  // 'AssetHubPolkadot' | 'AssetHubKusama'
      .to('AssetHubKusama')     // 'AssetHubPolkadot' | 'AssetHubKusama'
      .currency({symbol: 'DOT', amount: amount /*Use "ALL" to transfer everything*/})        // 'KSM' | 'DOT' | 'USDC' | 'USDT'
      .recipient(address)
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

**TURNED ON BY DEFAULT** Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

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
          .from(TSubstrateChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .to('Ethereum')           
          .currency({symbol: 'WETH', amount: amount /*Use "ALL" to transfer everything*/})   // Any supported asset by bridge - WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .recipient(eth_address)  // AccountKey20 recipient address
          .sender(sender_address) // Injector SS58 address
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

**TURNED ON BY DEFAULT** Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

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

Available as a [Snowbridge extension](https://paraspell.github.io/docs/xcm-sdk/getting-started.html#install-snowbridge-extension) in all XCM SDK versions. **Uses VIEM package.**

```ts
  import { Builder } from '@paraspell/sdk'
  import '@paraspell/evm-snowbridge'

  import { createWalletClient, custom, parseUnits } from 'viem'
  import { mainnet } from 'viem/chains'

  const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum),
  })

  const txHash = await Builder()
    .from('Ethereum')
    .to(TChain) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
    .currency(CURRENCY_SPEC)  // Refer to currency spec options below
    .recipient(address)   // AccountID32 recipient address
    .sender(walletClient) //EVM Signer
    .signAndSubmit()
```


::: tip
**Helper functions:**
```js
//Needs to be imported from @paraspell/evm-snowbridge
await getTokenBalance(signer: Signer, symbol: string); // Get token balance
await approveToken(signer: Signer, amount: bigint, symbol: string); // Approve token
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

#### Snowbridge status check
Query for Snowbridge status 

```ts
//Needs to be imported from @paraspell/evm-snowbridge
const status = await getBridgeStatus(/*optional parameter Bridge Hub API*/)
```

:::


## Batch calls
You can batch XCM calls and execute multiple XCM calls within one call. All three scenarios (Para->Para, Para->Relay, Relay->Para) can be used and combined.
```ts
await Builder(/*CHAIN api/ws_url_string - optional*/)
      .from(TSubstrateChain) // Ensure, that origin CHAIN is the same in all batched XCM Calls. 
      .to(Tchain2) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .recipient(address | Location object)
      .addToBatch()

      .from(TSubstrateChain) // Ensure, that origin CHAIN is the same in all batched XCM Calls.
      .to(TChain3) // 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .recipient(address | Location object)
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
Available as a [EVM extension](https://paraspell.github.io/docs/xcm-sdk/getting-started.html#install-evm-extension) in all XCM SDK versions. **Uses VIEM package.**

```ts

  import { Builder } from '@paraspell/sdk'
  import '@paraspell/evm'

  import { createWalletClient, custom, parseUnits } from 'viem'
  import { moonbeam } from 'viem/chains'

  const walletClient = createWalletClient({
    chain: moonbeam,
    transport: custom(window.ethereum),
  })

  const txHash = await Builder()
    .from('Moonbeam') // 'Moonriver'
    .to(TChain) // 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
    .currency(CURRENCY_SPEC)  // Refer to currency spec options below
      .recipient(address)
      .sender(signer) // Viem Wallet Client
    .signAndSubmit()
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
  .recipient(address) //You can also use prederived accounts - //Alice, //Bob... //Alith, //Balthathar...
  .sender(address) //You can also use prederived accounts //Alice, //Bob... //Alith, //Balthathar...

const tx = await builder.build()
// Or if you use prederived account as senderAddress:
// await builder.signAndSubmit() - Signs and submits the transaction; returns TX hash for tracking

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
  .recipient('0x24D18dbFBcEd732EAdF98EE520853e13909fE258')

const tx = await builder.build()

// Disconnect API after TX
await builder.disconnect()
```
:::

## Convert SS58 address 
The following functionality allows you to convert any SS58 address to a Parachain-specific address. Function uses [TChain](https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types) types.

```ts
import { convertSs58 } from "@paraspell/sdk"; // || @paraspell/sdk-pjs || @paraspell/sdk-dedot

const result = convertSs58(ADDRESS, TChain) 
```

**Example output:**

```json
"7Lu51dzX1eqBxHdc8DkWvMkyFgoVXXFjibjEnxUndJQ8NAHz"
```

## Query asset reserve
Following query allows you to query asset reserve for specific asset on specific chain.

```ts
import { getAssetReserveChain } from "@paraspell/sdk"; // || @paraspell/sdk-pjs || @paraspell/sdk-dedot

getAssetReserveChain(chain: TSubstrateChain, location: TLocation)
```

**Example output**

```
"moonbeam"
```

## Import Chains as types
There are 6 options for types you can choose based on your prefference

```ts
// Import all exchange chains (Swap)
import type { TExchangeChain } from "@paraspell/sdk" // || @paraspell/sdk-pjs || @paraspell/sdk-dedot

// Import all Parachains
import type { TParachain } from "@paraspell/sdk" // || @paraspell/sdk-pjs || @paraspell/sdk-dedot

// Import all Relay chains
import type { TRelaychain } from "@paraspell/sdk" // || @paraspell/sdk-pjs || @paraspell/sdk-dedot

// Import all Substrate chains (Parachains + Relays)
import type { TSubstrateChain } from "@paraspell/sdk" // || @paraspell/sdk-pjs || @paraspell/sdk-dedot

// Import chains outside Polkadot ecosystem (Ethereum)
import type { TExternalChain } from "@paraspell/sdk" // || @paraspell/sdk-pjs || @paraspell/sdk-dedot

// Import all chains implemented in ParaSpell
import type { TChain } from "@paraspell/sdk" // || @paraspell/sdk-pjs || @paraspell/sdk-dedot
```

## Import Chains as constants
There are 6 options for constants you can choose based on your prefference

```ts
// Print all exchange chains (Swap)
console.log(EXCHANGE_CHAINS)

// Print all Parachains
console.log(PARACHAINS)

// Print all Relay chains
console.log(RELAYCHAINS)

// Print all Substrate chains (Parachains + Relays)
console.log(SUBSTRATE_CHAINS)

// Print chains outside Polkadot ecosystem (Ethereum)
console.log(EXTERNAL_CHAINS)

// Print all chains implemented in ParaSpell
console.log(CHAINS)
```