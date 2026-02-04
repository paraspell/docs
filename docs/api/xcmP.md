# Use XCM SDK🪄 within XCM API
The following guide guides you through the XCM SDK functionality implemented in XCM API.

## Send XCM
This functionality allows you to send XCM messages across the Paraverse.

### Example package-less implementation of XCM API XCM features into your application

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

### Substrate to Substrate (HRMP)
The following endpoint enables the creation of a variety of `Substrate-to-Substrate` XCM calls. It provides a unified interface for constructing cross-chain messages between Substrate-based networks using XCM. This endpoint is intended to simplify interoperability workflows and reduce the complexity of composing XCM transactions programmatically.

**Endpoint**: `POST /v5/x-transfer`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `xcmVersion` (Inside JSON body): (optional): Specifies manually selected XCM version if pre-selected does not work. Format: Vx - where x = version number eg. V4.

 :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Notes

When transferring from Chain that uses long IDs for example Moonbeam make sure to add character `n` at the end of currencyID. For example: `.currency({id: 42259045809535163221576417993425387648n, amount: 123})` will mean that you have selected to transfer xcDOT.

  :::

  ::: details Currency spec options
  
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

  :::

  ::: details Advanced settings

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
  
  :::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "TChain", // Replace "TChain" with sender Chain, for example, "Acala" or "Polkadot"
        to: "TChain",   // Replace "TChain" with destination Chain, for example, "Hydration" or custom Location
        currency: {currency spec} //Refer to currency spec options above
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
        senderAddress: "senderAddress" //Optional but strongly recommended as it is automatically ignored when not needed - Used when origin is AssetHub with feeAsset or when sending to AssetHub to prevent asset traps by auto-swapping to DOT to have DOT Existential deposit.
        //ahAddress: ahAddress //Optional parameter - used when origin is EVM chain and XCM goes through AssetHub (Multihop transfer where we are unable to convert Key20 to ID32 address eg. origin: Moonbeam & destination: Ethereum (Multihop goes from Moonbeam > AssetHub > BridgeHub > Ethereum)
    })
});
```

## Local transfers
The following endpoint allows  creation of Local asset transfers for any chain and any currency registered on it. This call is specified by same Chain selected as origin - `from` and destination - `to` parameters.

**Endpoint**: `POST /v5/x-transfer`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain on which the asset is transfered locally.
  - `to` (Inside JSON body): (required): Represents the Chain on which the asset is transfered locally.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `400`  (Bad request exception) - Returned when query parameter 'keepAlive' does not have valid input
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Notes

When transferring from Chain that uses long IDs for example Moonbeam make sure to add character `n` at the end of currencyID. For example: `.currency({id: 42259045809535163221576417993425387648n, amount: 123})` will mean that you have selected to transfer xcDOT.

  :::

::: details Currency spec options
  
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

:::

::: details Advanced API settings

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

:::


**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/x-transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Chain', // Replace "Chain" with sender Chain, e.g., "Acala"
    to: 'Chain' // Replace Chain with same parameter as "from" parameter
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
 /* keepAlive: bool - Optional: Allows draining the account below the existential deposit. */
  }),
});
```

## Transact
The Api gives the ability to perform Transact, which enables execution of calls on a remote chain in the context of the destination environment. This allows applications to trigger cross-chain actions without direct interaction from users on the target chain.

**Endpoint**: `POST /v5/x-transfer`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain on which the asset is transfered locally.
  - `to` (Inside JSON body): (required): Represents the Chain on which the asset is transfered locally.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender.
  - `transact` (Inside JSON body): (required): Specifies the transact which should execute on destination.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `400`  (Bad request exception) - Returned when body of 'transact' is not a valid
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Notes

`V3` and `V4` Transact cannot transfer currency and transact in same call. You need to deposit currencies into sovereign account of the origin account on destination chain - its location is `(Parent, Parachain: Original Parachain, Account)`. This address can be calculated with following API: `locationToAccountApi.convert_location`. The `.currency()` parameter serves for specifying in which currency should the SDK buy execution, so amount parameter can be random number (Only applies for calls to/from V3/V4 chains).

`V5` is able to transfer and transact at the same time, so `amount` parameter in `.currency()` needs to be filled accordingly because the amount being transferred is also used to buy execution.

When transferring from Chain that uses long IDs for example Moonbeam make sure to add character `n` at the end of currencyID. For example: `.currency({id: 42259045809535163221576417993425387648n, amount: 123})` will mean that you have selected to transfer xcDOT.
 
  :::

::: details Currency spec options

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

