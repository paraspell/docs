# Use XCM SDK🪄 within XCM API
This guide walks you through the XCM SDK functionality implemented in XCM API.

## Send XCM
This functionality allows you to send XCM messages across the Paraverse.

### Example package-less implementation of XCM API XCM features into your application

```ts
//Chain WS API instance that will send generated XCM Call
const provider = getWsProvider('YourChainWSPort') // Specify "YourChainWSPort" with WS Port of sender chain 
const client = createClient(withPolkadotSdkCompat(provider))

const response = await fetch(
    "https://api.paraspell.xyz/v2/x-transfer”,
{
	method: ‘POST’,
           	body: JSON.stringify({
                  "from": "origin",
                  "to": "destination",
                  "recipient": "recipient",
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

**Endpoint**: `POST /v2/x-transfer`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender.
  - `xcmVersion` (Inside JSON body): (optional): Specifies manually selected XCM version if pre-selected does not work. Format: Vx - where x = version number, e.g. V4.

 :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}

// Used to customize XCM version - Replace "Vx" with V and version number, e.g. "V4"
xcmVersion: "Vx"

// Used for customizing pallet name - Replace RandomXtokens with Camel case name of the pallet
pallet: 'RandomXTokens',

// Used for customizing pallet method - replace random_function with snake case name of the method
method: 'random_function'
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch("https://api.paraspell.xyz/v2/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "TChain", // Replace "TChain" with sender Chain, for example, "Acala" or "Polkadot"
        to: "TChain",   // Replace "TChain" with destination Chain, for example, "Hydration" or custom Location
        currency: {currency spec} //Refer to currency spec options above
        recipient: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
        sender: "sender" //Optional but strongly recommended as it is automatically ignored when not needed - Used when origin is AssetHub with feeAsset or when sending to AssetHub to prevent asset traps by auto-swapping to DOT to have DOT existential deposit.
        //ahAddress: ahAddress //Optional parameter - used when origin is EVM chain and XCM goes through AssetHub (Multihop transfer where we are unable to convert Key20 to ID32 address
    })
});
```

## Local transfers
The following endpoint allows the creation of local asset transfers for any chain and any currency registered on it. This call is specified by the same Chain selected as origin - `from` and destination - `to` parameters.

**Endpoint**: `POST /v2/x-transfer`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain on which the asset is transferred locally.
  - `to` (Inside JSON body): (required): Represents the Chain on which the asset is transferred locally.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `400`  (Bad request exception) - Returned when query parameter 'keepAlive' does not have valid input
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::


::: details Currency spec options
  
**The following options are possible for currency specification:**

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

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
  }
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

:::


**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/x-transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Chain', // Replace "Chain" with sender Chain, e.g., "Acala"
    to: 'Chain' // Replace Chain with same parameter as "from" parameter
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
 /* keepAlive: bool - Optional: Allows draining the account below the existential deposit. */
  }),
});
```

## Transact
The API gives the ability to perform Transact, which enables execution of calls on a remote chain in the context of the destination environment. This allows applications to trigger cross-chain actions without direct interaction from users on the target chain.

**Endpoint**: `POST /v2/x-transfer`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain on which the asset is transferred locally.
  - `to` (Inside JSON body): (required): Represents the Chain on which the asset is transferred locally.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender.
  - `transactOptions` (Inside JSON body): (required): Specifies the transact which should execute on destination.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `400`  (Bad request exception) - Returned when body of 'transactOptions' is not a valid
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Notes

`V3` and `V4` Transact cannot transfer currency and transact in the same call. You need to deposit currencies into the sovereign account of the origin account on the destination chain: its location is `(Parent, Parachain: Original Parachain, Account)`. This address can be calculated with the following API: `locationToAccountApi.convert_location`. The `.currency()` parameter specifies in which currency the SDK should buy execution, so the amount parameter can be a random number (only applies for calls to/from V3/V4 chains).

`V5` is able to transfer and transact at the same time, so the `amount` parameter in `.currency()` needs to be filled accordingly because the amount being transferred is also used to buy execution.
 
  :::

::: details Currency spec options

**The following options are possible for currency specification:**

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

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
  }
  mode: "BATCH" | "BATCH_ALL" // Only in x-transfer-batch endpoint - Default as BATCH_ALL
})
```

:::


**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/x-transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Chain', // Replace "Chain" with sender Chain, e.g., "Acala"
    to: 'Chain' // Replace Chain with same parameter as "from" parameter
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'SenderAddress' //Replace "SenderAddress" with sender wallet address (In AccountID32 or AccountKey20 Format)
    transactOptions: {
      hex: Destination call hex //Function that should execute on destination
    /*originKind: "SovereignAccount" || "XCM" || "Native" || "SuperUser" - Optional, "SovereignAccount" by default
      maxWeight: { proofSize: string, refTime: string } - Optional, autofilled by default (Utilized in V3 and V4 as maxFallbackWeight parameter) */
    }
  }),
});
```

## Swap
This feature allows you to send Swap XCMs, meaning you send one currency and receive another at the destination chain.

**Endpoint**: `POST /v2/x-transfers`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain on which the asset is transferred locally.
  - `to` (Inside JSON body): (required): Represents the Chain on which the asset is transferred locally.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender.
  - `swapOptions` (Inside JSON body): (required): Specifies the swap to currency that should occur during XCM.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `400`  (Bad request exception) - Returned when body of 'swapOptions' is not a valid
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::


::: details Currency spec options

**The following options are possible for currency specification:**

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

:::

::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
  }
})
```

