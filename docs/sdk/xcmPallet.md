# Send XCM messages across Paraverse 🪐
### You can use our SDK in five different cross-chain scenarios:
- Relay chain to Parachain XCM transfer 
- Parachain to Relay chain XCM transfer
- Parachain to Parachain XCM transfer
- Parachain to Ethereum transfer
- Polkadot to Kusama ecosystem transfer and vice versa (DOT & KSM)

## Relay chain to Parachain

```ts
const builder = Builder(/*node api/ws_url_string/ws_url_array - optional*/)
      .from(RELAY_NODE) //Kusama or Polkadot
      .to(NODE/*,customParaId - optional*/ | Multilocation object)
      .currency({symbol: 'DOT', amount: amount})
      .address(address | Multilocation object)
      /*.xcmVersion(Version.V1/V2/V3/V4)  //Optional parameter for manual override of XCM Version used in call
        .customPallet('Pallet','pallet_function') //Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some node but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.*/

const tx = await builder.build()

//Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()

/*
EXAMPLE:
const builder = await Builder()
  .from('Polkadot')
  .to('Astar')
  .currency({
    symbol: 'DOT',
    amount: '1000000000'
  })
  .address(address)

const tx = await builder.build()

//Disconnect API after TX
await builder.disconnect()
*/
```

## Parachain to Relay chain

```ts
const builder = Builder(/*node api/ws_url_string/ws_url_array - optional*/)
      .from(NODE)
      .to(RELAY_NODE) //Kusama or Polkadot
      .currency({symbol: 'DOT', amount: amount})
      .address(address | Multilocation object)
      /*.xcmVersion(Version.V1/V2/V3/V4)  //Optional parameter for manual override of XCM Version used in call
        .customPallet('Pallet','pallet_function') //Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some node but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.*/

const tx = await builder.build()

//Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()

/*
EXAMPLE:
const builder = await Builder()
  .from('Astar')
  .to('Polkadot')
  .currency({
    symbol: 'DOT',
    amount: '1000000000'
  })
  .address(address)

const tx = await builder.build()

//Disconnect API after TX
await builder.disconnect()
*/
```

## Parachain to Parachain

**NOTE** If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `.currency(42259045809535163221576417993425387648n)` will mean you transfer xcDOT.

### Builder pattern

```ts
const builder = Builder(/*node api/ws_url_string/ws_url_array - optional*/)
      .from(NODE)
      .to(NODE /*,customParaId - optional*/ | Multilocation object /*Only works for PolkadotXCM pallet*/) 
      .currency({id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection/* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}})
      .address(address | Multilocation object /*If you are sending through xTokens, you need to pass the destination and address multilocation in one object (x2)*/)
      /*.senderAddress(address) - OPTIONAL - used when origin is AssetHub and feeAsset parameter is provided
        .ahAddress(ahAddress) - OPTIONAL - used when origin is EVM node and XCM goes through AssetHub (Multihop transfer where we are unable to convert Key20 to ID32 address eg. origin: Moonbeam & destination: Ethereum (Multihop goes from Moonbeam > AssetHub > BridgeHub > Ethereum)
        .feeAsset({symbol: 'symbol'} || {id: 'id'} || {multilocation: 'multilocation'}) // Optional parameter used when multiasset is provided or when origin is AssetHub - so user can pay in fees different than DOT
        .xcmVersion(Version.V1/V2/V3/V4)  //Optional parameter for manual override of XCM Version used in call
        .customPallet('Pallet','pallet_function') //Optional parameter for manual override of XCM Pallet and function used in call (If they are named differently on some node but syntax stays the same). Both pallet name and function required. Pallet name must be CamelCase, function name snake_case.*/

const tx = await builder.build()

//Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()

/*
EXAMPLE:
const builder = Builder()
  .from('Acala')
  .to('Astar')
  .currency({
    symbol: 'ACA',
    amount: '1000000000'
  })
  .address(address)

const tx = await builder.build()

//Disconnect API after TX
await builder.disconnect()
*/
```

## Ecosystem Bridges
This section sums up currently available and implemented ecosystem bridges that are offered in the XCM SDK. Implementing cross-ecosystem asset transfers was never this easy!

### Polkadot <> Kusama bridge
Latest SDK versions support Polkadot <> Kusama bridge in very native and intuitive way. You just construct the Polkadot <> Kusama transfer as standard Parachain to Parachain scenario transfer.

```ts
  await Builder(api)            //Api parameter is optional and can also be ws_url_string
        .from('AssetHubPolkadot')  //Either AHP or AHK
        .to('AssetHubKusama')     //Either AHP or AHK
        .currency({symbol: 'DOT', amount: amount})        // Either KSM or DOT 
        .address(address)
        .build()
```

### Polkadot <> Ethereum bridge (Snowbridge)
Just like Polkadot <> Kusama bridge the Snowbridge is implemented in as intuitive and native form as possible. The implementations for Polkadot -> Ethereum and Ethereum -> Polkadot differ due to different architecure so we will mention both scenarios.

