# Asset 💰 query operations for your front-end
This functionality serves to retrieve asset data from compatible Parachains. Users can retrieve details like `asset decimals`, `registered assets on particular Parachain`, `check if the asset is registered on Parachain` and more.

## Import functionality

To use this functionality you first have to import it in the following way.
```ts
//PAPI
import { getSupportedDestinations, getSupportedAssets, getFeeAssets, getAssetsObject, getAssetId, getRelayChainSymbol, getNativeAssets, getNativeAssets, getOtherAssets, getAllAssetsSymbols, hasSupportForAsset, getAssetDecimals, getParaId, getTChain, getAssetLocation, TParachain, TRelaychain, TSubstrateChain, TExternalChain, TChain, findAssetInfo, findAssetInfoOrThrow } from  '@paraspell/sdk'
//PJS
import { getSupportedDestinations, getSupportedAssets, getFeeAssets, getAssetsObject, getAssetId, getRelayChainSymbol, getNativeAssets, getNativeAssets, getOtherAssets, getAllAssetsSymbols, hasSupportForAsset, getAssetDecimals, getParaId, getTChain, getAssetLocation, TParachain, TRelaychain, TSubstrateChain, TExternalChain, TChain, findAssetInfo, findAssetInfoOrThrow } from  '@paraspell/sdk-pjs'
```

```ts
//Standalone asset package
yarn add || pnpm | npm install @paraspell/assets

import { getSupportedDestinations, getSupportedAssets, getFeeAssets, getAssetsObject, getAssetId, getRelayChainSymbol, getNativeAssets, getNativeAssets, getOtherAssets, getAllAssetsSymbols, hasSupportForAsset, getAssetDecimals, getParaId, getTChain, getAssetLocation, TParachain, TRelaychain, TSubstrateChain, TExternalChain, TChain, findAssetInfo, findAssetInfoOrThrow } from  '@paraspell/assets'
```

## Query asset paths
Following query lets you query paths that should be supported for specific asset related to origin chain.

```ts
getSupportedDestinations(CHAIN, CURRENCY)
```

**Example output:**
```json
[
  "Acala",
  "BifrostPolkadot",
  "ComposableFinance",
  "Hydration",
  "Moonbeam",
  "Pendulum",
  "Phala"
]
```

## Query assets supported between chains
Following query lets you query assets supported between two selected Parachains.
```ts
getSupportedAssets(ORIGIN_CHAIN, DESTINATION_CHAIN)
```

**Example output:**

<details>
<summary>An example of output for Acala and Astar as input</summary>

```json
[
  {
    "symbol": "ACA",
    "decimals": 12,
    "existentialDeposit": "100000000000",
    "location": {
      "parents": 1,
      "interior": {
        "X2": [
          {
            "Parachain": 2000
          },
          {
            "GeneralKey": {
              "length": 2,
              "data": "0x0000000000000000000000000000000000000000000000000000000000000000"
            }
          }
        ]
      }
    },
    "isNative": true
  },
  {
    "symbol": "aSEED",
    "decimals": 12,
    "existentialDeposit": "100000000000",
    "location": {
      "parents": 1,
      "interior": {
        "X2": [
          {
            "Parachain": 2000
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
    "isNative": true
  },
  {
    "symbol": "LDOT",
    "decimals": 10,
    "existentialDeposit": "500000000",
    "location": {
      "parents": 1,
      "interior": {
        "X2": [
          {
            "Parachain": 2000
          },
          {
            "GeneralKey": {
              "length": 2,
              "data": "0x0003000000000000000000000000000000000000000000000000000000000000"
            }
          }
        ]
      }
    },
    "isNative": true
  },
  {
    "symbol": "DOT",
    "decimals": 10,
    "existentialDeposit": "100000000",
    "location": {
      "parents": 1,
      "interior": {
        "Here": null
      }
    },
    "isNative": true
  },
  {
    "symbol": "UNQ",
    "decimals": 18,
    "existentialDeposit": "1250000000000000000",
    "assetId": "10",
    "location": {
      "parents": 1,
      "interior": {
        "X1": [
          {
            "Parachain": 2037
          }
        ]
      }
    }
  },
  {
    "symbol": "USDC",
    "decimals": 6,
    "existentialDeposit": "10000",
    "assetId": "14",
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
    }
  },
  {
    "symbol": "EQD",
    "decimals": 9,
    "existentialDeposit": "1000000000",
    "assetId": "8",
    "location": {
      "parents": 1,
      "interior": {
        "X2": [
          {
            "Parachain": 2011
          },
          {
            "GeneralKey": {
              "length": 3,
              "data": "0x6571640000000000000000000000000000000000000000000000000000000000"
            }
          }
        ]
      }
    }
  },
  {
    "symbol": "INTR",
    "decimals": 10,
    "existentialDeposit": "1000000000",
    "assetId": "4",
    "location": {
      "parents": 1,
      "interior": {
        "X2": [
          {
            "Parachain": 2032
          },
          {
            "GeneralKey": {
              "length": 2,
              "data": "0x0002000000000000000000000000000000000000000000000000000000000000"
            }
          }
        ]
      }
    }
  },
  {
    "symbol": "ASTR",
    "decimals": 18,
    "existentialDeposit": "100000000000000000",
    "assetId": "2",
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
  {
    "symbol": "PHA",
    "decimals": 12,
    "existentialDeposit": "100000000000",
    "assetId": "9",
    "location": {
      "parents": 1,
      "interior": {
        "X1": [
          {
            "Parachain": 2035
          }
        ]
      }
    }
  },
  {
    "symbol": "GLMR",
    "decimals": 18,
    "existentialDeposit": "100000000000000000",
    "assetId": "0",
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
    }
  },
  {
    "symbol": "HDX",
    "decimals": 12,
    "existentialDeposit": "78438200000000",
    "assetId": "17",
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
    }
  },
  {
    "symbol": "PINK",
    "decimals": 10,
    "existentialDeposit": "1000000000",
    "assetId": "13",
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
            "GeneralIndex": 23
          }
        ]
      }
    }
  },
  {
    "symbol": "USDT",
    "decimals": 6,
    "existentialDeposit": "10000",
    "assetId": "12",
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
            "GeneralIndex": 1984
          }
        ]
      }
    }
  },
  {
    "symbol": "EQ",
    "decimals": 9,
    "existentialDeposit": "1000000000",
    "assetId": "7",
    "location": {
      "parents": 1,
      "interior": {
        "X1": [
          {
            "Parachain": 2011
          }
        ]
      }
    }
  },
  {
    "symbol": "IBTC",
    "decimals": 8,
    "existentialDeposit": "100",
    "assetId": "3",
    "location": {
      "parents": 1,
      "interior": {
        "X2": [
          {
            "Parachain": 2032
          },
          {
            "GeneralKey": {
              "length": 2,
              "data": "0x0001000000000000000000000000000000000000000000000000000000000000"
            }
          }
        ]
      }
    }
  }
]
```

