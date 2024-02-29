# Getting started

#### Since version 1.0.0
Our SDK introduced all Polkadot libraries as peer dependencies. The reason for this is, that most of the projects use these libraries in some way already and it fixes issues with unmet dependency warnings. Make sure your project has them. You can install them by the following command:

##### Install dependencies
```sh
# npm
npm install @polkadot/api @polkadot/types @polkadot/api-base @polkadot/apps-config @polkadot/util
```
```sh
# yarn
yarn add @polkadot/api @polkadot/types @polkadot/api-base @polkadot/apps-config @polkadot/util
```
```sh
# pnpm
pnpm install @polkadot/api @polkadot/types @polkadot/api-base @polkadot/apps-config @polkadot/util
```

**To get started install the following package (depending on your package manager of choice):**
```sh
# npm
npm install @paraspell/sdk
```
```sh
# yarn
yarn add @paraspell/sdk
```
```sh
# pnpm
pnpm install @paraspell/sdk
```

## Importing package
After installing the package there are two ways of importing it:

### 1. Builder pattern - in case you plan to use XCM & XCMP functionality only
This way allows you to enhance builder patterns and construct your calls in a simple way.
```js
import { Builder } from '@paraspell/sdk'
```

### 2. Classic pattern and Asset pallet functionality
```js
// ESM
import * as paraspell from '@paraspell/sdk'
```
```js
// CommonJS
const { } = require('@paraspell/sdk')
```

