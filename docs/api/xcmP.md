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
    "http://localhost:3001/v5/x-transfer”,
{
	method: ‘POST’,
           	body: JSON.stringify({
                  "from": "origin",
                  "to": "destination",
                  "address": "address",
                  "currency": {currencySpec, amount: amount /*Use "ALL" to transfer everything*/},
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

### Parachain to Parachain (HRMP)
The following endpoint allows creation of Parachain to Parachain XCM call. This call is specified by Parachains selected as origin - `from` and destination - `to` parameters.

**Endpoint**: `POST /v5/x-transfer`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `currency: "42259045809535163221576417993425387648n"` will mean you wish to transfer xcDOT.

  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}

// Used to customize XCM version - Replace "Vx" with V and version number eg. "V4"
xcmVersion: "Vx"

// Used for customizing pallet name - Replace RandomXtokens with Camel case name of the pallet
pallet: 'RandomXTokens',

// Used for customizing pallet method - replace random_function with snake case name of the method
method: 'random_function'
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Location
        currency: {currency spec} //Refer to currency spec options above
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
        senderAddress: "senderAddress" //Optional but strongly recommended as it is automatically ignored when not needed - Used when origin is AssetHub with feeAsset or when sending to AssetHub to prevent asset traps by auto-swapping to DOT to have DOT ED.
        //ahAddress: ahAddress //Optional parameter - used when origin is EVM chain and XCM goes through AssetHub (Multihop transfer where we are unable to convert Key20 to ID32 address eg. origin: Moonbeam & destination: Ethereum (Multihop goes from Moonbeam > AssetHub > BridgeHub > Ethereum)
    })
});
```

### Relay chain to Parachain (DMP)
The following endpoint constructs the Relay chain to the Parachain XCM message.

**Endpoint**: `POST /v5/x-transfer`

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

  <details>

  <summary><b>Advanced settings</b></summary>
  
  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used to customize XCM version - Replace "Vx" with V and version number eg. "V4"
xcmVersion: "Vx"

// Used for customizing pallet name - Replace RandomXtokens with Camel case name of the pallet
pallet: 'RandomXTokens',

// Used for customizing pallet method - replace random_function with snake case name of the method
method: 'random_function'
```

  </details>

<details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
	    from: "Polkadot" // Or Kusama
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or Location
	    currency: { symbol: 'DOT', amount: amount /*Use "ALL" to transfer everything*/}, //symbol: 'KSM' || symbol: 'WND' || symbol: 'PAS'
        address: "Address", // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    })
});
```

### Parachain chain to Relay chain (UMP)
The following endpoint constructs Parachain to Relay chain XCM message.

**Endpoint**: `POST /v5/x-transfer`

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

  <details>

  <summary><b>Advanced settings</b></summary>
  
  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used to customize XCM version - Replace "Vx" with V and version number eg. "V4"
xcmVersion: "Vx"

// Used for customizing pallet name - Replace RandomXtokens with Camel case name of the pallet
pallet: 'RandomXTokens',

// Used for customizing pallet method - replace random_function with snake case name of the method
method: 'random_function'
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
	    from: "Parachain" // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Location
        to: "Polkadot",   // Or Kusama
	    currency: { symbol: 'DOT', amount: amount /*Use "ALL" to transfer everything*/}, //symbol: 'KSM' || symbol: 'WND' || symbol: 'PAS'
        address: "Address", // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    })
});
```

### Local transfers
The following endpoint allows  creation of Local asset transfers for any chain and any currency registered on it. This call is specified by same Parachain selected as origin - `from` and destination - `to` parameters.

**Endpoint**: `POST /v5/x-transfer`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

  If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `currency: "42259045809535163221576417993425387648n"` will mean you wish to transfer xcDOT.

  </details>

<details>

<summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

</details>

<details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
  }
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>


**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/x-transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Parachain', // Replace "Parachain" with sender Parachain, e.g., "Acala"
    to: 'Parachain' // Replace Parachain with same parameter as "from" parameter
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
  }),
});
```

### Custom location call
You can now customize locations for Address, Currency and Destination within all three scenarios (where possible).

   - **Parameters**:
        - Same as in above scenarios
   - **Errors**:
        - Same as in above scenarios

  <details>

  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used to customize XCM version - Replace "Vx" with V and version number eg. "V4"
xcmVersion: "Vx"

// Used for customizing pallet name - Replace RandomXtokens with Camel case name of the pallet
pallet: 'RandomXTokens',

// Used for customizing pallet method - replace random_function with snake case name of the method
method: 'random_function'
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**

```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain",   // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",    // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Location
        address: "Address", // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
        currency: {
          location: 
          type: 'Override',
          value: {
            parents: 0,
            interior: {
              X2: [{ PalletInstance: '50' }, { GeneralIndex: '41' }],
            },
          },
	amount: amount /*Use "ALL" to transfer everything*/
        },
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