#### Polkadot -> Ethereum transfer

**AssetHub**
```ts
await Builder(api)
          .from('AssetHubPolkadot')
          .to('Ethereum')           
          .currency({symbol: 'WETH', amount: amount})   //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .address(eth_address)  //AccountKey20 recipient address
          .build()
```
**Other non-evm Parachains**
```ts
await Builder(api)
          .from('Hydration') //Non-evm Parachain
          .to('Ethereum')           
          .currency({symbol: 'WETH', amount: amount})   //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .address(eth_address)  //AccountKey20 recipient address
          .senderAddress(sender_address) // Injector SS58 address
          .build()
```

**Other evm Parachains**
```ts
await EvmBuilder(provider)
          .from('Moonbeam') //EVM Parachain
          .to('Ethereum')           
          .currency({symbol: 'WETH', amount: amount})   //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
          .address(eth_address)  //AccountKey20 recipient address
          .senderAddress(sender_address) //Asset hub address (Needs to be sender address)
          .build()
```

#### Ethereum -> Polkadot transfer
```ts
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

await EvmBuilder(provider)   //Ethereum provider
  .from('Ethereum')   
  .to('AssetHubPolkadot')
  .currency({symbol: 'WETH', amount: amount})    //Any supported asset by bridge eg. WETH, WBTC, SHIB and more - {symbol: currencySymbol} | {id: currencyID}
  .address(address)   //AccountID32 recipient address
  //.ahAddress(ahAddress) ////ahAddress is optional and used in Ethereum>EVM Substrate chain (eg. Moonbeam) transfer.
  .signer(signer)     //Ethereum signer address
  .build();
```

**Helper functions:**
```js
await depositToken(signer: Signer, amount: bigint, symbol: string); //Deposit token to contract
await getTokenBalance(signer: Signer, symbol: string); //Get token balance
await approveToken(signer: Signer, amount: bigint, symbol: string); //Approve token
```

### Snowbridge status check
Query for Snowbridge status 

```ts
const status = await getBridgeStatus(/*optional parameter Bridge Hub API*/)
```

## Local transfers
```ts
const builder = Builder(/*node api/ws_url_string/ws_url_array - optional*/)
      .from(NODE)
      .to(NODE) //Has to be same as origin (from)
      .currency({id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection /* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}})
      .address(address)

const tx = await builder.build()

//Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()

/*
EXAMPLE:
const builder = Builder()
  .from('Hydration')
  .to('Hydration')
  .currency({
    symbol: 'DOT',
    amount: '1000000000'
  })
  .address(address)

const tx = await builder.build()

//Disconnect API after TX
await builder.disconnect()
*/
```

## Batch calls
You can batch XCM calls and execute multiple XCM calls within one call. All three scenarios (Para->Para, Para->Relay, Relay->Para) can be used and combined.
```ts
await Builder(/*node api/ws_url_string - optional*/)
      .from(NODE) //Ensure, that origin node is the same in all batched XCM Calls.
      .to(NODE_2) //Any compatible Parachain
      .currency({currencySelection, amount}) //Currency to transfer - options as in scenarios above
      .address(address | Multilocation object)
      .addToBatch()

      .from(NODE) //Ensure, that origin node is the same in all batched XCM Calls.
      .to(NODE_3) //Any compatible Parachain
      .currency({currencySelection, amount}) //Currency to transfer - options as in scenarios above
      .address(address | Multilocation object)
      .addToBatch()
      .buildBatch({ 
          // This settings object is optional and batch all is the default option
          mode: BatchMode.BATCH_ALL //or BatchMode.BATCH
      })
```

## Moonbeam xTokens smart-contract
If you need to sign Moonbeam / Moonriver transactions with other than Polkadot wallets (eg. Metamask), you can interact with their smart contract to perform operations with other wallets. Both Ethers and Viem are supported.

```ts
const hash = await EvmBuilder()
      .from('Moonbeam') // Moonbeam or Moonriver
      .to(node) //Parachain | Relay chain
      .currency(({id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount}) //Select currency by ID or Symbol
      .address(address)
      .signer(signer) // Ethers Signer or Viem Wallet Client
      .build()
```

### Asset claim:
Claim XCM trapped assets from the selected chain.

```ts
const builder = Builder(/*node api/ws_url_string/ws_url_array - optional*/)
      .claimFrom(NODE)
      .fungible(MultilocationArray (Only one multilocation allowed) [{Multilocation}])
      .account(address | Multilocation object)
      /*.xcmVersion(Version.V3) Optional parameter, by default V3. XCM Version ENUM if a different XCM version is needed (Supported V2 & V3). Requires importing Version enum.*/

const tx = await builder.build()

//Make sure to disconnect API after it is no longer used (eg. after transaction)
await builder.disconnect()
```

## Dry run your XCM Calls

