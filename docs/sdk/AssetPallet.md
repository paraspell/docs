# Asset pallet
This pallet serves to retrieve asset data from compatible Parachains. Users can retrieve details like `asset decimals`, `registered assets on particular Parachain`, `check if the asset is registered on Parachain` and more.

## New video guide for this section:
[
![assetPallet](https://user-images.githubusercontent.com/55763425/238154687-c506cd39-887d-4135-8144-eca64f17e6ed.png)
](https://youtu.be/jjGbXXqtElk)

## Retrieve assets object for a specific Parachain
This function returns `assets object` from `assets.json` for `particular Parachain` including information about `native` and `foreign` assets.
```js
paraspell.assets.getAssetsObject('Acala')
```

## Retrieve asset ID for particular Parachain and asset
This function returns `assetId` for `particular Parachain` and `asset symbol`
```js
paraspell.assets.getAssetId('Acala', 'tDOT')
```
## Retrieve the Relay chain asset Symbol for a particular Parachain
This function returns the `symbol` of the Relay chain for a particular Parachain. Either "DOT" or "KSM"
```js
paraspell.assets.getRelayChainSymbol('Basilisk')
```
## Retrieve native assets for a particular Parachain
This function returns a string array of `native` assets symbols for a particular Parachain
```js
paraspell.assets.getNativeAssets('Acala')
```
## Retrieve foreign assets for a particular Parachain
This function returns an object array of foreign assets for a particular Parachain. Each object has a symbol and assetId property
```js
paraspell.assets.getOtherAssets('Acala')
```
## Retrieve all asset symbols for particular Parachain
Function returns string array of all asset symbols for a specific Parachain. (native and foreign assets are merged into a single array)
```js
paraspell.assets.getAllAssetsSymbols('Acala')
```
## Retrieve support for a particular asset on a particular Parachain
The function checks if Parachain supports a particular asset. (Both native and foreign assets are searched). Returns boolean
```js
paraspell.assets.hasSupportForAsset(node: TNode, symbol: string)
```
## Retrieve decimals of a particular asset for a particular Parachain
The function returns decimals for a specific asset
```js
paraspell.assets.getAssetDecimals('Basilisk', 'KSM')
```
## Retrieve Parachain ID for a particular Parachain
The function returns specific Parachain id
```js
paraspell.assets.getParaId('Basilisk')
```

## Retrieve Parachain name from Parachain ID
Function to get specific TNode from Parachain id
```js
paraspell.assets.getTNode(nodeID: number)
```

## Import SDK compatible Parachains as constant
Import all compatible Parachains as constant
```js
paraspell.NODE_NAMES
```