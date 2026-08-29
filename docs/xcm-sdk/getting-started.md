# Getting started with your journey across Paraverse 👨‍🚀

This guide walks you through the implementation of XCM SDK, which allows you to do various exciting actions on Polkadot and Kusama chains. To start, proceed with the steps mentioned below. Good luck adventurer!

## Install XCM SDK and its dependencies

XCM SDK supports three different JavaScript client providers. It is advised to use the PAPI JS provider or the Dedot JS provider, but in case your project heavily relies on Polkadot JS, you can also install the PJS SDK version.


**Choose your package manager:**

<PackageManagerSwitch />

### Polkadot API (PAPI) version of SDK and Peer Dependencies
**Note: SDK uses PAPI V2 since 13.2.2 and descriptors since 14.0.0 onwards.**


<InstallCommand :pkg="['@paraspell/sdk','polkadot-api', '@paraspell/descriptors']" />

---

### PolkadotJS (PJS) version of SDK and Peer Dependencies

<InstallCommand :pkg="[
  '@paraspell/sdk-pjs',
  '@polkadot/api',
  '@polkadot/types',
  '@polkadot/api-base',
  '@polkadot/util',
  '@polkadot/util-crypto'
]" />

### Dedot version of SDK and Peer Dependencies

<InstallCommand :pkg="[
  '@paraspell/sdk-dedot',
  'dedot',
  '@polkadot/keyring',
]" />

## Install Swap extension
If you plan to [do Swap XCMs](https://paraspell.github.io/docs/xcm-sdk/send-xcm.html#swap), you can install the Swap package, which allows you to do cross-chain swaps on popular Polkadot, Kusama, Paseo, and Westend exchanges. Available in **all** versions of SDK.

> [!IMPORTANT]
> - ⚠️  **WebAssembly (Wasm) must be enabled in your project** because of the Hydration SDK (One of the exchanges implemented in XCM Router). Wasm can be enabled either through the web application configuration or through the appropriate plugin. 
>
> - ⚠️ Additionally, Hydration requires the use of the **augment package** (see: https://github.com/galacticcouncil/sdk/issues/114).

<InstallCommand pkg="@paraspell/swap @galacticcouncil/api-augment" />

### Setup Swap extension

Add the `@paraspell/swap` import to your application's root component (usually `App.tsx`). This ensures the extension is registered before using Builder.

```ts
// Import swap extension here
import '@paraspell/swap';

export default function App() {
  return {/* Your app here */};
}
```

## Install EVM extension
If you plan to do EVM contract transfers, you can install the EVM package, which allows you to interact with EVM contract-based XCMs on Darwinia. Available in **all** versions of SDK.

<InstallCommand pkg="@paraspell/evm" />

### Setup EVM extension

Add the `@paraspell/evm` import to your application's root component (usually `App.tsx`). This ensures the extension is registered before using Builder.

```ts
// Import EVM extension here
import '@paraspell/evm';

export default function App() {
  return {/* Your app here */};
}
```

## Install Snowbridge extension
If you plan to [do Snowbridge transfers from Ethereum](https://paraspell.github.io/docs/xcm-sdk/send-xcm.html#ethereum-polkadot-transfer), you can install the Snowbridge package, which allows you to input "Ethereum" as the from chain parameter. Available in **all** versions of SDK.

<InstallCommand pkg="@paraspell/evm-snowbridge" />

### Setup Snowbridge extension

Add the `@paraspell/evm-snowbridge` import to your application's root component (usually `App.tsx`). This ensures the extension is registered before using Builder.

```ts
// Import Snowbridge extension here
import '@paraspell/evm-snowbridge';

export default function App() {
  return {/* Your app here */};
}
```

## Import SDK functionality
There are two ways to import the package into your project: importing the builder or using the classic import.

### Named import
Named import is restricted to sending XCM messages and using transfer info.
```js
// Polkadot API version
import { Builder } from '@paraspell/sdk'

// Polkadot JS version
import { Builder } from '@paraspell/sdk-pjs'

// Dedot version
import { Builder } from '@paraspell/sdk-dedot'
```

### Default import
Default import allows you to use all the functionality XCM SDK offers.
```js
// ESM PAPI
import * as paraspell from '@paraspell/sdk'
// ESM PJS
import * as paraspell from '@paraspell/sdk-pjs'
// ESM DEDOT
import * as paraspell from '@paraspell/sdk-dedot'
```