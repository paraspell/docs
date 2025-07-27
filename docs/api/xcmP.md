# Use XCM SDK🪄 within XCM API
The following guide guides you through the XCM SDK functionality implemented in XCM API.
## Send XCM
This functionality allows you to send XCM messages across the Paraverse.

### Package-less implementation of XCM API XCM features into your application

```ts
//Chain WS API instance that will send generated XCM Call
const provider = getWsProvider('YourChainWSPort') // Specify "YourChainWSPort" with WS Port of sender chain 
const client = createClient(withPolkadotSdkCompat(provider))

const response = await fetch(
    "http://localhost:3001/v3/x-transfer”,
{
	method: ‘POST’,
           	body: JSON.stringify({
                  "from": "origin",
                  "to": "destination",
                  "address": "address",
                  "currency": {currencySpec, amount: amount},
             })
});

const hash = await response.json();

//Received response is parsed to the call
const callData = Binary.fromHex(hash)

// Also possibility to use .getTypedApi()
const tx = await client.getUnsafeApi().txFromCallData(callData)

//Call is then signed and can be subscribed to extrinsics
tx.signAndSubmit(signer)
  .then(() => "Transaction completed")
  .catch((err) => {
    console.log(err)
  })

```

### Relay chain to Parachain (DMP)
The following endpoint constructs the Relay chain to the Parachain XCM message.

**Endpoint**: `POST /v3/x-transfer`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Relay chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Specifies the currency and amount of assets to transfer.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `xcmVersion` (Inside JSON body): (optional): Specifies manually selected XCM version if pre-selected does not work. Format: Vx - where x = version number eg. V4.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'to' is not provided
  - `400`  (Bad request exception) - Returned when parameter 'to' is not a valid Parachain
  - `400`  (Bad request exception) - Returned when parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
	from: "Polkadot" // Or Kusama
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
	currency: { symbol: 'DOT', amount: amount},
        address: "Address", // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
        //xcmVersion: "Vx" //Optional parameter - replace "Vx" with V and version number eg. "V4"
        //pallet: 'RandomXTokens', //Optional parameter - replace RandomXtokens with Camel case name of the pallet
	    //method: 'random_function' //Optional parameter - replace random_function with snake case name of the method
    })
});
```

### Parachain chain to Relay chain (UMP)
The following endpoint constructs Parachain to Relay chain XCM message.

**Endpoint**: `POST /v3/x-transfer`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Relay chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Specifies the currency and amount of assets to transfer.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `xcmVersion` (Inside JSON body): (optional): Specifies manually selected XCM version if pre-selected does not work. Format: Vx - where x = version number eg. V4.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'from' is not provided
  - `400`  (Bad request exception) - Returned when parameter 'from' is not a valid Parachain
  - `400`  (Bad request exception) - Returned when parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
	from: "Parachain" // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        to: "Polkadot",   // Or Kusama
	currency: { symbol: 'DOT', amount: amount},
        address: "Address", // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
        //xcmVersion: "Vx" //Optional parameter - replace "Vx" with V and version number eg. "V4"
        //pallet: 'RandomXTokens', //Optional parameter - replace RandomXtokens with Camel case name of the pallet
	    //method: 'random_function' //Optional parameter - replace random_function with snake case name of the method
    })
});
```

### Parachain to Parachain (HRMP)
The following endpoint allows creation of Parachain to Parachain XCM call. This call is specified by Parachains selected as origin - `from` and destination - `to` parameters.

