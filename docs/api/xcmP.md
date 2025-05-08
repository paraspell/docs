# Use XCM SDK🪄 within XCM API
The following guide guides you through the XCM SDK functionality implemented in XCM API.
## Send XCM
This functionality allows you to send XCM messages across the Paraverse.

### Package-less implementation of XCM API XCM features into your application
```
NOTES: 
- We recently introduced a new, much simpler way to implement XCM API! You can now request a hashed response to the built call, which will offlift you from parsing and work right away!
- XCM API is now migrated to Polkadot API (PAPI), so PolkadotJS signers are no longer compatible!
```

```ts
//Chain WS API instance that will send generated XCM Call
const provider = getWsProvider('YourChainWSPort') // Specify "YourChainWSPort" with WS Port of sender chain 
const client = createClient(withPolkadotSdkCompat(provider))

const response = await fetch(
    "http://localhost:3001/v2/x-transfer”,
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

**Endpoint**: `POST /v2/x-transfer`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Relay chain from which the assets will be transferred.
     - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
     - `currency` (Inside JSON body): (required): Specifies the currency and amount of assets to transfer.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.
     - `xcmVersion` (Inside JSON body): (optional): Specifies manually selected XCM version if pre-selected does not work. Format: Vx - where x = version number eg. V4.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'to' is not provided
     - `400`  (Bad request exception) - Returned when parameter 'to' is not a valid Parachain
     - `400`  (Bad request exception) - Returned when parameter 'amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when parameter 'amount' is not a valid amount
     - `400`  (Bad request exception) - Returned when parameter 'address' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/x-transfer", {
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

**Endpoint**: `POST /v2/x-transfer`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
     - `to` (Inside JSON body): (required): Represents the Relay chain to which the assets will be transferred.
     - `currency` (Inside JSON body): (required): Specifies the currency and amount of assets to transfer.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.
     - `xcmVersion` (Inside JSON body): (optional): Specifies manually selected XCM version if pre-selected does not work. Format: Vx - where x = version number eg. V4.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'from' is not provided
     - `400`  (Bad request exception) - Returned when parameter 'from' is not a valid Parachain
     - `400`  (Bad request exception) - Returned when parameter 'amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when parameter 'amount' is not a valid amount
     - `400`  (Bad request exception) - Returned when parameter 'address' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/x-transfer", {
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

**Endpoint**: `POST /v2/x-transfer`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
     - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
     - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.
     - `xcmVersion` (Inside JSON body): (optional): Specifies manually selected XCM version if pre-selected does not work. Format: Vx - where x = version number eg. V4.

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
```ts
const response = await fetch("http://localhost:3001/v2/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
        //feeAsset: {id: currencyID} | {symbol: currencySymbol} | {multilocation: AssetMultilocationString | AssetMultilocationJson} //Optional parameter used when multiasset is provided or when origin is AssetHub - so user can pay in fees different than DOT
        //senderAddress: senderAddress //Optional parameter - only needed when origin is AssetHub and feeAsset is provided
        //ahAddress: ahAddress //Optional parameter - used when origin is EVM node and XCM goes through AssetHub (Multihop transfer where we are unable to convert Key20 to ID32 address eg. origin: Moonbeam & destination: Ethereum (Multihop goes from Moonbeam > AssetHub > BridgeHub > Ethereum)
        //xcmVersion: "Vx" //Optional parameter - replace "Vx" with V and version number eg. "V4"
        //pallet: 'RandomXTokens', //Optional parameter - replace RandomXtokens with Camel case name of the pallet
	    //method: 'random_function' //Optional parameter - replace random_function with snake case name of the method
    })
});
```

### Local transfers
The following endpoint allows  creation of Local asset transfers for any chain and any currency registered on it. This call is specified by same Parachain selected as origin - `from` and destination - `to` parameters.

**Endpoint**: `POST /v2/x-transfer`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Parachain on which the asset is transfered locally.
     - `to` (Inside JSON body): (required): Represents the Parachain on which the asset is transfered locally.
     - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
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
```ts
const response = await fetch('http://localhost:3001/v2/x-transfer', {
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
const response = await fetch("http://localhost:3001/v2/x-transfer", {
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

## XCM Fee query (With DryRun)
The following endpoint allows is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by either origin or destination. This endpoint requires user to have token balance (Token that they are sending and origin native asset to pay for execution fees on origin)

```
NOTICE: When Payment info is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price. DryRun returns fees in currency that is being transferred, so no additional calculations necessary in that case.
```

**Endpoint**: `POST /v2/xcm-fee`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
     - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
     - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.
     - `senderAddress` (Inside JSON body): (required): Specifies the address of the XCM sender.

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
```ts
const response = await fetch("http://localhost:3001/v2/xcm-fee", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
        /*disableFallback: "True" //Optional parameter - if enabled it disables fallback to payment info if dryrun fails only returning dryrun error but no fees.*/
    })
});
```

## XCM Fee query (Payment info)
The following endpoint allows is designed to retrieve you approximate fee and doesn't require any token balance.

```
NOTICE: When Payment info is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price.
```

**Endpoint**: `POST /v2/xcm-fee-estimate`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
     - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
     - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.
     - `senderAddress` (Inside JSON body): (required): Specifies the address of the XCM sender.

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
```ts
const response = await fetch("http://localhost:3001/v2/xcm-fee-estimate", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
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
const response = await fetch("http://localhost:3001/v2/x-transfer", {
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
const response = await fetch("http://localhost:3001/v2/x-transfer", {
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
const response = await fetch("http://localhost:3001/v2/x-transfer", {
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

**Endpoint**: `GET /v2/x-transfer/eth-bridge-status`


   - **Parameters**:
     - No parameters required

   - **Errors**:
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/x-transfer/eth-bridge-status");
```


## Batch call
XCM API allows you to batch your XCM calls and send multiple at the same time via batch feature.

**Endpoint** `POST /v2/x-transfer-batch`

   - **Parameters**
     - `transfers` (Inside JSON body): (required): Represents array of XCM calls along with optional parameter "options" which contains "mode" to switch between BATCH and BATCH_ALL call forms.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameter 'transfers' is expected but not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
//mode options: - BATCH
//		- BATCH_ALL

const response = await fetch("http://localhost:3001/v2/x-transfer-batch", {
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

## Dry run
You can find out whether you XCM message will execute successfuly or with error. XCM Message dry run should write you concrete error so you can find out if the XCM message will execute without it ever being submitted.

**Endpoint**: `POST /v2/dry-run`

   - **Parameters**:
     - `from` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
     - `to` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
     - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
     - `address` (Inside JSON body): (required): Specifies the address of the recipient.
     - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
     - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
     - `400`  (Bad request exception) - Returned when entered nodes 'from' and 'to' are not compatible for the transaction
     - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
     - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v2/dry-run', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Multilocation
    currency: { currencySpec }, //{id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Asset claim
Assets that have been trapped in the cross-chain transfers can now be recovered through the asset claim feature.

**Endpoint**: `POST /v2/asset-claim`

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
```ts
const response = await fetch("http://localhost:3001/v2/asset-claim", {
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



## Transfer info query
The following functionality gives you all the necessary information about your transfer, including fees, sufficiency to transfer and more.

**Endpoint**: `GET /v2/transfer-info`

  - **Parameters**:
    - `origin` (Inside JSON body): (required): Represents the Parachain from which the assets will be transferred.
    - `destination` (Inside JSON body): (required): Represents the Parachain to which the assets will be transferred.
    - `currency`: (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
    - `amount`: (Inside JSON body): (required): Specifies the amount of assets to transfer. It should be a numeric value.
    - `accountOrigin`: (Inside JSON body): (required): Specifies the address of the origin.
    - `accountDestination`: (Inside JSON body): (required): Specifies the recipient's address.

  - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'origin/destination' is not provided or existing
     - `400`  (Bad request exception) - Returned when parameter 'accountOrigin/accountDestination' is not provided or correct
     - `400`  (Bad request exception) - Returned when query parameter 'currency/amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'amount' is not positive number
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
     
**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v2/transfer-info?' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
  body: JSON.stringify({
    origin: 'Parachain', // Replace "Parachain" with chain you wish to query transfer info for as origin
    destination: 'Parachain', // Replace "destination" with chain you wish to query transfer info for as destination
    currency: {currencySpec}, //{id: currencyID} | {symbol: currencySymbol} | {"symbol": {"type": "Native","value": "currencySymbol"} | {"symbol": {"type": "Foreign","value": "currencySymbol"} | {"symbol": {"type": "ForeignAbstract","value": "currencySymbolAlias"} | {multilocation: AssetMultilocationString} | {multilocation: AssetMultilocationJson} | {multilocation: "type": "Override","value": "CustomAssetMultilocationJson"}
    amount: 'Amount', // Replace "Amount" with the numeric value you wish to transfer
    accountOrigin: 'Account address', // Replace "Address" with origin wallet address (In AccountID32 or AccountKey20 Format)
    accountDestination: 'Account address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
  }),
});
```

## Asset query
This functionality allows you to perform various asset queries with compatible Parachains.

### Package-less implementation of XCM API Asset features into your application

```ts
const response = await fetch(
    "http://localhost:3001/v2/assets/<action>" + //Replace "action" with your desired action eg. "Acala/native" 
);

console.log(response) //use response data as necessary
```

### Query asset balance
The following endpoint allows you to query asset balance for on specific chain.

**Endpoint**: `POST /v2/balance/:node/asset`

   - **Parameters**:
     - `node` (Path parameter): Specifies the name of the Parachain.
     - `address` (Inside JSON body): (required): Specifies the address of the account.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'address' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/balance/:node/asset", {
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

### Query max transferable amount
The following endpoint allows you to query the maximum currency transferable amount for a specific chain.

**Endpoint**: `POST /v2/balance/:node/transferable-amount`

   - **Parameters**:
     - `node` (Path parameter): Specifies the name of the Parachain.
     - `address` (Inside JSON body): (required): Specifies the address of the account.
     - `currency` (Inside JSON body): (required): Specifies the currency to query.


   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'node' is not provided
     - `400`  (Bad request exception) - Returned when body parameter 'address' is not provided
     - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/balance/:node/transferable-amount", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        address: "Address", // Replace "Address" with wallet address (In AccountID32 or AccountKey20 Format) 
        currency: "Currency" //Replace "Currency" with {id: currencyID} | {symbol: currencySymbol} | {"symbol": {"type": "Native","value": "currencySymbol"} | {"symbol": {"type": "Foreign","value": "currencySymbol"} | {"symbol": {"type": "ForeignAbstract","value": "currencySymbolAlias"} | {multilocation: AssetMultilocationString} | {multilocation: AssetMultilocationJson}
    })
});
```

### Query asset existential deposit
The following endpoint allows you to query the existential deposit for currency in a specific chain.

**Endpoint**: `POST /v2/balance/:node/existential-deposit`

   - **Parameters**:
     - `node` (Path parameter): Specifies the name of the Parachain.
     - `currency` (Inside JSON body): (required): Specifies the currency to query.


   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'node' is not provided
     - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/balance/:node/existential-deposit", {
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

**Endpoint**: `GET /v2/assets/:node/fee-assets`


   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v2/assets/:node/fee-assets');
```

### Query assets object
The following endpoint retrieves all assets on a specific Parachain as an object.

**Endpoint**: `GET /v2/assets/:node`


   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/Moonbeam");
```

### Query asset multilocation
The following endpoint retrieves asset multilocation from the asset ID or asset symbol.

**Endpoint**: `POST /v2/assets/:node/multilocation`


   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/:node/multilocation", {
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

**Endpoint**: `GET /v2/assets/:node/id?symbol=:symbol`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.
     - `symbol` (path parameter): Specifies the currency symbol of the asset.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `404` (Bad request): When an asset with a specified currency symbol does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/Interlay/id?symbol=USDT");
```

### Query Relay chain asset symbol
The following endpoint returns the Relay chain asset symbol for a specific Parachain.

**Endpoint**: `GET /v2/assets/:node/relay-chain-symbol`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.
    
   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/Astar/relay-chain-symbol");
```

### Query native assets
The following endpoint returns native assets of specific Parachain.

**Endpoint**: `GET /v2/assets/:node/native`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/Hydration/native");
```

### Query foreign assets
The following endpoint returns foreign assets of specific Parachain.

**Endpoint**: `GET /v2/assets/:node/other`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/Astar/other");
```

### Query all asset symbols
The following endpoint returns all asset symbols for specific Parachain.

**Endpoint**: `GET /v2/assets/:node/all-symbols`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/Moonbeam/all-symbols");
```

### Query asset support
The following endpoint returns a boolean value that confirms if the asset is registered on a specific Parachain or not.

**Endpoint**: `GET /v2/assets/:node/has-support?symbol=:symbol`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.
     - `symbol` (path parameter): Specifies the symbol of the asset.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `404` (Bad request): When an asset with a specified currency symbol does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/Hydration/has-support?symbol=DOT");
```

### Query asset support between two chains
The following endpoint retrieves assets supported by both chains.

**Endpoint**: `GET /v2/supported-assets?origin=:node&destination=:node`

- **Parameters**:
    - `node` (path parameter): Specifies the name of the Parachain.

- **Errors**:
    - `400` (Bad request): When a specified Parachain does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/supported-assets?origin=Acala&destination=Astar");
```

### Query destination existential deposit
The following endpoint retrieves whether sent XCM message will be above existential deposit on destination chain.

**Endpoint**: `POST /v2/balance/${node}/verify-ed-on-destination`


- **Parameters**:
    - `node` (path parameter): Specifies the name of the destination Parachain.
    - `address` (body parameter): Destination account
    - `currency` (body parameter): Currency spec

- **Errors**:
    - `400` (Bad request): When a specified Parachain does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/balance/:node/foreign", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        address: "Address", // Replace "Address" with wallet address (In AccountID32 or AccountKey20 Format) 
        currency: "Currency" //Replace "Currency" with {id: currencyID} | {symbol: currencySymbol} | {"symbol": {"type": "Native","value": "currencySymbol"} | {"symbol": {"type": "Foreign","value": "currencySymbol"} | {"symbol": {"type": "ForeignAbstract","value": "currencySymbolAlias"} | {multilocation: AssetMultilocationString} | {multilocation: AssetMultilocationJson}
    })
});
```

### Query asset decimals
The following endpoint retrieves specific asset decimals on specific Parachain.

**Endpoint**: `GET /v2/assets/:node/decimals?symbol=:symbol`

- **Parameters**:
    - `node` (path parameter): Specifies the name of the Parachain.
    - `symbol` (path parameter): Specifies the currency symbol.

- **Errors**:
    - `400` (Bad request): When a specified Parachain does not exist.
    - `404` (Bad request): When an asset with a specified currency symbol does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/Basilisk/decimals?symbol=BSX");
```

