# Ready to make cross-chain swap messages with ease? 🤝

XCM Router supports following cross-chain swaps across Polkadot and Kusama.

| Swap Type   | DEX               | Pools | Notes                                |
|------------|-------------------|-------|--------------------------------------|
| One-click  | Hydration         | 210   | —                                    |
| One-click  | AssetHub Polkadot | 32    | Requires specific native tokens      |
| Two-click  | Acala             | 36    | Requires native token                                    |
| Two-click  | Bifrost Kusama    | 66    | Requires native token                |
| Two-click  | Bifrost Polkadot  | 45    | Requires native token                |
| Two-click  | Karura            | 136   | Requires native token                                    |
| Two-click  | AssetHub Kusama   | 16    | Requires specific native tokens      |

**Total pools available:** 541

> [!IMPORTANT]
> - 📣 Some exchanges require native tokens to proceed with swaps.
>
>- 📣 Router supports one-click cross-chain swaps! Supported exchanges are AssetHubPolkadot and Hydration.
>   - 📋 **Sidenote**: Not all chains can be selected as origin for one-click cross-chain swaps, because their barrier doesn't support execute extrinsic. All chains can be selected as a destination, however. For origin chains that do not support execute extrinsic, we automatically default to the original two-click scenario.


## Automatic exchange selection
If you wish to have an exchange chain selection based on the best price outcome, you can opt for the automatic exchange selection method. This method can be selected by **not using** `.exchange()` parameter in the call. The router will then automatically select the best exchange chain for you based on the best price outcome.

