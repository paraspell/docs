# Know the toll before the trip 🎒

Understand the complete fee structure and balance flow behind your XCM call. Use the queries below for deep, technical insight prior to dispatch.

## XCM Transfer info
To comprehensively assess whether a message will execute successfully without failure, use this query. It provides detailed information on currency balances before and after the transaction, including all relevant fees. This data is essential for accurately evaluating potential balance or fee-related issues that could cause message failure.

```ts
const info = await Builder(/*node api/ws_url_string/ws_url_array - optional*/)
          .from(ORIGIN_CHAIN)
          .to(DESTINATION_CHAIN)
          .currency(CURRENCY)
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getTransferInfo()
```

**Example output:**

```json
{
  "chain": {
    "origin": "Hydration",
    "destination": "Astar",
    "ecosystem": "DOT"
  },
  "origin": {
    "selectedCurrency": {
      "sufficient": true, //Whether the amount of the asset being sent is sufficient
      "balance": "3346776337",
      "balanceAfter": "1346776337",
      "currencySymbol": "DOT",
      "existentialDeposit": "17540000"
    },
    "xcmFee": {
      "sufficient": true, //Whether the amount of the execution fee asset is sufficient
      "fee": "523900168617",
      "balance": "21403376436851",
      "balanceAfter": "20879476268234",
      "currencySymbol": "HDX"
    }
  },
  "destination": {
    "receivedCurrency": {
      "sufficient": true, //Whether the amount of received asset will be sufficient
      "balance": "0",
      "balanceAfter": "1954174383",
      "currencySymbol": "DOT",
      "existentialDeposit": "1"
    },
    "xcmFee": {
      "fee": "45825617",
      "balance": "0",
      "balanceAfter": "1954174383",
      "currencySymbol": "DOT"
    }
  }
}
```

## Transferable amount
To retrieve information on how much of the selected currency can be transfered from specific account you can use transferable balance. This query will calculate transferable balance using following formulae: 

**transferable = Balance - ED - if(asset=native) then also substract Origin XCM Fees else ignore**

**Beware**: If DryRun fails function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will actually go through).

```ts
const transferable = await Builder(/*node api/ws_url_string/ws_url_array - optional*/)
          .from(ORIGIN_CHAIN)
          .to(DESTINATION_CHAIN)
          .currency(CURRENCY)
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getTransferableAmount()
```

**Example output:**

```json
"3329236337"
```

## Verify ED on destination
To retrieve information on whether the selected currency from specific account will meet existential deposit on destination chain you can use this query. This query will calculate whether user has will have enough to cover existential deposit on XCM arrival using following pseudo formulae: 

**existential = (if(Balance) || if(TransferedAmount - ED - Destination Fee > 0)) return true else false** 

**Beware**: If DryRun fails function automatically switches to PaymentInfo for XCM Fees (Less accurate), so this function should only serve for informative purposes (Always run DryRun if chains support it to ensure the message will actually go through). **If function switches to PaymentInfo and transfered currency is different than native currency on destination chain the function throws error as PaymentInfo only returns fees in native asset of the chain.**

```ts
const ed = await Builder(/*node api/ws_url_string/ws_url_array - optional*/)
          .from(ORIGIN_CHAIN)
          .to(DESTINATION_CHAIN)
          .currency(CURRENCY)
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .verifyEdOnDestination()
```

**Example output:**

```json
true
```