:::

::: details List of available exchanges

| Swap Type   | DEX               | Pools | Notes                                |
|------------|-------------------|-------|--------------------------------------|
| One-click  | AssetHub Polkadot | 58    | Requires specific native tokens      |
| One-click  | AssetHub Kusama   | 19    | Requires specific native tokens      |
| One-click  | AssetHub Westend   | 110    | Requires specific native tokens      |
| One-click  | AssetHub Paseo   | 13    | Requires specific native tokens      |
| Two-click  | Hydration         | 210   | —                                    |
| Two-click  | Bifrost Polkadot  | 45    | Requires native token                |
| Two-click  | Bifrost Kusama    | 66    | Requires native token                |
| Two-click  | Acala             | 36    | Requires native token                                    |
| Two-click  | Karura            | 136   | Requires native token                                    |

**Total pools available:** 693

> [!Note]
> One-click transfers are only one click if the origin chain supports execute extrinsics.

:::

::: details Selecting an exchange

There are **three** options for specifying the exchange chain:

#### Automatic exchange selection

You can leave automatic exchange selection on API if you do not want to choose manually. API will pick based on best price outcome. You can do so by not providing exchange object into `swapOptions` object.

```
swapOptions:{
  currencyTo: CURRENCY_SPEC, //Refer to currency spec options below
}
```

#### Whitelisted exchange selection

You can whitelist exchange selection if you have preferred exchanges. API will pick based on best price outcome from selected exchanges. You can do so by providing an array of exchanges into `swapOptions` object.

```
swapOptions:{
  currencyTo: CURRENCY_SPEC, //Refer to currency spec options below
  exchange: ['AssetHubPolkadotDex', 'HydrationDex']
}
```

#### Manual exchange selection

If you want to manually specify exchange there is an option to do so by providing exact exchange into `swapOptions` object.

```
swapOptions:{
  currencyTo: CURRENCY_SPEC, //Refer to currency spec options below
  exchange: ['AssetHubPolkadotDex'] // Or just 'AssetHubPolkadotDex' without an array
}
```


:::


**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/x-transfers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Chain', // Replace "Chain" with sender Chain, e.g., "Acala"
    to: 'Chain' // Replace Chain with same parameter as "from" parameter
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'SenderAddress' //Replace "SenderAddress" with sender wallet address (In AccountID32 or AccountKey20 Format)
    swapOptions: {
      currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
      // exchange: ['AssetHubPolkadot'], - Optional parameter - 'Hydration' | 'Acala' | 'AssetHubPolkadot' | ...
      // slippage: 1, - Optional - 1 by default
      // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
    },
  }),
});
```

## Sending EVM XCM
The following endpoint enables the creation of a variety of `EVM>Substrate` (for example Ethereum > AssetHubPolkadot) cross-chain transfers.

**Endpoint**: `POST /v2/evm-x-transfer`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
 :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::


  ::: details Currency spec options
  
**The following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount /*Use "ALL" to transfer everything*/} //Recommended
{location: AssetLocationJson, amount: amount /*Use "ALL" to transfer everything*/} //Recommended 
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
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  xcmFormatCheck: true, // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
  apiOverrides: {    //ONLY TO OVERRIDE SUBSTRATE CHAINS - Does not work on Ethereum
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  },
})
```

:::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/evm-x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "TChain", // Replace "TChain" with sender EVM Chain, for example, "Ethereum"
        to: "TChain",   // Replace "TChain" with destination Chain, for example, "Hydration" or custom Location
        currency: {currency spec} //Refer to currency spec options above
        recipient: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
        sender: "sender" // Sender address
    })
});
```

**Example implementation:**
```ts
 import {
    createWalletClient,
    custom,
    parseTransaction,
    type Hex,
    type WalletClient,
  } from 'viem';
  import { mainnet, darwinia } from 'viem/chains';

  const walletClient: WalletClient = createWalletClient({
    chain: darwinia, 
    transport: custom(window.ethereum),
  });
  const [account] = await walletClient.requestAddresses();

  const res = await fetch('https://localhost:3001/v2/evm-x-transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Darwinia',
      to: 'AssetHubPolkadot',
      sender: account,
      recipient: '5FNDaod3wYTvg48s73H1zSB3gVoKNg2okr6UsbyTuLutTXFz',
      currency: { symbol: 'RING', amount: '10000' },
    }),
  });
  const hex = (await res.json()) as Hex;

  const parsed = parseTransaction(hex);

  //  Estimate gas + fees + nonce in parallel
  const [gas, fees, nonce] = await Promise.all([
    publicClient.estimateGas({
      account,
      to: parsed.to ?? undefined,
      data: parsed.data,
      value: parsed.value,
    }),
    publicClient.estimateFeesPerGas(),
    publicClient.getTransactionCount({ address: account, blockTag: 'pending' }),
  ]);

  // Send with the explicit values
  const txHash = await walletClient.sendTransaction({
    account,
    chain,
    to: parsed.to ?? undefined,
    data: parsed.data,
    value: parsed.value,
    gas,
    maxFeePerGas: fees.maxFeePerGas,
    maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
    nonce,
  });