**Endpoint**: `POST /v3/x-transfer`

  <details>
  <summary><b>Parameters</b></summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `xcmVersion` (Inside JSON body): (optional): Specifies manually selected XCM version if pre-selected does not work. Format: Vx - where x = version number eg. V4.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `currency: "42259045809535163221576417993425387648n"` will mean you wish to transfer xcDOT.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
        senderAddress: "senderAddress" //Optional but strongly recommended as it is automatically ignored when not needed - Used when origin is AssetHub with feeAsset or when sending to AssetHub to prevent asset traps by auto-swapping to DOT to have DOT ED.
        //feeAsset: {id: currencyID} | {symbol: currencySymbol} | {multilocation: AssetMultilocationString | AssetMultilocationJson} //Optional parameter used when multiasset is provided or when origin === AssetHubPolkadot and TX is supposed to be paid in same fee asset as selected currency
        //ahAddress: ahAddress //Optional parameter - used when origin is EVM node and XCM goes through AssetHub (Multihop transfer where we are unable to convert Key20 to ID32 address eg. origin: Moonbeam & destination: Ethereum (Multihop goes from Moonbeam > AssetHub > BridgeHub > Ethereum)
        //xcmVersion: "Vx" //Optional parameter - replace "Vx" with V and version number eg. "V4"
        //pallet: 'RandomXTokens', //Optional parameter - replace RandomXtokens with Camel case name of the pallet
	    //method: 'random_function' //Optional parameter - replace random_function with snake case name of the method
    })
});
```

### Local transfers
The following endpoint allows  creation of Local asset transfers for any chain and any currency registered on it. This call is specified by same Parachain selected as origin - `from` and destination - `to` parameters.

**Endpoint**: `POST /v3/x-transfer`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain on which the asset is transfered locally.
  - `to` (Inside JSON body): (required): Represents the Parachain on which the asset is transfered locally.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `currency: "42259045809535163221576417993425387648n"` will mean you wish to transfer xcDOT.

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v3/x-transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Parachain', // Replace "Parachain" with sender Parachain, e.g., "Acala"
    to: 'Parachain' // Replace Parachain with same parameter as "from" parameter
    currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
  }),
});
```

### Custom multilocation call
You can now customize multilocations for Address, Currency and Destination within all three scenarios (where possible).

   - **Parameters**:
        - Same as in above scenarios
   - **Errors**:
        - Same as in above scenarios

**Example of request:**

```ts
const response = await fetch("http://localhost:3001/v3/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain",   // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",    // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        address: "Address", // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
        currency: {
          multilocation: 
          type: 'Override',
          value: {
            parents: 0,
            interior: {
              X2: [{ PalletInstance: '50' }, { GeneralIndex: '41' }],
            },
          },
	amount: amount
        },
        //xcmVersion: "Vx" //Optional parameter - replace "Vx" with V and version number eg. "V4"
        //pallet: 'RandomXTokens', //Optional parameter - replace RandomXtokens with Camel case name of the pallet
	    //method: 'random_function' //Optional parameter - replace random_function with snake case name of the method
    })
});
```

## Ecosystem Bridges
This section sums up currently available and implemented ecosystem bridges that are offered in the XCM API. Implementing cross-ecosystem asset transfers was never this easy!

### Kusama<>Polkadot bridge
Latest API versions support Polkadot <> Kusama bridge in very native and intuitive way. You just construct the Polkadot <> Kusama transfer as standard Parachain to Parachain scenario transfer.

   - **Parameters**:
        - Same as in Parachain -> Parachain scenario
   - **Errors**:
        - Same as in Parachain -> Parachain scenario

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "AssetHubPolkadot", // Or AssetHubKusama
        to: "AssetHubKusama",   // Or AssetHubPolkadot
        currency: {symbol: "KSM", amount: amount}, // Or DOT
        address: "Address" // AccountID 32 address
    })
});
```


### AssetHubPolkadot -> Ethereum

   - **Parameters**:
        - Same as in Parachain -> Parachain scenario
   - **Errors**:
        - Same as in Parachain -> Parachain scenario

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "AssetHubPolkadot", 
        to: "Ethereum",   
        currency: {symbol: "WETH", amount: amount}, // Any supported asset - WBTC, WETH.. - {symbol: currencySymbol} | {id: currencyID}
        address: "Address" // Ethereum Address
    })
});
```