<details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "AssetHubPolkadot", // Or AssetHubKusama
        to: "AssetHubKusama",   // Or AssetHubPolkadot
        currency: {symbol: "KSM", amount: amount /*Use "ALL" to transfer everything*/}, // Or DOT
        address: "Address" // AccountID 32 address
    })
});
```


### AssetHubPolkadot -> Ethereum

   - **Parameters**:
        - Same as in Parachain -> Parachain scenario
   - **Errors**:
        - Same as in Parachain -> Parachain scenario

<details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "AssetHubPolkadot", 
        to: "Ethereum",   
        currency: {symbol: "WETH", amount: amount /*Use "ALL" to transfer everything*/}, // Any supported asset - WBTC, WETH.. - {symbol: currencySymbol} | {id: currencyID}
        address: "Address" // Ethereum Address
    })
});
```

### Parachain -> Ethereum

   - **Parameters**:
        - Same as in Parachain -> Parachain scenario
   - **Errors**:
        - Same as in Parachain -> Parachain scenario

<details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", 
        to: "Ethereum",   
        currency: {symbol: "WETH", amount: amount /*Use "ALL" to transfer everything*/}, // Any supported asset - WBTC, WETH.. - {symbol: currencySymbol} | {id: currencyID}
        address: "Address", // Ethereum Address
        ahAddress: "Address", //Asset hub address (Needs to be sender address)
        senderAddress: "Address" //Origin chain sender address
    })
});
```

### Snowbridge health check
Query for Snowbridge status 

**Endpoint**: `GET /v5/x-transfer/eth-bridge-status`


   - **Parameters**:
     - No parameters required

   - **Errors**:
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer/eth-bridge-status");
```


## Batch call
XCM API allows you to batch your XCM calls and send multiple at the same time via batch feature.

**Endpoint** `POST /v5/x-transfer-batch`

  <details>
  <summary><b>Parameters</b> </summary>

  - `transfers` (Inside JSON body): (required): Represents array of XCM calls along with optional parameter "options" which contains "mode" to switch between BATCH and BATCH_ALL call forms.


  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when query parameter 'transfers' is expected but not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts

const response = await fetch("http://localhost:3001/v5/x-transfer-batch", {
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
			"currency": { symbol: "DOT", amount: amount /*Use "ALL" to transfer everything*/},
			"address": "0x939229F9c6E2b97589c4a5A0B3Eb8664FFc00502"
		},
		{
			"from": "Kusama"
			"to": "Basilisk",
			"currency": { symbol: "DOT", amount: amount /*Use "ALL" to transfer everything*/},
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

**Endpoint**: `POST /v5/asset-claim`

  <details>
  <summary><b>Parameters</b> </summary>

  - `from` (Inside JSON body): (required): Represents the Parachain on which the asset will be claimed.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `currency` (Inside JSON body): (required): Represents the asset being claimed. It should be a location.


  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'from' is not provided
  - `400`  (Bad request exception) - Returned when parameter 'address' is not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/asset-claim", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "from" with the numeric value you wish to transfer
        address: "Address", // Replace "address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
        currency: "Asset Location array" //Replace "Asset location array" with specific asset location along with amount specification
    })
});

//Example of asset location array:
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

**Endpoint**: `POST /v5/dry-run`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  </details>

  <details>
  <summary><b>Possible output objects</b></summary>