```

## Dry run
You can determine whether your XCM message will execute successfully or fail with an error. The XCM message dry run provides a concrete execution error, allowing you to validate the message before submission. This makes it possible to verify correct execution without ever submitting the XCM message on-chain.

**Endpoint**: `POST /v2/dry-run`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
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
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
swapOptions: {
    currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
    // exchange: ['AssetHubPolkadotDex'], - Optional parameter - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
    // slippage: 1, - Optional - 1 by default
    // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
},
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch('https://api.paraspell.xyz/v2/dry-run', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Hydration" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Dry run preview
By using preview with dry-run, you can determine the result of a call using a fictional currency amount. This effectively allows you to simulate and demo calls with custom asset values of assets you don't need to own.

**Endpoint**: `POST /v2/dry-run-preview`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
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
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch('https://api.paraspell.xyz/v2/dry-run-preview', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Hydration" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Ecosystem Bridges
List of available bridges in XCM SDK. Implementing cross-ecosystem asset transfers has never been easier.


### Polkadot<>Kusama bridge
   - **Parameters**:
        - Same as in Chain -> Chain scenario
   - **Errors**:
        - Same as in Chain -> Chain scenario

::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch("https://api.paraspell.xyz/v2/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "AssetHubPolkadot", // Or AssetHubKusama
        to: "AssetHubKusama",   // Or AssetHubPolkadot
        currency: {symbol: "KSM", amount: amount /*Use "ALL" to transfer everything*/}, // DOT | USDT | USDC
        recipient: "Address" // AccountID 32 address
    })
});
```


### AssetHubPolkadot -> Ethereum

   - **Parameters**:
        - Same as in Chain -> Chain scenario
   - **Errors**:
        - Same as in Chain -> Chain scenario

::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch("https://api.paraspell.xyz/v2/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "AssetHubPolkadot", 
        to: "Ethereum",   
        currency: {symbol: "WETH", amount: amount /*Use "ALL" to transfer everything*/}, // Any supported asset - WBTC, WETH.. - {symbol: currencySymbol} | {id: currencyID}
        recipient: "Address" // Ethereum Address
    })
});
```

### Parachain -> Ethereum

   - **Parameters**:
        - Same as in Substrate -> Substrate scenario
   - **Errors**:
        - Same as in Substrate -> Substrate scenario

::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch("https://api.paraspell.xyz/v2/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", 
        to: "Ethereum",   
        currency: {symbol: "WETH", amount: amount /*Use "ALL" to transfer everything*/}, // Any supported asset - WBTC, WETH.. - {symbol: currencySymbol} | {id: currencyID}
        recipient: "Address", // Ethereum Address
        ahAddress: "Address", //Asset hub address (Needs to be sender address)
        sender: "Address" //Origin chain sender address
    })
});
```

### Snowbridge health check
Query for Snowbridge status.

**Endpoint**: `GET /v2/x-transfer/eth-bridge-status`


   - **Parameters**:
     - No parameters required

   - **Errors**:
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/x-transfer/eth-bridge-status");
```

## Batch call
XCM API allows you to batch your XCM calls and send multiple at the same time via the batch feature.

**Endpoint** `POST /v2/x-transfer-batch`

  ::: details Parameters

  - `transfers` (Inside JSON body): (required): Represents an array of XCM calls along with an optional parameter "options" which contains "mode" to switch between BATCH and BATCH_ALL call forms.


  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameter 'transfers' is expected but not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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

const response = await fetch("https://api.paraspell.xyz/v2/x-transfer-batch", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        transfers: "Chain", // Replace "transfers" with array of XCM transfers
    })
});

/*Example of JSON body
{
	"transfers": [
		{
			"from": "Kusama"
			"to": "Moonriver",
			"currency": { symbol: "DOT", amount: amount Use "ALL" to transfer everything},
			"recipient": "0x939229F9c6E2b97589c4a5A0B3Eb8664FFc00502"
		},
		{
			"from": "Kusama"
			"to": "Basilisk",
			"currency": { symbol: "DOT", amount: amount Use "ALL" to transfer everything},
			"recipient": "bXgnPigqWnUTb9PxgCvnt61bsQoRQFnzLYYyRPV1bvB6DLu87"
		}
	],
	"options": {
		"mode": "BATCH"
	}
}*/
```

## Adding chain and/or assets
API features the ability to add a custom chain and/or custom assets simply by adding its config to the request.