:::

::: details Advanced API settings

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

:::


**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/x-transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Chain', // Replace "Chain" with sender Chain, e.g., "Acala"
    to: 'Chain' // Replace Chain with same parameter as "from" parameter
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'SenderAddress' //Replace "SenderAddress" with sender wallet address (In AccountID32 or AccountKey20 Format)
    transact: {
      hex: Destination call hex //Function that should execute on destination
    /*originKind: "SovereignAccount" || "XCM" || "Native" || "SuperUser" - Optional, "SovereignAccount" by default
      maxWeight: { proofSize: string, refTime: string } - Optional, autofilled by default (Utilized in V3 and V4 as maxFallbackWeight parameter)
    }
  }),
});
```

## Dry run
You can determine whether your XCM message will execute successfully or fail with an error. The XCM message dry run provides a concrete execution error, allowing you to validate the message before submission. This makes it possible to verify correct execution without ever submitting the XCM message on-chain.

**Endpoint**: `POST /v5/dry-run`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Possible output objects

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

  :::

  ::: details Currency spec options
  
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

  :::

  ::: details Advanced settings

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/dry-run', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Dry run preview
By using preview with dry-run, you can determine the result of a call using a fictional currency amount. This effectively allows you to simulate and demo calls with custom asset values of assets you don't need to own.

**Endpoint**: `POST /v5/dry-run-preview`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Possible output objects

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

  :::

  ::: details Currency spec options
  
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

  :::

  ::: details Advanced settings

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/dry-run-preview', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Ecosystem Bridges
List of available bridges in XCM SDK. Implementing cross-ecosystem asset transfers was never this easy!


### Polkadot<>Kusama bridge
   - **Parameters**:
        - Same as in Chain -> Chain scenario
   - **Errors**:
        - Same as in Chain -> Chain scenario

::: details Advanced API settings

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

:::

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
        currency: {symbol: "KSM", amount: amount /*Use "ALL" to transfer everything*/}, // DOT | USDT | USDC
        address: "Address" // AccountID 32 address
    })
});
```


### AssetHubPolkadot -> Ethereum

   - **Parameters**:
        - Same as in Chain -> Chain scenario
   - **Errors**:
        - Same as in Chain -> Chain scenario

::: details Advanced API settings

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

:::

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
        - Same as in Substrate ->Substrate scenario
   - **Errors**:
        - Same as in Substrate -> Substrate scenario

::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", 
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

  ::: details Parameters

  - `transfers` (Inside JSON body): (required): Represents array of XCM calls along with optional parameter "options" which contains "mode" to switch between BATCH and BATCH_ALL call forms.


  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameter 'transfers' is expected but not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts

const response = await fetch("http://localhost:3001/v5/x-transfer-batch", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        transfers: "Chain", // Replace "transfers" with array of XCM transfers
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
Assets that have been trapped in the cross-chain transfers can be recovered through the asset claim feature.

**Endpoint**: `POST /v5/asset-claim`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain on which the asset will be claimed.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `currency` (Inside JSON body): (required): Represents the asset being claimed. It should be a location.


  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when parameter 'from' is not provided
  - `400`  (Bad request exception) - Returned when parameter 'address' is not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/asset-claim", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", // Replace "from" with the numeric value you wish to transfer
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

## Localhost testing setup

API offers enhanced localhost support. You can pass an object called options containing overrides for all WS endpoints (Including hops) used in the test transfer. This allows for advanced localhost testing such as localhost dry-run or xcm-fee queries.

**Endpoint**: `Any that can leverage this feature` (From transfers, dry-run to xcm-fee queries)

  ::: details Parameters

  - Inherited from concrete endpoint

  :::

  ::: details Errors

  - Inherited from concrete endpoint
    
  :::

  ::: details Notes

  
- **Options Object**  
  The `xcm-api` accepts an options object in the request body for endpoints such as `/x-transfer`. This object supports the same parameters as the SDK.

- **`apiOverrides` Property**  
  The `apiOverrides` property is a map where:
  - **Keys** represent chain names (for example, `Hydration`, `BridgeHubPolkadot`)
  - **Values** are either:
    - A WebSocket endpoint URL  
    - An array of WebSocket endpoint URLs  
    - An instantiated API client

- **Development Mode**  
  When the development flag is set to `true`, the SDK will throw a `MissingChainApiError` if an operation involves a chain that does not have a corresponding entry in `apiOverrides`. This behavior ensures that, in testing environments, the SDK does not fall back to production endpoints.

  :::

  ::: details Advanced API settings

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

:::

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

API allows you to use prederived accounts for testing (As sender or receiver address). For example Alice, Bob, Charlie, Alith, Balthathar and others.

**Endpoint**: `POST /v5/sign-and-submit`

  ::: details Parameters

  - Inherited from concrete endpoint

  :::

  ::: details Errors

  - Inherited from concrete endpoint
    
  :::

  ::: details Notes

  
- **Options Object**  
  The `xcm-api` accepts an options object in the request body for endpoints such as `/x-transfer`. This object supports the same parameters as the SDK.

- **`apiOverrides` Property**  
  The `apiOverrides` property is a map where:
  - **Keys** represent chain names (for example, `Hydration`, `BridgeHubPolkadot`)
  - **Values** are either:
    - A WebSocket endpoint URL  
    - An array of WebSocket endpoint URLs  
    - An instantiated API client

- **Development Mode**  
  When the development flag is set to `true`, the SDK will throw a `MissingChainApiError` if an operation involves a chain that does not have a corresponding entry in `apiOverrides`. This behavior ensures that, in testing environments, the SDK does not fall back to production endpoints.

  :::

  ::: details Advanced API settings

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

:::

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

## XCM Fee (Origin & Dest.)

The following endpoint allows is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by either origin or destination. 

**Endpoint**: `POST /v5/xcm-fee`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the XCM sender.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Note

 When transferring from Chain that uses long IDs for example Moonbeam make sure to add character `n` at the end of currencyID. For example: `.currency({id: 42259045809535163221576417993425387648n, amount: 123})` will mean that you have selected to transfer xcDOT.

  :::

  ::: details Possible output objects

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

  :::

  ::: details Currency spec options
  
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

  :::

  ::: details Advanced settings

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}

//If enabled it disables fallback to payment info if dryrun fails only returning dryrun error but no fees.
disableFallback: "True" 
```
  
  :::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/xcm-fee", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", // Replace "Chain" with sender Chain, e.g., "Acala"
        to: "Chain",   // Replace "Chain" with destination Chain, e.g., "Moonbeam" or custom Location
        currency: { currencySpec }, // Refer to currency spec options above
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
    })
});
```

## XCM Fee (Origin only)
Following queries allow you to query XCM fee from Origin chain. The query is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by origin. 

**Endpoint**: `POST /v5/origin-xcm-fee`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the XCM sender.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Note
 When transferring from Chain that uses long IDs for example Moonbeam make sure to add character `n` at the end of currencyID. For example: `.currency({id: 42259045809535163221576417993425387648n, amount: 123})` will mean that you have selected to transfer xcDOT.

  :::

  ::: details Possible output objects

```
origin - Always present
```

  :::

::: details Currency spec options
  
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

:::

::: details Advanced settings

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}

//If enabled it disables fallback to payment info if dryrun fails only returning dryrun error but no fees.
disableFallback: "True" 
```
  
