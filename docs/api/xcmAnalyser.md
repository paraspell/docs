# XCM Analyser🔎

Following section covers implementation of XCM Analyser in LightSpell XCM API. Users can analyse either independent locations or entire XCM Calls.

## Analyse Location
**Endpoint**: `POST /v5/xcm-analyser`

::: details Parameters

  - `location`: Specific location

:::

::: details Errors

  - `400`  (Bad request exception) - Returned when no location is provided
  - `400`  (Bad request exception) - Returned when wrongly formatted location is provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::
  
```ts
const response = await fetch("http://localhost:3001/v5/xcm-analyser", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        location: "location", //Replace location with specific location you wish to analyse
    })
});
```
## Analyse XCM call
**Endpoint**: `POST /v5/xcm-analyser`

::: details Parameters

  - `xcm`: Complete XCM call

:::

::: details Errors

  - `400`  (Bad request exception) - Returned when no XCM call is provided
  - `400`  (Bad request exception) - Returned when wrongly formatted location is provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
:::

```ts
const response = await fetch("http://localhost:3001/v5/xcm-analyser", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        xcm: "XCM" //Replace XCM with the specific XCM call you wish to analyse
    })
});
```