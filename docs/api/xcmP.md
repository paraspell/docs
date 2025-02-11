# Use XCM SDK🪄 within XCM API
The following guide guides you through the XCM SDK functionality implemented in XCM API.
## Send XCM
This functionality allows you to send XCM messages across the Paraverse.

### Package-less implementation of XCM API XCM features into your application
```NOTE:``` We recently introduced a new, much simpler way to implement XCM API! You can now request a hashed response to the built call, which will offlift you from parsing and work right away!

```JS
//Chain WS API instance that will send generated XCM Call
const wsProvider = new WsProvider('YourChainWSPort'); //Specify "YourChainWSPort" with WS Port of sender chain 
const api = await ApiPromise.create({ provider: wsProvider });

const response = await fetch(
    "http://localhost:3001/x-transfer”,
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
const call = api.tx(hash)

//Call is then signed and can be subscribed to extrinsics
call.signAndSend(address, { signer: injector.signer }, ({ status, txHash }) => {
```

### Relay chain to Parachain (DMP)
The following endpoint constructs the Relay chain to the Parachain XCM message.

**Endpoint**: `POST /x-transfer`

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
```js
const response = await fetch("http://localhost:3001/x-transfer", {
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

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

### Parachain chain to Relay chain (UMP)
The following endpoint constructs Parachain to Relay chain XCM message.

**Endpoint**: `POST /x-transfer`

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
```js
const response = await fetch("http://localhost:3001/x-transfer", {
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
```js
const response = await fetch("http://localhost:3001/x-transfer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Parachain", // Replace "Parachain" with sender Parachain, e.g., "Acala"
        to: "Parachain",   // Replace "Parachain" with destination Parachain, e.g., "Moonbeam" or custom Multilocation
        currency: {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection, isFeeAsset?: true /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}}
        address: "Address" // Replace "Address" with destination wallet address (In AccountID32 or AccountKey20 Format) or custom Multilocation
        //xcmVersion: "Vx" //Optional parameter - replace "Vx" with V and version number eg. "V4"
        //pallet: 'RandomXTokens', //Optional parameter - replace RandomXtokens with Camel case name of the pallet
	//method: 'random_function' //Optional parameter - replace random_function with snake case name of the method
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
```js
const response = await fetch("http://localhost:3001/x-transfer", {
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

### Snowbridge Ethereum -> AssetHubPolkadot
Just like Polkadot <> Kusama bridge the Snowbridge is implemented in as intuitive and native form as possible. The implementations for Polkadot -> Ethereum and Ethereum -> Polkadot differ due to different architecture, so we will mention both scenarios.

   - **Parameters**:
        - Same as in Parachain -> Parachain scenario
   - **Errors**:
        - Same as in Parachain -> Parachain scenario

**Example of request:**
```js
//As Ethereum module is different from Polkadot modules (Thus Ethereum is not compatible with new hash response system), we provide complete implementation snippet.
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const response = await axios(`https://api.lightspell.xyz/x-transfer-eth`, {
      method: "POST",
      data: {
        to: 'AssetHubPolkadot',
        destAddress: address,
        address: await signer.getAddress(),
        currency: {currencySpec}, // {symbol: currencySymbol, amount: amount} | {id: currencyID, amount: amount}
      }
    });

const apiResponse = response.data;

   const GATEWAY_CONTRACT = "0xEDa338E4dC46038493b885327842fD3E301CaB39";

    const contract = IGateway__factory.connect(GATEWAY_CONTRACT, signer);

    const abi = ethers.AbiCoder.defaultAbiCoder();

    const address: MultiAddressStruct = {
      data: abi.encode(["bytes32"], [formValues.address]),
      kind: 1,
    };

    const response = await contract.sendToken(
      apiResonse.token,
      apiResonse.destinationParaId,
      address,
      apiResonse.destinationFee,
      apiResonse.amount,
      {
        value: apiResonse.fee,
      }
    );
    const receipt = await response.wait(1);

    if (receipt === null) {
      throw new Error("Error waiting for transaction completion");
    }

    if (receipt?.status !== 1) {
      throw new Error("Transaction failed");
    }

    const events: LogDescription[] = [];
    receipt.logs.forEach((log) => {
      const event = contract.interface.parseLog({
        topics: [...log.topics],
        data: log.data,
      });
      if (event !== null) {
        events.push(event);
      }
    });

```


### Snowbridge AssetHubPolkadot -> Ethereum

   - **Parameters**:
        - Same as in Parachain -> Parachain scenario
   - **Errors**:
        - Same as in Parachain -> Parachain scenario

**Example of request:**
```js
const response = await fetch("http://localhost:3001/x-transfer", {
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

## Batch call
XCM API allows you to batch your XCM calls and send multiple at the same time via batch feature.

**Endpoint** `POST /x-transfer-batch`

   - **Parameters**
     - `transfers` (Inside JSON body): (required): Represents array of XCM calls along with optional parameter "options" which contains "mode" to switch between BATCH and BATCH_ALL call forms.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameter 'transfers' is expected but not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
//mode options: - BATCH
//		- BATCH_ALL

const response = await fetch("http://localhost:3001/x-transfer-batch", {
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

**Endpoint**: `POST /dry-run`

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
```js
const response = await fetch('http://localhost:3001/dry-run', {
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

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`


## Transfer info query
The following functionality gives you all the necessary information about your transfer, including fees, sufficiency to transfer and more.

**Endpoint**: `GET /transfer-info`

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
```js
const response = await fetch(
  'http://localhost:3001/transfer-info?' , {
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

### Query native asset balance
The following endpoint allows you to query native asset balance for on specific chain.

**Endpoint**: `POST /balance/:node/native`

   - **Parameters**:
     - `node` (Path parameter): Specifies the name of the Parachain.
     - `address` (Inside JSON body): (required): Specifies the address of the account.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'address' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/balance/:node/native", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        address: "Address" // Replace "Address" with wallet address (In AccountID32 or AccountKey20 Format) 
    })
});
```

### Query foreign asset balance
The following endpoint allows you to query foreign asset balance for on specific chain.

**Endpoint**: `POST /balance/:node/foreign`

   - **Parameters**:
     - `node` (Path parameter): Specifies the name of the Parachain.
     - `address` (Inside JSON body): (required): Specifies the address of the account.
     - `currency` (Inside JSON body): (required): Specifies the currency to query.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'address' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/balance/:node/foreign", {
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

### Query max foreign currency transferable amount
The following endpoint allows you to query the maximum native currency transferable amount for a specific chain.

**Endpoint**: `POST /balance/:node/max-foreign-transferable-amount
`

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
```js
const response = await fetch("http://localhost:3001/balance/:node/max-foreign-transferable-amount", {
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

### Query max native currency transferable amount
The following endpoint allows you to query the maximum native currency transferable amount for a specific chain.

**Endpoint**: `POST /balance/:node/max-native-transferable-amount
`

   - **Parameters**:
     - `node` (Path parameter): Specifies the name of the Parachain.
     - `address` (Inside JSON body): (required): Specifies the address of the account.
     - `currency` (Inside JSON body): (optional): Specifies the currency to query (Has to be currency symbol as native assets do not have IDs).

   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'node' is not provided
     - `400`  (Bad request exception) - Returned when body parameter 'address' is not provided
     - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided and has to be provided (Otherwise optional)
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/balance/:node/max-native-transferable-amount", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        address: "Address", // Replace "Address" with wallet address (In AccountID32 or AccountKey20 Format) 
        currency?: "Currency" //Replace "Currency" with {symbol: currencySymbol}
    })
});
```

### Query max transferable amount
The following endpoint allows you to query the maximum currency transferable amount for a specific chain.

**Endpoint**: `POST /balance/:node/transferable-amount`

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
```js
const response = await fetch("http://localhost:3001/balance/:node/transferable-amount", {
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

**Endpoint**: `POST /balance/:node/existential-deposit`

   - **Parameters**:
     - `node` (Path parameter): Specifies the name of the Parachain.
     - `currency` (Inside JSON body): (required): Specifies the currency to query.


   - **Errors**:
     - `400`  (Bad request exception) - Returned when parameter 'node' is not provided
     - `400`  (Bad request exception) - Returned when body parameter 'currency' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/balance/:node/existential-deposit", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        currency: "Currency" //Replace "Currency" with {id: currencyID} | {symbol: currencySymbol} | {"symbol": {"type": "Native","value": "currencySymbol"} | {"symbol": {"type": "Foreign","value": "currencySymbol"} | {"symbol": {"type": "ForeignAbstract","value": "currencySymbolAlias"} | {multilocation: AssetMultilocationString} | {multilocation: AssetMultilocationJson}
    })
});
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

### Query asset multilocation
The following endpoint retrieves asset multilocation from the asset ID or asset symbol.

**Endpoint**: `POST /assets/:node/multilocation`


   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400` (Bad request): When a specified Parachain does not exist.
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/assets/:node/multilocation", {
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

### Query asset support between two chains
The following endpoint retrieves assets supported by both chains.

**Endpoint**: `GET /supported-assets?origin=:node&destination=:node`

- **Parameters**:
    - `node` (path parameter): Specifies the name of the Parachain.

- **Errors**:
    - `400` (Bad request): When a specified Parachain does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/supported-assets?origin=Acala&destination=Astar");
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

### Query Parachain ws endpoints
The following endpoint retrieves the Parachain's WS endpoints.

**Endpoint**: `GET /nodes/:node/ws-endpoints`

- **Parameters**:
    - `parachain` (path parameter): Specifies the parachain ID.

- **Errors**:
    - `404` (Bad request): When a Parachain with a specified name does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/nodes/Acala/ws-endpoints");
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

**Endpoint**: `GET /nodes/:paraId?ecosystem=eco`

- **Parameters**:
    - `paraId` (path parameter): Specifies the parachain ID.

- **Errors**:
    - `404` (Bad request): When a Parachain with a specified Parachain ID does not exist.
    - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/nodes/2090?ecosystem=polkadot");
```

### Query list of implemented Parachains
The following endpoint retrieves an array of implemented Parachains.

**Endpoint**: `GET /nodes`

   - **Parameters**: None.
   - **Errors**: 
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/nodes");
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