**Endpoint**: `Any that can leverage this feature` (From transfers, dry-run to xcm-fee queries)

  ::: details Parameters

  - Inherited from concrete endpoint

  :::

  ::: details Errors

  - Inherited from concrete endpoint
    
  :::  

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    
    // Custom chains can be fitted into both from and to parameters
    "from": "MyChain", 
    "to": "AssetHubPolkadot",
    "recipient": "address",
    "currency": { "symbol": "USDC", "amount": "1000000" },
    "options": {

      // Adding custom chain
      "customChains": {
        "MyChain": {
          "paraId": 4242,
          "ecosystem": "Polkadot",
          "xcmVersion": "V5",
          "providers": [
            { "name": "Primary", "endpoint": "wss://rpc.mychain.example/ws" }
          ],
          // Everything below is optional — auto-fetched from runtime `system.properties` when omitted
          "nativeAssetSymbol": "MYC",
          "nativeAssetDecimals": 12,
          "ss58Prefix": 42,
          "pallets”: {
              "nativeAssets": "Balances”,
              "otherAssets": "Assets",
          },
          "assets": [
            {
              "symbol": "USDC",
              "decimals": 6,
              "assetId": "1337",
              "existentialDeposit": "10000000", //Needs to be in planck
              "location": {
                "parents": 1,
                "interior": {
                  "X3": [
                    { "Parachain": 1000 },
                    { "PalletInstance": 50 },
                    { "GeneralIndex": 1337 }
                  ]
                }
              }
            }
          ]
        }
      },

      // Adding assets to existing chains
      "customAssets": {
        "AssetHubPolkadot": [
          {
            "symbol": "MYNEWUSD",
            "decimals": 6,
            "assetId": "9999",
            "existentialDeposit": "10000000", //Needs to be in planck,
            "location": {
              "parents": 0,
              "interior": {
                "X2": [{ "PalletInstance": 50 }, { "GeneralIndex": 9999 }]
              }
            }
          },
          // Replace an existing registry asset that shares the same location
          {
            "symbol": "USDT",
            "decimals": 6,
            "assetId": "1984",
            "existentialDeposit": "10000000", //Needs to be in planck,
            "location": {
              "parents": 0,
              "interior": {
                "X2": [{ "PalletInstance": 50 }, { "GeneralIndex": 1984 }]
              }
            },
            "forceOverride": true
          }
        ]
      }
    }
  })
});
```

## Localhost testing setup

API offers enhanced localhost support. You can pass an object called options containing overrides for all WS endpoints (including hops) used in the test transfer. This allows for advanced localhost testing such as localhost dry-run or xcm-fee queries.

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

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch("https://api.paraspell.xyz/v2/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        sender: "1pze8UbJDcDAacrXcwkpqeRSYLphaAiXB8rUaC6Z3V1kBLq",
        recipient: "0x1501C1413e4178c38567Ada8945A80351F7B8496",
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

API allows you to use pre-derived accounts for testing (as sender or receiver address). For example, Alice, Bob, Charlie, Alith, Balthathar and others.

**Endpoint**: `POST /v2/sign-and-submit`

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

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch("https://api.paraspell.xyz/v2/sign-and-submit", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        sender: "//Alice", //You can use pre-derived accounts - //Alice, //Bob... //Alith, //Balthathar...
        recipient: "0x1501C1413e4178c38567Ada8945A80351F7B8496", //You can also use pre-derived accounts here - //Alice, //Bob... //Alith, //Balthathar...
        from: "Hydration",
        to: "Mythos",
        currency: {
          symbol: "MYTH",
          amount: "10"
        },
        options: {
          development: true, // Optional: Enforces overrides for all chains used
          decimalAbstraction: true // Abstracts decimals, so 1 as input amount equals 10_000_000_000 if selected asset is DOT
          xcmFormatCheck: true // Dryruns each call under the hood with dryrun bypass to confirm message passes with fictional balance
          apiOverrides: {
            Hydration: "ws://127.0.0.1:8000", //Only works with locally launched chains (Eg. chopsticks)
            Mythos: "ws://127.0.0.1:8001" //Only works with locally launched chains (Eg. chopsticks)
          }
        }
    })
});
```

## XCM Fee (Origin & Dest.)

The following endpoint is designed to retrieve your XCM fee at any cost, but falls back to Payment info if the DryRun query fails or is not supported by either origin or destination.

**Endpoint**: `POST /v2/xcm-fee`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the XCM sender.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::


  ::: details Possible output objects

```
origin - Always present
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
swapOptions: {
    currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
    // exchange: ['AssetHubPolkadotDex'], - Optional parameter - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
    // slippage: 1, - Optional - 1 by default
    // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
},  

//If enabled it disables fallback to payment info if dryrun fails only returning dryrun error but no fees.
disableFallback: "True" 
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch("https://api.paraspell.xyz/v2/xcm-fee", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", // Replace "Chain" with sender Chain, e.g., "Acala"
        to: "Chain",   // Replace "Chain" with destination Chain, e.g., "Hydration" or custom Location
        currency: { currencySpec }, // Refer to currency spec options above
        recipient: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        sender: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
    })
});
```

## XCM Fee (Origin only)
The following queries allow you to query XCM fee from the origin chain. The query is designed to retrieve your XCM fee at any cost, but falls back to Payment info if the DryRun query fails or is not supported by origin.

