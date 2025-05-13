# XCM Router (SpellRouter☄️) 

Following section covers XCM Router implementation in LightSpell XCM API. Users can use XCM Router to perform cross-chain transactions between compatible two chains and receive different assets than assets that were sent. This helps with liquidity and user experience as users do not need to perform multiple transactions to achieve the same result.

For list of supported chains/assets/dexes head over to [List of supported chains](https://paraspell.github.io/docs/supported.html#xcm-router%E2%98%84)

### Package-less implementation of XCM API Router features into your application
```NOTE:``` We recently introduced new much simpler way to implement XCM API! You can now request hashed response of built call which offlifts you from parsing and works right away!

```ts
export const submitTransaction = async (
  tx: TPapiTransaction,
  signer: PolkadotSigner,
  onSign?: () => void,
): Promise<TxFinalizedPayload> => {
  return new Promise((resolve, reject) => {
    tx.signSubmitAndWatch(signer).subscribe({
      next: (event) => {
        if (event.type === 'signed') {
          onSign?.();
        }

        if (event.type === 'finalized') {
          if (!event.ok) {
            const errorMsg = event.dispatchError?.value
              ? JSON.stringify(event.dispatchError.value)
              : 'Transaction failed';
            reject(new Error(errorMsg));
          } else {
            resolve(event);
          }
        }
      },
      error: (error) => {
        if (error instanceof InvalidTxError) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const typedErr = error.error;
          reject(new Error(`Invalid transaction: ${JSON.stringify(typedErr)}`));
        } else {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      },
    });
  });
};


const response = await fetch("http://localhost:3001/v2/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", // Origin Parachain/Relay chain
        to: "Chain", // Destination Parachain/Relay chain
        currencyFrom: {currencySpec}, // Currency to send - {symbol: currencySymbol} | {id: currencyID}
        currencyTo: {currencySpec}, // Currency to receive - {symbol: currencySymbol} | {id: currencyID}
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        recipientAddress: "Address", // Recipient address
        senderAddress: 'InjectorAddress', // Address of sender
        evmSenderAddress: 'EvmInjectorAddress', // EVM address of sender
    })
});

const txs = await response.json();

for (const txInfo of txs) {
    // Use the WS provider URL retrieved from the API to create an ApiPromise instance
    const api = createClient(
          withPolkadotSdkCompat(getWsProvider(txInfo.wsProviders)),
        );
const tx = await api
            .getUnsafeApi()
            .txFromCallData(Binary.fromHex(txInfo.tx))

    if (txInfo.statusType === "TO_EXCHANGE") {
      // When submitting to exchange, prioritize the evmSigner if available
      await submitTransaction(
        tx,
        evmSigner ?? signer,
      );
    } else {
      await submitTransaction(
        tx,
        signer,
      );
    }
}
```


## Automatic exchange selection 

If you wish to have exchange chain selection based on best price outcome, you can opt for automatic exchange selection method. This method can be selected by **not using** `exchange:` parameter in the call. Router will then automatically select the best exchange chain for you based on the best price outcome.
  
**Endpoint**: `POST /v2/router-hash`

   - **Parameters**:
     - `from`: (optional): Represents the Parachain from which the assets will be transferred.
     - `to`: (optional): Represents the Parachain to which the assets will be transferred.
     - `currencyFrom`: (required): Represents the asset being sent.
     - `currencyTo`: (required): Represents the asset being received. 
     - `amount`: (required): Specifies the amount of assets to transfer.
     - `slippagePct`: (required): Specifies the slipeage percentage. 
     - `recipientAddress`: (required): Specifies the address of the recipient.
     - `injectorAddress`: (required): Specifies the address of the sender.
     - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.


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
     - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is not a valid address
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {currencySpec}, // Currency to send - {symbol: 'ASTR'})    // Currency to receive - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        currencyTo: {currencySpec}, // Currency to receive - {symbol: 'ASTR'})    // Currency to receive - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        recipientAddress: "Address", //Recipient address
        senderAddress: 'InjectorAddress', //Address of sender
    })
});
```

## Whitelist exchange selection 

If you wish to have exchange chain selection based on best price outcome from selected chains, you can opt for whitelist exchange selection method. This method can be selected by **using desired chains in** `exchange:` parameter in the call. Router will then automatically select the best exchange chain for you based on the best price outcome.
  
**Endpoint**: `POST /v2/router-hash`

   - **Parameters**:
     - `from`: (optional): Represents the Parachain from which the assets will be transferred.
     - `exchange`: (optional): Represents the Parachain DEXex on which tokens can be exchanged (If not provided, DEX is selected automatically based on best price output).
     - `to`: (optional): Represents the Parachain to which the assets will be transferred.
     - `currencyFrom`: (required): Represents the asset being sent.
     - `currencyTo`: (required): Represents the asset being received. 
     - `amount`: (required): Specifies the amount of assets to transfer.
     - `slippagePct`: (required): Specifies the slipeage percentage. 
     - `recipientAddress`: (required): Specifies the address of the recipient.
     - `injectorAddress`: (required): Specifies the address of the sender.
     - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.


   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameters  'to' is not provided
     - `400`  (Bad request exception) - Returned when query parameters  'to' is not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameter 'exchange' is not valid exchange
     - `400`  (Bad request exception) - Returned when query parameters  'from' is not provided
     - `400`  (Bad request exception) - Returned when query parameters  'from' is not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameter 'currencyTo' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'currencyTo' is not a valid currency
     - `400`  (Bad request exception) - Returned when query parameter 'currencyFrom' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'currencyFrom' is not a valid currency
     - `400`  (Bad request exception) - Returned when query parameter 'amount' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'slippagePct' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is not a valid address
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: ["Dex", "Dex2", ...] //Exchange Parachain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {currencySpec}, // Currency to send - {symbol: 'ASTR'})    // Currency to receive - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        currencyTo: {currencySpec}, // Currency to receive - {symbol: 'ASTR'})    // Currency to receive - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        recipientAddress: "Address", //Recipient address
        senderAddress: 'InjectorAddress', //Address of sender
    })
});
```