```
origin - Always present
assetHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/dry-run', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Dry run preview
Using preview with dry-run you can find out the result of the call for fictional amount of the currency. Essentially allowing you to demo calls with custom asset amounts. 

**Endpoint**: `POST /v5/dry-run-preview`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  </details>

  <details>
  <summary><b>Possible output objects</b></summary>

```
origin - Always present
assetHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  }
  mintFeeAssets: true //false by default - Mints fee assets also, if user does not have enough to cover fees on origin
})
```

</details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/dry-run-preview', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
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

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
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
          amount: "10000000"
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

## Localhost testing setup II

API now allows you to use prederived accounts for testing (As sender or receiver address). For example Alice, Bob, Charlie, Alith, Balthathar and others.

**Endpoint**: `POST /v5/sign-and-submit`

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

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/sign-and-submit", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        senderAddress: "//Alice", //You can use prederived accounts - //Alice, //Bob... //Alith, //Balthathar...
        address: "0x1501C1413e4178c38567Ada8945A80351F7B8496", //You can also use prederived accounts here - //Alice, //Bob... //Alith, //Balthathar...
        from: "Hydration",
        to: "Moonbeam",
        currency: {
          symbol: "HDX",
          amount: "10"
        },
        options: {
          development: true, // Optional: Enforces overrides for all chains used
          decimalAbstraction: true // Abstracts decimals, so 1 as input amount equals 10_000_000_000 if selected asset is DOT
          xcmFormatCheck: true // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
          apiOverrides: {
            Hydration: "ws://127.0.0.1:8000", //Only works with locally launched chains (Eg. chopsticks)
            Moonbeam: "ws://127.0.0.1:8001" //Only works with locally launched chains (Eg. chopsticks)
          }
        }
    })
});
```

## XCM Transfer info
To comprehensively assess whether a message will execute successfully without failure, use this query. It provides detailed information on currency balances before and after the transaction, including all relevant fees. This data is essential for accurately evaluating potential balance or fee-related issues that could cause message failure.

**Endpoint**: `POST /v5/transfer-info`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
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
assetHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/transfer-info' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Transferable amount
To retrieve information on how much of the selected currency can be transfered from specific account you can use transferable balance. 

**Endpoint**: `POST /v5/transferable-amount`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
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

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/transferable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Minimal transferable amount
You can use the minimal transferable balance to retrieve information on minimum of the selected currency can be transferred from a specific account to specific destination, so that the ED and destination or origin fee is paid fully.

**Endpoint**: `POST /v5/min-transferable-amount`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  </details>

  <details>
  <summary><b>Notes</b> </summary>

 This query will calculate minimal transferable balance using the following formulae: 

**(Origin Balance - if(Balance on destination = 0) then also substract destination ED(Existential deposit) - if(Asset=native) then also substract Origin XCM Fees - hop fees (If present) - destination XCM fee) +1**

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will go through). Chains that do not have support for dryrun will return error in this query.


  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/min-transferable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Predicted received amount
You can predict the amount to be received on destination, granted, that the destination chain and hops have dry-run.

**Endpoint**: `POST /v5/receivable-amount`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
})
```

</details>

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/receivable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Verify ED on destination
To retrieve information on whether the selected currency from specific account will meet existential deposit on destination chain you can use this query. 

**Endpoint**: `POST /v5/verify-ed-on-destination`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
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

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

  </details>

  <details>

  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>
     
**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/verify-ed-on-destination' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Parachain', // Replace "Parachain" with sender Parachain or Relay chain, e.g., "Acala"
    to: 'Parachain', // Replace "Parachain" with destination Parachain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## XCM Fee (Origin & Dest.)

The following endpoint allows is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by either origin or destination. 

**Endpoint**: `POST /v5/xcm-fee`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
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
assetHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

  </details>

  <details>
  
  <summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  </details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/xcm-fee", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Location
        currency: { currencySpec }, // Refer to currency spec options above
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
        /*disableFallback: "True" //Optional parameter - if enabled it disables fallback to payment info if dryrun fails only returning dryrun error but no fees.*/
    })
});
```

## XCM Fee (Origin only)
Following queries allow you to query XCM fee from Origin chain. The query is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by origin. 

**Endpoint**: `POST /v5/origin-xcm-fee`

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
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
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

<details>

<summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
{location: Override('Custom Location'), amount: amount /*Use "ALL" to transfer everything*/} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount /*Use "ALL" to transfer everything*/} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount /*Use "ALL" to transfer everything*/} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount /*Use "ALL" to transfer everything*/}, {currencySelection}, ..]
```

</details>

<details>

<summary><b>Advanced settings</b></summary>

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}

//If enabled it disables fallback to payment info if dryrun fails only returning dryrun error but no fees.
disableFallback: "True" 
```
  
</details>

  <details>
<summary><b>Advanced API settings</b></summary>

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

</details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/origin-xcm-fee", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Location
        currency: { currencySpec }, // Refer to currency spec options above
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
    })
});
```

## SS58 Address conversion
Following functionality allows you to convert any SS58 address to Parachain specific address.

 **Endpoint**: `GET /v5/convert-ss58?address=:address&chain=:chain`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (query parameter): Specifies the name of the Parachain.
  - `address` (query parameter): Specifies the SS58 Address.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `400` (Bad request): When a specified Address is not provided.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/convert-ss58?address=:address&chain=:chain');
```