:::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/origin-xcm-fee", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", // Replace "Chain" with sender Chain, e.g., "Acala"
        to: "Chain",   // Replace "Chain" with destination Chain, e.g., "Moonbeam" or custom Location
        currency: { currencySpec }, // Refer to currency spec options above
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        senderAddress: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
    })
});
```

## XCM Transfer info
To comprehensively assess whether a message will execute successfully without failure, use this query. It provides detailed information on currency balances before and after the transaction, including all relevant fees. This data is essential for accurately evaluating potential balance or fee-related issues that could cause message failure.

**Endpoint**: `POST /v5/transfer-info`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Possible output objects

```
chain - Always present
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

  :::

  ::: details Currency spec options
  
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

  :::

  ::: details Advanced settings

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/transfer-info' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Transferable amount
To retrieve information on how much of the selected currency can be transfered from specific account you can use transferable balance. 

**Endpoint**: `POST /v5/transferable-amount`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Notes

  This query will calculate transferable balance using following formulae: 

  ```
  Balance - Existential deposit - if(asset=native) then also substract Origin XCM Fees else ignore
  ```

  **Beware**: If DryRun fails function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will actually go through).

  :::

  ::: details Currency spec options
  
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

  :::

  ::: details Advanced settings

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/transferable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Minimal transferable amount
You can use the minimal transferable balance to retrieve information on minimum of the selected currency can be transferred from a specific account to specific destination, so that the Existential deposit and destination or origin fee is paid fully.

**Endpoint**: `POST /v5/min-transferable-amount`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Notes

 This query will calculate minimal transferable balance using the following formulae: 

