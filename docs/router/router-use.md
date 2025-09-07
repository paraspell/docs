# Ready to make cross-chain swap messages with ease? 🤝

XCM Router can perform cross-chain transactions between Polkadot/Kusama Parachains and Relay chains as well. 
It works across 8 open-source Parachain DEXes.

**These are:**
```
1️⃣ Supporting one click swaps
- Hydration / 210 Pools available
- AssetHubPolkadot / 32 Pools available / Requires specific native tokens for swaps

2️⃣ Supporting standard two click swaps
- Acala / 36 Pools available
- Basilisk / 15 Pools available
- BifrostKusama / 66 Pools available / Requires native token for swaps
- BifrostPolkadot / 45 Pools available / Requires native token for swaps
- Karura / 136 Pools available
- AssetHubKusama / 16 Pools available / Requires specific native tokens for swaps
```
Totaling to 556 pools available for cross-chain swap transactions.

**⚠️ IMPORTANT NOTES:** 
```
- 📣 Some exchanges require native tokens to proceed with swaps.

- 📣 Router now supports one-click cross-chain swaps! Supported exchanges are AssetHubPolkadot and Hydration.
        -Sidenote: Not all chains can be selected as origin for one-click cross-chain swaps, because their barrier doesn't support executing instructions. All chains can be selected as a destination, however. For origin chains that do not support execute instruction, we automatically default to the original two-click scenario.
```

## Automatic exchange selection
If you wish to have an exchange chain selection based on the best price outcome, you can opt for the automatic exchange selection method. This method can be selected by **not using** `.exchange()` parameter in the call. The router will then automatically select the best exchange chain for you based on the best price outcome.

```ts
await RouterBuilder()
        .from('Polkadot')   //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
        .to('Astar')    //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
        .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
        .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .senderAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(signer)    //PAPI Signer
        //.evmSenderAddress(evmInjector address)   //Optional parameters when origin CHAIN is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin CHAIN is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TRouterEvent) => {  //This is how we subscribe to calls that need signing
          console.log(status.type);   // Current transaction type
          console.log(status.routerPlan);   // Array of all transactions to execute
          console.log(status.chain);   // Current transaction origin chain
          console.log(status.destinationChain);    // Current transaction destination chain
          console.log(status.currentStep);    // 0-based step index of current transaction
        })
        .buildAndSend()
```

**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

  **Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

</details>

## Whitelist exchange selection
If you wish to have specific exchanges selection and select the best one among them based on the best price outcome, you can opt for the whitelist automatic exchange selection method. This method can be selected by **using** `.exchange()` parameter in the call and feeding it with **array of exchanges**. The router will then automatically select the best exchange chain for you based on the best price outcome.

```ts
await RouterBuilder()
        .from('Polkadot')   //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
        .exchange(['HydrationDex','AcalaDex','AssetHubPolkadotDex'])    //Exchange Parachains
        .to('Astar')    //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
        .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
        .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .senderAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(signer)    //PAPI Signer
        //.evmSenderAddress(evmInjector address)   //Optional parameters when origin CHAIN is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin CHAIN is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TRouterEvent) => {  //This is how we subscribe to calls that need signing
          console.log(status.type);   // Current transaction type
          console.log(status.routerPlan);   // Array of all transactions to execute
          console.log(status.chain);   // Current transaction origin chain
          console.log(status.destinationChain);    // Current transaction destination chain
          console.log(status.currentStep);    // 0-based step index of current transaction
        })
        .buildAndSend()
```

**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

  **Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

</details>

## Manual exchange selection
If you wish to select your exchange chain manually you can do that by providing additional parameter `.exchange()` in the call. The router will then use the exchange chain of your choice.

```ts
await RouterBuilder()
        .from('Polkadot')   //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
        .exchange('HydrationDex')    //Exchange Parachain
        .to('Astar')    //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
        .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
        .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
        .amount('1000000')  // Amount to send
        .slippagePct('1')   // Max slipppage percentage
        .senderAddress(selectedAccount.address)   //Injector address
        .recipientAddress(recipientAddress) //Recipient address
        .signer(signer)    //PAPI Signer
        //.evmSenderAddress(evmInjector address)   //Optional parameters when origin CHAIN is EVM based (Required with evmSigner)
        //.evmSigner(EVM signer)                     //Optional parameters when origin CHAIN is EVM based (Required with evmInjectorAddress)

        .onStatusChange((status: TRouterEvent) => {  //This is how we subscribe to calls that need signing
          console.log(status.type);   // Current transaction type
          console.log(status.routerPlan);   // Array of all transactions to execute
          console.log(status.chain);   // Current transaction origin chain
          console.log(status.destinationChain);    // Current transaction destination chain
          console.log(status.currentStep);    // 0-based step index of current transaction
        })
        .buildAndSend()
```

