# Know the toll before the trip 🎒

Understand the complete fee structure and balance flow behind your XCM call. Use the queries below for deep, technical insight before dispatch.

## XCM Transfer info
Use this query to comprehensively assess whether a message will execute successfully without failure. It provides detailed information on currency balances before and after the transaction, including all relevant fees. This data is essential for accurately evaluating balance or fee-related issues that could cause message failure.

```ts
const info = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(ORIGIN_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .to(DESTINATION_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getTransferInfo()
```

**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary>Advanced settings</summary>

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
```
  
  </details>

**Possible output objects:**

<details>
<summary>The Transfer info query will return the following objects</summary>

```
chain - Always present
origin - Always present
assetHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

</details>

**Example output**
<details>
<summary>Following output contains transfer of 10 USDC from AssetHubPolkadot to BifrostPolkadot</summary>

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
      "balance": "1801745",
      "balanceAfter": "-8198255",
      "currencySymbol": "USDC",
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
      },
      "existentialDeposit": "10000"
    },
    "xcmFee": {
      "sufficient": true,
      "fee": "346838364",
      "balance": "40571369517",
      "balanceAfter": "40224531153",
      "currencySymbol": "USDC",
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
        "alias": "USDC1",
        "amount": "10000000"
      }
    }
  },
  "hops": [],
  "destination": {
    "receivedCurrency": {
      "sufficient": true,
      "receivedAmount": "9987572",
      "balance": "530221",
      "balanceAfter": "10517793",
      "currencySymbol": "USDC",
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
      },
      "existentialDeposit": "1000"
    },
    "xcmFee": {
      "fee": "12428",
      "balance": "530221",
      "balanceAfter": "10517793",
      "currencySymbol": "USDC",
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


**Example of builder configuration:**

Following example has every option enabled.
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
```

</details>


## Transferable amount
You can use the transferable balance to retrieve information on how much of the selected currency can be transferred from a specific account.

```ts
const transferable = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(ORIGIN_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .to(DESTINATION_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getTransferableAmount()
```

**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary>Advanced settings</summary>

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
```
  
  </details>

**Notes:**

<details>
<summary>Note containing function formulae & further information about the query</summary>

 This query will calculate transferable balance using the following formulae: 

**Balance - ED - if(asset=native) then also substract Origin XCM Fees else ignore**

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will go through).

</details>

**Example output:**

```json
"3329236337"
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


**Example of builder configuration:**

Following example has every option enabled.
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
```

</details>

## Minimal transferable amount
You can use the minimal transferable balance to retrieve information on minimum of the selected currency can be transferred from a specific account to specific destination, so that the ED and destination or origin fee is paid fully.

```ts
const transferable = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(ORIGIN_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .to(DESTINATION_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getMinTransferableAmount()
```

**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary>Advanced settings</summary>

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
```
  
  </details>

**Notes:**

<details>
<summary>Note containing function formulae & further information about the query</summary>

 This query will calculate minimal transferable balance using the following formulae: 

**(Origin Balance - if(Balance on destination = 0) then also substract destination ED(Existential deposit) - if(Asset=native) then also substract Origin XCM Fees - hop fees (If present) - destination XCM fee) +1**

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will go through). Chains that do not have support for dryrun will return error in this query.

</details>

**Example output:**

```json
"3329236337"
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


**Example of builder configuration:**

Following example has every option enabled.
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
```

</details>

## Verify ED on destination
To retrieve information on whether the selected currency from a specific account will meet the existential deposit on the destination chain, you can use this query. 

```ts
const ed = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(ORIGIN_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .to(DESTINATION_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .verifyEdOnDestination()
```
**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary>Advanced settings</summary>

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
```
  
  </details>

**Notes:**

<details>
<summary>Note containing function formulae & further information about the query</summary>

This query will calculate whether the user will have enough to cover the existential deposit on XCM arrival using the following pseudo formulae: 

**(if(Balance) || if(TransferedAmount - ED - Destination Fee > 0)) return true else false** 

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will actually go through). **If the function switches to PaymentInfo and the transferred currency is different from the native currency on the destination chain, the function throws an error as PaymentInfo only returns fees in the native asset of the chain.**

</details>

**Example output:**

```json
true
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


**Example of builder configuration:**

Following example has every option enabled.
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
```

</details>


## XCM Fee (Origin and Dest.)
The following queries allow you to query the fee from both the Origin and Destination of the XCM Message. You can get an accurate result from the DryRun query (Requires token balance) or a less accurate result from the Payment info query (Doesn't require token balance).

### More accurate query using DryRun
The query is designed to retrieve your XCM fee at any cost, but falls back to Payment info if the DryRun query fails or is not supported by either origin or destination. This query requires the user to have a token balance (the Token that they are sending and the origin native asset to pay for execution fees on the origin).

```ts
const fee = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(ORIGIN_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .to(DESTINATION_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getXcmFee(/*{disableFallback: true / false}*/)  //Fallback is optional. When fallback is disabled, you only get notified of DryRun error, but no Payment info query fallback is performed. Payment info is still performed if Origin or Destination chain do not support DryRun out of the box.
```

**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary>Advanced settings</summary>

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
```
  
  </details>

**Notes**
<details>
<summary>Information about the query behaviour</summary>

When Payment info query is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price. DryRun returns fees in the currency that is being transferred, so no additional calculations are necessary in that case.

</details>

**Possible output objects:**

<details>
<summary>The XCM Fee query will return the following objects</summary>

```
origin - Always present
assetHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

</details>

**Example output**
<details>
<summary>Following output contains transfer of 10 GLMR from Hydration to Moonbeam</summary>

```json
{
  "origin": {
    "weight": {
      "refTime": "1847483799",
      "proofSize": "12268"
    },
    "fee": "46696677064",
    "feeType": "dryRun",
    "sufficient": false,
    "currency": "GLMR",
    "asset": {
      "assetId": "16",
      "symbol": "GLMR",
      "decimals": 18,
      "existentialDeposit": "34854864344868000",
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
      "isFeeAsset": true,
      "amount": "10000000000000000000"
    }
  },
  "destination": {
    "fee": "9823071250000000",
    "feeType": "dryRun",
    "sufficient": false,
    "currency": "GLMR",
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


**Example of builder configuration:**

Following example has every option enabled.
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
```

</details>


### Less accurate query using Payment info
This query is designed to retrieve your approximate fee and doesn't require any token balance.

```ts
const fee = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(ORIGIN_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .to(DESTINATION_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)          
          .getXcmFeeEstimate()
```

**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

  </details>

**Notes**
<details>
<summary>Information about the query behaviour</summary>

When Payment info query is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price. 

</details>

**Possible output objects:**

<details>
<summary>The XCM Fee Estimate query will return the following objects</summary>

```
origin - Always present
destination - Always present
```

</details>

**Example output**
<details>
<summary>Following output contains transfer of 10 GLMR from Hydration to Moonbeam</summary>

```json
{
  "origin": {
    "fee": "664518329863",
    "currency": "HDX",
    "asset": {
      "assetId": "16",
      "symbol": "GLMR",
      "decimals": 18,
      "existentialDeposit": "34854864344868000",
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
    },
    "sufficient": true
  },
  "destination": {
    "fee": "1450023772558270",
    "currency": "GLMR",
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
    },
    "sufficient": true
  }
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


**Example of builder configuration:**

Following example has every option enabled.
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
```

</details>


## XCM Fee (Origin only)
The following queries allow you to query the XCM fee from the Origin chain. You can get an accurate result from the DryRun query (Requires token balance) or a less accurate result from the Payment info query (Doesn't require token balance).

### More accurate query using DryRun
The query is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by origin. This query requires user to have token balance (Token that they are sending and origin native asset to pay for execution fees on origin).



```ts
const fee = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(ORIGIN_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .to(DESTINATION_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getOriginXcmFee(/*{disableFallback: true / false}*/)  //Fallback is optional. When fallback is disabled, you only get notified of DryRun error, but no Payment info query fallback is performed. Payment info is still performed if Origin do not support DryRun out of the box.
```

**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary>Advanced settings</summary>

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
```
  
  </details>

**Possible output objects:**

<details>
<summary>The Origin XCM Fee query will return the following objects</summary>

```
origin - Always present
```

</details>

**Example output**
<details>
<summary>Following output contains transfer of 100 MYTH from Mythos to AssetHubPolkadot</summary>

```json
{
  "origin": {
    "weight": {
      "refTime": "970770242",
      "proofSize": "10755"
    },
    "fee": "189322000411000000",
    "feeType": "dryRun",
    "sufficient": true,
    "currency": "MYTH",
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
      },
      "amount": "100000000000000000000"
    }
  },
  "destination": {
    "fee": "78516679785747332",
    "feeType": "dryRun",
    "sufficient": true,
    "currency": "MYTH",
    "asset": {
      "symbol": "MYTH",
      "decimals": 18,
      "location": {
        "parents": 1,
        "interior": {
          "X1": [
            {
              "Parachain": 3369
            }
          ]
        }
      },
      "existentialDeposit": "10000000000000000",
      "isFeeAsset": true
    }
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


**Example of builder configuration:**

Following example has every option enabled.
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
```

</details>

### Less accurate query using Payment info
This query is designed to retrieve your approximate fee and doesn't require any token balance.

```ts
const fee = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(ORIGIN_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .to(DESTINATION_CHAIN) //'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)          
          .getOriginXcmFeeEstimate()
```

**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary>Advanced settings</summary>

  You can use following optional advanced settings to further customize your calls:

```ts
// Used when origin === AssetHubPolkadot | Hydration - This will allow for custom fee asset on origin.
.feeAsset({id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson})
```
  
  </details>

**Possible output objects:**

<details>
<summary>The Origin XCM Fee query will return the following objects</summary>

```
origin - Always present
```

</details>

**Example output**
<details>
<summary>Following output contains transfer of 100 MYTH from Mythos to AssetHubPolkadot</summary>

```json
{
  "fee": "150000000000000000",
  "currency": "MYTH",
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
  "sufficient": true
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


**Example of builder configuration:**

Following example has every option enabled.
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
```

</details>



## Asset balance
You can now query all important information about your XCM call, including fees (if your balance is sufficient to transfer an XCM message) and more.

```ts
//PAPI
import { getAssetBalance } from "@paraspell/sdk";
//PJS
import { getAssetBalance } from "@paraspell/sdk-pjs";

//Retrieves the asset balance for a given account on a specified CHAIN (You do not need to specify if it is native or foreign).
const balance = await getAssetBalance({address, CHAIN, CURRENCY_SPEC /*Refer to currency spec options below*/, /* client | ws_url | [ws_url, ws_url,..] - optional */});
```

**Initial setup**

  <details>

  <summary>Currency spec options</summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: Native('currencySymbol'), amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: Foreign('currencySymbol'), amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: ForeignAbstract('currencySymbol'), amount: amount} 
```

  </details>

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
Latest SDK versions now offer the ability to query the existential deposit on implemented chains using a simple call:

```ts
//PAPI
import { getExistentialDeposit } from "@paraspell/sdk";
//PJS
import { getExistentialDeposit } from "@paraspell/sdk-pjs";

//Currency is an optional parameter. If you wish to query native asset, currency parameter is not necessary.
//Currency can be either {symbol: assetSymbol}, {id: assetId}, {location: assetLocation}.
const ed = getExistentialDeposit(CHAIN, currency?)
```

**Example output:**

```json
"100000000"
```

## Convert SS58 address 
The following functionality allows you to convert any SS58 address to a Parachain-specific address.

```ts
//PAPI
import { convertSs58 } from "@paraspell/sdk";
//PJS
import { convertSs58 } from "@paraspell/sdk-pjs";

const result = convertSs58(address, CHAIN) 
```

**Example output:**

```json
"7Lu51dzX1eqBxHdc8DkWvMkyFgoVXXFjibjEnxUndJQ8NAHz"
```