### Query Parachain ws endpoints
The following endpoint retrieves the Parachain's WS endpoints.

**Endpoint**: `GET /v2/nodes/:node/ws-endpoints`

- **Parameters**:
    - `parachain` (path parameter): Specifies the parachain ID.

- **Errors**:
    - `404` (Bad request): When a Parachain with a specified name does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/nodes/Acala/ws-endpoints");
```

### Query Parachain ID
The following endpoint retrieves Parachain's ID from Parachain's name

 **Endpoint**: `GET /v2/assets/:node/para-id`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.
   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/assets/Acala/para-id");
```

### Query Parachain name
The following endpoint retrieves the Parachain's name from the Parachain's ID.

**Endpoint**: `GET /v2/nodes/:paraId?ecosystem=eco`

- **Parameters**:
    - `paraId` (path parameter): Specifies the parachain ID.

- **Errors**:
    - `404` (Bad request): When a Parachain with a specified Parachain ID does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/nodes/2090?ecosystem=polkadot");
```

### Query list of implemented Parachains
The following endpoint retrieves an array of implemented Parachains.

**Endpoint**: `GET /v2/nodes`

   - **Parameters**: None.
   - **Errors**: 
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/nodes");
```

## Query XCM pallets

This functionality allows you to query the `XCM pallets` that Parachains currently support. 

### Package-less implementation of XCM API XCM Pallet Query features into your application

```ts
const response = await fetch(
    "http://localhost:3001/v2/pallets/<action>" + //Replace "action" with your desired action eg. "Acala/default" 
);

console.log(response) //use response data as necessary
```

### Get default XCM pallet
The following endpoint returns the default pallet for specific Parachain

**Endpoint**: `GET /v2/pallets/:node/default`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when path parameter 'node' is not a valid Parachain
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/pallets/Acala/default");
```

### Get all supported XCM pallets
The following endpoint returns all XCM Pallets that are supported on specific Parachain

**Endpoint**: `GET /v2/pallets/:node`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when path parameter 'node' is not a valid Parachain
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/pallets/Basilisk");
```

### Get node DryRun support
The following endpoint returns whether selected Parachain has DryRun support

**Endpoint**: `GET /v2/nodes/:node/has-dry-run-support`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when path parameter 'node' is not a valid Parachain
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v2/nodes/:node/has-dry-run-support');
```