```
(Origin Balance - if(Balance on destination = 0) then also substract destination Existential deposit - if(Asset=native) then also substract Origin XCM Fees - hop fees (If present) - destination XCM fee) +1
```

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will go through). Chains that do not have support for dryrun will return error in this query.


  :::

  ::: details Currency spec options
  
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

  :::

  ::: details Advanced settings

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/min-transferable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Predicted received amount
You can predict the amount to be received on destination, granted, that the destination chain and hops have dry-run.

**Endpoint**: `POST /v5/receivable-amount`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Currency spec options
  
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

  :::

  ::: details Advanced settings

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

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

:::

**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/receivable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Verify ED on destination
To retrieve information on whether the selected currency from specific account will meet existential deposit on destination chain you can use this query. 

**Endpoint**: `POST /v5/verify-ed-on-destination`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `address` (Inside JSON body): (required): Specifies the address of the recipient.
  - `senderAddress` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Notes

  This query will calculate whether user has will have enough to cover existential deposit on XCM arrival using following pseudo formulae: 

  ```
  (if(Balance) || if(TransferedAmount - Existential deposit - Destination Fee > 0)) return true else false
  ``` 

  **Beware**: If DryRun fails function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will actually go through). **If function switches to PaymentInfo and transfered currency is different than native currency on destination chain the function throws error as PaymentInfo only returns fees in native asset of the chain.**

  :::

  ::: details Currency spec options
  
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

  :::

  ::: details Advanced settings

  You can use following optional advanced settings by adding them as parameter into request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

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

:::
     
**Example of request:**
```ts
const response = await fetch(
  'http://localhost:3001/v5/verify-ed-on-destination' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Moonbeam" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    address: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    senderAddress: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## SS58 Address conversion
Following functionality allows you to convert any SS58 address to Chain specific address.

 **Endpoint**: `GET /v5/convert-ss58?address=:address&chain=:chain`

  ::: details Parameters

  - `chain` (query parameter): Specifies the name of the Chain.
  - `address` (query parameter): Specifies the SS58 Address.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `400` (Bad request): When a specified Address is not provided.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/convert-ss58?address=:address&chain=:chain');
```

## Asset queries
This functionality allows you to perform various asset queries with compatible Chains.

### Example of package-less implementation of XCM API Asset features into your application

```ts
const response = await fetch(
    "http://localhost:3001/v5/assets/<action>" + //Replace "action" with your desired action eg. "Acala/native" 
);

console.log(response) //use response data as necessary
```

### Query asset paths
The following endpoint allows you to query the asset paths related to origin chain.

**Endpoint**: `POST /v5/assets/:chain/supported-destinations`

  ::: details Currency spec options
  
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

:::

  ::: details Parameters

  - `chain` (Path parameter): Specifies the name of the Chain.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when parameter 'chain' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

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

  ::: details Parameters

  - `chain` (Path parameter): Specifies the name of the Chain.
  - `address` (Inside JSON body): (required): Specifies the address of the account.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when parameter 'chain' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'address' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Currency spec options
  
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

:::


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

  ::: details Parameters

  - `chain` (Path parameter): Specifies the name of the Chain.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when parameter 'chain' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

  ::: details Currency spec options
  
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

 :::


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

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/assets/:chain/fee-assets');
```

### Query assets object
The following endpoint retrieves all assets on a specific Chain as an object.

**Endpoint**: `GET /v5/assets/:chain`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Moonbeam");
```

### Query asset Location
The following endpoint retrieves asset location from the asset ID or asset symbol.

**Endpoint**: `POST /v5/assets/:chain/location`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

  ::: details Currency spec options
  
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

 :::


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

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.
  - `currency` (body parameter): Specifies currency 
  - `destination` (optional body parameter): Specifies destination (When Ethereum is chosen as destination)

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `400` (Bad request): When a specified Asset does not exist.
  - `400` (Bad request): When a specified Currency does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

  ::: details Currency spec options
  
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

 :::


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
The following endpoint returns the asset id for the specific asset on a specific Chain.

**Endpoint**: `GET /v5/assets/:chain/id?symbol=:symbol`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.
  - `symbol` (path parameter): Specifies the currency symbol of the asset.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `404` (Bad request): When an asset with a specified currency symbol does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Interlay/id?symbol=USDT");
```

### Query Relay chain asset symbol
The following endpoint returns the Relay chain asset symbol for a specific Chain.

**Endpoint**: `GET /v5/assets/:chain/relay-chain-symbol`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::
    
**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Astar/relay-chain-symbol");
```

### Query native assets
The following endpoint returns native assets of specific Chain.