```ts
await RouterBuilder(/* builder_config - Optional*/)
        .from(TSubstrateChain)   //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .to(TChain)    //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
        .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .senderAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(signer)    //PAPI Signer
        //.evmSenderAddress(evmInjector address)   //Optional parameters when origin CHAIN is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin CHAIN is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TRouterEvent) => {  //This is how we subscribe to calls that need signing
          console.log(status.type);   // Current transaction type
          console.log(status.routerPlan);   // Array of all transactions to execute
          console.log(status.chain);   // Current transaction origin chain
          console.log(status.destinationChain);    // Current transaction destination chain
          console.log(status.currentStep);    // 0-based step index of current transaction
        })
        .buildAndSend()
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString} //Recommended
{location: AssetLocationJson} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol} 
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await RouterBuilder({
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await RouterBuilder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

:::

## Whitelist exchange selection
If you wish to have specific exchanges selection and select the best one among them based on the best price outcome, you can opt for the whitelist automatic exchange selection method. This method can be selected by **using** `.exchange()` parameter in the call and feeding it with **array of exchanges**. The router will then automatically select the best exchange chain for you based on the best price outcome.

```ts
await RouterBuilder(/* builder_config - Optional*/)
        .from(TSubstrateChain)   //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .to(TChain)    //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .exchange(['HydrationDex','AcalaDex','AssetHubPolkadotDex'])    //Exchange Parachains
        .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
        .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .senderAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(signer)    //PAPI Signer
        //.evmSenderAddress(evmInjector address)   //Optional parameters when origin CHAIN is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin CHAIN is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TRouterEvent) => {  //This is how we subscribe to calls that need signing
          console.log(status.type);   // Current transaction type
          console.log(status.routerPlan);   // Array of all transactions to execute
          console.log(status.chain);   // Current transaction origin chain
          console.log(status.destinationChain);    // Current transaction destination chain
          console.log(status.currentStep);    // 0-based step index of current transaction
        })
        .buildAndSend()
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString} //Recommended
{location: AssetLocationJson} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol} 
```

:::

::: details **Builder configuration**


**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await RouterBuilder({
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await RouterBuilder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

:::

## Manual exchange selection
If you wish to select your exchange chain manually you can do that by providing additional parameter `.exchange()` in the call. The router will then use the exchange chain of your choice.

```ts
await RouterBuilder(/* builder_config - Optional*/)
        .from(TSubstrateChain)   //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .to(TChain)    //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
        .exchange('HydrationDex')    //Exchange Parachain
        .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
        .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .senderAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(signer)    //PAPI Signer
        //.evmSenderAddress(evmInjector address)   //Optional parameters when origin CHAIN is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin CHAIN is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TRouterEvent) => {  //This is how we subscribe to calls that need signing
          console.log(status.type);   // Current transaction type
          console.log(status.routerPlan);   // Array of all transactions to execute
          console.log(status.chain);   // Current transaction origin chain
          console.log(status.destinationChain);    // Current transaction destination chain
          console.log(status.currentStep);    // 0-based step index of current transaction
        })
        .buildAndSend()
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString} //Recommended
{location: AssetLocationJson} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol} 
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await RouterBuilder({
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await RouterBuilder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

:::

## Dry run your Router calls
Dry running let's you check whether your XCM Call will execute, giving you a chance to fix it if it is constructed wrongly or you didn't select correct account/asset or don't have enough balance. It is constructed in same way as standard XCM messages with parameter `.dryRun()` at the end.

```ts
const result = await RouterBuilder()
      .from(TSubstrateChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .exchange('HydrationDex') //OPTIONAL PARAMETER - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
      .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
      .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
      .amount(10000000000n)
      .senderAddress(selectedAccount.address)   //Injector address
      .recipientAddress(recipientAddress) //Recipient address
      //.evmSenderAddress(evmInjector address)   //Optional parameters when origin CHAIN is EVM based (Required with evmSigner)
      //.evmSigner(EVM signer)                     //Optional parameters when origin CHAIN is EVM based (Required with evmInjectorAddress)
      .dryRun();
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString} //Recommended
{location: AssetLocationJson} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol} 
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await RouterBuilder({
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await RouterBuilder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
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

::: details Transfer and swap of 1 DOT into USDC comming from AssetHub to Hydration dex and ending at BifrostPolkadot

```json
{
  "origin": {
    "success": true,
    "fee": "25537364",
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
    },
    "weight": {
      "refTime": "1323338000",
      "proofSize": "10530"
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
                        "type": "Here"
                      }
                    }
                  },
                  "fun": {
                    "type": "Fungible",
                    "value": "10000000000"
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
                    "value": "10000000000"
                  }
                },
                "weight_limit": {
                  "type": "Unlimited"
                }
              }
            },
            {
              "type": "ExchangeAsset",
              "value": {
                "give": {
                  "type": "Wild",
                  "value": {
                    "type": "AllOf",
                    "value": {
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
                        "type": "Fungible"
                      }
                    }
                  }
                },
                "want": [
                  {
                    "id": {
                      "type": "Concrete",
                      "value": {
                        "parents": 1,
                        "interior": {
                          "type": "X3",
                          "value": [
                            {
                              "type": "Parachain",
                              "value": 1000
                            },
                            {
                              "type": "PalletInstance",
                              "value": 50
                            },
                            {
                              "type": "GeneralIndex",
                              "value": "1337"
                            }
                          ]
                        }
                      }
                    },
                    "fun": {
                      "type": "Fungible",
                      "value": "1775950"
                    }
                  }
                ],
                "maximal": false
              }
            },
            {
              "type": "InitiateReserveWithdraw",
              "value": {
                "assets": {
                  "type": "Wild",
                  "value": {
                    "type": "AllOf",
                    "value": {
                      "id": {
                        "type": "Concrete",
                        "value": {
                          "parents": 1,
                          "interior": {
                            "type": "X3",
                            "value": [
                              {
                                "type": "Parachain",
                                "value": 1000
                              },
                              {
                                "type": "PalletInstance",
                                "value": 50
                              },
                              {
                                "type": "GeneralIndex",
                                "value": "1337"
                              }
                            ]
                          }
                        }
                      },
                      "fun": {
                        "type": "Fungible"
                      }
                    }
                  }
                },
                "reserve": {
                  "parents": 1,
                  "interior": {
                    "type": "X1",
                    "value": {
                      "type": "Parachain",
                      "value": 1000
                    }
                  }
                },
                "xcm": [
                  {
                    "type": "BuyExecution",
                    "value": {
                      "fees": {
                        "id": {
                          "type": "Concrete",
                          "value": {
                            "parents": 0,
                            "interior": {
                              "type": "X2",
                              "value": [
                                {
                                  "type": "PalletInstance",
                                  "value": 50
                                },
                                {
                                  "type": "GeneralIndex",
                                  "value": "1337"
                                }
                              ]
                            }
                          }
                        },
                        "fun": {
                          "type": "Fungible",
                          "value": "1775948"
                        }
                      },
                      "weight_limit": {
                        "type": "Unlimited"
                      }
                    }
                  },
                  {
                    "type": "DepositReserveAsset",
                    "value": {
                      "assets": {
                        "type": "Wild",
                        "value": {
                          "type": "AllOf",
                          "value": {
                            "id": {
                              "type": "Concrete",
                              "value": {
                                "parents": 0,
                                "interior": {
                                  "type": "X2",
                                  "value": [
                                    {
                                      "type": "PalletInstance",
                                      "value": 50
                                    },
                                    {
                                      "type": "GeneralIndex",
                                      "value": "1337"
                                    }
                                  ]
                                }
                              }
                            },
                            "fun": {
                              "type": "Fungible"
                            }
                          }
                        }
                      },
                      "dest": {
                        "parents": 1,
                        "interior": {
                          "type": "X1",
                          "value": {
                            "type": "Parachain",
                            "value": 2030
                          }
                        }
                      },
                      "xcm": [
                        {
                          "type": "BuyExecution",
                          "value": {
                            "fees": {
                              "id": {
                                "type": "Concrete",
                                "value": {
                                  "parents": 1,
                                  "interior": {
                                    "type": "X3",
                                    "value": [
                                      {
                                        "type": "Parachain",
                                        "value": 1000
                                      },
                                      {
                                        "type": "PalletInstance",
                                        "value": 50
                                      },
                                      {
                                        "type": "GeneralIndex",
                                        "value": "1337"
                                      }
                                    ]
                                  }
                                }
                              },
                              "fun": {
                                "type": "Fungible",
                                "value": "1692273"
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
                                "type": "AllOf",
                                "value": {
                                  "id": {
                                    "type": "Concrete",
                                    "value": {
                                      "parents": 1,
                                      "interior": {
                                        "type": "X3",
                                        "value": [
                                          {
                                            "type": "Parachain",
                                            "value": 1000
                                          },
                                          {
                                            "type": "PalletInstance",
                                            "value": 50
                                          },
                                          {
                                            "type": "GeneralIndex",
                                            "value": "1337"
                                          }
                                        ]
                                      }
                                    }
                                  },
                                  "fun": {
                                    "type": "Fungible"
                                  }
                                }
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
                  }
                ]
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
    "destParaId": 2034
  },
  "destination": {
    "success": true,
    "fee": "11349",
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
    "weight": {
      "refTime": "164940000",
      "proofSize": "0"
    },
    "forwardedXcms": []
  },
  "hops": [
    {
      "chain": "Hydration",
      "result": {
        "success": true,
        "fee": "186595260",
        "asset": {
          "assetId": "5",
          "symbol": "DOT",
          "decimals": 10,
          "existentialDeposit": "17540000",
          "location": {
            "parents": 1,
            "interior": {
              "Here": null
            }
          },
          "isFeeAsset": true
        },
        "weight": {
          "refTime": "49757539337",
          "proofSize": "489799"
        },
        "forwardedXcms": [
          {
            "type": "V4",
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
              "type": "V4",
              "value": [
                {
                  "type": "WithdrawAsset",
                  "value": [
                    {
                      "id": {
                        "parents": 0,
                        "interior": {
                          "type": "X2",
                          "value": [
                            {
                              "type": "PalletInstance",
                              "value": 50
                            },
                            {
                              "type": "GeneralIndex",
                              "value": "1337"
                            }
                          ]
                        }
                      },
                      "fun": {
                        "type": "Fungible",
                        "value": "1775950"
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
                        "parents": 0,
                        "interior": {
                          "type": "X2",
                          "value": [
                            {
                              "type": "PalletInstance",
                              "value": 50
                            },
                            {
                              "type": "GeneralIndex",
                              "value": "1337"
                            }
                          ]
                        }
                      },
                      "fun": {
                        "type": "Fungible",
                        "value": "1775948"
                      }
                    },
                    "weight_limit": {
                      "type": "Unlimited"
                    }
                  }
                },
                {
                  "type": "DepositReserveAsset",
                  "value": {
                    "assets": {
                      "type": "Wild",
                      "value": {
                        "type": "AllOf",
                        "value": {
                          "id": {
                            "parents": 0,
                            "interior": {
                              "type": "X2",
                              "value": [
                                {
                                  "type": "PalletInstance",
                                  "value": 50
                                },
                                {
                                  "type": "GeneralIndex",
                                  "value": "1337"
                                }
                              ]
                            }
                          },
                          "fun": {
                            "type": "Fungible"
                          }
                        }
                      }
                    },
                    "dest": {
                      "parents": 1,
                      "interior": {
                        "type": "X1",
                        "value": {
                          "type": "Parachain",
                          "value": 2030
                        }
                      }
                    },
                    "xcm": [
                      {
                        "type": "BuyExecution",
                        "value": {
                          "fees": {
                            "id": {
                              "parents": 1,
                              "interior": {
                                "type": "X3",
                                "value": [
                                  {
                                    "type": "Parachain",
                                    "value": 1000
                                  },
                                  {
                                    "type": "PalletInstance",
                                    "value": 50
                                  },
                                  {
                                    "type": "GeneralIndex",
                                    "value": "1337"
                                  }
                                ]
                              }
                            },
                            "fun": {
                              "type": "Fungible",
                              "value": "1692273"
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
                              "type": "AllOf",
                              "value": {
                                "id": {
                                  "parents": 1,
                                  "interior": {
                                    "type": "X3",
                                    "value": [
                                      {
                                        "type": "Parachain",
                                        "value": 1000
                                      },
                                      {
                                        "type": "PalletInstance",
                                        "value": 50
                                      },
                                      {
                                        "type": "GeneralIndex",
                                        "value": "1337"
                                      }
                                    ]
                                  }
                                },
                                "fun": {
                                  "type": "Fungible"
                                }
                              }
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
      "isExchange": true
    },
    {
      "chain": "AssetHubPolkadot",
      "result": {
        "success": true,
        "fee": "69731",
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
        "weight": {
          "refTime": "1416916000",
          "proofSize": "12638"
        },
        "forwardedXcms": [
          {
            "type": "V4",
            "value": {
              "parents": 1,
              "interior": {
                "type": "X1",
                "value": {
                  "type": "Parachain",
                  "value": 2030
                }
              }
            }
          },
          [
            {
              "type": "V4",
              "value": [
                {
                  "type": "ReserveAssetDeposited",
                  "value": [
                    {
                      "id": {
                        "parents": 1,
                        "interior": {
                          "type": "X3",
                          "value": [
                            {
                              "type": "Parachain",
                              "value": 1000
                            },
                            {
                              "type": "PalletInstance",
                              "value": 50
                            },
                            {
                              "type": "GeneralIndex",
                              "value": "1337"
                            }
                          ]
                        }
                      },
                      "fun": {
                        "type": "Fungible",
                        "value": "1706038"
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
                        "parents": 1,
                        "interior": {
                          "type": "X3",
                          "value": [
                            {
                              "type": "Parachain",
                              "value": 1000
                            },
                            {
                              "type": "PalletInstance",
                              "value": 50
                            },
                            {
                              "type": "GeneralIndex",
                              "value": "1337"
                            }
                          ]
                        }
                      },
                      "fun": {
                        "type": "Fungible",
                        "value": "1692273"
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
                        "type": "AllOf",
                        "value": {
                          "id": {
                            "parents": 1,
                            "interior": {
                              "type": "X3",
                              "value": [
                                {
                                  "type": "Parachain",
                                  "value": 1000
                                },
                                {
                                  "type": "PalletInstance",
                                  "value": 50
                                },
                                {
                                  "type": "GeneralIndex",
                                  "value": "1337"
                                }
                              ]
                            }
                          },
                          "fun": {
                            "type": "Fungible"
                          }
                        }
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
        "destParaId": 2030
      },
      "isExchange": false
    }
  ]
}
```

:::

## Minimal transferable amount

You can use the minimal transferable balance to retrieve information on minimum of the selected currency can be transferred from a specific account to specific destination, so that the existential deposit and destination or origin fee is paid fully

```ts
const result = await RouterBuilder()
      .from(TSubstrateChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .exchange('HydrationDex') //OPTIONAL PARAMETER - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
      .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
      .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
      .amount(10000000000n)
      .senderAddress(selectedAccount.address)   //Injector address
      //.evmSenderAddress(evmInjector address)   //Optional parameters when origin CHAIN is EVM based (Required with evmSigner)
      //.evmSigner(EVM signer)                     //Optional parameters when origin CHAIN is EVM based (Required with evmInjectorAddress)
      .getMinTransferableAmount();
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString} //Recommended
{location: AssetLocationJson} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol} 
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await RouterBuilder({
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await RouterBuilder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

:::


**Example output:**

```json
"3329236337"
```


## Maximal transferable amount

You can use the transferable balance to retrieve information on how much of the selected currency can be transferred from a specific account.

```ts
const result = await RouterBuilder()
      .from(TSubstrateChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .exchange('HydrationDex') //OPTIONAL PARAMETER - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
      .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
      .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
      .amount(10000000000n)
      .senderAddress(selectedAccount.address)   //Injector address
      //.evmSenderAddress(evmInjector address)   //Optional parameters when origin CHAIN is EVM based (Required with evmSigner)
      //.evmSigner(EVM signer)                     //Optional parameters when origin CHAIN is EVM based (Required with evmInjectorAddress)
      .getTransferableAmount();
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString} //Recommended
{location: AssetLocationJson} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol} 
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await RouterBuilder({
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await RouterBuilder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

:::

**Example output:**

```json
"3329236337"
```

## Get amount out for your currency pair

To retrieve exchange amount, that you receive for your desired asset pair you can use following function. This function returns 2 parameters. Name of best fitting DEX (Automatic selection - can be further used for manual selection) and Amount out

```ts
const result = await RouterBuilder()
      .from(TSubstrateChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .exchange('HydrationDex') //OPTIONAL PARAMETER - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
      .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
      .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
      .amount(10000000000n)
      .getBestAmountOut();

console.log(result.amountOut)
console.log(result.exchange)
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString} //Recommended
{location: AssetLocationJson} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol} 
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await RouterBuilder({
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await RouterBuilder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
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

## Get Router fees

You can retrieve fees for all operations XCM Router performs. Keep in mind, that they are not as accurate for transfer from exchange to destination as the currency that is planned to be routed after the swap is not yet available on that account (Thus it uses payment info method instead of dryrun in that scenario).

```ts
const fees = await RouterBuilder(/* builder_config - Optional*/)
      .from(TSubstrateChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .to(TChain) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ... https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types
      .exchange(exchange) //OPTIONAL PARAMETER - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
      .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
      .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
      .amount(amount)
      .senderAddress(senderAddress)
      .recipientAddress(recipientAddress)
      .slippagePct(slippagePct)
      .getXcmFees();
```

**Initial setup:**

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString} //Recommended
{location: AssetLocationJson} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol} 
```

:::

::: details **Builder configuration**

**Development:**

The development setting requires you to define all chain endpoints - those that are used within call. This is good for localhost usage.
```ts
const builder = await Builder({
  development: true, // Optional: Enforces overrides for all chains used
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Api overrides:**

You can override any API endpoint in your call in following way.
```ts
const builder = await RouterBuilder({
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
  }
})
```

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

>[!Note]
>Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

**Example of builder configuration:**

Following example has every option enabled.
```ts
const builder = await RouterBuilder({
  development: true, // Optional: Enforces overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000
  apiOverrides: {
    Hydration: /* ws_url | [ws_url, ws_url,..]*/
    AssetHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
    BridgeHubPolkadot: /* ws_url | [ws_url, ws_url,..]*/
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

::: details Swap transfer (USDT to USDC) from Astar going to AssetHubPolkadotDex and ending at Hydration

```json
{
  "origin": {
    "weight": {
      "refTime": "2838684462",
      "proofSize": "35585"
    },
    "fee": "82106097813361033",
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
      }
    }
  },
  "destination": {
    "fee": "349",
    "feeType": "dryRun",
    "asset": {
      "assetId": "22",
      "symbol": "USDC",
      "decimals": 6,
      "existentialDeposit": "10000",
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
      "isFeeAsset": true,
      "alias": "USDC3"
    }
  },
  "hops": [
    {
      "chain": "AssetHubPolkadot",
      "result": {
        "fee": "359818592",
        "feeType": "dryRun",
        "sufficient": false,
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
        },
        "forwardedXcms": [],
        "weight": {
          "refTime": "1290077488",
          "proofSize": "20021"
        }
      },
      "isExchange": true
    }
  ]
}
```

:::


## Helpful functions

Below, you can find helpful functions that are exported from XCM Router to help you enhance front end usability of XCM Router.

```ts
import {getExchangeAssets, getExchangePairs} from @paraspell/xcm-router

//Returns all assets that DEX supports
const assets = getExchangeAssets('AssetHubPolkadotDex')

//Returns asset pairs supported by selected exchanges
const pairs = getExchangePairs(exchange) // Exchange can be also array of exchanges such as [“HydrationDex”, “AcalaDex”] or undefined which will return all available pairs for all dexes
```