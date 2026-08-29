# Know the toll before the trip 🎒

Understand the complete fee structure and balance flow behind your XCM call. Use the queries below for deep, technical insight before dispatch.

## XCM Fee (Origin and Dest.)
The following query allows you to query the fee from both the Origin and Destination of the XCM Message. The query is designed to retrieve your XCM fee at any cost, but falls back to Payment info if the DryRun query fails or is not supported by either origin or destination. 

```ts
const fee = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .recipient(RECIPIENT_ADDRESS)
          .sender(SENDER_ADDRESS)
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
.swap({
    currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
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

::: details Possible output objects

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

:::

::: details Example output: for transfer of 10 ASTR from Hydration to Astar

```json
{
  "success": true,
  "origin": {
    "weight": {
      "refTime": "2270817049",
      "proofSize": "16764"
    },
    "fee": "14120795471",
    "feeType": "dryRun",
    "sufficient": true,
    "asset": {
      "assetId": "14",
      "symbol": "BNC",
      "decimals": 12,
      "existentialDeposit": "68795189840",
      "location": {
        "parents": 1,
        "interior": {
          "X2": [
            {
              "Parachain": 2030
            },
            {
              "GeneralKey": {
                "length": 2,
                "data": "0x0001000000000000000000000000000000000000000000000000000000000000"
              }
            }
          ]
        }
      },
      "isFeeAsset": true
    }
  },
  "destination": {
    "fee": "44143974690192250",
    "feeType": "dryRun",
    "sufficient": true,
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
      },
      "amount": "10000000000000000000"
    }
  },
  "hops": []
}
```

:::

## XCM Fee (Origin only)
The following query allows you to query the XCM fee from the Origin chain. The query is designed to retrieve your XCM fee at any cost, but falls back to Payment info if the DryRun query fails or is not supported by origin. 

```ts
const fee = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .recipient(RECIPIENT_ADDRESS)
          .sender(SENDER_ADDRESS)
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
You can now query all important information about your XCM call, including fees (if your balance is sufficient to transfer an XCM message) and more. The function uses [TChain](https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types) types.

```ts
//PAPI
import { getBalance } from "@paraspell/sdk";
//PJS
import { getBalance } from "@paraspell/sdk-pjs";
//Dedot
import { getBalance } from "@paraspell/sdk-dedot";

//Retrieves the asset balance for a given account on a specified CHAIN (You do not need to specify if it is native or foreign).
const balance = await getBalance({ADDRESS, TChain, CURRENCY_SPEC /*OPTIONAL - Refer to currency spec options below*/, /* client | ws_url | [ws_url, ws_url,..] - optional */});
```

**Initial setup:**

::: details Currency spec options
  
**The currency spec in this method is optional; if not provided, the function will search for the balance of the native asset of the chosen chain.**

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

## XCM Transfer info
Use this query to comprehensively assess whether a message will execute successfully without failure. It provides detailed information on currency balances before and after the transaction, including all relevant fees. This data is essential for accurately evaluating balance or fee-related issues that could cause message failure.

