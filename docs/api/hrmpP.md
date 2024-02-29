# HRMP pallet
This pallet serves for the construction of calls used for opening and closing HRMP channels.

*(These features only works on Locally launched network as these functions require sudo access account)*


### Package-less implementation of XCM API HRMP features into your application

```JS
const response = await fetch(
    "http://localhost:3001/hrmp/channels?" +
    new URLSearchParams({
        //Method parameters should be here
        //For eg. from: 'Basilisk'
    }),
    //Replace the method with the method your scenario uses eg. "POST" 
    { method: "YourMethod" }
);

const data = await response.json(); //Here we receive data
const { module, section, parameters } = data; //Parsing received data

//Received data needs to be wrapped in a sudo call - only the sudo account can 
//perform these eg. Alice in localhost
const promise = api.tx.sudo.sudo(api.tx[module][section](...parameters)); 

//Call is signed here and can subscribe to extrinsics
promise.signAndSend(alice, ({status,txHash}) => 
```


## Construct HRMP call to open channels
The following endpoint serves to open a new HRMP channel between Parachains defined with `origin` & `destination` parameters. Users also provide `maxSize` and `maxMessageSize` details.

**Endpoint**: `POST /hrmp/channels`

   - **Parameters**:
     - `from` (Query parameter): (required): Specifies the origin Parachain.
     - `to` (Query parameter): (required): Specifies the destination Parachain.
     - `maxSize` (Query parameter): (required): Specifies the maximum size.
     - `maxMessageSize` (Query parameter): (required): Specifies the maximum message size.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not provided
     - `400`  (Bad request exception) - Returned when query parameters 'from' or 'to' are not a valid Parachains
     - `400`  (Bad request exception) - Returned when query parameter 'maxSize' pr 'maxMessageSize' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch(
    "http://localhost:3001/hrmp/channels?" +
    new URLSearchParams({
        from: Karura,
        to: BifrostKusama,
        maxSize: "8",
        maxMessageSize: "1024",
    }),
    { method: "POST" }
);
```

## Construct HRMP call to close channels
The following endpoint serves to close HRMP channels routed from Parachain defined with the `from` parameter. Users also provide `inbound` and `outbound` details.

**Endpoint**: `DELETE /hrmp/channels`

   - **Parameters**:
     - `from` (Query parameter): (required): Specifies the origin Parachain.
     - `inbound` (Query parameter): (required): Specifies the maximum inbound.
     - `outbound` (Query parameter):  (required): Specifies the maximum outbound.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when query parameter 'from' is not provided
     - `400`  (Bad request exception) - Returned when query parameter 'from' is not a valid Parachain
     - `400`  (Bad request exception) - Returned when query parameter 'inbound' or 'outbound' is not provided
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch(
    "http://localhost:3001/hrmp/channels?" +
    new URLSearchParams({
        from: Karura,
        inbound: "0",
        outbound: "0",
    }),
    { method: "DELETE" }
);
```