**Endpoint**: `POST /v2/origin-xcm-fee`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the XCM sender.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Possible output objects

```
origin - Always present
```

  :::

::: details Currency spec options
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}

//If enabled it disables fallback to payment info if dryrun fails only returning dryrun error but no fees.
disableFallback: "True" 
```
  
:::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
const response = await fetch("https://api.paraspell.xyz/v2/origin-xcm-fee", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", // Replace "Chain" with sender Chain, e.g., "Acala"
        to: "Chain",   // Replace "Chain" with destination Chain, e.g., "Hydration" or custom Location
        currency: { currencySpec }, // Refer to currency spec options above
        recipient: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format)
        sender: "Address" // Replace "Address" with sender wallet address (In AccountID32 or AccountKey20 Format) 
    })
});
```

## XCM Transfer info
To comprehensively assess whether a message will execute successfully without failure, use this query. It provides detailed information on currency balances before and after the transaction, including all relevant fees. This data is essential for accurately evaluating potential balance or fee-related issues that could cause message failure.

**Endpoint**: `POST /v2/transfer-info`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
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
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
  'https://api.paraspell.xyz/v2/transfer-info' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Hydration" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Transferable amount
To retrieve information on how much of the selected currency can be transferred from a specific account, you can use the transferable balance.

**Endpoint**: `POST /v2/transferable-amount`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Notes

The query uses the following formula:

```
max(balance - existentialDeposit - originFee, 0)
```

- **`balance`**: the sender's current balance of the queried asset on the origin chain.
- **`existentialDeposit`**: the ED for that asset on the origin chain. Anything below it isn't really spendable, since a balance that drops under the ED gets the account reaped, so it's carved out of what's "transferable" from the start.
- **`originFee`**: the fee for locally executing the outgoing XCM program on the origin chain, included only when it's paid out of the same asset being queried (no separate `feeAsset` was configured and the asset is the origin chain's native asset, or an explicit `feeAsset` was set that happens to equal the queried asset). When the fee is paid from a different asset, it doesn't touch this balance, so it contributes `0` here.

**Example**: Alice holds `5 DOT` on AssetHub Polkadot. DOT's existential deposit there is `0.01 DOT`. Since DOT is the origin chain's native asset and Alice hasn't set a separate `feeAsset`, the local execution fee of `0.02 DOT` is also paid from this same balance. Her transferable amount is `5 - 0.01 - 0.02 = 4.97 DOT`, the most she could send without leaving her own AssetHub account under its existential deposit or short on fees for the extrinsic itself.

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (less accurate), so this function should only serve for informative purposes (always run DryRun if chains support it to ensure the message will go through).

  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
swapOptions: {
    currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
    // exchange: ['AssetHubPolkadotDex'], - Optional parameter - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
    // slippage: 1, - Optional - 1 by default
    // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
},
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
  'https://api.paraspell.xyz/v2/transferable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Hydration" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Minimal transferable amount
You can use the minimal transferable balance to retrieve the minimum amount of the selected currency that can be transferred from a specific account to a specific destination, so that the existential deposit and destination or origin fee are paid in full.

**Endpoint**: `POST /v2/min-transferable-amount`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Notes

This query calculates the minimal transferable amount using the following formula:

```
hopFeeTotal + destinationFee + originFee + edComponent + 1n
```

Every term below is expressed in the asset actually being transferred, and each one is added only when that fee (or requirement) is actually paid in that same asset. A fee taken in a different asset doesn't shrink what arrives, so it's left out.

- **`hopFeeTotal`** - Some routes don't go directly from origin to destination; the message passes through one or more intermediate chains first. Each intermediate chain executes part of the XCM program and charges its own execution fee, deducted from the asset as it passes through. `hopFeeTotal` is the sum of every hop's fee that happens to be charged in the transferred asset. If a route has no hops, this is `0`.

