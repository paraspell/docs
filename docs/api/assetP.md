# Asset pallet
This pallet serves to retrieve asset data from compatible Parachains. Users can retrieve details like `asset decimals`, `registered assets on particular Parachain`, `check if the asset is registered on Parachain` and more.

### Package-less implementation of XCM API Asset features into your application

```JS
const response = await fetch(
    "http://localhost:3001/assets/<action>" + //Replace "action" with your desired action eg. "Acala/native" 
);

console.log(response) //use response data as necessary
```

This snippet should work on most javascript/typescript frameworks as it is a standard HTTP request.


## Retrieve assets object for a specific Parachain
The following endpoint retrieves all assets on a specific Parachain as an object.

**Endpoint**: `GET /assets/:node`


   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/Statemint");
```

## Retrieve asset ID for particular Parachain and asset
The following endpoint returns the asset id for the specific asset on a specific Parachain.

**Endpoint**: `GET /assets/:node/id?symbol=:symbol`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.
     - `symbol` (path parameter): Specifies the currency symbol of the asset.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `404` (Bad request): When an asset with a specified currency symbol does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/Interlay/id?symbol=USDT");
```

## Retrieve the Relay chain asset Symbol for a particular Parachain
The following endpoint returns the Relay chain asset symbol for a specific Parachain.

**Endpoint**: `GET /assets/:node/relay-chain-symbol`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.
    
   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/Astar/relay-chain-symbol");
```

## Retrieve native assets for a particular Parachain
The following endpoint returns native assets of specific Parachain.

**Endpoint**: `GET /assets/:node/native`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/Kylin/native");
```

## Retrieve foreign assets for a particular Parachain
The following endpoint returns foreign assets of specific Parachain.

**Endpoint**: `GET /assets/:node/other`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/Statemine/other");
```

## Retrieve all asset symbols for particular Parachain
The following endpoint returns all asset symbols for specific Parachain.

**Endpoint**: `GET /assets/:node/all-symbols`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/Moonbeam/all-symbols");
```

## Retrieve support for a particular asset on a particular Parachain
The following endpoint returns a boolean value that confirms if the asset is registered on a specific Parachain or not.

**Endpoint**: `GET /assets/:node/has-support?symbol=:symbol`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.
     - `symbol` (path parameter): Specifies the symbol of the asset.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `404` (Bad request): When an asset with a specified currency symbol does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/HydraDX/has-support?symbol=DOT");
```


## Retrieve decimals for a particular asset for a particular Parachain
The following endpoint retrieves specific asset decimals on specific Parachain.

**Endpoint**: `GET /assets/:node/decimals?symbol=:symbol`

- **Parameters**:
    - `node` (path parameter): Specifies the name of the Parachain.
    - `symbol` (path parameter): Specifies the currency symbol.

- **Errors**:
    - `400` (Bad request): When a specified Parachain does not exist.
    - `404` (Bad request): When an asset with a specified currency symbol does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/Basilisk/decimals?symbol=BSX");
```

## Retrieve Parachain ID for a particular Parachain
The following endpoint retrieves Parachain's ID from Parachain's name

 **Endpoint**: `GET /assets/:node/para-id`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.
   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/Acala/para-id");
```

## Retrieve Parachain name from Parachain ID
The following endpoint retrieves the Parachain's name from the Parachain's ID.

**Endpoint**: `GET /assets/:paraId`

- **Parameters**:
    - `paraId` (path parameter): Specifies the parachain ID.

- **Errors**:
    - `404` (Bad request): When a Parachain with a specified Parachain ID does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/2090");
```

## Retrieve a list of implemented Parachains
The following endpoint retrieves an array of implemented Parachains.

**Endpoint**: `GET /assets`

   - **Parameters**: None.
   - **Errors**: 
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets");
```