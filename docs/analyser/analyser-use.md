# Ready to make XCM Multilocations more human friendly? 👨‍🏫

This documentation provides you all steps necessary to implement core XCM Analyser functions. It also provides you with handy examples that can help you understand how to use this tool to its fullest potential.

## Implementation
```
NOTE:
The following junction types are supported:

Parachain
AccountId32
AccountIndex64
AccountKey20
PalletInstance
GeneralIndex
GeneralKey
OnlyChild
Plurality
GlobalConsensus
```
#### Compile a single multilocation object to the URL

To compile a single multilocation object to url use the following structure:

```js
//Importing the call
import { convertMultilocationToUrl } from '@paraspell/xcm-analyser';

//Define the multilocation you wish to convert to URL
/*const multilocation: MultiLocation = {
      parents: '0',
      interior: {
        X2: [
          {
            PalletInstance: '50',
          },
          {
            GeneralIndex: '41',
          },
        ],
      },
    };*/

const result = convertMultilocationToUrl(multilocation);

/*
This should result into:
'./PalletInstance(50)/GeneralIndex(41)'
*/
```

#### Compile a single multilocation JSON to the URL
To compile a single multilocation JSON to url use the following structure:

```js
//Importing the call
import { convertMultilocationToUrlJson } from '@paraspell/xcm-analyser';

//Define multilocation JSON
/*const multilocationJson = `{
      "parents": "3",
      "interior": {
        "X2": [
          {
            "PalletInstance": "50"
          },
          {
            "GeneralIndex": "41"
          }
        ]
      }
    }`*/

const result = convertMultilocationToUrl(multilocationJson);

/*
This should result into:
''../../../PalletInstance(50)/GeneralIndex(41)''
*/
```

#### Compile the entire XCM call to the URL
To compile the entire XCM call to the URL use the following structure:

```js
//Importing the call
import { convertXCMToUrls } from '@paraspell/xcm-analyser';

//Define XCM call arguments you wish to convert
/*const xcmCallArguments = [
  {
    V3: {
      parents: '1',
      interior: {
        X1: {
          Parachain: '2006',
        },
      },
    },
  },
  {
    V3: {
      parents: '0',
      interior: {
        X1: {
          AccountId32: {
            network: null,
            id: 'accountID',
          },
        },
      },
    },
  },
  {
    V3: [
      {
        id: {
          Concrete: {
            parents: '0',
            interior: {
              X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
            },
          },
        },
        fun: {
          Fungible: 'amount',
        },
      },
    ],
  },
];*/

const urls = convertXCMToUrls(xcmCallArguments);

/*
This should result into:
[
  '../Parachain(2006)',
  './AccountId32(null, accountID)',
  './PalletInstance(50)/GeneralIndex(1984)',
]
*/
```