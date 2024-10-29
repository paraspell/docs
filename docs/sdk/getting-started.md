# Getting started with your journey accross Paraverse 👨‍🚀

This guide guides you through implementation of XCM SDK that allows you to do various exciting actions on Polkadot and Kusama chains. To start proceed with steps mentioned below. Good luck adventurer!

## Starter template
Don't want to go through setup and build from ground up? 
- Our team has created a [XCM SDK Starter template](https://github.com/paraspell/xcm-sdk-template) for you! 

This template is programmed with React & Vite framework. It contains basic components ready to set you off on your cross-chain dApp journey.

## Install dependencies
Install peer dependencies according to the choice of API package. 

ParaSpell XCM SDK is the 🥇 in the ecosystem to support both **PolkadotJS** and **PolkadotAPI**.


```
NOTE: Make sure to set PeerDependencyInstall flag to false on your package manager (Because it will install both API packages instead of just one)
For example on PNPM: `pnpm config set auto-install-peers false`
```

```bash
#NOTE: apps-config will soon be removed entirely from the peer dependency list

#Choose a package and install its dependencies below (SDK is built in a way, that only one library has to be installed)

#Polkadot API peer dependencies
pnpm | npm install || yarn add polkadot-api @polkadot/apps-config

#PolkadotJS peer dependencies
pnpm | npm install || yarn add @polkadot/api @polkadot/types @polkadot/api-base @polkadot/apps-config @polkadot/util
```

## Install XCM SDK package
Choose your package provider and proceed to install XCM SDK to your project.
```sh
yarn add || pnpm | npm install @paraspell/sdk
```

## Import package
There are two ways to import package to your project. Importing builder or classic import.

### Builder import
Builder import is restricted for sending XCM messages and using transfer info.
```js
// Polkadot API version
import { Builder } from '@paraspell/sdk/papi'

// Polkadot JS version
import { Builder } from '@paraspell/sdk'
```

### Classic import
Classic import allows you to use every functionality XCM SDK offers.
```js
// ESM PAPI
import * as paraspell from '@paraspell/sdk/papi'
// ESM PJS
import * as paraspell from '@paraspell/sdk'

// CommonJS PAPI
const paraspell = require('@paraspell/sdk/papi')

// CommonJS PJS
const paraspell = require('@paraspell/sdk')
```
