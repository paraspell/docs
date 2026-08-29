# Getting started with XCM Analyser 🔎
This guide walks you through the implementation of XCM Analyser, which allows you to translate locations into a human-readable format (URLs).

## Install XCM Analyser Package

<PackageManagerSwitch />

<InstallCommand pkg="@paraspell/xcm-analyser" />

## Importing package
After installing the XCM Analyser package, you can import its functionality in the following way:

```ts
import { convertLocationToUrl } from '@paraspell/xcm-analyser'; //To import conversion from object
import { convertLocationToUrlJson } from '@paraspell/xcm-analyser'; //To import conversion from JSON
import { convertXCMToUrls } from '@paraspell/xcm-analyser'; //To import conversion from XCM message
import * as xcm-analyser from '@paraspell/xcm-analyser'; //To import entire functionality
```