### Parachain -> Ethereum

   - **Parameters**:
        - Same as in Parachain -> Parachain scenario
   - **Errors**:
        - Same as in Parachain -> Parachain scenario

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", 
        to: "Ethereum",   
        currency: {symbol: "WETH", amount: amount}, // Any supported asset - WBTC, WETH.. - {symbol: currencySymbol} | {id: currencyID}
        address: "Address", // Ethereum Address
        ahAddress: "Address", //Asset hub address (Needs to be sender address)
        senderAddress: "Address" //Origin chain sender address
    })
});
```

### Snowbridge health check
Query for Snowbridge status 

**Endpoint**: `GET /v3/x-transfer/eth-bridge-status`


   - **Parameters**:
     - No parameters required

   - **Errors**:
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/x-transfer/eth-bridge-status");
```


## Batch call
XCM API allows you to batch your XCM calls and send multiple at the same time via batch feature.

**Endpoint** `POST /v3/x-transfer-batch`

  <details>
  <summary><b>Parameters</b> </summary>

  - `transfers` (Inside JSON body): (required): Represents array of XCM calls along with optional parameter "options" which contains "mode" to switch between BATCH and BATCH_ALL call forms.


  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameter 'transfers' is expected but not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
//mode options: - BATCH
//		- BATCH_ALL

const response = await fetch("http://localhost:3001/v3/x-transfer-batch", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        transfers: "Parachain", // Replace "transfers" with array of XCM transfers
    })
});

//Example of JSON body
/*{
	"transfers": [
		{
			"from": "Kusama"
			"to": "Moonriver",
			"currency": { symbol: "DOT", amount: amount},
			"address": "0x939229F9c6E2b97589c4a5A0B3Eb8664FFc00502"
		},
		{
			"from": "Kusama"
			"to": "Basilisk",
			"currency": { symbol: "DOT", amount: amount},
			"address": "bXgnPigqWnUTb9PxgCvnt61bsQoRQFnzLYYyRPV1bvB6DLu87"
		}
	],
	"options": {
		"mode": "BATCH"
	}
}*/
```

## Asset claim
Assets that have been trapped in the cross-chain transfers can now be recovered through the asset claim feature.

**Endpoint**: `POST /v3/asset-claim`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain on which the asset will be claimed.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `fungible` (Inside JSON body): (required): Represents the asset being claimed. It should be a multilocation.


  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'from' is not provided
  - `400`  (Bad request exception) - Returned when parameter 'address' is not provided
  - `400`  (Bad request exception) - Returned when query parameter 'fungible' is expected but not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/asset-claim", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "from" with the numeric value you wish to transfer
        address: "Address", // Replace "address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
        fungible: "Asset Multilocation array" //Replace "Asset Multilocation array" with specific asset multilocation along with amount specification
    })
});

//Example of asset multilocation array:
/*"fungible": [
{
  "id": {
    "Concrete": {
      "parents": 0,
      "interior": {
        "Here": null
      }
    }
  },
  "fun": {
    "Fungible": "10000"
  }
}]*/
```

## Dry run
You can find out whether you XCM message will execute successfuly or with error. XCM Message dry run should write you concrete error so you can find out if the XCM message will execute without it ever being submitted.

**Endpoint**: `POST /v3/dry-run`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  </details>

  <details>
  <summary><b>Possible output objects</b></summary>

```
origin - Always present
assetHub - Present if XCM is Multihop (For example Para > Ethereum)
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum)
destination - Present if origin doesn't fail
```

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v3/dry-run', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Multilocation
    currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
    //feeAsset: {id: currencyID} | {symbol: currencySymbol} | {multilocation: AssetMultilocationString | AssetMultilocationJson} //Optional parameter used when origin === AssetHubPolkadot and TX is supposed to be paid in same fee asset as selected currency
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Localhost testing setup

API offers enhanced localhost support. You can pass an object called options containing overrides for all WS endpoints (Including hops) used in the test transfer. This allows for advanced localhost testing such as localhost dry-run or xcm-fee queries.