## Asset queries
This functionality allows you to perform various asset queries with compatible Parachains.

### Package-less implementation of XCM API Asset features into your application

```ts
const response = await fetch(
    "http://localhost:3001/v5/assets/<action>" + //Replace "action" with your desired action eg. "Acala/native" 
);

console.log(response) //use response data as necessary
```

### Query asset paths
The following endpoint allows you to query the asset paths related to origin chain.

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

</details>


**Endpoint**: `POST /v5/assets/:chain/supported-destinations`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (Path parameter): Specifies the name of the Parachain.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'chain' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/:chain/supported-destinations", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        currency: {currency spec} //Refer to currency spec options above
    })
});
```

### Query asset balance
The following endpoint allows you to query asset balance for on specific chain.

**Endpoint**: `POST /v5/balance/:chain`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (Path parameter): Specifies the name of the Parachain.
  - `address` (Inside JSON body): (required): Specifies the address of the account.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'chain' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'address' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

</details>


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/balance/:chain/asset", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        address: "Address" // Replace "Address" with wallet address (In AccountID32 or AccountKey20 Format) 
        currency: {currencySpec}, // Refer to currency spec options above
    })
});
```

### Query asset existential deposit
The following endpoint allows you to query the existential deposit for currency in a specific chain.

**Endpoint**: `POST /v5/balance/:chain/existential-deposit`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (Path parameter): Specifies the name of the Parachain.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when parameter 'chain' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount} 
```

Asset selection of multiple assets:
```ts
[{currencySelection /*for example symbol: symbol or id: id, or location: location*/, amount: amount}, {currencySelection}, ..]
```

 </details>


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/balance/:chain/existential-deposit", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        currency: {CurrencySpec} // Refer to currency spec options above
    })
});
```

### Query Fee assets
The following endpoint retrieves Fee asset queries (Assets accepted as XCM Fee on specific chain)

**Endpoint**: `GET /v5/assets/:chain/fee-assets`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/assets/:chain/fee-assets');
```

### Query assets object
The following endpoint retrieves all assets on a specific Parachain as an object.

**Endpoint**: `GET /v5/assets/:chain`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Moonbeam");
```

### Query asset Location
The following endpoint retrieves asset location from the asset ID or asset symbol.

**Endpoint**: `POST /v5/assets/:chain/location`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount} 
```

 </details>


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/:chain/location", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        currency: {currencySpec} // Refer to currency spec options above
    })
});
```

### Query asset Location
The following endpoint retrieves asset location from the asset ID or asset symbol.

**Endpoint**: `POST /v5/assets/:chain/asset-info`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.
  - `currency` (body parameter): Specifies currency 
  - `destination` (optional body parameter): Specifies destination (When Ethereum is chosen as destination)

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `400` (Bad request): When a specified Asset does not exist.
  - `400` (Bad request): When a specified Currency does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

  <details>

  <summary><b>Currency spec options</b></summary>
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
{location: Override('Custom Location'), amount: amount} //Advanced override of asset registry
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Not all chains register assets under IDs
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 

// Used when multiple assets under same symbol are registered, this selection will prefer chains native assets
{symbol: {type: Native, value: 'currencySymbol'}, amount: amount}

// Used when multiple assets under same symbol are registered, this selection will prefer chains foreign assets
{symbol: {type: Foreign, value: 'currencySymbol'}, amount: amount} 

// Used when multiple foreign assets under same symbol are registered, this selection will prefer selected abstract asset (They are given as option when error is displayed)
{symbol: {type: ForeignAbstract, value: 'currencySymbol'}, amount: amount} 
```

 </details>


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/:chain/asset-info", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        currency: "Currency" //Replace "Currency" with {id: currencyID} | {symbol: currencySymbol} | {"symbol": {"type": "Native","value": "currencySymbol"} | {"symbol": {"type": "Foreign","value": "currencySymbol"} | {"symbol": {"type": "ForeignAbstract","value": "currencySymbolAlias"}
        destination?: "CHAIN"
    })
});
```

### Query asset ID
The following endpoint returns the asset id for the specific asset on a specific Parachain.

**Endpoint**: `GET /v5/assets/:chain/id?symbol=:symbol`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.
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
const response = await fetch("http://localhost:3001/v5/assets/Interlay/id?symbol=USDT");
```

### Query Relay chain asset symbol
The following endpoint returns the Relay chain asset symbol for a specific Parachain.

**Endpoint**: `GET /v5/assets/:chain/relay-chain-symbol`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>
    
**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Astar/relay-chain-symbol");
```

