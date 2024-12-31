# Asset 💰 query operations for your front-end
This functionality serves to retrieve asset data from compatible Parachains. Users can retrieve details like `asset decimals`, `registered assets on particular Parachain`, `check if the asset is registered on Parachain` and more.

### Video guide for this section:
[
![assetPallet](https://user-images.githubusercontent.com/55763425/238154687-c506cd39-887d-4135-8144-eca64f17e6ed.png)
](https://youtu.be/jjGbXXqtElk)

## Query assets object
This function returns `assets object` from `assets.json` for `particular Parachain` including information about `native` and `foreign` assets.
```js
paraspell.assets.getAssetsObject('Acala')
```

## Query asset ID
This function returns `assetId` for `particular Parachain` and `asset symbol`
```js
paraspell.assets.getAssetId('Acala', 'DOT')
```
## Query Relay chain asset symbol
This function returns the `symbol` of the Relay chain for a particular Parachain. Either "DOT" or "KSM"
```js
paraspell.assets.getRelayChainSymbol('Basilisk')
```
## Query native assets
This function returns a string array of `native` assets symbols for a particular Parachain
```js
paraspell.assets.getNativeAssets('Acala')
```
## Query foreign assets
This function returns an object array of foreign assets for a particular Parachain. Each object has a symbol and assetId property
```js
paraspell.assets.getOtherAssets('Acala')
```
## Query all asset symbols
Function returns string array of all asset symbols for a specific Parachain. (native and foreign assets are merged into a single array)
```js
paraspell.assets.getAllAssetsSymbols('Acala')
```
## Query asset support
The function checks if Parachain supports a particular asset. (Both native and foreign assets are searched). Returns boolean
```js
paraspell.assets.hasSupportForAsset(node: TNode, symbol: string)
```
## Query asset decimals
The function returns decimals for a specific asset
```js
paraspell.assets.getAssetDecimals('Basilisk', 'KSM')
```
## Query Parachain ID
The function returns specific Parachain id
```js
paraspell.assets.getParaId('Basilisk')
```

## Query Parachain name
Function to get specific TNode from Parachain id
```js
paraspell.assets.getTNode(nodeID: number)
```

## Import Parachains as constant
Import all compatible Parachains as constant
```js
paraspell.NODE_NAMES
```