**Endpoint**: `Any that can leverage this feature` (From transfers, dry-run to xcm-fee queries)

  <details>
  <summary><b>Parameters</b></summary>

  - Inherited from concrete endpoint

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - Inherited from concrete endpoint
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  
```
- The xcm-api accepts an options object in the request body for endpoints like /x-transfer, accepting the same parameters as SDK.

- apiOverrides property is a map where keys are chain names (e.g., Hydration, BridgeHubPolkadot) and values are the corresponding WS endpoint URL / array of WS URLs or an API client instance.

- Development mode parameter: When development flag is set to true, the SDK will throw a MissingChainApiError if an operation involves a chain for which an override has not been provided in apiOverrides. This ensures that in a testing environment, the SDK does not fall back to production endpoints.
```

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        senderAddress: "1pze8UbJDcDAacrXcwkpqeRSYLphaAiXB8rUaC6Z3V1kBLq",
        address: "0x1501C1413e4178c38567Ada8945A80351F7B8496",
        from: "Hydration",
        to: "Ethereum",
        currency: {
          symbol: "USDC.e",
          amount: "1000000"
        },
        options: {
          development: true,
          apiOverrides: {
            Hydration: "wss://hydration.ibp.network",
            AssetHubPolkadot: "wss://dot-rpc.stakeworld.io/assethub"
            BridgeHubPolkadot: "wss://sys.ibp.network/bridgehub-polkadot"
          }
        }
    })
});
```

## XCM Transfer info
To comprehensively assess whether a message will execute successfully without failure, use this query. It provides detailed information on currency balances before and after the transaction, including all relevant fees. This data is essential for accurately evaluating potential balance or fee-related issues that could cause message failure.

**Endpoint**: `POST /v3/transfer-info`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  </details>

  <details>
  <summary><b>Possible output objects</b></summary>

```
chain - Always present
origin - Always present
assetHub - Present if XCM is Multihop (For example Para > Ethereum)
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum)
destination - Present if origin doesn't fail
```

  </details>

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v3/transfer-info' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Multilocation
    currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
    //feeAsset: {id: currencyID} | {symbol: currencySymbol} | {multilocation: AssetMultilocationString | AssetMultilocationJson} //Optional parameter used when origin === AssetHubPolkadot and TX is supposed to be paid in same fee asset as selected currency
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Transferable amount
To retrieve information on how much of the selected currency can be transfered from specific account you can use transferable balance. 

**Endpoint**: `POST /v3/transferable-amount`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  This query will calculate transferable balance using following formulae: 

  **Balance - ED - if(asset=native) then also substract Origin XCM Fees else ignore**

  **Beware**: If DryRun fails function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will actually go through).

  </details>

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v3/transferable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Multilocation
    currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
    //feeAsset: {id: currencyID} | {symbol: currencySymbol} | {multilocation: AssetMultilocationString | AssetMultilocationJson} //Optional parameter used when origin === AssetHubPolkadot and TX is supposed to be paid in same fee asset as selected currency
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Verify ED on destination
To retrieve information on whether the selected currency from specific account will meet existential deposit on destination chain you can use this query. 

**Endpoint**: `POST /v3/verify-ed-on-destination`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  This query will calculate whether user has will have enough to cover existential deposit on XCM arrival using following pseudo formulae: 

  **(if(Balance) || if(TransferedAmount - ED - Destination Fee > 0)) return true else false** 

  **Beware**: If DryRun fails function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will actually go through). **If function switches to PaymentInfo and transfered currency is different than native currency on destination chain the function throws error as PaymentInfo only returns fees in native asset of the chain.**

  </details>
     
**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v3/verify-ed-on-destination' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Multilocation
    currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
    //feeAsset: {id: currencyID} | {symbol: currencySymbol} | {multilocation: AssetMultilocationString | AssetMultilocationJson} //Optional parameter used when origin === AssetHubPolkadot and TX is supposed to be paid in same fee asset as selected currency
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## XCM Fee (Origin & Dest.)

### More accurate query using DryRun
The following endpoint allows is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by either origin or destination. This endpoint requires user to have token balance (Token that they are sending and origin native asset to pay for execution fees on origin)

**Endpoint**: `POST /v3/xcm-fee`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the XCM sender.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  When Payment info is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price. DryRun returns fees in currency that is being transferred, so no additional calculations necessary in that case.

  **NOTE** If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `currency: "42259045809535163221576417993425387648n"` will mean you wish to transfer xcDOT.

  </details>

  <details>
  <summary><b>Possible output objects</b></summary>

```
origin - Always present
assetHub - Present if XCM is Multihop (For example Para > Ethereum)
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum)
destination - Present if origin doesn't fail
```

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/xcm-fee", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
        //feeAsset: {id: currencyID} | {symbol: currencySymbol} | {multilocation: AssetMultilocationString | AssetMultilocationJson} //Optional parameter used when origin === AssetHubPolkadot and TX is supposed to be paid in same fee asset as selected currency
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
        /*disableFallback: "True" //Optional parameter - if enabled it disables fallback to payment info if dryrun fails only returning dryrun error but no fees.*/
    })
});
```

