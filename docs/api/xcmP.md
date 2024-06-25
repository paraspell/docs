# Use XCM SDK✨ within XCM API
Following guide guides you through XCM SDK functionality implemented in XCM API.
## Send XCM
This functionality allows you to send XCM messages across Paraverse.
### Package-less implementation of XCM API XCM features into your application

```JS
//Chain WS API instance that will send generated XCM Call
const wsProvider = new WsProvider('YourChainWSPort'); //Specify "YourChainWSPort" with WS Port of sender chain 
const api = await ApiPromise.create({ provider: wsProvider });

const response = await fetch(
    "http://localhost:3001/x-transfer?" +
    new URLSearchParams({
        //Method parameters should be here
        //For eg. from: 'Basilisk'
    })
);

//Constant required for every endpoint (As this is output they will provide)
const {   
    module,
    section,
    parameters
} =

await response.json();

//Response received is parsed to the call
const promise = api.tx[module][section](
    ...parameters
);

//Promise is then signed and can be subscribed to extrinsics
promise.signAndSend(address, { signer: injector.signer }, ({ status, txHash }) => {
```

### Relay chain to Parachain (DMP)
The following endpoint constructs the Relay chain to the Parachain XCM message. This message is constructed by providing the `to` parameter.

**Endpoint**: `POST /x-transfer`

   - **Parameters**:
     - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
     - `amount` (Inside JSON body): (required): Specifies the amount of assets to transfer. It should be a numeric value.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'to' is not provided
     - `400`  (Bad request exception) - Returned when parameter 'to' is not a valid Parachain
     - `400`  (Bad request exception) - Returned when parameter 'amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when parameter 'amount' is not a valid amount
     - `400`  (Bad request exception) - Returned when parameter 'address' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        amount: "Amount", // Replace "Amount" with the numeric value you wish to transfer
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
    })
});
```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

### Parachain chain to Relay chain (UMP)
The following endpoint constructs Parachain to Relay chain XCM message. This message is constructed by providing the `from` parameter.

**Endpoint**: `POST /x-transfer`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
     - `amount` (Inside JSON body): (required): Specifies the amount of assets to transfer. It should be a numeric value.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'from' is not provided
     - `400`  (Bad request exception) - Returned when parameter 'from' is not a valid Parachain
     - `400`  (Bad request exception) - Returned when parameter 'amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when parameter 'amount' is not a valid amount
    - `400`  (Bad request exception) - Returned when parameter 'address' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        amount: "Amount", // Replace "Amount" with the numeric value you wish to transfer
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
    })
});
```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

### Parachain to Parachain (HRMP)
The following endpoint allows got creation of Parachain to Parachain XCM call. This call is specified by Parachains selected as origin - `from` and destination - `to` parameters.

**Endpoint**: `POST /x-transfer`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
     - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
     - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
     - `amount` (Inside JSON body): (required): Specifies the amount of assets to transfer. It should be a numeric value.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
     - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
     - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
     - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
     - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**NOTE** If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `currency: "42259045809535163221576417993425387648n"` will mean you wish to transfer xcDOT.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: "Currency", // Replace "Currency" with asset id or symbol, e.g., "DOT" or custom Multilocation
        amount: "Amount", // Replace "Amount" with the numeric value you wish to transfer
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
    })
});
```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

### Custom multilocation call
You can now customize multilocations for Address, Currency and Destination within all three scenarios (where possible).

   - **Parameters**:
        - Same as in above scenarios
   - **Errors**:
        - Same as in above scenarios

**Example of request:**

```js
const response = await fetch("http://localhost:3001/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain",   // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",    // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        address: "Address", // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
        currency: {         // Replace "Currency" with asset id, symbol, e.g., "DOT" or custom Multilocation
            parents: 0,
            interior: {
                X2: [
                    { PalletInstance: "50" },
                    { GeneralIndex: "41" }
                ]
            }
        },
        amount: "Amount" // Replace "Amount" with the numeric value you wish to transfer
    })
});
```

## Asset claim
Assets, that have been trapped in the cross-chain transfers can now be recovered through asset claim feature.

**Endpoint**: `POST /asset-claim`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Parachain on which the asset will be claimed.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.
     - `fungible` (Inside JSON body): (required): Represents the asset being claimed. It should be a multilocation.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'from' is not provided
     - `400`  (Bad request exception) - Returned when parameter 'address' is not provided
     - `400`  (Bad request exception) - Returned when query parameter 'fungible' is expected but not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/asset-claim", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Amount" with the numeric value you wish to transfer
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
        fungible: "Multilocation" //Replace "Multilocation" with specific asset multilocation
    })
});
```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`


## Asset query
This functionality allows you to perform various asset queries with compatible Parachains.

### Package-less implementation of XCM API Asset features into your application

```JS
const response = await fetch(
    "http://localhost:3001/assets/<action>" + //Replace "action" with your desired action eg. "Acala/native" 
);

