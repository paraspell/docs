# HRMP pallet, every possible call variation explained
### There are two scenarios we use in our SDK. These are:
- Opening HRMP channels between Parachains
- Closing HRMP channels between Parachains

## New video guide for this section:
[
![hrmpPallets](https://user-images.githubusercontent.com/55763425/238154733-cef698ac-f00f-4e74-8c4f-1e0d7cfe4059.png)
](https://youtu.be/8iXQZhyNrPM)

### There are also two possible ways that our SDK allows you to construct your HRMP calls:
- Construct your calls via Builder pattern (recommended, easy to use)
- Construct them in classic function-like way

Both of these ways will be explained.

*(This pallet only works on Locally launched network. These functions require sudo access)*

## Builder pattern HRMP call to open channels
When opening a new channel the operation has to be specified by providing `origin` & `destination` Parachains, calling the `openChannel()` method and then providing `maxSize` and `maxMessageSize` parameters.

```js
    Builder(api)
      .from('Karura')               // Origin Parachain
      .to('Pichiu')                 // Destination Parachain
      .openChannel()                // Call to open channel
      .maxSize(maxSize)             // Max size
      .maxMessageSize(maxMsgSize)   // Max message size
      .build()
```

## Builder pattern HRMP call to close channels
When closing channels the operation has to be specified by providing the `origin` Parachain, calling the `closeChannel()` method and then providing `inbound` and `outbound` parameters.
```js
    Builder(api)
      .from('Karura')          //Origin Parachain
      .closeChannel()          //Call to close channels
      .inbound(inbound)        //Inbound
      .outbound(outbound)      //Outbound
      .build()
```

## Function pattern HRMP call to open channel
Same as the Builder pattern, this pattern requires the same details to construct. When opening a new channel the operation has to be specified by providing `origin` & `destination` Parachains, calling the `openChannel()` method and then providing `maxSize` and `maxMessageSize` parameters.

```js
paraspell.openChannels.openChannel(
    api,
    origin,             // Origin Parachain
    destination,        // Destination Parachain
    maxSize,            // Max size
    maxMessageSize      // Max message size
    )

```
## Function pattern HRMP call to close the channel
Same as the Builder pattern, this pattern requires the same details to construct. When closing channels the operation has to be specified by providing the `origin` Parachain, calling the `closeChannel()` method and then providing `inbound` and `outbound` parameters.
```js
paraspell.closeChannels.closeChannel(
    api,              
    origin,            // Origin Parachain 
    inbound,           // Inbound
    outbound           // Outbound
    )

```

## Developer experience

### Builder pattern experience
When developing with the Builder pattern, the developer is guided by the typescript and thus knows which parameter can be added next. This increases the developer experience and makes SDK easier to use.
<img width="459" alt="builder" src="https://user-images.githubusercontent.com/55763425/214562882-dd1a052e-c420-4131-bb50-3b656fabd10c.png">
