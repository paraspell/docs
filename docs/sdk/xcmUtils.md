# Know the toll before the trip 🎒

Understand the complete fee structure and balance flow behind your XCM call. Use the queries below for deep, technical insight before dispatch.

## XCM Transfer info
Use this query to comprehensively assess whether a message will execute successfully without failure. It provides detailed information on currency balances before and after the transaction, including all relevant fees. This data is essential for accurately evaluating balance or fee-related issues that could cause message failure.

```ts
const info = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getTransferInfo()
```

**Initial setup:**
  ::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by **Location**:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by **Asset ID**:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by **Asset Symbol**:
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

Asset selection of **multiple assets**:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```
  :::

  ::: details **Advanced settings**

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
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
chain - Always present
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

:::


::: details **Example for transfer of 10 USDC from AssetHubPolkadot to BifrostPolkadot**

```json
{
  "chain": {
    "origin": "AssetHubPolkadot",
    "destination": "BifrostPolkadot",
    "ecosystem": "DOT"
  },
  "origin": {
    "selectedCurrency": {
      "sufficient": false,
      "balance": "260993",
      "balanceAfter": "-9739007",
      "asset": {
        "assetId": "1337",
        "symbol": "USDC",
        "decimals": 6,
        "location": {
          "parents": 1,
          "interior": {
            "X3": [
              {
                "Parachain": 1000
              },
              {
                "PalletInstance": 50
              },
              {
                "GeneralIndex": 1337
              }
            ]
          }
        },
        "existentialDeposit": "10000",
        "isFeeAsset": true,
        "alias": "USDC1"
      }
    },
    "xcmFee": {
      "sufficient": true,
      "fee": "322781864",
      "balance": "31996244022",
      "balanceAfter": "31673462158",
      "asset": {
        "symbol": "DOT",
        "isNative": true,
        "decimals": 10,
        "existentialDeposit": "100000000",
        "location": {
          "parents": 1,
          "interior": {
            "Here": null
          }
        },
        "isFeeAsset": true
      }
    }
  },
  "hops": [],
  "destination": {
    "receivedCurrency": {
      "sufficient": true,
      "receivedAmount": "9988338",
      "balance": "530221",
      "balanceAfter": "10518559",
      "asset": {
        "assetId": "5",
        "symbol": "USDC",
        "decimals": 6,
        "existentialDeposit": "1000",
        "location": {
          "parents": 1,
          "interior": {
            "X3": [
              {
                "Parachain": 1000
              },
              {
                "PalletInstance": 50
              },
              {
                "GeneralIndex": 1337
              }
            ]
          }
        },
        "isFeeAsset": true
      }
    },
    "xcmFee": {
      "fee": "11662",
      "balance": "530221",
      "balanceAfter": "10518559",
      "asset": {
        "assetId": "5",
        "symbol": "USDC",
        "decimals": 6,
        "existentialDeposit": "1000",
        "location": {
          "parents": 1,
          "interior": {
            "X3": [
              {
                "Parachain": 1000
              },
              {
                "PalletInstance": 50
              },
              {
                "GeneralIndex": 1337
              }
            ]
          }
        },
        "isFeeAsset": true
      }
    }
  }
}
```

:::


## Transferable amount
You can use the transferable balance to retrieve information on how much of the selected currency can be transferred from a specific account.

```ts
const transferable = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getTransferableAmount()
```

**Initial setup:**

  ::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by **Location**:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by **Asset ID**:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by **Asset symbol**:
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

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
```
  
:::

:::details **Builder configuration**

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

**Notes:**

::: details Function formulae

 This query will calculate transferable balance using the following formulae: 

```
Balance - Existential deposit - if(asset==native) then also substract Origin XCM Fees else ignore
```

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will go through).

:::

**Example output:**

```json
"3329236337"
```

## Minimal transferable amount
You can use the minimal transferable balance to retrieve information on minimum of the selected currency can be transferred from a specific account to specific destination, so that the ED and destination or origin fee is paid fully.