Dry running let's you check whether your XCM Call will execute, giving you a chance to fix it if it is constructed wrongly or you didn't select correct account/asset or don't have enough balance. It is constructed in same way as standard XCM messages with parameter `.dryRun()` instead of `.build()`

```ts
const result = await Builder(API /*optional*/)
        .from(NODE)
        .to(NODE_2)
        .currency({id: currencyID, amount: amount} | {symbol: currencySymbol, amount: amount} | {symbol: Native('currencySymbol'), amount: amount} | {symbol: Foreign('currencySymbol'), amount: amount} | {symbol: ForeignAbstract('currencySymbol'), amount: amount} | {multilocation: AssetMultilocationString, amount: amount | AssetMultilocationJson, amount: amount} | {multilocation: Override('Custom Multilocation'), amount: amount} | {multiasset: {currencySelection/* for example symbol: symbol or id: id, or multilocation: multilocation*/, amount: amount}})
        /*.feeAsset(CURRENCY) - Optional parameter when origin === AssetHubPolkadot and TX is supposed to be paid in same fee asset as selected currency.*/
        .address(ADDRESS)
        .senderAddress(SENDER_ADDRESS)
        .dryRun()

//Check Parachain for DryRun support - returns true/false
//PAPI
import { hasDryRunSupport } from "@paraspell/sdk";
//PJS
import { hasDryRunSupport } from "@paraspell/sdk-pjs";

const result = hasDryRunSupport(node)
```

**Possible output objects:**
```
origin - Always present
assetHub - Present if XCM is Multihop (For example Para > Ethereum)
bridgeHub - Present if XCM is Multihop (For example Para > Ethereum)
destination - Present if origin doesn't fail
```

**Example output:**
```json
{
  "origin": {
    "success": true,
    "fee": "523900168617",
    "forwardedXcms": [
      {
        "type": "V4",
        "value": {
          "parents": 1,
          "interior": {
            "type": "Here"
          }
        }
      },
      [
        {
          "type": "V3",
          "value": [
            {
              "type": "WithdrawAsset",
              "value": [
                {
                  "id": {
                    "type": "Concrete",
                    "value": {
                      "parents": 0,
                      "interior": {
                        "type": "Here"
                      }
                    }
                  },
                  "fun": {
                    "type": "Fungible",
                    "value": "2000000000"
                  }
                }
              ]
            },
            {
              "type": "ClearOrigin"
            },
            {
              "type": "BuyExecution",
              "value": {
                "fees": {
                  "id": {
                    "type": "Concrete",
                    "value": {
                      "parents": 0,
                      "interior": {
                        "type": "Here"
                      }
                    }
                  },
                  "fun": {
                    "type": "Fungible",
                    "value": "1000000000"
                  }
                },
                "weight_limit": {
                  "type": "Unlimited"
                }
              }
            },
            {
              "type": "DepositReserveAsset",
              "value": {
                "assets": {
                  "type": "Wild",
                  "value": {
                    "type": "AllCounted",
                    "value": 1
                  }
                },
                "dest": {
                  "parents": 0,
                  "interior": {
                    "type": "X1",
                    "value": {
                      "type": "Parachain",
                      "value": 2006
                    }
                  }
                },
                "xcm": [
                  {
                    "type": "BuyExecution",
                    "value": {
                      "fees": {
                        "id": {
                          "type": "Concrete",
                          "value": {
                            "parents": 1,
                            "interior": {
                              "type": "Here"
                            }
                          }
                        },
                        "fun": {
                          "type": "Fungible",
                          "value": "1000000000"
                        }
                      },
                      "weight_limit": {
                        "type": "Unlimited"
                      }
                    }
                  },
                  {
                    "type": "DepositAsset",
                    "value": {
                      "assets": {
                        "type": "Wild",
                        "value": {
                          "type": "AllCounted",
                          "value": 1
                        }
                      },
                      "beneficiary": {
                        "parents": 0,
                        "interior": {
                          "type": "X1",
                          "value": {
                            "type": "AccountId32",
                            "value": {
                              "id": {}
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            },
            {
              "type": "SetTopic",
              "value": {}
            }
          ]
        }
      ]
    ],
    "destParaId": 0,
    "currency": "HDX"
  },
  "destination": {
    "success": true,
    "fee": "45825617",
    "weight": {
      "refTime": "577609000",
      "proofSize": "7186"
    },
    "forwardedXcms": [
      {
        "type": "V4",
        "value": {
          "parents": 0,
          "interior": {
            "type": "X1",
            "value": {
              "type": "Parachain",
              "value": 2094
            }
          }
        }
      },
      []
    ],
    "destParaId": 2094,
    "currency": "DOT"
  }
}
```

## Developer experience

### Builder pattern experience
When developing with the Builder pattern, the developer is guided by the typescript and thus knows which parameter can be added next. This increases the developer experience and makes SDK easier to use.
<img width="459" alt="builder" src="https://user-images.githubusercontent.com/55763425/214562882-dd1a052e-c420-4131-bb50-3b656fabd10c.png">