console.log(response) //use response data as necessary
```

### Query assets object
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

### Query asset ID
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

### Query Relay chain asset symbol
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

### Query native assets
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

### Query foreign assets
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

### Query all asset symbols
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

### Query asset support
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


### Query asset decimals
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

### Query Parachain ID
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

### Query Parachain name
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

### Query list of implemented Parachains
The following endpoint retrieves an array of implemented Parachains.

**Endpoint**: `GET /assets`

   - **Parameters**: None.
   - **Errors**: 
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets");
```
## Create HRMP channels
The following functionality allows you to open or close HRMP channels between Parachains.

### Package-less implementation of XCM API HRMP features into your application

```JS
const response = await fetch(
    "http://localhost:3001/hrmp/channels?" +
    new URLSearchParams({
        //Method parameters should be here
        //For eg. from: 'Basilisk'
    }),
    //Replace the method with the method your scenario uses eg. "POST" 
    { method: "YourMethod" }
);

const data = await response.json(); //Here we receive data
const { module, section, parameters } = data; //Parsing received data

//Received data needs to be wrapped in a sudo call - only the sudo account can 
//perform these eg. Alice in localhost
const promise = api.tx.sudo.sudo(api.tx[module][section](...parameters)); 

//Call is signed here and can subscribe to extrinsics
promise.signAndSend(alice, ({status,txHash}) => 
```


### Open HRMP channel
The following endpoint serves to open a new HRMP channel between Parachains defined with `origin` & `destination` parameters. Users also provide `maxSize` and `maxMessageSize` details.

**Endpoint**: `POST /hrmp/channels`

   - **Parameters**:
     - `from` (Query parameter): (required): Specifies the origin Parachain.
     - `to` (Query parameter): (required): Specifies the destination Parachain.
     - `maxSize` (Query parameter): (required): Specifies the maximum size.
     - `maxMessageSize` (Query parameter): (required): Specifies the maximum message size.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
     - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameter 'maxSize' pr 'maxMessageSize' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch(
    "http://localhost:3001/hrmp/channels?" +
    new URLSearchParams({
        from: Karura,
        to: BifrostKusama,
        maxSize: "8",
        maxMessageSize: "1024",
    }),
    { method: "POST" }
);
```

### Close HRMP channel
The following endpoint serves to close HRMP channels routed from Parachain defined with the `from` parameter. Users also provide `inbound` and `outbound` details.

**Endpoint**: `DELETE /hrmp/channels`

   - **Parameters**:
     - `from` (Query parameter): (required): Specifies the origin Parachain.
     - `inbound` (Query parameter): (required): Specifies the maximum inbound.
     - `outbound` (Query parameter):  (required): Specifies the maximum outbound.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameter 'from' is not provided
     - `400`  (Bad request exception) - Returned when query parameter 'from' is not a valid Parachain
     - `400`  (Bad request exception) - Returned when query parameter 'inbound' or 'outbound' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch(
    "http://localhost:3001/hrmp/channels?" +
    new URLSearchParams({
        from: Karura,
        inbound: "0",
        outbound: "0",
    }),
    { method: "DELETE" }
);
```

## Query XCM pallets

This functionality allows you to query the `XCM pallets` that Parachains currently support. 

### Package-less implementation of XCM API XCM Pallet Query features into your application

```JS
const response = await fetch(
    "http://localhost:3001/pallets/<action>" + //Replace "action" with your desired action eg. "Acala/default" 
);

console.log(response) //use response data as necessary
```

### Get default XCM pallet
The following endpoint returns the default pallet for specific Parachain

**Endpoint**: `GET /pallets/:node/default`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when path parameter 'node' is not a valid Parachain
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/pallets/Acala/default");
```

### Get all supported XCM pallets
The following endpoint returns all XCM Pallets that are supported on specific Parachain

**Endpoint**: `GET /pallets/:node`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when path parameter 'node' is not a valid Parachain
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/pallets/Basilisk");
```
