# XCM Router (SpellRouter☄️) 

Following section covers XCM Router implementation in LightSpell XCM API. Users can use XCM Router to perform cross-chain transactions between compatible two chains and receive different assets than assets that were sent. This helps with liquidity and user experience as users do not need to perform multiple transactions to achieve the same result.

For list of supported chains/assets/dexes head over to [List of supported chains](https://paraspell.github.io/docs/supported.html#xcm-router%E2%98%84)

### Package-less implementation of XCM API Router features into your application

```JS
const submitTransaction = async (
  api: ApiPromise,
  tx: Extrinsic,
  signer: Signer,
  injectorAddress: string,
): Promise<string> => {
  await tx.signAsync(injectorAddress, { signer });
  return await new Promise((resolve, reject) => {
    void tx.send(({ status, dispatchError, txHash }) => {
      if (status.isFinalized) {
        // Check if there are any dispatch errors
        if (dispatchError !== undefined) {
          if (dispatchError.isModule) {
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;

            reject(new Error(`${section}.${name}: ${docs.join(' ')}`));
          } else {
            reject(new Error(dispatchError.toString()));
          }
        } else {
          // No dispatch error, transaction should be successful
          resolve(txHash.toString());
        }
      }
    });
  });
};

const buildTx = (api, {module, section, parameters}) => {
  return api.tx[module][section](...parameters)
};

const response = await fetch("http://localhost:3001/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain
        to: "Chain", //Destination Parachain/Relay chain
        currencyFrom: "Currency", // Currency to send
        currencyTo: "Currency", // Currency to receive
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        address: "Address", //Recipient address
        injectorAddress: 'InjectorAddress', //Address of sender
    })
});

const {
        txs: [toExchange, swap, toDest],
        exchangeNode,
      } = await response.data;

// create api promise for origin node
const originApi = await ApiPromise.create({ wsProvider: '...' });
// create api promise for exchange node (use echangeNode variable returned from API)
const swapApi = await ApiPromise.create({ wsProvider: '...' });
await submitTransaction(originApi, buildTx(originApi, toExchange), signer, injectorAddress);
await submitTransaction(swapApi, buildTx(swapApi, swap), signer, injectorAddress);
await submitTransaction(swapApi, buildTx(swapApi, toDest), signer, injectorAddress);
```


## Automatic exchange selection 

If you wish to have exchange chain selection based on best price outcome, you can opt for automatic exchange selection method. This method can be selected by **not using** `exchange:` parameter in the call. Router will then automatically select the best exchange chain for you based on the best price outcome.
  
**Endpoint**: `POST /router`

   - **Parameters**:
     - `from`: (required): Represents the Parachain from which the assets will be transferred.
     - `to`: (required): Represents the Parachain to which the assets will be transferred.
     - `currencyFrom`: (required): Represents the asset being sent.
     - `currencyTo`: (required): Represents the asset being received. 
     - `amount`: (required): Specifies the amount of assets to transfer.
     - `slippagePct`: (required): Specifies the slipeage percentage. 
     - `address`: (required): Specifies the address of the recipient.
     - `injectorAddress`: (required): Specifies the address of the sender.


   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameters  'to' is not provided
     - `400`  (Bad request exception) - Returned when query parameters  'to' is not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameters  'from' is not provided
     - `400`  (Bad request exception) - Returned when query parameters  'from' is not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameter 'currencyTo' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'currencyTo' is not a valid currency
     - `400`  (Bad request exception) - Returned when query parameter 'currencyFrom' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'currencyFrom' is not a valid currency
     - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'slippagePct' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'address' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain
        to: "Chain", //Destination Parachain/Relay chain
        currencyFrom: "Currency", // Currency to send
        currencyTo: "Currency", // Currency to receive
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        address: "Address", //Recipient address
        injectorAddress: 'InjectorAddress', //Address of sender
    })
});
```


## Manual exchange selection

If you wish to select your exchange chain manually you can do that by providing aditional parameter `exchange:` in the call. Router will then use exchange chainn of your choice.

**Endpoint**: `POST /router`

   - **Parameters**:
     - `from`: (required): Represents the Parachain from which the assets will be transferred.
     - `exchange`: (optional): Represents the Parachain DEX on which tokens will be exchanged (If not provided, DEX is selected automatically based on best price output).
     - `to`: (required): Represents the Parachain to which the assets will be transferred.
     - `currencyFrom`: (required): Represents the asset being sent.
     - `currencyTo`: (required): Represents the asset being received. 
     - `amount`: (required): Specifies the amount of assets to transfer.
     - `slippagePct`: (required): Specifies the slippage percentage. 
     - `address`: (required): Specifies the address of the recipient.
     - `injectorAddress`: (required): Specifies the address of the sender.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameters  'to' is not provided
     - `400`  (Bad request exception) - Returned when query parameters  'to' is not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameters  'from' is not provided
     - `400`  (Bad request exception) - Returned when query parameters  'from' is not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameter 'exchange' is not valid exchange
     - `400`  (Bad request exception) - Returned when query parameter 'currencyTo' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'currencyTo' is not a valid currency
     - `400`  (Bad request exception) - Returned when query parameter 'currencyFrom' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'currencyFrom' is not a valid currency
     - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'slippagePct' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'address' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain
        exchange: "Dex", //Exchange Parachain/Relay chain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain
        currencyFrom: "Currency", // Currency to send
        currencyTo: "Currency", // Currency to receive
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        address: "Address", //Recipient address
        injectorAddress: 'InjectorAddress', //Address of sender
    })
});
```