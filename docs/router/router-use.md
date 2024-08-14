# XCM Router Implementation Guide

XCM Router can perform cross-chain transactions between Polkadot/Kusama Parachains and Relay chains as well. 
It works across 8 open-source Parachain DEXes.

**These are:**
- Acala / 36 Pools available
- Basilisk / 15 Pools available
- BifrostKusama / 66 Pools available / Requires native token for swaps
- BifrostPolkadot / 45 Pools available / Requires native token for swaps
- HydraDX / 210 Pools available
- Interlay / 10 Pools available / Requires native token for swaps
- Karura / 136 Pools available
- Kintsugi / 6 Pools available / Requires native token for swaps

Totalling to 524 pools available for cross-chain swap transactions.

**NOTE: Some exchanges require native tokens to proceed with swaps.**

## Automatic exchange selection
If you wish to have an exchange chain selection based on the best price outcome, you can opt for the automatic exchange selection method. This method can be selected by **not using** `.exchange()` parameter in the call. The router will then automatically select the best exchange chain for you based on the best price outcome.

### Builder pattern

```js
await RouterBuilder
        .from('Polkadot')   //Origin Parachain/Relay chain
        .to('Astar')    //Destination Parachain/Relay chain
        .currencyFrom('DOT')    // Currency to send
        .currencyTo('ASTR')    // Currency to receive
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .injectorAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(injector.signer)    //Signer
        //.evmInjectorAddress(evmInjector address)   //Optional parameters when origin node is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin node is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TTxProgressInfo) => {  //This is how we subscribe to calls that need signing
          console.log(status.hashes);   //Transaction hashes
          console.log(status.status);   //Transaction statuses
          console.log(status.type);    //Transaction types
        })
        .buildAndSend()
```

### Function pattern

```js
await transfer({
        from: 'Polkadot', //Origin Parachain/Relay chain
        to: 'Interlay', //Destination Parachain/Relay chain
        currencyFrom: 'DOT', // Currency to send
        currencyTo: 'INTR', // Currency to receive
        amount: '100000', // Amount to send
        slippagePct: '1', // Max slipppage percentage
        injectorAddress: selectedAccount.address, //Injector address
        address: recipientAddress, //Recipient address
        signer: injector.signer,  //Signer
        //evmInjectorAddress: evmInjector address,   //Optional parameters when origin node is EVM based (Required with evmSigner)
        //evmSigner: EVM signer,                     //Optional parameters when origin node is EVM based (Required with evmInjectorAddress)

        onStatusChange: (status: TTxProgressInfo) => {  //This is how we subscribe to calls that need signing
          console.log(status.hashes);   //Transaction hashes
          console.log(status.status);   //Transaction statuses
          console.log(status.type);     //Transaction types
        },
      });

```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

## Manual exchange selection
If you wish to select your exchange chain manually you can do that by providing additional parameter `.exchange()` in the call. The router will then use the exchange chain of your choice.

### Builder pattern

```js
await RouterBuilder
        .from('Polkadot')   //Origin Parachain/Relay chain
        .exchange('HydraDxDex')    //Exchange Parachain
        .to('Astar')    //Destination Parachain/Relay chain
        .currencyFrom('DOT')    // Currency to send
        .currencyTo('ASTR')    // Currency to receive
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .injectorAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(injector.signer)    //Signer
        //.evmInjectorAddress(evmInjector address)   //Optional parameters when origin node is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin node is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TTxProgressInfo) => {  //This is how we subscribe to calls that need signing
          console.log(status.hashes);   //Transaction hashes
          console.log(status.status);   //Transaction statuses
          console.log(status.type);    //Transaction types
        })
        .buildAndSend()
```

### Function pattern

```js
await transfer({
        from: 'Polkadot', //Origin Parachain/Relay chain
        exchange: 'AcalaDex', //Exchange Parachain
        to: 'Interlay', //Destination Parachain/Relay chain
        currencyFrom: 'DOT', // Currency to send
        currencyTo: 'INTR', // Currency to receive
        amount: '100000', // Amount to send
        slippagePct: '1', // Max slipppage percentage
        injectorAddress: selectedAccount.address, //Injector address
        address: recipientAddress, //Recipient address
        signer: injector.signer,  //Signer
        //evmInjectorAddress: evmInjector address,   //Optional parameters when origin node is EVM based (Required with evmSigner)
        //evmSigner: EVM signer,                     //Optional parameters when origin node is EVM based (Required with evmInjectorAddress)

        onStatusChange: (status: TTxProgressInfo) => {  //This is how we subscribe to calls that need signing
          console.log(status.hashes);   //Transaction hashes
          console.log(status.status);   //Transaction statuses
          console.log(status.type);     //Transaction types
        },
      });

```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

