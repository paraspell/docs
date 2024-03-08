# Create channels between Parachains 🌐
### SDK allows you to:
- Open HRMP channels between Parachains
- Close HRMP channels between Parachains

*(This pallet only works on Locally launched network. These functions require sudo access)*


### Video guide for this section:
[
![hrmpPallets](https://user-images.githubusercontent.com/55763425/238154733-cef698ac-f00f-4e74-8c4f-1e0d7cfe4059.png)
](https://youtu.be/8iXQZhyNrPM)

## Open HRMP channel
When opening a new channel the operation has to be specified by providing `origin` & `destination` Parachains, calling the `openChannel()` method and then providing `maxSize` and `maxMessageSize` parameters.

### Builder pattern

```js
    Builder(api)
      .from('Karura')               // Origin Parachain
      .to('Pichiu')                 // Destination Parachain
      .openChannel()                // Call to open channel
      .maxSize(maxSize)             // Max size
      .maxMessageSize(maxMsgSize)   // Max message size
      .build()
```

### Function pattern

```js
paraspell.openChannels.openChannel(
    {
        api,
        origin,             // Origin Parachain
        destination,        // Destination Parachain
        maxSize,            // Max size
        maxMessageSize      // Max message size
    }
)
```

## Close HRMP channel
When closing channels the operation has to be specified by providing the `origin` Parachain, calling the `closeChannel()` method and then providing `inbound` and `outbound` parameters.

### Builder pattern 

```js
    Builder(api)
      .from('Karura')          //Origin Parachain
      .closeChannel()          //Call to close channels
      .inbound(inbound)        //Inbound
      .outbound(outbound)      //Outbound
      .build()
```

### Function pattern

```js
paraspell.closeChannels.closeChannel(
    {
        api,              
        origin,            // Origin Parachain 
        inbound,           // Inbound
        outbound           // Outbound
    }
)
```


## Developer experience

### Builder pattern experience
When developing with the Builder pattern, the developer is guided by the typescript and thus knows which parameter can be added next. This increases the developer experience and makes SDK easier to use.
<img width="459" alt="builder" src="https://user-images.githubusercontent.com/55763425/214562882-dd1a052e-c420-4131-bb50-3b656fabd10c.png">