```ts
const info = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .recipient(RECIPIENT_ADDRESS)
          .sender(SENDER_ADDRESS)
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
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .recipient(RECIPIENT_ADDRESS)
          .sender(SENDER_ADDRESS)
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
.swap({
    currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
    // exchange: ['AssetHubPolkadotDex'], - Optional parameter - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
    // slippage: 1, - Optional - 1 by default
    // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
    // evmSigner: Signer, - Optional parameter when origin CHAIN is EVM based (Required with evmInjectorAddress)
    // onStatusChange: (event) => void - Optional parameter for callback events when sender address is supplied as signer
})
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

**Notes:**

::: details Function formulae
The query uses the following formulae:

```
max(balance - existentialDeposit - originFee, 0)
```

- **`balance`**: the sender's current balance of the queried asset on the origin chain.
- **`existentialDeposit`**: the ED for that asset on the origin chain. Anything below it isn't really spendable, since a balance that drops under the ED gets the account reaped, so it's carved out of what's "transferable" from the start.
- **`originFee`**: the fee for locally executing the outgoing XCM program on the origin chain, included only when it's paid out of the same asset being queried (no separate `feeAsset` was configured and the asset is the origin chain's native asset, or an explicit `feeAsset` was set that happens to equal the queried asset). When the fee is paid from a different asset, it doesn't touch this balance, so it contributes `0` here.

**Example**: Alice holds `5 DOT` on AssetHub Polkadot. DOT's existential deposit there is `0.01 DOT`. Since DOT is the origin chain's native asset and Alice hasn't set a separate `feeAsset`, the local execution fee of `0.02 DOT` is also paid from this same balance. Her transferable amount is `5 - 0.01 - 0.02 = 4.97 DOT`, the most she could send without leaving her own AssetHub account under its existential deposit or short on fees for the extrinsic itself.

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will go through).

:::

**Example output:**

```json
"3329236337"
```

## Minimal transferable amount
You can use the minimal transferable balance to retrieve information on the minimum amount of the selected currency that can be transferred from a specific account to a specific destination, so that the ED and destination or origin fee are paid in full.

```ts
const transferable = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .recipient(RECIPIENT_ADDRESS)
          .sender(SENDER_ADDRESS)
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
.swap({
    currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
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

**Notes:**

::: details Function formulae

This query calculates the minimal transferable amount using the following formulae:

```
hopFeeTotal + destinationFee + originFee + edComponent + 1n
```

Every term below is expressed in the asset actually being transferred, and each one is added only when that fee (or requirement) is actually paid in that same asset. A fee taken in a different asset doesn't shrink what arrives, so it's left out.

- **`hopFeeTotal`** - Some routes don't go directly from origin to destination; the message passes through one or more intermediate chains first. Each intermediate chain executes part of the XCM program and charges its own execution fee, deducted from the asset as it passes through. `hopFeeTotal` is the sum of every hop's fee that happens to be charged in the transferred asset. If a route has no hops, this is `0`.

- **`destinationFee`** - When the message lands on destination chain, it has to execute XCM instructions (depositing the asset into the recipient's account for example), and it charges its own execution fee for that.

- **`originFee`** - A fee that is charged on origin chain and directly from account - not from the XCM specified transferring amount. **When the origin fee is denominated in the asset being transferred, subtract it from the queried value before displaying the minimal amount the XCM can carry.** When the origin fee is instead paid via a separate `feeAsset`, it comes out of a different balance entirely and never touches the transferred asset, so it contributes `0` here.

- **`edComponent`** - Account whose balance drops below the existential deposit (ED) is dusted. If the recipient has never held this asset on the destination chain (balance is `0`), the arriving amount must clear the destination's ED just to create a usable account, so `edComponent` equals that ED. If the recipient already holds a balance there, the account already exists and clears the ED, so this term is `0` and doesn't need to be paid again.

- **`+ 1n`** - A padding of one base unit (the smallest indivisible unit of the asset, e.g. one Planck for DOT). Fee estimates can be off by tiny rounding amounts, so this nudges the result just past the computed minimum rather than landing exactly on it, where a transfer could still fail by a hair.

**Example**: Alice wants to send DOT from AssetHub Polkadot to Hydration, to Bob, who currently holds **no DOT at all** on Hydration.

| Term | What it represents here | Value |
| --- | --- | --- |
| `hopFeeTotal` | Route doesn't need to go through a HOP chain | 0 DOT |
| `destinationFee` | Hydration's fee for executing the deposit, charged in DOT | 0.02 DOT |
| `originFee` | AssetHub Polkadot's local execution fee, paid in DOT since no separate `feeAsset` was set. | 0.05 DOT |
| `edComponent` | Bob holds 0 DOT on Hydration, so Hydration's existential deposit for DOT is added | 0.01 DOT |
| `+ 1n` | Rounding padding | ~0 (negligible) |
| **Total (minimum transferable amount)** | This much will be charged overall | **0.08 DOT** |
| **Total amount that should be inputted as amount in XCM** | This amount will be sent to destination chain | **0.03 DOT** |


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
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .recipient(RECIPIENT_ADDRESS)
          .sender(SENDER_ADDRESS)
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

**Notes:**

::: details Function formulae

This query checks whether, after fees are taken out on arrival, the recipient ends up above the destination's existential deposit (ED) - either because the amount that lands clears the ED outright, or because the recipient already had enough there beforehand. It uses the following formulae:

```
(amount - feeToSubtract) > (balance < ed ? ed : 0)
```

- **`amount`** - the transfer amount.
- **`feeToSubtract`** - the HOP fee combined with destination fee.
- **`balance`** - how much of this asset the recipient already holds on the destination chain, before this transfer lands.
- **`ed`** - the existential deposit for this asset on the destination chain.

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will actually go through). **If the function switches to PaymentInfo and the transferred currency is different from the native currency on the destination chain, the function throws an error as PaymentInfo only returns fees in the native asset of the chain.**

:::

**Example output:**

```json
true
```

## Predicted received amount
You can predict the amount to be received on the destination, provided that the destination chain and hops support dry-run.

```ts
const transferable = await Builder(/*client | builder_config | ws_url | [ws_url, ws_url,..] - Optional*/)
          .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
          .currency(CURRENCY_SPEC) // Refer to currency spec options below
          .recipient(RECIPIENT_ADDRESS)
          .sender(SENDER_ADDRESS)
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

```json
"3329236337"
```

## Get amount out for your currency pair

To retrieve the exchange amount you would receive for your desired asset pair, you can use the following function. This function returns two parameters: the name of the best-fitting DEX (automatic selection, which can also be used for manual selection) and the amount out.

```ts
const result = await Builder(/*chain api/builder_config/ws_url_string/ws_url_array - optional*/)
      .from(TSubstrateChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .to(TChain) //'AssetHubPolkadot' | 'Hydration' | 'BifrostPolkadot' | 'Polkadot' |  ... https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types
      .currency(CURRENCY_SPEC) // Refer to currency spec options below
      .recipient(RECIPIENT_ADDRESS)
      .sender(SENDER_ADDRESS)
      .swap({
          currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
          // exchange: ['AssetHubPolkadotDex'], - Optional parameter - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
          // slippage: 1, - Optional - 1 by default
          // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
          // evmSigner: Signer, - Optional parameter when origin CHAIN is EVM based (Required with evmInjectorAddress)
          // onStatusChange: (event) => void - Optional parameter for callback events when sender address is supplied as signer
      })
      .getBestAmountOut();

console.log(result.amountOut)
console.log(result.exchange)
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

```json
{
  "exchange": "AssetHubPolkadotDex",
  "amountOut": "982693"
}
```

## Ethereum bridge fees
The following query will retrieve the execution and bridge fee for transfers from Parachain to Ethereum.

```ts
//PAPI
import { getParaEthTransferFees } from "@paraspell/sdk";
//PJS
import { getParaEthTransferFees } from "@paraspell/sdk-pjs";
//Dedot
import { getParaEthTransferFees } from "@paraspell/sdk-dedot";

const fees = await getParaEthTransferFees(/*client | ws_url | [ws_url, ws_url,..] - Optional. Must be AssetHubPolkadot WS!)*/)
```

**Example output:**

```json
[16422495097, 2420000000]
```

## Query existential deposit
The latest SDK versions now offer the ability to query the existential deposit on implemented chains using a simple call. The function uses [TChain](https://paraspell.github.io/docs/xcm-sdk/asset-package.html#import-chains-as-types) types.

```ts
//PAPI
import { getExistentialDeposit } from "@paraspell/sdk";
//PJS
import { getExistentialDeposit } from "@paraspell/sdk-pjs";
//Dedot
import { getExistentialDeposit } from "@paraspell/sdk-dedot";

//Currency is an optional parameter. If you wish to query native asset, currency parameter is not necessary.
//Currency can be either {symbol: assetSymbol}, {id: assetId}, {location: assetLocation}.
const ed = getExistentialDeposit(TChain, currency?)
```

**Example output:**

```json
"100000000"
```