**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

  **Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

</details>

## Get amount out for your currency pair

To retrieve exchange amount, that you receive for your desired asset pair you can use following function. This function returns 2 parameters. Name of best fitting DEX (Automatic selection - can be further used for manual selection) and Amount out

```ts
const result = await RouterBuilder()
      .from('Astar') //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
      .to('Acala') //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
      .exchange('HydrationDex') //OPTIONAL PARAMETER - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
        .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
        .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
      .amount(10000000000n)
      .getBestAmountOut();

console.log(result.amountOut)
console.log(result.exchange)
```

**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

  **Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

</details>

## Get Router fees

You can retrieve fees for all operations XCM Router performs. Keep in mind, that they are not as accurate for transfer from exchange to destination as the currency that is planned to be routed after the swap is not yet available on that account (Thus it uses payment info method instead of dryrun in that scenario).

```ts
const fees = await RouterBuilder()
      .from(from) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
      .exchange(exchange) //OPTIONAL PARAMETER - 'HydrationDex' | 'AcalaDex' | 'AssetHubPolkadotDex' | ...
      .to(to) //OPTIONAL PARAMETER - 'Polkadot' | 'AssetHubPolkadot' | 'Hydration' | 'Moonbeam' | ...
        .currencyFrom(CURRENCY_SPEC) // Refer to currency spec options below
        .currencyTo(CURRENCY_SPEC)    // Refer to currency spec options below
      .amount(amount)
      .senderAddress(senderAddress)
      .recipientAddress(recipientAddress)
      .slippagePct(slippagePct)
      .getXcmFees();
```

**Possible output objects:**

<details>
<summary>The dryrun will return following objects</summary>

```
origin - Always present
assetHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum) - WILL DEPRECATE SOON - Superseded by hops array
destination - Present if origin doesn't fail
hops - Always present - An array of chains that the transfer hops through (Empty if none)
```

</details>

**Example output:**


<details>
        
<summary>One signature transfer scenarios</summary>

Router now features one-click cross-chain swaps using the Execute instruction (HydrationDex & AssetHubPolkadotDex). This allows us to get precise dry-run fee results for everything in one function call. 

<details>
<summary>Example of an output for swap transfer from Hydration > AssetHubPolkadotDex > Astar</summary>

```json
{
  "origin": {
    "weight": {
      "refTime": "1918633799",
      "proofSize": "13757"
    },
    "fee": "46696677064",
    "feeType": "dryRun",
    "sufficient": false,
    "currency": "USDT",
    "asset": {
      "assetId": "10",
      "symbol": "USDT",
      "decimals": 6,
      "existentialDeposit": "10000",
      "location": {
        "parents": 1,
        "interior": {
          "X3": [
            {
              "Parachain": 1000
            },
            {
              "PalletInstance": 50
            },
            {
              "GeneralIndex": 1984
            }
          ]
        }
      },
      "isFeeAsset": true,
      "alias": "USDT1",
      "amount": "10000000"
    }
  },
  "assetHub": {
    "fee": "4015851",
    "feeType": "dryRun",
    "currency": "USDT",
    "asset": {
      "assetId": "10",
      "symbol": "USDT",
      "decimals": 6,
      "existentialDeposit": "10000",
      "location": {
        "parents": 1,
        "interior": {
          "X3": [
            {
              "Parachain": 1000
            },
            {
              "PalletInstance": 50
            },
            {
              "GeneralIndex": 1984
            }
          ]
        }
      },
      "isFeeAsset": true,
      "alias": "USDT1"
    }
  },
  "destination": {
    "fee": "1813",
    "feeType": "dryRun",
    "sufficient": false,
    "currency": "USDC",
    "asset": {
      "assetId": "4294969281",
      "symbol": "USDC",
      "decimals": 6,
      "location": {
        "parents": 1,
        "interior": {
          "X3": [
            {
              "Parachain": 1000
            },
            {
              "PalletInstance": 50
            },
            {
              "GeneralIndex": 1337
            }
          ]
        }
      },
      "existentialDeposit": "1",
      "isFeeAsset": true
    }
  },
  "hops": [
    {
      "chain": "AssetHubPolkadot",
      "result": {
        "fee": "4015851",
        "feeType": "dryRun",
        "currency": "USDT",
        "asset": {
          "assetId": "10",
          "symbol": "USDT",
          "decimals": 6,
          "existentialDeposit": "10000",
          "location": {
            "parents": 1,
            "interior": {
              "X3": [
                {
                  "Parachain": 1000
                },
                {
                  "PalletInstance": 50
                },
                {
                  "GeneralIndex": 1984
                }
              ]
            }
          },
          "isFeeAsset": true,
          "alias": "USDT1"
        }
      },
      "isExchange": true
    }
  ]
}
```