### Less accurate query using Payment info
The following endpoint allows is designed to retrieve you approximate fee and doesn't require any token balance.

**Endpoint**: `POST /v3/xcm-fee-estimate`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the XCM sender.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  When Payment info is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price.

  **NOTE** If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `currency: "42259045809535163221576417993425387648n"` will mean you wish to transfer xcDOT.

  </details>

  <details>
  <summary><b>Possible output objects</b></summary>

```
origin - Always present
destination - Always present
```

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/xcm-fee-estimate", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
    })
});
```

## XCM Fee (Origin only)
Following queries allow you to query XCM fee from Origin chain. You can get accurate result from DryRun query (Requires token balance) or less accurate from Payment info query (Doesn't require token balance).

### More accurate query using DryRun
The query is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by origin. This query requires user to have token balance (Token that they are sending and origin native asset to pay for execution fees on origin).

**Endpoint**: `POST /v3/origin-xcm-fee`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the XCM sender.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  **NOTE** If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `currency: "42259045809535163221576417993425387648n"` will mean you wish to transfer xcDOT.

  </details>

  <details>
  <summary><b>Possible output objects</b></summary>

```
origin - Always present
```

  </details>


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/origin-xcm-fee", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
        //feeAsset: {id: currencyID} | {symbol: currencySymbol} | {multilocation: AssetMultilocationString | AssetMultilocationJson} //Optional parameter used when origin === AssetHubPolkadot and TX is supposed to be paid in same fee asset as selected currency
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
        /*disableFallback: "True" //Optional parameter - if enabled it disables fallback to payment info if dryrun fails only returning dryrun error but no fees.*/
    })
});
```

### Less accurate query using Payment info
The following endpoint allows is designed to retrieve you approximate fee and doesn't require any token balance.

**Endpoint**: `POST /v3/origin-xcm-fee-estimate`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the XCM sender.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  **NOTE** If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `currency: "42259045809535163221576417993425387648n"` will mean you wish to transfer xcDOT.

  </details>

  <details>
  <summary><b>Possible output objects</b></summary>

```
origin - Always present
```

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/origin-xcm-fee-estimate", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
    })
});
```

## SS58 Address conversion
Following functionality allows you to convert any SS58 address to Parachain specific address.

 **Endpoint**: `GET /v3/convert-ss58?address=:address&node=:node`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (query parameter): Specifies the name of the Parachain.
  - `node` (query parameter): Specifies the SS58 Address.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `400` (Bad request): When a specified Address is not provided.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v3/convert-ss58?address=:address&node=:node');
```

## Asset queries
This functionality allows you to perform various asset queries with compatible Parachains.

### Package-less implementation of XCM API Asset features into your application

```ts
const response = await fetch(
    "http://localhost:3001/v3/assets/<action>" + //Replace "action" with your desired action eg. "Acala/native" 
);

console.log(response) //use response data as necessary
```

