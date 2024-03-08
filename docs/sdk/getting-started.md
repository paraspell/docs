# Getting started with your journey accross Paraverse 👨‍🚀

This guide guides you through implementation of XCM SDK that allows you to do various exciting actions on Polkadot and Kusama chains. To start proceed with steps mentioned below. Good luck adventurer!

## Install dependencies
Choose your package provider and proceed to install dependencies to your project.
```sh
yarn add || pnpm | npm install @polkadot/api @polkadot/types @polkadot/api-base @polkadot/apps-config @polkadot/util
```

## Install XCM SDK package
Choose your package provider and proceed to install XCM SDK to your project.
```sh
yarn add || pnpm | npm install @paraspell/sdk
```

## Import package
There are two ways to import package to your project. Importing builder or classic import.

### Builder import
Builder import is restricted for sending XCM messages and opening HRMP channels.
```js
import { Builder } from '@paraspell/sdk'
```

### Classic import
Classic import allows you to use every functionality XCM SDK offers.
```js
// ESM
import * as paraspell from '@paraspell/sdk'

// CommonJS
const { } = require('@paraspell/sdk')
```

