# Query which XCM pallet Parachain uses 📦

This functionality allows developers to query the `XCM pallets` that Parachains currently support. 

## Import functionality

To use this functionality you first have to import it in the following way.
```ts
//PAPI
import { getDefaultPallet, getSupportedPallets, getPalletIndex, SUPPORTED_PALLETS, getNativeAssetsPallet, getOtherAssetsPallets } from  '@paraspell/sdk'
//PJS
import { getDefaultPallet, getSupportedPallets, getPalletIndex, SUPPORTED_PALLETS, getNativeAssetsPallet, getOtherAssetsPallets } from  '@paraspell/sdk-pjs'
```

```ts
//Standalone pallet package
yarn add || pnpm | npm install @paraspell/pallets

import { getDefaultPallet, getSupportedPallets, getPalletIndex, SUPPORTED_PALLETS, getNativeAssetsPallet, getOtherAssetsPallets } from  '@paraspell/pallets'
```

## Get default XCM pallet

The function returns the default XCM pallet for selected compatible Parachain.
```ts
getDefaultPallet(CHAIN)
```

**Example output:**

```json
"XTokens"
```

## Get all supported XCM pallets

The function returns all supported XCM pallets for selected compatible Parachain.
```ts
getSupportedPallets(CHAIN)
```

**Example output:**

```json
[
  "PolkadotXcm",
  "XTokens"
]
```

### Get index of XCM Pallet

The function returns all index of XCM Pallet for selected Parachain.
```ts
getPalletIndex(CHAIN)
```

**Example output:**

```json
54
```

## Print all supported XCM pallets

This returns all supported XCM pallets supported by compatible Parachains as constant.
```ts
console.log(SUPPORTED_PALLETS)
```

## Print local pallets for native assets

Following function returns all pallets for local transfers of native assets for specific chain.
```ts
getNativeAssetsPallet(chain: TChain)
```

## Print local pallets for foreign assets

Following function returns all pallets for local transfers of foreign assets for specific chain.
```ts
getOtherAssetsPallets(chain: TChain)
```