# XCM Router (SpellRouter☄️) 

The following section covers the XCM Router implementation in the LightSpell XCM API. The XCM Router enables cross-chain swaps between two compatible chains while allowing the received assets to differ from the assets sent. This approach improves liquidity and overall experience by eliminating the need to perform multiple transactions to achieve the same result.

For list of supported chains/assets/dexes head over to [List of supported chains](https://paraspell.github.io/docs/supported.html#xcm-router%E2%98%84)

### Example of package-less implementation of XCM API Router features into your application

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


const response = await fetch("http://localhost:3001/v5/router", {
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
  
**Endpoint**: `POST /v5/router-hash`

  ::: details Parameters

  - `from`: (optional): Represents the Parachain from which the assets will be transferred.
  - `to`: (optional): Represents the Parachain to which the assets will be transferred.
  - `currencyFrom`: (required): Represents the asset being sent.
  - `currencyTo`: (required): Represents the asset being received. 
  - `amount`: (required): Specifies the amount of assets to transfer.
  - `slippagePct`: (required): Specifies the slipeage percentage. 
  - `recipientAddress`: (required): Specifies the address of the recipient.
  - `senderAddress`: (required): Specifies the address of the sender.
  - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.
  - `options`: (optional): Configuration options for the API

:::

  ::: details Errors

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
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 
```

:::

::: details Advanced API settings

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {CURRENCY_SPEC}, // Refer to currency spec options below
        currencyTo: {CURRENCY_SPEC}, // Refer to currency spec options below
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        recipientAddress: "Address", //Recipient address
        senderAddress: 'InjectorAddress', //Address of sender
    })
});
```

## Whitelist exchange selection 

If you wish to have exchange chain selection based on best price outcome from selected chains, you can opt for whitelist exchange selection method. This method can be selected by **using desired chains in** `exchange:` parameter in the call. Router will then automatically select the best exchange chain for you based on the best price outcome.
  
**Endpoint**: `POST /v5/router-hash`

  ::: details Parameters

  - `from`: (optional): Represents the Parachain from which the assets will be transferred.
  - `exchange`: (optional): Represents the Parachain DEXex on which tokens can be exchanged (If not provided, DEX is selected automatically based on best price output).
  - `to`: (optional): Represents the Parachain to which the assets will be transferred.
  - `currencyFrom`: (required): Represents the asset being sent.
  - `currencyTo`: (required): Represents the asset being received. 
  - `amount`: (required): Specifies the amount of assets to transfer.
  - `slippagePct`: (required): Specifies the slipeage percentage. 
  - `recipientAddress`: (required): Specifies the address of the recipient.
  - `senderAddress`: (required): Specifies the address of the sender.
  - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.
  - `options`: (optional): Configuration options for the API

:::

  ::: details Errors

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
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 
```

:::

::: details Advanced API settings

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  }
})
```

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: ["Dex", "Dex2", ...] //Exchange Parachain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {CURRENCY_SPEC}, // Refer to currency spec options below
        currencyTo: {CURRENCY_SPEC}, // Refer to currency spec options below
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        recipientAddress: "Address", //Recipient address
        senderAddress: 'InjectorAddress', //Address of sender
    })
});
```


## Manual exchange selection

If you wish to select your exchange chain manually you can do that by providing aditional parameter `exchange:` in the call. Router will then use exchange chain of your choice.

**Endpoint**: `POST /v5/router-hash`

  ::: details Parameters

  - `from`: (optional): Represents the Parachain from which the assets will be transferred.
  - `exchange`: (optional): Represents the Parachain DEX on which tokens will be exchanged (If not provided, DEX is selected automatically based on best price output).
  - `to`: (optional): Represents the Parachain to which the assets will be transferred.
  - `currencyFrom`: (required): Represents the asset being sent.
  - `currencyTo`: (required): Represents the asset being received. 
  - `amount`: (required): Specifies the amount of assets to transfer.
  - `slippagePct`: (required): Specifies the slippage percentage. 
  - `recipientAddress`: (required): Specifies the address of the recipient.
  - `senderAddress`: (required): Specifies the address of the sender.
  - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.
  - `options`: (optional): Configuration options for the API

:::

  ::: details Errors

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
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 
```

:::

::: details Advanced API settings

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  }
})
```

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/router", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: "Dex", //Exchange Parachain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {CURRENCY_SPEC}, // Refer to currency spec options below
        currencyTo: {CURRENCY_SPEC}, // Refer to currency spec options below
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        recipientAddress: "Address", //Recipient address
        senderAddress: 'InjectorAddress', //Address of sender
    })
});
```