## Snowbridge
You can now use Ethereum <> Polkadot bridge in the XCM Router. There are two scenarios to this transfer.

### Polkadot -> Ethereum
Following scenario works just like normal transfer, you just select Ethereum as destination chain. See example below.

```js
await RouterBuilder
        .from('Origin')   //Origin Parachain/Relay chain
        .to('Ethereum')   
        .currencyFrom('DOT')    // Currency to send
        .currencyTo('WETH')    // Any currency supported by Ethereum bridge (WETH, WBTC and more)
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .injectorAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(injector.signer)    //Signer
        //.evmInjectorAddress(evmInjector address)   //Optional parameters when origin node is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin node is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TTxProgressInfo) => {  //This is how we subscribe to calls that need signing
          console.log(status.hashes);   //Transaction hashes
          console.log(status.status);   //Transaction statuses
          console.log(status.type);    //Transaction types
        })
        .buildAndSend()
```

### Ethereum -> Polkadot
The other scenario is a little different as it requires other parameters because Ethereum has different wallets and signers.

```js
await RouterBuilder()
    .from('Ethereum')     
    .to('Destination')     //Destination Chain
    .currencyTo('WETH')    // Any currency supported by Ethereum bridge (WETH, WBTC and more)
    .currencyTo('GLMR')   // Currency to receive
    .amount('1000000')  // Amount to send
    .injectorAddress(selectedAccount.address)   //Injector address
    .recipientAddress(recipientAddress) //Recipient address
    .signer(injector.signer)    //Signer
    .slippagePct('1')   // Max slipppage percentage
    .onStatusChange(onStatusChange)
    .assetHubAddress(address) //Asset Hub address where currency from Ethereum will be sent
    .ethSigner(ethSigner) // Ethereum signer
    .build();

    .onStatusChange((status: TTxProgressInfo) => {  //This is how we subscribe to calls that need signing
      console.log(status.hashes);   //Transaction hashes
      console.log(status.status);   //Transaction statuses
      console.log(status.type);    //Transaction types
    })
    .buildAndSend()
```

## Ready to use in SpellRouter

| DEX | Can send to/receive from | Supported assets | Notes |
| ------------- | ------------- | ------------- |------------- |
| Acala DEX |Polkadot Relay, Astar, HydraDX, Interlay, Moonbeam, Parallel, AssetHubPolkadot, Unique network|ACA, DOT, aSEED, USDCet, UNQ, IBTC, INTR, lcDOT, LDOT| Fees are paid by either ACA or DOT|
|Karura DEX| Kusama Relay, Altair, Basilisk, BifrostKusama, Calamari, Crab, Parallel Heiko, Kintsugi, Moonriver, Quartz, Crust Shadow, Shiden, AssetHubKusama| BNC, USDCet, RMRK, ARIS, AIR, QTZ, CSM, USDT, KAR, KBTC, KINT, KSM, aSEED, LKSM, PHA, tKSM, TAI | Fees are paid by either KAR or KSM|
|Hydration DEX| Polkadot Relay, Acala, Interlay, AssetHubPolkadot, Zeitgeist, Astar, Centrifuge, BifrostPolkadot, Mythos | USDT, MYTH, HDX, WETH, GLMR, IBTC, BNC, WBTC, vDOT, DAI, CFG, DOT, DAI, ZTG, WBTC, INTR, ASTR, LRNA, USDC| Chain automatically gives you native asset to pay for fees.|
| Basilisk DEX | Kusama Relay, Karura, AssetHubKusama, Tinkernet, Robonomics| BSX, USDT, aSEED, XRT, KSM, TNKR| Chain automatically gives you native asset to pay for fees.|
|Bifrost Kusama DEX| Kusama Relay, AssetHubKusama, Karura, Moonriver, Kintsugi| BNC, vBNC, vsKSM, vKSM, USDT, aSEED, KAR, ZLK, RMRK, KBTC, MOVR, vMOVR| Chain requires native BNC asset for fees.|
|Bifrost Polkadot DEX| Polkadot Relay, AssetHubPolkadot, Moonbeam, Astar, Interlay| BNC, vDOT, vsDOT, USDT, FIL, vFIL, ASTR, vASTR, GLMR, vGLMR, MANTA, vMANTA|Chain requires native BNC asset for fees.|
|Interlay DEX| Polkadot Relay, Acala, Astar, Parallel, PolkadotAssetHub, HydraDX, BifrostPolkadot |INTR, DOT, IBTC, USDT, VDOT| Chain requires native INTR asset for fees.|
|Kintsugi DEX| Kusama Relay, Karura, KusamaAssetHub, Parallel Heiko, BifrostKusama|KINT,KSM,KBTC,USDT|Chain requires native KINT asset for fees.|