# Query which XCM pallet Parachain uses 📦

This functionality allows developers to query the `XCM pallets` that Parachains currently support. 

## Getting Started

You have two options for using presented functionality. Either you install it as standalone package or you can use it by directly importing it from XCM SDK (If you have it installed already).

### Standalone Pallet Package
You do not need to have XCM SDK installed for following functionality. You can also install it as standalone and use it separately. Good approach for vanilla projects.

**Choose your package manager:**

<PackageManagerSwitch />

<InstallCommand pkg="@paraspell/pallets" />

**Import all of the functionality:**

```ts
import {
  getDefaultPallet,
  getSupportedPallets,
  getPalletIndex,
  SUPPORTED_PALLETS,
  getNativeAssetsPallet,
  getOtherAssetsPallets
} from '@paraspell/pallets'
```

### Already using XCM SDK

The pallet package is included with the XCM SDK. If you already have the XCM SDK installed, you can directly import the functionality:

<ApiVersionSwitch />

<ImportBlock />


## Get default XCM pallet

The function returns the default XCM pallet for selected compatible Parachain. Function uses [TChain](https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types) types.
```ts
getDefaultPallet(chain: TChain)
```

**Example output:**

```json
"XTokens"
```

## Get all supported XCM pallets

The function returns all supported XCM pallets for selected compatible Parachain. Function uses [TChain](https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types) types.
```ts
getSupportedPallets(chain: TChain)
```

**Example output:**

```json
[
  "PolkadotXcm",
  "XTokens"
]
```

### Get index of XCM Pallet

The function returns all index of XCM Pallet for selected Parachain. Function uses [TChain](https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types) types.
```ts
getPalletIndex(chain: TChain)
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

Following function returns all pallets for local transfers of native assets for specific chain. Function uses [TChain](https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types) types.
```ts
getNativeAssetsPallet(chain: TChain)
```

## Print local pallets for foreign assets

Following function returns all pallets for local transfers of foreign assets for specific chain. Function uses [TChain](https://paraspell.github.io/docs/sdk/AssetPallet.html#import-chains-as-types) types.
```ts
getOtherAssetsPallets(chain: TChain)
```