- **`destinationFee`** - When the message lands on destination chain, it has to execute XCM instructions (depositing the asset into the recipient's account for example), and it charges its own execution fee for that.

- **`originFee`** - A fee that is charged on the origin chain and taken directly from the account, not from the XCM's specified transfer amount. **When the origin fee is denominated in the asset being transferred, subtract it from the queried value before displaying the minimal amount the XCM can carry.** When the origin fee is instead paid via a separate `feeAsset`, it comes out of a different balance entirely and never touches the transferred asset, so it contributes `0` here.

- **`edComponent`** - Account whose balance drops below the existential deposit (ED) is dusted. If the recipient has never held this asset on the destination chain (balance is `0`), the arriving amount must clear the destination's ED just to create a usable account, so `edComponent` equals that ED. If the recipient already holds a balance there, the account already exists and clears the ED, so this term is `0` and doesn't need to be paid again.

- **`+ 1n`** - A padding of one base unit (the smallest indivisible unit of the asset, e.g. one Planck for DOT). Fee estimates can be off by tiny rounding amounts, so this nudges the result just past the computed minimum rather than landing exactly on it, where a transfer could still fail by a hair.

**Example**: Alice wants to send DOT from AssetHub Polkadot to Hydration, to Bob, who currently holds **no DOT at all** on Hydration.

| Term | What it represents here | Value |
| --- | --- | --- |
| `hopFeeTotal` | Route doesn't need to go through a HOP chain | 0 DOT |
| `destinationFee` | Hydration's fee for executing the deposit, charged in DOT | 0.02 DOT |
| `originFee` | AssetHub Polkadot's local execution fee, paid in DOT since no separate `feeAsset` was set. | 0.05 DOT |
| `edComponent` | Bob holds 0 DOT on Hydration, so Hydration's existential deposit for DOT is added | 0.01 DOT |
| `+ 1n` | Rounding padding | ~0 (negligible) |
| **Total (minimum transferable amount)** | This much will be charged overall | **0.08 DOT** |
| **Total amount that should be entered as amount in XCM** | This amount will be sent to destination chain | **0.03 DOT** |


**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (less accurate), so this function should only serve for informative purposes (always run DryRun if chains support it to ensure the message will go through). Chains that do not have support for dryrun will return error in this query.

  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
swapOptions: {
    currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
    // exchange: ['AssetHubPolkadotDex'], - Optional parameter - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
    // slippage: 1, - Optional - 1 by default
    // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
},
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
  'https://api.paraspell.xyz/v2/min-transferable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Hydration" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Predicted received amount
You can predict the amount to be received on destination, granted, that the destination chain and hops have dry-run.

**Endpoint**: `POST /v2/receivable-amount`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
  'https://api.paraspell.xyz/v2/receivable-amount' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Hydration" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Verify ED on destination
To retrieve information on whether the selected currency from a specific account will meet the existential deposit on the destination chain, you can use this query.

**Endpoint**: `POST /v2/verify-ed-on-destination`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Notes

This query checks whether, after fees are taken out on arrival, the recipient ends up above the destination's existential deposit (ED) - either because the amount that lands clears the ED outright, or because the recipient already had enough there beforehand. It uses the following formula:

```
(amount - feeToSubtract) > (balance < ed ? ed : 0)
```

- **`amount`** - the transfer amount.
- **`feeToSubtract`** - the HOP fee combined with destination fee.
- **`balance`** - how much of this asset the recipient already holds on the destination chain, before this transfer lands.
- **`ed`** - the existential deposit for this asset on the destination chain.

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (less accurate), so this function should only serve for informative purposes (always run DryRun if chains support it to ensure the message will actually go through). **If the function switches to PaymentInfo and the transferred currency is different from the native currency on the destination chain, the function throws an error as PaymentInfo only returns fees in the native asset of the chain.**

  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
  'https://api.paraspell.xyz/v2/verify-ed-on-destination' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Hydration" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'Address' //Replace "Address" with sender address from origin chain
  }),
```

## Best amount out
The following endpoint gives you the best amount out for a specific DEX. Only works when `swapOptions` is defined.

**Endpoint**: `POST /v2/best-amount-out`

  ::: details Parameters

  - `from` (Inside JSON body): (required): Represents the Chain from which the assets will be transferred.
  - `to` (Inside JSON body): (required): Represents the Chain to which the assets will be transferred.
  - `currency` (Inside JSON body): (required): Represents the asset being sent. It should be a string value.
  - `recipient` (Inside JSON body): (required): Specifies the address of the recipient.
  - `sender` (Inside JSON body): (required): Specifies the address of the sender (Origin chain one).
  - `swapOptions` (Inside JSON body): (required): Specifies the currency to swap to.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
  - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not valid Chains
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'currency' is not a valid currency
  - `400`  (Bad request exception) - Returned when entered chains 'from' and 'to' are not compatible for the transaction
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'amount' is not a valid amount
  - `400`  (Bad request exception) - Returned when query parameter 'recipient' is not a valid address
  - `400`  (Bad request exception) - Returned when query parameter 'swapOptions' is not a valid
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue
    
  :::

  ::: details Notes

This query will calculate the minimal transferable balance using the following formula:

```
(Origin Balance - if(Balance on destination = 0) then also substract destination Existential deposit - if(Asset=native) then also substract Origin XCM Fees - hop fees (If present) - destination XCM fee) +1
```

**Beware**: If DryRun fails, the function automatically switches to PaymentInfo for XCM Fees (less accurate), so this function should only serve for informative purposes (always run DryRun if chains support it to ensure the message will go through). Chains that do not have support for dryrun will return error in this query.


  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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

  :::

  ::: details Advanced settings

  You can use the following optional advanced settings by adding them as a parameter into the request body to further customize your calls:

```ts
// Used when multiple assets are provided or when (origin === AssetHubPolkadot | Hydration) - This will allow for custom fee asset on origin.
feeAsset: {id: currencyID} | {symbol: currencySymbol} | {location: AssetLocationString | AssetLocationJson}
```
  
  :::

  ::: details Advanced API settings

You can customize the following API settings to further tailor your experience with the API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // TURNED ON BY DEFAULT Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
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
  'https://api.paraspell.xyz/v2/best-amount-out' , {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },  
    from: 'Chain', // Replace "Chain" with sender Chain or Relay chain, e.g., "Acala"
    to: 'Chain', // Replace "Chain" with destination Chain or Relay chain, e.g., "Hydration" or custom Location
    currency: { currencySpec }, // Refer to currency spec options above
    recipient: 'Address', // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Location
    sender: 'Address', //Replace "Address" with sender address from origin chain
    swapOptions: {
      currencyTo: CURRENCY_SPEC, //Refer to currency spec options above
      // exchange: ['AssetHubPolkadotDex'], - Optional parameter - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
      // slippage: 1, - Optional - 1 by default
      // evmSenderAddress: '0x000', - Optional parameter when origin CHAIN is EVM based (Required with evmSigner)
    },
  }),
```

