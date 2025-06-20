# XCM Analyser🔎

Following section covers implementation of XCM Analyser in LightSpell XCM API. Users can analyse either independent multilocations or entire XCM Calls.

## Analyse Multilocation
**Endpoint**: `POST /v3/xcm-analyser`

  <details>
  <summary><b>Parameters</b> </summary>

  - `multilocation`: Specific multilocation

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when no Multilocation is provided
  - `400`  (Bad request exception) - Returned when wrongly formatted Multilocation is provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>
  
```ts
const response = await fetch("http://localhost:3001/v3/xcm-analyser", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        multilocation: "Multilocation", //Replace Multilocation with specific Multilocation you wish to analyse
    })
});
```
## Analyse XCM call
**Endpoint**: `POST /v3/xcm-analyser`

  <details>
  <summary><b>Parameters</b> </summary>

  - `xcm`: Complete XCM call

  </details>

  <details>
  <summary><b>Errors</b> </summary>

  - `400`  (Bad request exception) - Returned when no XCM call is provided
  - `400`  (Bad request exception) - Returned when wrongly formatted Multilocation is provided
  - `500`  (Internal server error) - Returned when an unknown error has occurred. In this case please open an issue.
    
  </details>

```ts
const response = await fetch("http://localhost:3001/v3/xcm-analyser", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        xcm: "XCM" //Replace XCM with the specific XCM call you wish to analyse
    })
});
```