</details>
</details>

<details>
        
<summary>Two signature scenarios</summary>

We suggest running this query twice. First time to get Origin > Exchange chain transfer fee and second time to get Swap + Exchange > Destination chain fee. This is because DryRun requires currency to be on selected account in order to check for result. While the currency is on origin at the start we are unable to perform the DryRun on exchange chain because user doesn't yet have the asset there. 

**First query call - Origin > Exchange example:**

<details>
<summary>Example of an output for swap transfer from Astar > Hydration > ... </summary>

```json
{
{
  "origin": {
    "fee": "84865735666669748",
    "feeType": "dryRun",
    "sufficient": true,
    "currency": "ASTR"
  },
  "destination": {
    "fee": "515268509029",
    "feeType": "dryRun",
    "currency": "HDX",
    "isExchange": true
  },
  "hops": [
    {
      "chain": "AssetHubPolkadot",
      "result": {
        "fee": "17450",
        "feeType": "dryRun",
        "currency": "USDT",
        "sufficient": true
      }
    }
  ]
}
```

</details>

**Second query call - Swap fee + Exchange > Destination example:**

<details>
<summary> Notes regarding the second query call</summary>

We are unable to perform XCM DryRun because the asset is not exchanged yet thus fees for XCM are estimated in payment info. 

The origin fee is **exchangeChain.fee + receivingChain.origin.fee**

The destination fee is **receivingChain.destination.fee**

In some occasions user has the exchanged asset already so DryRun might be also performed for receivingChain.origin.fee parameter. This will result in more precise fees, but they shouldn't differ too much in general - The switch between DryRun and PaymentInfo is automatic and internal so no action from your side required (DryRun is always performed first and only if it fails we switch to PaymentInfo).

</details>

<details>
<summary>Example of an output for swap transfer from ... > BifrostPolkadotDex > Moonbeam </summary>

```json
{
  "exchangeChain": {
    "fee": "19468364",
    "feeType": "dryRun",
    "currency": "DOT",
    "selectedExchange": "AssetHubPolkadotDex"
  },
  "receivingChain": {
    "origin": {
      "fee": "733054560",
      "feeType": "paymentInfo",
      "currency": "DOT",
      "dryRunError": "LocalExecutionIncomplete"
    },
    "destination": {
      "fee": "44916179205536000",
      "feeType": "paymentInfo",
      "currency": "GLMR"
    }
  }
}
```

</details>
</details>

**Initial setup:**

  <details>

  <summary>Currency spec options</summary>
  
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

  </details>

  **Builder configuration**

<details>
<summary>You can customize builder configuration for more advanced usage</summary>

**Decimal abstraction:**

Following setting will abstract decimals from the .currency builder functionality.

**NOTE:**

Types in amount parameter are **(number | string | bigint)**. If bigint is provided and decimal abstraction is turned on, it will automatically turn it off as bigint does not support float numbers.

```ts
const builder = await RouterBuilder({
  abstractDecimals: true // Abstracts decimals from amount - so 1 in amount for DOT equals 10_000_000_000 
})
```

</details>

## Helpful functions

Below, you can find helpful functions that are exported from XCM Router to help you enhance front end usability of XCM Router.

```ts
import {getExchangeAssets, getExchangePairs} from @paraspell/xcm-router

//Returns all assets that DEX supports
const assets = getExchangeAssets('AssetHubPolkadotDex')

//Returns asset pairs supported by selected exchanges
const pairs = getExchangePairs(exchange) // Exchange can be also array of exchanges such as [“HydrationDex”, “AcalaDex”] or undefined which will return all available pairs for all dexes
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
|AssetHubPolkadotDex| Polkadot Relay, Any Parachain it has HRMP channel with | DOT, WETH.e, USDC, USDT, LAOS, MYTH, WBBTC.e, ASX, BILL, DEMO, TATE, PINK, MODE, MVPW, PIGS, DED, wstETH.e, TTT, KSM, tBTC.e, PEPE.e, SHIB.e, TON.e, NAT, NT2, DOTA, STINK, MTC, AJUN, GGI, GLMR, NIN | Requires specific native tokens for swaps |
|AssetHubKusamaDex| Kusama Relay, Any Parachain it has HRMP channel with | KSM, DOT, USDC, USDT, BILLCOIN, WOOD, dUSD, TACP, TSM, MA42, USDT, DMO, JAM | Requires specific native tokens for swaps |