## SS58 Address conversion
The following functionality allows you to convert any SS58 address to a Chain-specific address.

 **Endpoint**: `GET /v2/convert-ss58?address=:address&chain=:chain`

  ::: details Parameters

  - `chain` (query parameter): Specifies the name of the Chain.
  - `recipient` (query parameter): Specifies the SS58 Address.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `400` (Bad request): When a specified Address is not provided.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/convert-ss58?address=:address&chain=:chain');
```

## Swap helper queries
The following set of queries provides helpers for swap functionality.

### Exchange chains list
The following query lists all supported exchange chains.

 **Endpoint**: `GET /v2/swap/exchange-chains`

   ::: details Errors
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/swap/exchange-chains');
```

### Supported assets for currency from
The following endpoint allows you to query the supported assets for the origin currency when performing a swap.

 **Endpoint**: `GET /v2/swap/supported-assets-from?from=:chain&exchange=:exchange`

  ::: details Parameters
  - `from` (query parameter): Optional - origin chain.
  - `exchange` (query parameter): Optional - exchange chain (array of them or standalone).

  :::

  ::: details Errors

  - `400` (Bad request): When a specified from does not exist.
  - `400` (Bad request): When a specified exchange is not provided.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/swap/supported-assets-from?from=:chain&exchange=:exchange');
```


### Supported assets for currency to
The following endpoint allows you to query the supported assets for the destination currency when performing a swap.

 **Endpoint**: `GET /v2/swap/supported-assets-from?exchange=:exchange&to=:chain`

  ::: details Parameters
  - `to` (query parameter): Optional - destination chain.
  - `exchange` (query parameter): Optional - exchange chain (array of them or standalone).

  :::

  ::: details Errors

  - `400` (Bad request): When a specified to does not exist.
  - `400` (Bad request): When a specified exchange is not provided.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/swap/supported-assets-from?exchange=:exchange&to=:chain');
```

## Asset queries
This functionality allows you to perform various asset queries with compatible Chains.

### Example of package-less implementation of XCM API Asset features into your application

```ts
const response = await fetch(
    "https://api.paraspell.xyz/v2/assets/<action>" + //Replace "action" with your desired action, e.g. "Acala/native" 
);

console.log(response) //use response data as necessary
```

### Query asset paths
The following endpoint allows you to query the asset paths related to origin chain.

**Endpoint**: `POST /v2/assets/:chain/supported-destinations`

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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
const response = await fetch("https://api.paraspell.xyz/v2/assets/:chain/supported-destinations", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        currency: {currency spec} //Refer to currency spec options above
    })
});
```

### Query asset reserve
The following endpoint allows you to query the asset reserve for a specific asset on a specific chain.

**Endpoint**: `POST /v2/assets/:chain/reserve-chain`

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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
const response = await fetch("https://api.paraspell.xyz/v2/assets/:chain/reserve-chain", {
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
The following endpoint allows you to query the asset balance on a specific chain.

**Endpoint**: `POST /v2/balance/:chain`

  ::: details Parameters

  - `chain` (Path parameter): Specifies the name of the Chain.
  - `recipient` (Inside JSON body): (required): Specifies the address of the account.
  - `currency` (Inside JSON body): (required): Specifies the currency to query.

  :::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when parameter 'chain' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'recipient' is not provided
  - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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
const response = await fetch("https://api.paraspell.xyz/v2/balance/:chain/asset", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        recipient: "Address" // Replace "Address" with wallet address (In AccountID32 or AccountKey20 Format) 
        currency: {currencySpec}, // Refer to currency spec options above
    })
});
```

### Query asset existential deposit
The following endpoint allows you to query the existential deposit for currency in a specific chain.

**Endpoint**: `POST /v2/balance/:chain/existential-deposit`

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
  