```ts
const transferable = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getMinTransferableAmount()
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by **Location**:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by **Asset ID**:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by **Asset symbol**:
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

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
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

**Notes:**

::: details Function formulae

 This query will calculate minimal transferable balance using the following formulae: 

```
(Origin Balance - if(Balance on destination = 0) then also substract destination Existential deposit - if(Asset=native) then also substract Origin XCM Fees - hop fees (If present) - destination XCM fee) +1
```

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will go through). Chains that do not have support for dryrun will return error in this query.

:::

**Example output:**

```json
"3329236337"
```

## Verify ED on destination
To retrieve information on whether the selected currency from a specific account will meet the existential deposit on the destination chain, you can use this query. 

```ts
const ed = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .verifyEdOnDestination()
```
**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by **Location**:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by **Asset ID**:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by **Asset symbol**:
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

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
```
  
:::

::: details Builder configuration

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

**Notes:**

::: details Function formulae

This query will calculate whether the user will have enough to cover the existential deposit on XCM arrival using the following pseudo formulae: 

```
(if(Balance) || if(TransferedAmount - ED - Destination Fee > 0)) return true else false
```

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will actually go through). **If the function switches to PaymentInfo and the transferred currency is different from the native currency on the destination chain, the function throws an error as PaymentInfo only returns fees in the native asset of the chain.**

:::

**Example output:**

```json
true
```

## Predicted received amount
You can predict the amount to be received on destination, granted, that the destination chain and hops have dry-run.

```ts
const transferable = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getReceivableAmount()
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by **Location**:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by **Asset ID**:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by **Asset symbol**:
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

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
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

```json
"3329236337"
```

## XCM Fee (Origin and Dest.)
The following query allows you to query the fee from both the Origin and Destination of the XCM Message. The query is designed to retrieve your XCM fee at any cost, but falls back to Payment info if the DryRun query fails or is not supported by either origin or destination. 

```ts
const fee = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getXcmFee(/*{disableFallback: true / false}*/)  //Fallback is optional. When fallback is disabled, you only get notified of DryRun error, but no Payment info query fallback is performed. Payment info is still performed if Origin or Destination chain do not support DryRun out of the box.
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by **Location**:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by **Asset ID**:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by **Asset symbol**:
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

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
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

::: details Possible output objects

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

:::

::: details Example output: for transfer of 10 GLMR from Hydration to Moonbeam

```json
{
  "origin": {
    "weight": {
      "refTime": "1847483799",
      "proofSize": "12268"
    },
    "fee": "511167946049",
    "feeType": "dryRun",
    "sufficient": false,
    "asset": {
      "symbol": "HDX",
      "isNative": true,
      "decimals": 12,
      "existentialDeposit": "1000000000000",
      "location": {
        "parents": 1,
        "interior": {
          "X2": [
            {
              "Parachain": 2034
            },
            {
              "GeneralIndex": 0
            }
          ]
        }
      },
      "isFeeAsset": true
    }
  },
  "destination": {
    "fee": "9910446250000000",
    "feeType": "dryRun",
    "sufficient": true,
    "asset": {
      "symbol": "GLMR",
      "isNative": true,
      "decimals": 18,
      "existentialDeposit": "0",
      "location": {
        "parents": 1,
        "interior": {
          "X2": [
            {
              "Parachain": 2004
            },
            {
              "PalletInstance": 10
            }
          ]
        }
      },
      "isFeeAsset": true
    }
  },
  "hops": []
}
```

:::

## XCM Fee (Origin only)
The following queries allow you to query the XCM fee from the Origin chain. The query is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by origin. 