## Dry run your Router calls

You can find out whether you XCM message will execute successfuly or with error. XCM Message dry run should write you concrete error so you can find out if the XCM message will execute without it ever being submitted.

**Endpoint**: `POST /v5/router/dry-run`

  ::: details Parameters

  - `from`: (optional): Represents the Parachain from which the assets will be transferred.
  - `exchange`: (optional): Represents the Parachain DEX on which tokens will be exchanged (If not provided, DEX is selected automatically based on best price output).
  - `to`: (required): Represents the Parachain to which the assets will be transferred.
  - `currencyFrom`: (required): Represents the asset being sent.
  - `currencyTo`: (required): Represents the asset being received. 
  - `amount`: (required): Specifies the amount of assets to transfer.
  - `recipientAddress`: (required): Specifies the address of the recipient.
  - `senderAddress`: (required): Specifies the address of the sender.
  - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.
  - `options`: (optional): Configuration options for the API


:::

  ::: details Errors

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
  - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is not a valid address
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 
```

:::

::: details Advanced API settings

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  }
})
```

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/router/dry-run", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: "Dex", //Exchange Parachain/Relay chain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {CURRENCY_SPEC}, // Refer to currency spec options below
        currencyTo: {CURRENCY_SPEC}, // Refer to currency spec options below
        senderAddress: 'selectedAccount.address',   //Injector address
        recipientAddress: 'recipientAddress', //Recipient address
        evmSenderAddress: 'EvmInjectorAddress', // Only if origin is EVM
        amount: "Amount", // Amount to send
    })
});
```

## Minimal transferable amount

If you wish to find out what is the `minimal transferable amount` of the asset you are trying to exchange you can use following endpoint.

**Endpoint**: `POST /v5/router/min-transferable-amount`

  ::: details Parameters

  - `from`: (optional): Represents the Parachain from which the assets will be transferred.
  - `exchange`: (optional): Represents the Parachain DEX on which tokens will be exchanged (If not provided, DEX is selected automatically based on best price output).
  - `to`: (required): Represents the Parachain to which the assets will be transferred.
  - `currencyFrom`: (required): Represents the asset being sent.
  - `currencyTo`: (required): Represents the asset being received. 
  - `amount`: (required): Specifies the amount of assets to transfer.
  - `recipientAddress`: (required): Specifies the address of the recipient.
  - `senderAddress`: (optional): Specifies the address of the sender.
  - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.
  - `options`: (optional): Configuration options for the API


:::

  ::: details Errors

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
  - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is not a valid address
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 
```

:::

::: details Advanced API settings

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  }
})
```

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/router/min-transferable-amount", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: "Dex", //Exchange Parachain/Relay chain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {CURRENCY_SPEC}, // Refer to currency spec options below
        currencyTo: {CURRENCY_SPEC}, // Refer to currency spec options below
        senderAddress: 'selectedAccount.address',   //Injector address
        recipientAddress: 'recipientAddress', //Recipient address
        evmSenderAddress: 'EvmInjectorAddress', // Only if origin is EVM
        amount: "Amount", // Amount to send
    })
});
```

## Max transferable amount

If you wish to find out what is the `max transferable amount` of the asset you are trying to exchange you can use following endpoint.

**Endpoint**: `POST /v5/router/transferable-amount`

  ::: details Parameters

  - `from`: (optional): Represents the Parachain from which the assets will be transferred.
  - `exchange`: (optional): Represents the Parachain DEX on which tokens will be exchanged (If not provided, DEX is selected automatically based on best price output).
  - `to`: (required): Represents the Parachain to which the assets will be transferred.
  - `currencyFrom`: (required): Represents the asset being sent.
  - `currencyTo`: (required): Represents the asset being received. 
  - `amount`: (required): Specifies the amount of assets to transfer.
  - `recipientAddress`: (required): Specifies the address of the recipient.
  - `senderAddress`: (optional): Specifies the address of the sender.
  - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.
  - `options`: (optional): Configuration options for the API


:::

  ::: details Errors

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
  - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'recipientAddress' is not a valid address
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 
```

:::

::: details Advanced API settings

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  }
})
```

:::