**The following options are possible for currency specification:**

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
const response = await fetch("https://api.paraspell.xyz/v2/balance/:chain/existential-deposit", {
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
The following endpoint retrieves the fee assets accepted as an XCM fee on a specific chain.

**Endpoint**: `GET /v2/assets/:chain/fee-assets`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/assets/:chain/fee-assets');
```

### Query assets object
The following endpoint retrieves all assets on a specific Chain as an object.

**Endpoint**: `GET /v2/assets/:chain`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/assets/Hydration");
```

### Query asset Location
The following endpoint retrieves asset location from the asset ID or asset symbol.

**Endpoint**: `POST /v2/assets/:chain/location`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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
const response = await fetch("https://api.paraspell.xyz/v2/assets/:chain/location", {
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

**Endpoint**: `POST /v2/assets/:chain/asset-info`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.
  - `currency` (body parameter): Specifies the currency.
  - `destination` (optional body parameter): Specifies the destination (when Ethereum is chosen as destination).

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `400` (Bad request): When a specified Asset does not exist.
  - `400` (Bad request): When a specified Currency does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

  ::: details Currency spec options
  
**The following options are possible for currency specification:**

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
const response = await fetch("https://api.paraspell.xyz/v2/assets/:chain/asset-info", {
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

### Query Relay chain asset symbol
The following endpoint returns the Relay chain asset symbol for a specific Chain.

**Endpoint**: `GET /v2/assets/:chain/relay-chain-symbol`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::
    
**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/assets/Astar/relay-chain-symbol");
```

### Query native assets
The following endpoint returns native assets of a specific Chain.

**Endpoint**: `GET /v2/assets/:chain/native`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/assets/Hydration/native");
```

### Query foreign assets
The following endpoint returns foreign assets of a specific Chain.

**Endpoint**: `GET /v2/assets/:chain/other`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/assets/Astar/other");
```

### Query all asset symbols
The following endpoint returns all asset symbols for a specific Chain.

**Endpoint**: `GET /v2/assets/:chain/all-symbols`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/assets/Hydration/all-symbols");
```

### Query asset support between two chains
The following endpoint retrieves assets supported by both chains.

**Endpoint**: `GET /v2/supported-assets?origin=:chain&destination=:chain`

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
const response = await fetch("https://api.paraspell.xyz/v2/supported-assets?origin=Acala&destination=Astar");
```

### Query Chain ws endpoints
The following endpoint retrieves the Chain's WS endpoints.

**Endpoint**: `GET /v2/chains/:chain/ws-endpoints`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/chains/Acala/ws-endpoints");
```

### Query Chain ID
The following endpoint retrieves the Chain's ID from the Chain's name.

 **Endpoint**: `GET /v2/chains/:chain/para-id`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/chains/Acala/para-id");
```

### Query Chain name
The following endpoint retrieves the Chain's name from the Chain's ID. (Options for ecosystem - Polkadot, Kusama, Paseo, Westend, Ethereum)

**Endpoint**: `GET /v2/chains/:paraId?ecosystem=eco`

  ::: details Parameters

  - `paraId` (path parameter): Specifies the Chain ID.

  :::

  ::: details Errors

  - `404` (Bad request): When a Chain with a specified Chain ID does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/chains/2090?ecosystem=Polkadot");
```

### Query list of implemented Chains
The following endpoint retrieves an array of implemented Chains.

**Endpoint**: `GET /v2/chains`

   - **Parameters**: None.
   - **Errors**: 
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/chains");
```

## XCM pallet queries

This functionality allows you to query the `XCM pallets` that Chains currently support. 

### Package-less implementation of XCM API XCM Pallet Query features into your application

```ts
const response = await fetch(
    "https://api.paraspell.xyz/v2/pallets/<action>" + //Replace "action" with your desired action, e.g. "Acala/default" 
);

console.log(response) //use response data as necessary
```

### Get default XCM pallet
The following endpoint returns the default pallet for a specific Chain.

**Endpoint**: `GET /v2/pallets/:chain/default`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/pallets/Acala/default");
```

### Get XCM pallet index
The following endpoint returns the index of a specific cross-chain pallet for a specific chain.

**Endpoint**: `GET /v2/pallets/:chain/index`

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
const response = await fetch('https://api.paraspell.xyz/v2/pallets/Acala/index?pallet=XTokens');
```

### Get all supported XCM pallets
The following endpoint returns all XCM Pallets that are supported on a specific Chain.

**Endpoint**: `GET /v2/pallets/:chain`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch("https://api.paraspell.xyz/v2/pallets/Basilisk");
```

### Get chain DryRun support
The following endpoint returns whether the selected Chain has DryRun support.

**Endpoint**: `GET /v2/chains/:chain/has-dry-run-support`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/chains/:chain/has-dry-run-support');
```

### Get EVM compatible chains
Returns a JSON array of true EVM-compatible chains (Chains that support only substrate EVM are not included). Useful for the `evm-x-transfer` endpoint.

**Endpoint**: `GET /v2/chains/evm`

  ::: details Errors

  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/chains/evm');
```

### Print local pallets for native assets
The following endpoint returns all pallets for local transfers of native assets for a specific chain.

**Endpoint**: `GET /v2/pallets/:chain/native-assets`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/pallets/:chain/native-assets');
```


### Print local pallets for foreign assets
The following endpoint returns all pallets for local transfers of foreign assets for a specific chain.

**Endpoint**: `GET /v2/pallets/:chain/other-assets`

  ::: details Parameters

  - `chain` (path parameter): Specifies the name of the Chain.

  :::

  ::: details Errors

  - `400` (Bad request): When a specified Chain does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

  :::

**Example of request:**
```ts
const response = await fetch('https://api.paraspell.xyz/v2/pallets/:chain/other-assets');
```
