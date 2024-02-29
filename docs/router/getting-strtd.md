# Getting started with SpellRouter☄️
##### Step 1. Install peer dependencies
```sh
# npm
npm install @polkadot/api @polkadot/types @polkadot/api-base @polkadot/apps-config @polkadot/util
```
```sh
# yarn
yarn add @polkadot/api @polkadot/types @polkadot/api-base @polkadot/apps-config @polkadot/util
```
```sh
#pnpm
pnpm install @polkadot/api @polkadot/types @polkadot/api-base @polkadot/apps-config @polkadot/util
```

##### Step 2. Install XCM Router package (depending on your package manager of choice):
```sh
# npm
npm install @paraspell/xcm-router
```
```sh
# yarn
yarn add @paraspell/xcm-router
```
```sh
# pnpm
pnpm install @paraspell/xcm-router
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