### Query asset paths
The following endpoint allows you to query the asset paths related to origin chain.

**Endpoint**: `POST /v3/assets/:node/supported-destinations`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (Path parameter): Specifies the name of the Parachain.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'node' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/:node/supported-destinations", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        currency: "Currency" //Replace "Currency" with {id: currencyID} | {symbol: currencySymbol} | {"symbol": {"type": "Native","value": "currencySymbol"} | {"symbol": {"type": "Foreign","value": "currencySymbol"} | {"symbol": {"type": "ForeignAbstract","value": "currencySymbolAlias"}
    })
});
```

### Query asset balance
The following endpoint allows you to query asset balance for on specific chain.

**Endpoint**: `POST /v3/balance/:node/asset`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (Path parameter): Specifies the name of the Parachain.
  - `address` (Inside JSON body): (required): Specifies the address of the account.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'node' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'address' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/balance/:node/asset", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        address: "Address" // Replace "Address" with wallet address (In AccountID32 or AccountKey20 Format) 
        currency: {currencySpec}, //{id: currencyID} | {symbol: currencySymbol} | {"symbol": {"type": "Native","value": "currencySymbol"} | {"symbol": {"type": "Foreign","value": "currencySymbol"} | {"symbol": {"type": "ForeignAbstract","value": "currencySymbolAlias"} | {multilocation: AssetMultilocationString} | {multilocation: AssetMultilocationJson} | {multilocation: "type": "Override","value": "CustomAssetMultilocationJson"}
    })
});
```

### Query asset existential deposit
The following endpoint allows you to query the existential deposit for currency in a specific chain.

**Endpoint**: `POST /v3/balance/:node/existential-deposit`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (Path parameter): Specifies the name of the Parachain.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'node' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/balance/:node/existential-deposit", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        currency: "Currency" //Replace "Currency" with {id: currencyID} | {symbol: currencySymbol} | {"symbol": {"type": "Native","value": "currencySymbol"} | {"symbol": {"type": "Foreign","value": "currencySymbol"} | {"symbol": {"type": "ForeignAbstract","value": "currencySymbolAlias"} | {multilocation: AssetMultilocationString} | {multilocation: AssetMultilocationJson}
    })
});
```

### Query Fee assets
The following endpoint retrieves Fee asset queries (Assets accepted as XCM Fee on specific node)

**Endpoint**: `GET /v3/assets/:node/fee-assets`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v3/assets/:node/fee-assets');
```

### Query assets object
The following endpoint retrieves all assets on a specific Parachain as an object.

**Endpoint**: `GET /v3/assets/:node`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/Moonbeam");
```

### Query asset multilocation
The following endpoint retrieves asset multilocation from the asset ID or asset symbol.

**Endpoint**: `POST /v3/assets/:node/multilocation`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/:node/multilocation", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        currency: "Currency" //Replace "Currency" with {id: currencyID} | {symbol: currencySymbol} | {"symbol": {"type": "Native","value": "currencySymbol"} | {"symbol": {"type": "Foreign","value": "currencySymbol"} | {"symbol": {"type": "ForeignAbstract","value": "currencySymbolAlias"}
    })
});
```

### Query asset ID
The following endpoint returns the asset id for the specific asset on a specific Parachain.

**Endpoint**: `GET /v3/assets/:node/id?symbol=:symbol`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.
  - `symbol` (path parameter): Specifies the currency symbol of the asset.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `404` (Bad request): When an asset with a specified currency symbol does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/Interlay/id?symbol=USDT");
```

### Query Relay chain asset symbol
The following endpoint returns the Relay chain asset symbol for a specific Parachain.

**Endpoint**: `GET /v3/assets/:node/relay-chain-symbol`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>
    
**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/Astar/relay-chain-symbol");
```

### Query native assets
The following endpoint returns native assets of specific Parachain.