```ts
const fee = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getOriginXcmFee(/*{disableFallback: true / false}*/)  //Fallback is optional. When fallback is disabled, you only get notified of DryRun error, but no Payment info query fallback is performed. Payment info is still performed if Origin do not support DryRun out of the box.
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by **Location**:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by **Asset ID**:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by **Asset symbol**:
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

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
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

::: details Possible output objects

```
origin - Always present
```

:::

::: details Example output: for transfer of 100 MYTH from Mythos to AssetHubPolkadot

```json
{
  "fee": "120608600411000000",
  "feeType": "dryRun",
  "sufficient": true,
  "asset": {
    "symbol": "MYTH",
    "isNative": true,
    "decimals": 18,
    "existentialDeposit": "10000000000000000",
    "location": {
      "parents": 1,
      "interior": {
        "X1": [
          {
            "Parachain": 3369
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
                      "type": "X1",
                      "value": {
                        "type": "Parachain",
                        "value": 3369
                      }
                    }
                  }
                },
                "fun": {
                  "type": "Fungible",
                  "value": "100000000000000000000"
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
                        "value": 3369
                      }
                    }
                  }
                },
                "fun": {
                  "type": "Fungible",
                  "value": "100000000000000000000"
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
  "destParaId": 1000,
  "weight": {
    "refTime": "970770242",
    "proofSize": "10755"
  }
}
```

:::

## Asset balance
You can now query all important information about your XCM call, including fees (if your balance is sufficient to transfer an XCM message) and more. Function uses [TChain](https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types) types.

```ts
//PAPI
import { getBalance } from "@paraspell/sdk";
//PJS
import { getBalance } from "@paraspell/sdk-pjs";

//Retrieves the asset balance for a given account on a specified CHAIN (You do not need to specify if it is native or foreign).
const balance = await getBalance({ADDRESS, TChain, CURRENCY_SPEC /*OPTIONAL - Refer to currency spec options below*/, /* client | ws_url | [ws_url, ws_url,..] - optional */});
```

**Initial setup:**

::: details Currency spec options
  
**Currency spec in this method is optional and if not provided function will search for balance of native asset of chosen chain.**

**Following options are possible for currency specification:**

Asset selection by **Location**:
```ts
{location: AssetLocationString, amount: amount } //Recommended
{location: AssetLocationJson, amount: amount } //Recommended 
{location: Override('Custom Location'), amount: amount } //Advanced override of asset registry
```

Asset selection by **Asset ID**:
```ts
{id: currencyID, amount: amount } // Not all chains register assets under IDs
```

Asset selection by **Asset symbol**:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount } 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount }

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount } 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount } 
```

:::

**Example output:**

```json
"21403376436851"
```

## Ethereum bridge fees
The following query will retrieve the execution and bridge fee for transfers from Parachain to Ethereum.

```ts
//PAPI
import { getParaEthTransferFees } from "@paraspell/sdk";
//PJS
import { getParaEthTransferFees } from "@paraspell/sdk-pjs";

const fees = await getParaEthTransferFees(/*client | ws_url | [ws_url, ws_url,..] - Optional. Must be AssetHubPolkadot WS!)*/)
```

**Example output:**

```json
[16422495097, 2420000000]
```

## Query existential deposit
Latest SDK versions now offer the ability to query the existential deposit on implemented chains using a simple call. Function uses [TChain](https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types) types.

```ts
//PAPI
import { getExistentialDeposit } from "@paraspell/sdk";
//PJS
import { getExistentialDeposit } from "@paraspell/sdk-pjs";

//Currency is an optional parameter. If you wish to query native asset, currency parameter is not necessary.
//Currency can be either {symbol: assetSymbol}, {id: assetId}, {location: assetLocation}.
const ed = getExistentialDeposit(TChain, currency?)
```

**Example output:**

```json
"100000000"
```

## Convert SS58 address 
The following functionality allows you to convert any SS58 address to a Parachain-specific address. Function uses [TChain](https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types) types.

```ts
//PAPI
import { convertSs58 } from "@paraspell/sdk";
//PJS
import { convertSs58 } from "@paraspell/sdk-pjs";

const result = convertSs58(ADDRESS, TChain) 
```

**Example output:**

```json
"7Lu51dzX1eqBxHdc8DkWvMkyFgoVXXFjibjEnxUndJQ8NAHz"
```