**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/router/transferable-amount", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: "Dex", //Exchange Parachain/Relay chain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {CURRENCY_SPEC}, // Refer to currency spec options below
        currencyTo: {CURRENCY_SPEC}, // Refer to currency spec options below
        senderAddress: 'selectedAccount.address',   //Injector address
        recipientAddress: 'recipientAddress', //Recipient address
        evmSenderAddress: 'EvmInjectorAddress', // Only if origin is EVM
        amount: "Amount", // Amount to send
    })
});
```

## Best amount out

If you wish to find out what is the `best amount out` from specified dex or from any dex you can use following query.

**Endpoint**: `POST /v5/router/best-amount-out`

  ::: details Parameters

  - `from`: (optional): Represents the Parachain from which the assets will be transferred.
  - `exchange`: (optional): Represents the Parachain DEX on which tokens will be exchanged (If not provided, DEX is selected automatically based on best price output).
  - `to`: (required): Represents the Parachain to which the assets will be transferred.
  - `currencyFrom`: (required): Represents the asset being sent.
  - `currencyTo`: (required): Represents the asset being received. 
  - `amount`: (required): Specifies the amount of assets to transfer.
  - `options`: (optional): Configuration options for the API


:::

  ::: details Errors

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
    
:::

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 
```

:::

::: details Advanced API settings

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  }
})
```

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/router/best-amount-out", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: "Dex", //Exchange Parachain/Relay chain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {CURRENCY_SPEC}, // Refer to currency spec options below
        currencyTo: {CURRENCY_SPEC}, // Refer to currency spec options below
        amount: "Amount", // Amount to send
    })
});
```

## Get Router fees

You can retrieve fees for all operations XCM Router performs. Keep in mind, that they are not as accurate for transfer from exchange to destination as the currency that is planned to be routed after the swap is not yet available on that account (Thus it uses payment info method instead of dryrun in that scenario).

**Endpoint**: `POST /v5/router/xcm-fees`

  ::: details Parameters

  - `from`: (optional): Represents the Parachain from which the assets will be transferred.
  - `exchange`: (optional): Represents the Parachain DEX on which tokens will be exchanged (If not provided, DEX is selected automatically based on best price output).
  - `to`: (optional): Represents the Parachain to which the assets will be transferred.
  - `currencyFrom`: (required): Represents the asset being sent.
  - `currencyTo`: (required): Represents the asset being received. 
  - `amount`: (required): Specifies the amount of assets to transfer.
  - `slippagePct`: (required): Specifies the slippage percentage. 
  - `recipientAddress`: (required): Specifies the address of the recipient.
  - `senderAddress`: (required): Specifies the address of the sender.
  - `evmInjectorAddress`: (optional): Specifies the EVM address of the sender when sending from an EVM chain.
  - `options`: (optional): Configuration options for the API

:::

  ::: details Errors

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
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is expected but not provided
  - `400`  (Bad request exception) - Returned when query parameter 'senderAddress' is not a valid address
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::

::: details Currency spec options
  
**Following options are possible for currency specification:**

Asset selection by Location:
```ts
{location: AssetLocationString, amount: amount} //Recommended
{location: AssetLocationJson, amount: amount} //Recommended 
```

Asset selection by asset ID:
```ts
{id: currencyID, amount: amount} // Disabled when automatic exchange selection is chosen
```

Asset selection by asset Symbol:
```ts
// For basic symbol selection
{symbol: currencySymbol, amount: amount} 
```

:::

::: details Advanced API settings

You can customize following API settings, to further tailor your experience with API. You can do this by adding options parameter into request body.

```ts
options: ({
  development: true, // Optional: Enforces WS overrides for all chains used
  abstractDecimals: true, // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
  apiOverrides: {
    Hydration: // ws_url | [ws_url, ws_url,..]
    AssetHubPolkadot: // ws_url | [ws_url, ws_url,..]
    BridgeHubPolkadot: // ws_url | [ws_url, ws_url,..]
  }
})
```

:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/router/xcm-fees", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain - OPTIONAL PARAMETER
        exchange: "Dex", //Exchange Parachain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain - OPTIONAL PARAMETER
        currencyFrom: {CURRENCY_SPEC}, // Refer to currency spec options below
        currencyTo: {CURRENCY_SPEC}, // Refer to currency spec options below
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        recipientAddress: "Address", //Recipient address
        senderAddress: 'InjectorAddress', //Address of sender
    })
});
```


## Asset pairs

Retrieve which `asset pairs` are supported on which exchanges.

**Endpoint**: `POST /v5/router/pairs`

  ::: details Parameters

  - `exchange`: (optional): Represents the exchange for which the asset pairs should be retrieved 

:::

  ::: details Errors

  - `400`  (Bad request exception) - Returned when body parameter 'exchange' does not exist.
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::

**Example of request:**
```ts
const response = await fetch("http://localhost:3001/v5/router/pairs", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        exchange: "exchange chain", // Exchange can be also array of exchanges such as [“HydrationDex”, “AcalaDex”] or undefined which will return all available pairs for all dexes
    })
});
```