### Query native assets
The following endpoint returns native assets of specific Parachain.

**Endpoint**: `GET /v5/assets/:chain/native`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Hydration/native");
```

### Query foreign assets
The following endpoint returns foreign assets of specific Parachain.

**Endpoint**: `GET /v5/assets/:chain/other`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Astar/other");
```

### Query all asset symbols
The following endpoint returns all asset symbols for specific Parachain.

**Endpoint**: `GET /v5/assets/:chain/all-symbols`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Moonbeam/all-symbols");
```

### Query asset support
The following endpoint returns a boolean value that confirms if the asset is registered on a specific Parachain or not.

**Endpoint**: `GET /v5/assets/:chain/has-support?symbol=:symbol`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.
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
const response = await fetch("http://localhost:3001/v5/assets/Hydration/has-support?symbol=DOT");
```

### Query asset support between two chains
The following endpoint retrieves assets supported by both chains.

**Endpoint**: `GET /v5/supported-assets?origin=:chain&destination=:chain`

  <details>
  <summary><b>Parameters</b> </summary>

  - `origin` (path parameter): Specifies the name of the Parachain.
  - `destination` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/supported-assets?origin=Acala&destination=Astar");
```

### Query asset decimals
The following endpoint retrieves specific asset decimals on specific Parachain.

**Endpoint**: `GET /v5/assets/:chain/decimals?symbol=:symbol`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.
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
const response = await fetch("http://localhost:3001/v5/assets/Basilisk/decimals?symbol=BSX");
```

### Query Parachain ws endpoints
The following endpoint retrieves the Parachain's WS endpoints.

**Endpoint**: `GET /v5/chains/:chain/ws-endpoints`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/chains/Acala/ws-endpoints");
```

### Query Parachain ID
The following endpoint retrieves Parachain's ID from Parachain's name

 **Endpoint**: `GET /v5/chains/:chain/para-id`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/chains/Acala/para-id");
```

### Query Parachain name
The following endpoint retrieves the Parachain's name from the Parachain's ID. (Options for ecosystem - Polkadot, Kusama, Passeo, Westend, Ethereum)

**Endpoint**: `GET /v5/chains/:paraId?ecosystem=eco`

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
const response = await fetch("http://localhost:3001/v5/chains/2090?ecosystem=Polkadot");
```

### Query list of implemented Parachains
The following endpoint retrieves an array of implemented Parachains.

**Endpoint**: `GET /v5/chains`

   - **Parameters**: None.
   - **Errors**: 
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/chains");
```

## XCM pallet queries

This functionality allows you to query the `XCM pallets` that Parachains currently support. 

### Package-less implementation of XCM API XCM Pallet Query features into your application

```ts
const response = await fetch(
    "http://localhost:3001/v5/pallets/<action>" + //Replace "action" with your desired action eg. "Acala/default" 
);

console.log(response) //use response data as necessary
```

### Get default XCM pallet
The following endpoint returns the default pallet for specific Parachain

**Endpoint**: `GET /v5/pallets/:chain/default`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/pallets/Acala/default");
```

### Get XCM pallet index
The following endpoint returns the index of specific cross-chain pallet for specific chain.

**Endpoint**: `GET /v5/pallets/:chain/index`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.
  - `pallet` (query parameter): Specifies the name of the cross-chain pallet.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when path parameter 'chain' is not a valid Parachain
  - `400`  (Bad request exception) - Returned when query parameter 'pallet' is not a valid cross-chain pallet
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/pallets/Acala/index?pallet=XTokens');
```

### Get all supported XCM pallets
The following endpoint returns all XCM Pallets that are supported on specific Parachain

**Endpoint**: `GET /v5/pallets/:chain`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/pallets/Basilisk");
```

### Get chain DryRun support
The following endpoint returns whether selected Parachain has DryRun support

**Endpoint**: `GET /v5/chains/:chain/has-dry-run-support`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/chains/:chain/has-dry-run-support');
```

### Print local pallets for native assets
Following endpoint returns all pallets for local transfers of native assets for specific chain.

**Endpoint**: `GET /v5/pallets/:chain/native-assets`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/pallets/:chain/native-assets');
```


### Print local pallets for foreign assets
Following endpoint returns all pallets for local transfers of foreign assets for specific chain.

**Endpoint**: `GET /v5/pallets/:chain/other-assets`

  <details>
  <summary><b>Parameters</b> </summary>

  - `chain` (path parameter): Specifies the name of the Parachain.

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400` (Bad request): When a specified Parachain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  </details>

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/pallets/:chain/other-assets');
```
