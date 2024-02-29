# Parachain pallets

This functionality allows developers to query the `XCM pallets` that Parachains currently support. 

## New video guide for this section:
[
![xcmPallets](https://user-images.githubusercontent.com/55763425/238154722-aedb5798-0cfe-4f0d-875c-dea5c60373eb.png)
](https://youtu.be/oE1JttYN1zY)

## Importing functionality

To use this functionality you first have to import it in the following way.
```js
import { getDefaultPallet, getSupportedPallets, SUPPORTED_PALLETS } from '@paraspell/sdk'
```

## Return default pallet for specific Parachain

The function returns the default XCM pallet for selected compatible Parachain.
```js
getDefaultPallet(node: TNode)
```

## Return an array of supported pallets for specific Parachain

The function returns all supported XCM pallets for selected compatible Parachain.
```js
getSupportedPallets(node: TNode)
```

## Print all pallets that are currently supported

This returns all supported XCM pallets supported by compatible Parachains as constant.
```js
console.log(SUPPORTED_PALLETS)
```