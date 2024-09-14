# XCM Router (SpellRouter☄️) 

Following section covers XCM Router implementation in LightSpell XCM API. Users can use XCM Router to perform cross-chain transactions between compatible two chains and receive different assets than assets that were sent. This helps with liquidity and user experience as users do not need to perform multiple transactions to achieve the same result.

For list of supported chains/assets/dexes head over to [List of supported chains](https://paraspell.github.io/docs/supported.html#xcm-router%E2%98%84)

### Package-less implementation of XCM API Router features into your application
```NOTE:``` We recently introduced new much simpler way to implement XCM API! You can now request hashed response of built call which offlifts you from parsing and works right away!

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

const response = await fetch("http://localhost:3001/router-hash", {
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
        address: "Address", // Recipient address
        injectorAddress: 'InjectorAddress', // Address of sender
        evmInjectorAddress: 'EvmInjectorAddress', // EVM address of sender
    })
});

const txs = await response.json();

for (const txInfo of txs) {
    // Use the WS provider URL retrieved from the API to create an ApiPromise instance
    const api = await ApiPromise.create({
      provider: new WsProvider(txInfo.wsProvider),
    });

    if (txInfo.statusType === "TO_EXCHANGE") {
      // When submitting to exchange, prioritize the evmSigner if available
      const txHash = txInfo.tx
      await submitTransaction(
        api,
        api.tx(txHash),
        evmSigner ?? signer,
        evmInjectorAddress ?? injectorAddress
      );
    } else {
      await submitTransaction(
        api,
        api.tx(txHash),
        signer,
        injectorAddress
      );
    }
}
```


## Automatic exchange selection 

If you wish to have exchange chain selection based on best price outcome, you can opt for automatic exchange selection method. This method can be selected by **not using** `exchange:` parameter in the call. Router will then automatically select the best exchange chain for you based on the best price outcome.
  
**Endpoint**: `POST /router-hash`

   - **Parameters**:
     - `from`: (required): Represents the Parachain from which the assets will be transferred.
     - `to`: (required): Represents the Parachain to which the assets will be transferred.
     - `currencyFrom`: (required): Represents the asset being sent.
     - `currencyTo`: (required): Represents the asset being received. 
     - `amount`: (required): Specifies the amount of assets to transfer.
     - `slippagePct`: (required): Specifies the slipeage percentage. 
     - `address`: (required): Specifies the address of the recipient.
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
     - `400`  (Bad request exception) - Returned when query parameter 'address' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/router-hash", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain
        to: "Chain", //Destination Parachain/Relay chain
        currencyFrom: {currencySpec}, // Currency to send - {symbol: currencySymbol} | {id: currencyID}
        currencyTo: {currencySpec}, // Currency to receive - {symbol: currencySymbol} | {id: currencyID}
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        address: "Address", //Recipient address
        injectorAddress: 'InjectorAddress', //Address of sender
    })
});
```


## Manual exchange selection

If you wish to select your exchange chain manually you can do that by providing aditional parameter `exchange:` in the call. Router will then use exchange chainn of your choice.

**Endpoint**: `POST /router-hash`

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
     - `400`  (Bad request exception) - Returned when query parameter 'address' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'address' is not a valid address
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is expected but not provided
     - `400`  (Bad request exception) - Returned when query parameter 'injectorAddress' is not a valid address
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.


**Example of request:**
```js
const response = await fetch("http://localhost:3001/router-hash", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        from: "Chain", //Origin Parachain/Relay chain
        exchange: "Dex", //Exchange Parachain/Relay chain //Optional parameter, if not specified exchange will be auto-selected
        to: "Chain", //Destination Parachain/Relay chain
        currencyFrom: {currencySpec}, // Currency to send - {symbol: currencySymbol} | {id: currencyID}
        currencyTo: {currencySpec}, // Currency to receive - {symbol: currencySymbol} | {id: currencyID}
        amount: "Amount", // Amount to send
        slippagePct: "Pct", // Max slipppage percentage
        address: "Address", //Recipient address
        injectorAddress: 'InjectorAddress', //Address of sender
    })
});
```

## Snowbridge implementation
Following section provides XCM API Snowbridge implementation snippet:
```js

// Request Ethereum wallets and create signer
if (!window.ethereum) {
  alert("Please install MetaMask!");
  return;
}

const provider = new ethers.BrowserProvider(window.ethereum);
await provider.send("eth_requestAccounts", []);

const signer = await provider.getSigner();
const account = await signer.getAddress();

const submitTransaction = () => {
  // Implementation same as before
};

const submitEthTransaction = async (apiResponse, assetHubAddress) => {
  const tx = apiResponse.tx;
  const GATEWAY_CONTRACT = "0xEDa338E4dC46038493b885327842fD3E301CaB39";

  const contract = IGateway__factory.connect(GATEWAY_CONTRACT, signer);
  const abi = ethers.AbiCoder.defaultAbiCoder();

  const address = {
    data: abi.encode(
      ["bytes32"],
      [u8aToHex(decodeAddress(assetHubAddress))]
    ),
    kind: 1,
  };

  const response = await contract.sendToken(
    tx.token,
    tx.destinationParaId,
    address,
    tx.destinationFee,
    tx.amount,
    {
      value: tx.fee,
    }
  );

  const receipt = await response.wait(1);

  if (receipt === null) {
    throw new Error("Error waiting for transaction completion");
  }

  if (receipt?.status !== 1) {
    throw new Error("Transaction failed");
  }

  const events = [];
  receipt.logs.forEach((log) => {
    const event = contract.interface.parseLog({
      topics: [...log.topics],
      data: log.data,
    });
    if (event !== null) {
      events.push(event);
    }
  });
};

const response = await fetch("http://localhost:3001/router-hash", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "Chain", // Origin Parachain/Relay chain/Ethereum
    to: "Chain", // Destination Parachain/Relay chain/Ethereum
    exchange: “AcalaDex”, //Either empty for automatic selection or use preffered DEX
    currencyFrom: {currencySpec}, // Currency to send - {symbol: currencySymbol} | {id: currencyID}
    currencyTo: {currencySpec}, // Currency to receive - {symbol: currencySymbol} | {id: currencyID}
    amount: "Amount", // Amount to send
    slippagePct: "Pct", // Max slippage percentage
    address: "Address", // Recipient address
    injectorAddress: "InjectorAddress", // Address of sender
    evmInjectorAddress: "", // Evm address of sender if needed
    ethAddress: "", // Needed only if transferring FROM Ethereum
  }),
});

const txs = await response.json();


for (const txInfo of txs) {
  if (txInfo.type === "EXTRINSIC") {
    // Handling of Polkadot transaction
    const api = await ApiPromise.create({
      provider: new WsProvider(txInfo.wsProvider),
    });

    const txHash = txInfo.tx;

    if (txInfo.statusType === "TO_EXCHANGE") {
      // When submitting to exchange, prioritize the evmSigner if available
      await submitTransaction(
        api,
        api.tx(txHash),
        evmSigner ?? signer,
        evmInjectorAddress ?? injectorAddress
      );
    } else {
      await submitTransaction(
        api,
        api.tx(txHash),
        signer,
        injectorAddress
      );
    }
  } else {
    await submitEthTransaction(txInfo.tx, assetHubAddress);
  }
}
```
