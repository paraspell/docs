# Getting started with SpellRouter☄️
This guide guides you through implementation of XCM Router that allows you to do various exciting actions on Polkadot and Kusama chains.

## Starter template 🛫
Don't want to go through setup and build from ground up? 
- Our team has created a [XCM Router Starter template](https://github.com/paraspell/xcm-router-template) for you! 

This template is programmed with React & Vite framework. It contains basic components ready to set you off on your cross-chain dApp journey.

## Install peer dependencies

```
⚠️ NOTE
Enabling Wasm is required by Hydration SDK in order for XCM-Router to work in your dAPP. You can either enable it in web app config or by plugin.
Hydration also requires augment package - https://github.com/galacticcouncil/sdk/issues/114

⚠️⚠️ NOTE
XCM Router is now migrated towards PAPI library! To migrate you just need to replace old PJS injector with PAPI signer and install new peer dependency. Explore docs to find out more.
```

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


