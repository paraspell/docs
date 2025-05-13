# Getting started with your journey accross Paraverse 👨‍🚀

This guide guides you through implementation of XCM SDK that allows you to do various exciting actions on Polkadot and Kusama chains. To start proceed with steps mentioned below. Good luck adventurer!

## Starter template 🛫
Don't want to go through setup and build from ground up? 
- Our team has created a [XCM SDK Starter template](https://github.com/paraspell/xcm-sdk-template) for you! 

This template is programmed with React & Vite framework. It contains basic components ready to set you off on your cross-chain dApp journey.

## Install dependencies
Install peer dependencies according to the choice of API package. 

ParaSpell XCM SDK is the 🥇 in the ecosystem to support both **PolkadotJS** and **PolkadotAPI**.

```bash
#Choose a package and install its dependencies below. Only install dependencies for SDK Version you wish to use (Either PAPI or PJS)

#Polkadot API peer dependencies
pnpm | npm install || yarn add polkadot-api

#PolkadotJS peer dependencies
pnpm | npm install || yarn add @polkadot/api @polkadot/types @polkadot/api-base @polkadot/util @polkadot/util-crypto
```

## Install XCM SDK package
Choose your package provider and proceed to install XCM SDK to your project.
```sh
#PolkadotAPI Version
yarn add || pnpm | npm install @paraspell/sdk

#PolkadotJS Version
yarn add || pnpm | npm install @paraspell/sdk-pjs
```

## Import package
There are two ways to import package to your project. Importing builder or classic import.

### Builder import
Builder import is restricted for sending XCM messages and using transfer info.
```js
// Polkadot API version
import { Builder } from '@paraspell/sdk'

// Polkadot JS version
import { Builder } from '@paraspell/sdk-pjs'
```

### Classic import
Classic import allows you to use every functionality XCM SDK offers.
```js
// ESM PAPI
import * as paraspell from '@paraspell/sdk'
// ESM PJS
import * as paraspell from '@paraspell/sdk-pjs'

// CommonJS PAPI
const paraspell = require('@paraspell/sdk')
// CommonJS PJS
const paraspell = require('@paraspell/sdk-pjs')
```

Interaction with further asset symbol abstraction:
```js 
//Only needed when advanced asset symbol selection is used. PAPI version.
import { Native, Foreign, ForeignAbstract } from '@paraspell/sdk'; 

//Only needed when advanced asset symbol selection is used. PJS version.
import { Native, Foreign, ForeignAbstract } from '@paraspell/sdk-pjs'; 
```