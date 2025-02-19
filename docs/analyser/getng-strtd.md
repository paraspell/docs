# Getting started with XCM Analyser 🔎
This guide guides you through implementation of XCM Analyser that allows you to translate multilocations to human readable format (URLs).

## Install XCM Analyser package
```sh
# npm
yarn add || pnpm | npm install @paraspell/xcm-analyser
```

## Importing package
After installing the XCM-Analyser package you can import its functionality in following way:

```ts
import { convertMultilocationToUrl } from '@paraspell/xcm-analyser'; //To import conversion from object
import { convertMultilocationToUrlJson } from '@paraspell/xcm-analyser'; //To import conversion from JSON
import { convertXCMToUrls } from '@paraspell/xcm-analyser'; //To import conversion from XCM message
import * as xcm-analyser from '@paraspell/xcm-analyser'; //To import entire functionality
```


