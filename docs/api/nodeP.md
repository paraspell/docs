# Parachain pallets

This functionality allows developers to query the `XCM pallets` that Parachains currently support. 

### Package-less implementation of XCM API XCM Pallet Query features into your application

```JS
const response = await fetch(
    "http://localhost:3001/pallets/<action>" + //Replace "action" with your desired action eg. "Acala/default" 
);

console.log(response) //use response data as necessary
```

This snippet should work on most javascript/typescript frameworks as it is a standard HTTP request.

## Return default pallet for specific Parachain
The following endpoint returns the default pallet for specific Parachain

**Endpoint**: `GET /pallets/:node/default`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when path parameter 'node' is not a valid Parachain
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/pallets/Acala/default");
```

## Return an array of supported pallets for specific Parachain
The following endpoint returns all XCM Pallets that are supported on specific Parachain

**Endpoint**: `GET /pallets/:node`

   - **Parameters**:
     - `node` (path parameter): Specifies the name of the Parachain.

   - **Errors**:
     - `400`  (Bad request exception) - Returned when path parameter 'node' is not a valid Parachain
     - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.

**Example of request:**
```js
const response = await fetch("http://localhost:3001/pallets/Basilisk");
```