**Endpoint**: `GET /v5/assets/:chain/native`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Hydration/native");
```

### Query foreign assets
The following endpoint returns foreign assets of specific Chain.

**Endpoint**: `GET /v5/assets/:chain/other`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Astar/other");
```

### Query all asset symbols
The following endpoint returns all asset symbols for specific Chain.

**Endpoint**: `GET /v5/assets/:chain/all-symbols`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Moonbeam/all-symbols");
```

### Query asset support
The following endpoint returns a boolean value that confirms if the asset is registered on a specific Chain or not.

**Endpoint**: `GET /v5/assets/:chain/has-support?symbol=:symbol`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.
  - `symbol` (path parameter): Specifies the symbol of the asset.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `404` (Bad request): When an asset with a specified currency symbol does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Hydration/has-support?symbol=DOT");
```

### Query asset support between two chains
The following endpoint retrieves assets supported by both chains.

**Endpoint**: `GET /v5/supported-assets?origin=:chain&destination=:chain`

  ::: details Parameters

  - `origin` (path parameter): Specifies the name of the Chain.
  - `destination` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/supported-assets?origin=Acala&destination=Astar");
```

### Query asset decimals
The following endpoint retrieves specific asset decimals on specific Chain.

**Endpoint**: `GET /v5/assets/:chain/decimals?symbol=:symbol`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.
  - `symbol` (path parameter): Specifies the currency symbol.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `404` (Bad request): When an asset with a specified currency symbol does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/assets/Basilisk/decimals?symbol=BSX");
```

### Query Chain ws endpoints
The following endpoint retrieves the Chain's WS endpoints.

**Endpoint**: `GET /v5/chains/:chain/ws-endpoints`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/chains/Acala/ws-endpoints");
```

### Query Chain ID
The following endpoint retrieves Chain's ID from Chain's name

 **Endpoint**: `GET /v5/chains/:chain/para-id`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/chains/Acala/para-id");
```

### Query Chain name
The following endpoint retrieves the Chain's name from the Chain's ID. (Options for ecosystem - Polkadot, Kusama, Passeo, Westend, Ethereum)

**Endpoint**: `GET /v5/chains/:paraId?ecosystem=eco`

  ::: details Parameters

  - `paraId` (path parameter): Specifies the Chain ID.

  :::

  ::: details Errors

  - `404` (Bad request): When a Chain with a specified Chain ID does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/chains/2090?ecosystem=Polkadot");
```

### Query list of implemented Chains
The following endpoint retrieves an array of implemented Chains.

**Endpoint**: `GET /v5/chains`

   - **Parameters**: None.
   - **Errors**: 
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/chains");
```

## XCM pallet queries

This functionality allows you to query the `XCM pallets` that Chains currently support. 

### Package-less implementation of XCM API XCM Pallet Query features into your application

```ts
const response = await fetch(
    "http://localhost:3001/v5/pallets/<action>" + //Replace "action" with your desired action eg. "Acala/default" 
);

console.log(response) //use response data as necessary
```

### Get default XCM pallet
The following endpoint returns the default pallet for specific Chain

**Endpoint**: `GET /v5/pallets/:chain/default`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/pallets/Acala/default");
```

### Get XCM pallet index
The following endpoint returns the index of specific cross-chain pallet for specific chain.

**Endpoint**: `GET /v5/pallets/:chain/index`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.
  - `pallet` (query parameter): Specifies the name of the cross-chain pallet.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when path parameter 'chain' is not a valid Chain
  - `400`  (Bad request exception) - Returned when query parameter 'pallet' is not a valid cross-chain pallet
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue

  :::

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/pallets/Acala/index?pallet=XTokens');
```

### Get all supported XCM pallets
The following endpoint returns all XCM Pallets that are supported on specific Chain

**Endpoint**: `GET /v5/pallets/:chain`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/pallets/Basilisk");
```

### Get chain DryRun support
The following endpoint returns whether selected Chain has DryRun support

**Endpoint**: `GET /v5/chains/:chain/has-dry-run-support`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/chains/:chain/has-dry-run-support');
```

### Print local pallets for native assets
Following endpoint returns all pallets for local transfers of native assets for specific chain.

**Endpoint**: `GET /v5/pallets/:chain/native-assets`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/pallets/:chain/native-assets');
```


### Print local pallets for foreign assets
Following endpoint returns all pallets for local transfers of foreign assets for specific chain.

**Endpoint**: `GET /v5/pallets/:chain/other-assets`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch('http://localhost:3001/v5/pallets/:chain/other-assets');
```