</details>

## Query fee assets
This function returns `assets object` from `assets.json` for `particular Parachain` for assets that have `feeAsset` property.
```ts
getFeeAssets(CHAIN)
```

**Example output:**

```json
[
  {
    "isNative": true,
    "symbol": "ACA",
    "decimals": 12,
    "existentialDeposit": "100000000000",
    "location": {
      "parents": 1,
      "interior": {
        "X2": [
          {
            "Parachain": 2000
          },
          {
            "GeneralKey": {
              "length": 2,
              "data": "0x0000000000000000000000000000000000000000000000000000000000000000"
            }
          }
        ]
      }
    }
  }
]
```

## Convert id or symbol to location
Get location for asset id or symbol.
```ts
getAssetLocation(CHAIN, { symbol: symbol } | { id: assetId })
```

**Example output:**

```json
{
  "parents": 1,
  "interior": {
    "Here": null
  }
}
```

## Query assets object
This function returns `assets object` from `assets.json` for `particular Parachain` including information about `native` and `foreign` assets.
```ts
getAssetsObject(CHAIN)
```

**Example output:**

<details>
<summary>An example of output for Ajuna as input</summary>

```json
{
  "relaychainSymbol": "DOT",
  "nativeAssetSymbol": "AJUN",
  "isEVM": false,
  "ss58Prefix": 1328,
  "supportsDryRunApi": true,
  "supportsXcmPaymentApi": true,
  "assets": [
    {
      "symbol": "AJUN",
      "isNative": true,
      "decimals": 12,
      "existentialDeposit": "1000000000",
      "location": {
        "parents": 1,
        "interior": {
          "X1": [
            {
              "Parachain": 2051
            }
          ]
        }
      }
    },
    {
      "assetId": "0",
      "symbol": "DOT",
      "decimals": 10,
      "existentialDeposit": "1000000000",
      "location": {
        "parents": 1,
        "interior": {
          "Here": null
        }
      },
      "isFeeAsset": true
    },
    {
      "assetId": "847713",
      "symbol": "DMOG",
      "decimals": 12,
      "existentialDeposit": "10000000000"
    },
    {
      "assetId": "1984",
      "symbol": "USDt",
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
              "GeneralIndex": 1984
            }
          ]
        }
      }
    },
    {
      "assetId": "1337",
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
      }
    }
  ]
}
```

</details>


## Query asset ID
This function returns `assetId` for `particular Parachain` and `asset symbol`
```ts
getAssetId(CHAIN, ASSET_SYMBOL)
```

**Example output:**

```json
"340282366920938463463374607431768211455"
```

## Query Relay chain asset symbol
This function returns the `symbol` of the Relay chain for a particular Parachain. Either "DOT" or "KSM"
```ts
getRelayChainSymbol(CHAIN)
```

**Example output:**

```json
"DOT"
```

## Query native assets
This function returns a string array of `native` assets symbols for a particular Parachain
```ts
getNativeAssets(CHAIN)
```