**Endpoint**: `GET /v3/assets/:node/native`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/Hydration/native");
```

### Query foreign assets
The following endpoint returns foreign assets of specific Parachain.

**Endpoint**: `GET /v3/assets/:node/other`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/Astar/other");
```

### Query all asset symbols
The following endpoint returns all asset symbols for specific Parachain.

**Endpoint**: `GET /v3/assets/:node/all-symbols`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/Moonbeam/all-symbols");
```

### Query asset support
The following endpoint returns a boolean value that confirms if the asset is registered on a specific Parachain or not.

**Endpoint**: `GET /v3/assets/:node/has-support?symbol=:symbol`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.
  - `symbol` (path parameter): Specifies the symbol of the asset.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `404` (Bad request): When an asset with a specified currency symbol does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/Hydration/has-support?symbol=DOT");
```

### Query asset support between two chains
The following endpoint retrieves assets supported by both chains.

**Endpoint**: `GET /v3/supported-assets?origin=:node&destination=:node`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/supported-assets?origin=Acala&destination=Astar");
```

### Query asset decimals
The following endpoint retrieves specific asset decimals on specific Parachain.

**Endpoint**: `GET /v3/assets/:node/decimals?symbol=:symbol`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.
  - `symbol` (path parameter): Specifies the currency symbol.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `404` (Bad request): When an asset with a specified currency symbol does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/assets/Basilisk/decimals?symbol=BSX");
```

### Query Parachain ws endpoints
The following endpoint retrieves the Parachain's WS endpoints.

**Endpoint**: `GET /v3/nodes/:node/ws-endpoints`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/nodes/Acala/ws-endpoints");
```

### Query Parachain ID
The following endpoint retrieves Parachain's ID from Parachain's name

 **Endpoint**: `GET /v3/nodes/:node/para-id`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/nodes/Acala/para-id");
```

### Query Parachain name
The following endpoint retrieves the Parachain's name from the Parachain's ID.

**Endpoint**: `GET /v3/nodes/:paraId?ecosystem=eco`

  <details>
  <summary><b>Parameters</b> </summary>

  - `paraId` (path parameter): Specifies the parachain ID.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `404` (Bad request): When a Parachain with a specified Parachain ID does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/nodes/2090?ecosystem=polkadot");
```

### Query list of implemented Parachains
The following endpoint retrieves an array of implemented Parachains.

**Endpoint**: `GET /v3/nodes`

   - **Parameters**: None.
   - **Errors**: 
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/nodes");
```

## XCM pallet queries

This functionality allows you to query the `XCM pallets` that Parachains currently support. 

### Package-less implementation of XCM API XCM Pallet Query features into your application

```ts
const response = await fetch(
    "http://localhost:3001/v3/pallets/<action>" + //Replace "action" with your desired action eg. "Acala/default" 
);

console.log(response) //use response data as necessary
```

### Get default XCM pallet
The following endpoint returns the default pallet for specific Parachain

**Endpoint**: `GET /v3/pallets/:node/default`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/pallets/Acala/default");
```

### Get XCM pallet index
The following endpoint returns the index of specific cross-chain pallet for specific chain.

**Endpoint**: `GET /v3/pallets/:node/index`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.
  - `pallet` (query parameter): Specifies the name of the cross-chain pallet.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when path parameter 'node' is not a valid Parachain
  - `400`  (Bad request exception) - Returned when query parameter 'pallet' is not a valid cross-chain pallet
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v3/pallets/Acala/index?pallet=XTokens');
```

### Get all supported XCM pallets
The following endpoint returns all XCM Pallets that are supported on specific Parachain

**Endpoint**: `GET /v3/pallets/:node`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v3/pallets/Basilisk");
```

### Get node DryRun support
The following endpoint returns whether selected Parachain has DryRun support

**Endpoint**: `GET /v3/nodes/:node/has-dry-run-support`

  <details>
  <summary><b>Parameters</b> </summary>

  - `node` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v3/nodes/:node/has-dry-run-support');
```
