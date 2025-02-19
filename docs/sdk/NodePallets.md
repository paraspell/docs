# Query which XCM pallet Parachain uses 📦

This functionality allows developers to query the `XCM pallets` that Parachains currently support. 

## Import functionality

To use this functionality you first have to import it in the following way.
```ts
//PAPI
import { getDefaultPallet, getSupportedPallets, SUPPORTED_PALLETS } from  '@paraspell/sdk'
//PJS
import { getDefaultPallet, getSupportedPallets, SUPPORTED_PALLETS } from  '@paraspell/sdk-pjs'
```

## Get default XCM pallet

The function returns the default XCM pallet for selected compatible Parachain.
```ts
getDefaultPallet(node: TNode)
```

## Get all supported XCM pallets

The function returns all supported XCM pallets for selected compatible Parachain.
```ts
getSupportedPallets(node: TNode)
```

## Print all supported XCM pallets

This returns all supported XCM pallets supported by compatible Parachains as constant.
```ts
console.log(SUPPORTED_PALLETS)
```