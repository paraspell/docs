# Getting started with SpellRouter☄️
This guide guides you through implementation of XCM Router that allows you to do various exciting actions on Polkadot and Kusama chains.

## Starter template
Don't want to go through setup and build from ground up? 
- Our team has created a [XCM Router Starter template](https://github.com/paraspell/xcm-router-template) for you! 

This template is programmed with React & Vite framework. It contains basic components ready to set you off on your cross-chain dApp journey.

## Install peer dependencies
```sh
# npm
yarn add || pnpm | npm install @polkadot/api @polkadot/types @polkadot/api-base @polkadot/apps-config @polkadot/util
```

## Install XCM Router package
```sh
# npm
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

//As Polkadot moves to ESM only, our Router also moves to ESM only. CJS is not supported anymore.
```