**Example output:**

```json
[
  {
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
]
```

## Query foreign assets
This function returns an object array of foreign assets for a particular Parachain. Each object has a symbol and assetId property
```ts
getOtherAssets(CHAIN)
```

**Example output:**

<details>
<summary>An example of output for Darwinia as input</summary>

```json
[
  {
    "assetId": "1027",
    "symbol": "ahUSDT",
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
            "GeneralIndex": 1984
          }
        ]
      }
    },
    "existentialDeposit": "1",
    "isFeeAsset": true
  },
  {
    "assetId": "1026",
    "symbol": "KTON",
    "decimals": 18,
    "existentialDeposit": "1"
  },
  {
    "assetId": "1028",
    "symbol": "ahPINK",
    "decimals": 10,
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
            "GeneralIndex": 23
          }
        ]
      }
    },
    "existentialDeposit": "1"
  },
  {
    "assetId": "1029",
    "symbol": "DOT",
    "decimals": 10,
    "location": {
      "parents": 1,
      "interior": {
        "Here": null
      }
    },
    "existentialDeposit": "1",
    "isFeeAsset": true
  }
]
```

</details>

## Query all asset symbols
Function returns string array of all asset symbols for a specific Parachain. (native and foreign assets are merged into a single array)
```ts
getAllAssetsSymbols(CHAIN)
```

**Example output:**

```json
[
  "BNC",
  "vBNC",
  "IBTC",
  "MANTA",
  "WETH",
  "DOT",
  "USDT",
  "USDC",
  "DED",
  "PINK",
  "GLMR",
  "vGLMR",
  "BNCS",
  "vMANTA",
  "PEN",
  "vASTR",
  "vDOT",
  "INTR",
  "ETH",
  "vFIL",
  "FIL",
  "ASTR",
  "vsDOT"
]
```

## Query asset support I
The function checks if Parachain supports a particular asset. (Both native and foreign assets are searched). Returns boolean.
```ts
hasSupportForAsset(CHAIN, ASSET_SYMBOL)
```

**Example output:**

```json
true
```

## Query asset support II
The function checks if Parachain supports a particular asset. Returns asset object or null. Destination parameter is optional and should be set to Ethereum when using snowbridge assets.

```ts
findAssetInfo(CHAIN, CURRENCY, DESTINATION?)
```

**Example output:**

```json
{
  "assetId": "1000771",
  "symbol": "KSM",
  "decimals": 12,
  "existentialDeposit": "313283208",
  "location": {
    "parents": 2,
    "interior": {
      "X1": [
        {
          "GlobalConsensus": {
            "kusama": null
          }
        }
      ]
    }
  },
  "isFeeAsset": true
}
```


## Query asset support III
The function checks if Parachain supports a particular asset. Returns asset object or error. Destination parameter is optional and should be set to Ethereum when using snowbridge assets.

```ts
findAssetInfoOrThrow(CHAIN, CURRENCY, DESTINATION?)
```

**Example output:**

```json
{
  "assetId": "1000771",
  "symbol": "KSM",
  "decimals": 12,
  "existentialDeposit": "313283208",
  "location": {
    "parents": 2,
    "interior": {
      "X1": [
        {
          "GlobalConsensus": {
            "kusama": null
          }
        }
      ]
    }
  },
  "isFeeAsset": true
}
```


## Query asset decimals
The function returns decimals for a specific asset
```ts
getAssetDecimals(CHAIN, ASSET_SYMBOL)
```

**Example output:**

```json
12
```

## Query Parachain ID
The function returns specific Parachain id
```ts
getParaId(CHAIN)
```

**Example output:**

```json
2000
```

## Query Parachain name
Function to get specific TChain from Parachain id
```ts
getTChain(paraID: number, ecosystem: 'Polkadot' | 'Kusama' | 'Passeo' | 'Westend' | 'Ethereum') // When Ethereum ecosystem is selected please fill CHAINID as 1 to select Ethereum.
```

**Example output:**

```json
"Astar"
```

## Import Chains as types
There are 5 options for types you can choose based on your prefference
```ts
// Export all Parachains
console.log(TParachain)

// Export all Relay chains
console.log(TRelaychain)

// Export all Substrate chains (Parachains + Relays)
console.log(TSubstrateChain)

// Export chains outside Polkadot ecosystem (Ethereum)
console.log(TExternalChain)

// Export all chains implemented in ParaSpell
console.log(TChain)
```

## Import Chains as constants
There are 5 options for constants you can choose based on your prefference
```ts
// Export all Parachains
console.log(PARACHAINS)

// Export all Relay chains
console.log(RELAYCHAINS)

// Export all Substrate chains (Parachains + Relays)
console.log(SUBSTRATE_CHAINS)

// Export chains outside Polkadot ecosystem (Ethereum)
console.log(EXTERNAL_CHAINS)

// Export all chains implemented in ParaSpell
console.log(CHAINS)
```