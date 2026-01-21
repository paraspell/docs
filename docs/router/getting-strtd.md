# Getting started with SpellRouter☄️
This guide guides you through implementation of XCM Router that allows you to do various exciting actions on Polkadot and Kusama chains.

## Starter template 🛫
Don't want to go through setup and build from ground up? 
- Our team has created a [XCM Router Starter template](https://github.com/paraspell/xcm-router-template) for you! 

This template is programmed with React & Vite framework. It contains basic components ready to set you off on your cross-chain dApp journey.

## Install peer dependencies

> [!IMPORTANT]
> - ⚠️  **WebAssembly (Wasm) must be enabled in your project** because of the Hydration SDK (One of the exchanges implemented in XCM Router). Wasm can be enabled either through the web application configuration or through the appropriate plugin. Additionally, Hydration requires the use of the **augment package** (see: https://github.com/galacticcouncil/sdk/issues/114).
>
> - ⚠️  **XCM Router has been migrated to the PAPI library.** If you used XCM Router prior to migration, replace the legacy Polkadot.js (PJS) injector with the PAPI signer and install the newly required peer dependency. Follow the setup guide for more information.

```sh
yarn add || pnpm | npm install polkadot-api
```

## Install XCM Router package
```sh
yarn add || pnpm | npm install @paraspell/xcm-router
```

## Importing package
After installing the XCM-Router package there are two ways of importing it:

### Option 1: Builder pattern 

This way allows you to enhance builder patterns and construct your calls in a simple way.

```js
import { RouterBuilder } from '@paraspell/xcm-router'
```

### Option 2: Classic pattern

```js
// ESM
import * as xcmRouter from '@paraspell/xcm-router'

//Multiple import options
import { transfer, 
         TransactionType, 
         TTransferOptions, 
         TTxProgressInfo } from '@paraspell/xcm-router'
```


