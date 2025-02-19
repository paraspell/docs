# Asset 💰 query operations for your front-end
This functionality serves to retrieve asset data from compatible Parachains. Users can retrieve details like `asset decimals`, `registered assets on particular Parachain`, `check if the asset is registered on Parachain` and more.

## Query assets object
This function returns `assets object` from `assets.json` for `particular Parachain` including information about `native` and `foreign` assets.
```ts
paraspell.assets.getAssetsObject('Acala')
```

## Query asset ID
This function returns `assetId` for `particular Parachain` and `asset symbol`
```ts
paraspell.assets.getAssetId('Acala', 'DOT')
```
## Query Relay chain asset symbol
This function returns the `symbol` of the Relay chain for a particular Parachain. Either "DOT" or "KSM"
```ts
paraspell.assets.getRelayChainSymbol('Basilisk')
```
## Query native assets
This function returns a string array of `native` assets symbols for a particular Parachain
```ts
paraspell.assets.getNativeAssets('Acala')
```
## Query foreign assets
This function returns an object array of foreign assets for a particular Parachain. Each object has a symbol and assetId property
```ts
paraspell.assets.getOtherAssets('Acala')
```
## Query all asset symbols
Function returns string array of all asset symbols for a specific Parachain. (native and foreign assets are merged into a single array)
```ts
paraspell.assets.getAllAssetsSymbols('Acala')
```
## Query asset support
The function checks if Parachain supports a particular asset. (Both native and foreign assets are searched). Returns boolean
```ts
paraspell.assets.hasSupportForAsset(node: TNode, symbol: string)
```
## Query asset decimals
The function returns decimals for a specific asset
```ts
paraspell.assets.getAssetDecimals('Basilisk', 'KSM')
```
## Query Parachain ID
The function returns specific Parachain id
```ts
paraspell.assets.getParaId('Basilisk')
```

## Query Parachain name
Function to get specific TNode from Parachain id
```ts
paraspell.assets.getTNode(nodeID: number, ecosystem: 'polkadot' || 'kusama' || 'ethereum') //When Ethereum ecosystem is selected please fill nodeID as 1 to select Ethereum.
```

## Import Parachains as constant
Import all compatible Parachains as constant
```ts
paraspell.NODE_NAMES
```

## Convert id or symbol to multilocation
Get multilocation for asset id or symbol.
```ts
getAssetMultiLocation(chainFrom, { symbol: symbol } | { id: assetId })
```