## XCM Fee (Origin and Dest.)
Following queries allow you to query fee from both Origin and Destination of the XCM Message. You can get accurate result from DryRun query (Requires token balance) or less accurate from Payment info query (Doesn't require token balance).

### More accurate query using DryRun
The query is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by either origin or destination. This query requires user to have token balance (Token that they are sending and origin native asset to pay for execution fees on origin).

```
NOTICE: When Payment info query is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price. DryRun returns fees in currency that is being transferred, so no additional calculations necessary in that case.
```

```ts
const fee = await Builder(/*node api/ws_url_string/ws_url_array - optional*/)
          .from(ORIGIN_CHAIN)
          .to(DESTINATION_CHAIN)
          .currency(CURRENCY)
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getXcmFee(/*{disableFallback: true / false}*/)  //Fallback is optional. When fallback is disabled, you only get notified of DryRun error, but no Payment info query fallback is performed. Payment info is still performed if Origin or Destination chain do not support DryRun out of the box.
```

**Example output:**

```json
{
  "origin": {
    "fee": "523900168617",
    "feeType": "dryRun",
    "currency": "HDX"
  },
  "destination": {
    "fee": "45825617",
    "feeType": "dryRun",
    "currency": "DOT"
  }
}
```

### Less accurate query using Payment info
This query is designed to retrieve you approximate fee and doesn't require any token balance.

```
NOTICE: When Payment info query is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price. 
```

```ts
const fee = await Builder(/*node api/ws_url_string/ws_url_array - optional*/)
          .from(ORIGIN_CHAIN)
          .to(DESTINATION_CHAIN)
          .currency(CURRENCY)
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)          
          .getXcmFeeEstimate()
```

**Example output:**

```json
{
  "origin": {
    "fee": "681070219202",
    "currency": "HDX"
  },
  "destination": {
    "fee": "109531071563591533",
    "currency": "ASTR"
  }
}
```

## XCM Fee (Origin only)
Following queries allow you to query XCM fee from Origin chain. You can get accurate result from DryRun query (Requires token balance) or less accurate from Payment info query (Doesn't require token balance).

### More accurate query using DryRun
The query is designed to retrieve you XCM fee at any cost, but fallbacking to Payment info if DryRun query fails or is not supported by origin. This query requires user to have token balance (Token that they are sending and origin native asset to pay for execution fees on origin).

```ts
const fee = await Builder(/*node api/ws_url_string/ws_url_array - optional*/)
          .from(ORIGIN_CHAIN)
          .to(DESTINATION_CHAIN)
          .currency(CURRENCY)
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)
          .getOriginXcmFee(/*{disableFallback: true / false}*/)  //Fallback is optional. When fallback is disabled, you only get notified of DryRun error, but no Payment info query fallback is performed. Payment info is still performed if Origin do not support DryRun out of the box.
```

**Example output:**

```json
{
  "fee": "523900168617",
  "feeType": "dryRun",
  "currency": "HDX",
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
  "destParaId": 0
}
```

### Less accurate query using Payment info
This query is designed to retrieve you approximate fee and doesn't require any token balance.

```
NOTICE: When Payment info query is performed, it retrieves fees for destination in destination's native currency, however, they are paid in currency that is being sent. To solve this, you have to convert token(native) to token(transferred) based on price. 
```

```ts
const fee = await Builder(/*node api/ws_url_string/ws_url_array - optional*/)
          .from(ORIGIN_CHAIN)
          .to(DESTINATION_CHAIN)
          .currency(CURRENCY)
          .address(RECIPIENT_ADDRESS)
          .senderAddress(SENDER_ADDRESS)          
          .getOriginXcmFeeEstimate()
```

**Example output:**

```json
{
  "fee": "681070219202",
  "currency": "HDX"
}
```

## Asset balance
You can now query all important information about your XCM call including information about fees (If your balance is sufficient to transfer XCM message) and more.

```ts
//PAPI
import { getAssetBalance } from "@paraspell/sdk";
//PJS
import { getAssetBalance } from "@paraspell/sdk-pjs";

//Retrieves the asset balance for a given account on a specified node (You do not need to specify if it is native or foreign).
const balance = await getAssetBalance({address, node, currency /*- {id: currencyID} | {symbol: currencySymbol} | {symbol: Native('currencySymbol')} | {symbol: Foreign('currencySymbol')} | {symbol: ForeignAbstract('currencySymbol')} | {multilocation: AssetMultilocationString | AssetMultilocationJson}*/, api /* api/ws_url_string optional */});
```

**Example output:**

```json
"21403376436851"
```

## Ethereum bridge fees
Following query will retrieve execution and bridge fee for transfers from Parachain to Ethereum.

```ts
//PAPI
import { getParaEthTransferFees } from "@paraspell/sdk";
//PJS
import { getParaEthTransferFees } from "@paraspell/sdk-pjs";

const fees = await getParaEthTransferFees(/*api - optional (Can also be WS port string or array o WS ports. Must be AssetHubPolkadot WS!)*/)
```

**Example output:**

```json
[16422495097, 2420000000]
```

## Query existential deposit
Latest SDK versions now offer ability to query existential deposit on implemented chains using simple call:

```ts
//PAPI
import { getExistentialDeposit } from "@paraspell/sdk";
//PJS
import { getExistentialDeposit } from "@paraspell/sdk-pjs";

//Currency is an optional parameter. If you wish to query native asset, currency parameter is not necessary.
//Currency can be either {symbol: assetSymbol}, {id: assetId}, {multilocation: assetMultilocation}.
const ed = getExistentialDeposit(node, currency?)
```

**Example output:**

```json
"100000000"
```

## Convert SS58 address 
Following functionality allows you to convert any SS58 address to Parachain specific address.

```ts
//PAPI
import { convertSs58 } from "@paraspell/sdk";
//PJS
import { convertSs58 } from "@paraspell/sdk-pjs";

const result = convertSs58(address, node) // returns converted address in string
```

**Example output:**

```json
"7Lu51dzX1eqBxHdc8DkWvMkyFgoVXXFjibjEnxUndJQ8NAHz"
```

## Developer experience

### Builder pattern experience
When developing with the Builder pattern, the developer is guided by the typescript and thus knows which parameter can be added next. This increases the developer experience and makes SDK easier to use.
<img width="459" alt="builder" src="https://user-images.githubusercontent.com/55763425/214562882-dd1a052e-c420-4131-bb50-3b656fabd10c.png">