## Manual exchange selection

If you wish to select your exchange chain manually you can do that by providing aditional parameter `exchange:` in the call. Router will then use exchange chainn of your choice.

**Endpoint**: `POST /v2/router-hash`

   - **Parameters**:
     - `from`: (optional): Represents the Parachain from which the assets will be transferred.
     - `exchange`: (optional): Represents the Parachain DEX on which tokens will be exchanged (If not provided, DEX is selected automatically based on best price output).
     - `to`: (optional): Represents the Parachain to which the assets will be transferred.
     - `currencyFrom`: (required): Represents the asset being sent.
     - `currencyTo`: (required): Represents the asset being received. 
     - `amount`: (required): Specifies the amount of assets to transfer.
     - `slippagePct`: (required): Specifies the slippage percentage. 
     - `recipientAddress`: (required): Specifies the address of the recipient.
     - `injectorAddress`: (required): Specifies the address of the sender.
     - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.


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
     - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is not a valid address
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: "Dex", //Exchange Parachain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {currencySpec}, // Currency to send - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        currencyTo: {currencySpec}, // Currency to receive - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        recipientAddress: "Address", //Recipient address
        senderAddress: 'InjectorAddress', //Address of sender
    })
});
```

## Best amount out

If you wish to find out what is the `best amount out` from specified dex or from any dex you can use following query.

**Endpoint**: `POST /v2/router/best-amount-out`

   - **Parameters**:
     - `from`: (optional): Represents the Parachain from which the assets will be transferred.
     - `exchange`: (optional): Represents the Parachain DEX on which tokens will be exchanged (If not provided, DEX is selected automatically based on best price output).
     - `to`: (required): Represents the Parachain to which the assets will be transferred.
     - `currencyFrom`: (required): Represents the asset being sent.
     - `currencyTo`: (required): Represents the asset being received. 
     - `amount`: (required): Specifies the amount of assets to transfer.

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
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v2/router/best-amount-out", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: "Dex", //Exchange Parachain/Relay chain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {currencySpec}, // Currency to send - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        currencyTo: {currencySpec}, // Currency to receive - {id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount}
        amount: "Amount", // Amount to send
    })
});
```