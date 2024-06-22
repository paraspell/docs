# Send XCM messages across Paraverse 🪐
### You can use our SDK in all three scenarios:
- Relay chain to Parachain XCM transfer 
- Parachain to Relay chain XCM transfer
- Parachain to Parachain XCM transfer

### Video guide for this section:
[
![xcmPallet](https://user-images.githubusercontent.com/55763425/238154617-0b57c5c8-76cf-490c-812d-481f097f4977.png)
](https://youtu.be/MoCrt2vYJJU)


## Relay chain to Parachain
Only the `to` parameter is provided, thus the Relay chain to Parachain scenario will be used.

### Builder pattern

```js
  await Builder(api)        //Api parameter is optional
      .to('Basilisk')       // Destination Parachain //You can now add custom ParachainID eg. .to('Basilisk', 2024) or use custom Multilocation
      .amount(amount)       // Token amount
      .address(address)     // AccountId32 or AccountKey20 address or custom Multilocation
      /*.xcmVersion(Version.V1/V2/V3/V4  //Optional parameter for manual override of XCM Version used in call*/
      .build()              // Function called to build call
```

### Function pattern 

```js
await paraspell.xcmPallet.transferRelayToPara(
  {
    api?,                 //Api parameter (Optional)
    destination,          // Destination Parachain or custom Multilocation
    amount,               // Token amount
    to                    // AccountId32 or AccountKey20 address or custom Multilocation
    paraIdTo?,            //Custom destination parachain ID (Optional)
    destApiForKeepAlive?  //Api parameter for keep alive check (Optional)
  }
)
```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

To find out more about custom multilocations reffer to the [following PR](https://github.com/paraspell/xcm-tools/pull/199).


## Parachain to Relay chain
Only the `from` parameter is provided, thus the Parachain to Relay chain scenario will be used.

### Builder pattern

```js
  await Builder(api)            //Api parameter is optional
      .from('Acala')            // Origin Parachain
      .amount(amount)           // Token amount
      .address(address)         // AccountId32 address or custom Multilocation
      /*.xcmVersion(Version.V1/V2/V3/V4  //Optional parameter for manual override of XCM Version used in call*/
      .build()                  // Function called to build call
```

### Function pattern

```js
await paraspell.xcmPallet.send(
  {
    api?,                 //Api parameter (Optional)
    origin,               // Origin Parachain
    amount,               // Token amount
    to                    // AccountId32 or AccountKey20 address or custom Multilocation
    paraIdTo?,            //Custom destination parachain ID (Optional)
    destApiForKeepAlive?  //Api parameter for keep alive check (Optional)
  }
)
```
AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

To find out more about custom multilocations reffer to the [following PR](https://github.com/paraspell/xcm-tools/pull/199).

## Parachain to Parachain
Both `from` and `to` parameters are provided, thus the Parachain to Parachain scenario will be used.

**NOTE** If you wish to transfer from Parachain that uses long IDs for example Moonbeam you have to add character 'n' the end of currencyID. Eg: `.currency(42259045809535163221576417993425387648n)` will mean you transfer xcDOT.

### Builder pattern

```js
  await Builder(api)            //Api parameter is optional
      .from('Karura')           // Origin Parachain
      .to('Basilisk')           // Destination Parachain //You can now add custom ParachainID eg. .to('Basilisk', 2024) or use custom Multilocation
      .currency('KSM')         // CurrencyString | CurrencyID | Multilocation object | MultilocationArray
      /*.feeAsset(feeAsset) - Parameter required when using MultilocationArray*/
      .amount(amount)           // Token amount
      .address(address)         // AccountId32 or AccountKey20 address or custom Multilocation
      /*.xcmVersion(Version.V1/V2/V3/V4  //Optional parameter for manual override of XCM Version used in call*/
      .build()                  // Function called to build call
```

### Function pattern

```js
await paraspell.xcmPallet.send(
  {
    api?,                 //Api parameter (Optional)
    origin,               // Origin Parachain
    currency,             // CurrencyString | CurrencyID | Multilocation object | MultilocationArray
    feeAsset?             // Fee asset select id,
    amount,               // Token amount
    to,                   // AccountId32 or AccountKey20 address or custom Multilocation
    destination,          // Destination Parachain or custom Multilocation
    paraIdTo?,            //Custom destination parachain ID (Optional)
    destApiForKeepAlive?  //Api parameter for keep alive check (Optional)
  }
)
```

AccountId32 and AccountKey20 addresses can be directly copied from PolkadotJS as our SDK has a handler to convert it into the desired hex string automatically. 

Eg. use standard public key `141NGS2jjZca5Ss2Nysth2stJ6rimcnufCNHnh5ExSsftn7U`
Instead of `0x84fc49ce30071ea611731838cc7736113c1ec68fbc47119be8a0805066df9b2b`

To find out more about custom multilocations reffer to the [following PR](https://github.com/paraspell/xcm-tools/pull/199).

## Query existential deposit
Latest SDK versions now offer ability to query existential deposit on implemented chains using simple call:

```ts
import { getExistentialDeposit } from "@paraspell/sdk";

const ed = getExistentialDeposit('Acala')
```

## XCM Transfer info
You can now query all important information about your XCM call including information about fees (If your balance is sufficient to transfer XCM message) and more.

```ts
import { getTransferInfo, getBalanceForeign, getBalanceNative, getOriginFeeDetails } from "@paraspell/sdk"; 

//Get balance of foreign currency
await getBalanceForeign(address, Parachain name, currency)

//Get balance of native currency
await getBalanceNative(address, Parachain name)

//Get fee information regarding XCM call
await getOriginFeeDetails(from, to, currency, amount, originAddress)

//Get all the information about XCM transfer
await getTransferInfo(from, to, address, destinationAddress, currency, amount)
```

## Developer experience

### Builder pattern experience
When developing with the Builder pattern, the developer is guided by the typescript and thus knows which parameter can be added next. This increases the developer experience and makes SDK easier to use.
<img width="459" alt="builder" src="https://user-images.githubusercontent.com/55763425/214562882-dd1a052e-c420-4131-bb50-3b656fabd10c.png">


### Control messages into the console 
Once the call is being constructed developer is warned about major details regarding the call into the console. This way they can ensure, that the call they wanted to create is being created.
<img width="409" alt="212045110-c001fcb7-8cc2-421c-9cd0-6d8205b3b11f" src="https://user-images.githubusercontent.com/55763425/212065770-48ff4b35-2463-48b3-bd51-bae56b2105a8.png">
