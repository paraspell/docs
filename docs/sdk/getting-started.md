# Getting started with your journey accross Paraverse 👨‍🚀

This guide guides you through implementation of XCM SDK that allows you to do various exciting actions on Polkadot and Kusama chains. To start proceed with steps mentioned below. Good luck adventurer!

## Starter template 🛫
Don't want to go through setup and build from ground up? 
- Our team has created a [XCM SDK Starter template](https://github.com/paraspell/xcm-sdk-template) for you! 

This template is programmed with React & Vite framework. It contains basic components ready to set you off on your cross-chain dApp journey.

## Install Dependencies

Install peer dependencies according to the API package you choose.

ParaSpell XCM SDK is the 🥇 first in the ecosystem to support **PolkadotJS**, **Polkadot API** and **Dedot**.

**Choose your package manager:**

<PackageManagerSwitch />

### Polkadot API (PAPI) Peer Dependencies

<InstallCommand pkg="polkadot-api" />

---

### PolkadotJS (PJS) Peer Dependencies

<InstallCommand :pkg="[
  '@polkadot/api',
  '@polkadot/types',
  '@polkadot/api-base',
  '@polkadot/util',
  '@polkadot/util-crypto'
]" />

### Dedot Peer Dependencies

<InstallCommand :pkg="[
  'dedot',
  '@polkadot/keyring',
]" />


## Install XCM SDK package
XCM SDK supports three different Javascript client providers. It is advised to use PAPI JS provider or Dedot JS provider, but in case your project heavily relies on Polkadot JS you can also install PJS SDK version. Please note, that PJS and Dedot version does not have Swap functionality yet.

### Polkadot API (PAPI) client version
**BEWARE: SDK uses PAPI V2 since 13.2.0 onwards!**

<InstallCommand pkg="@paraspell/sdk" />

### PolkadotJS (PJS) client version

<InstallCommand pkg="@paraspell/sdk-pjs" />

### Dedot client version

<InstallCommand pkg="@paraspell/sdk-dedot" />

## Install swap extension
If you plan to [do Swap XCMs](https://paraspell.github.io/docs/sdk/xcmPallet.html#swap) you can install Swap package which allows you to do cross-chain swaps on popular Polkadot, Kusama, Paseo, Westend exchanges. Now available in **ALL** versions of SDK.

> [!IMPORTANT]
> - ⚠️  **WebAssembly (Wasm) must be enabled in your project** because of the Hydration SDK (One of the exchanges implemented in XCM Router). Wasm can be enabled either through the web application configuration or through the appropriate plugin. 
>
> - ⚠️ Additionally, Hydration requires the use of the **augment package** (see: https://github.com/galacticcouncil/sdk/issues/114).

<InstallCommand pkg="@paraspell/swap @galacticcouncil/api-augment" />

### Setup Swap extension

Add the `@paraspell/swap` import to your application's root component (Usually `App.tsx`). This ensures the extension is registered before using Builder.

```ts
// Import swap extension here
import '@paraspell/swap';

export default function App() {
  return {/* Your app here */};
}
```

## Import SDK functionality
There are two ways to import package to your project. Importing builder or classic import.

### Named import
Named import is restricted for sending XCM messages and using transfer info.
```js
// Polkadot API version
import { Builder } from '@paraspell/sdk'

// Polkadot JS version
import { Builder } from '@paraspell/sdk-pjs'

// Dedot version
import { Builder } from '@paraspell/sdk-dedot'
```

### Default import
Default import allows you to use every functionality XCM SDK offers.
```js
// ESM PAPI
import * as paraspell from '@paraspell/sdk'
// ESM PJS
import * as paraspell from '@paraspell/sdk-pjs'
// ESM DEDOT
import * as paraspell from '@paraspell/sdk-dedot'
```