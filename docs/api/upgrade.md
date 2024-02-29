# Upgrade your amount of requests per minute

As the requested amount per minute is limited to prevent possibilities of DDoS attacks we offer three different levels of limits to best suit your project needs. All levels are completely free and this page covers a guide on how to acquire each one of them. 

## Standard user
As a standard user, you do not need to do any action and are free to use XCM API right away.

The limit for this level is:
`20 requests per minute`

## Captcha verified user
To become a verified user you have to complete simple captcha verification.

Before you proceed with verification note the following:
- After you verify with the captcha you will receive your authentication token which you can use to unlock the higher request limit.
- This token is only visible once so make sure to save it properly.
- These tokens are not saved anywhere by us so we could not restore them for you.
 
 You can claim your token on the following site (API has to be running):  

`http://localhost:3001/app/generate-api-key`

The limit for this level is:
`100 requests per minute`

The verification website should look like this:
<img width="835" alt="Screenshot 2023-08-21 at 21 56 01" src="https://user-images.githubusercontent.com/55763425/262140640-ed942d5e-3e33-493f-a6b1-0245b9665179.png">

Your generated API key will be in the following box:
<img width="835" alt="Screenshot 2023-08-21 at 21 56 12" src="https://user-images.githubusercontent.com/55763425/262140604-7fcead1e-58fd-4364-ba40-9b057ec22746.png">

## Higher request limit user
If 100 requests per minute is not enough for your project you can request a limit that will suit your needs.

Before you proceed with the request note the following:
- Freshly hashed and generated UserID associated with your captcha-generated API key will be stored in our database for simple monitoring (only request amount monitoring) to prevent malicious behaviour (You can find out the format of data we store in the [deploy section](https://paraspell.github.io/docs/api/deploy.html)).  
- You will have to provide a few details (Your email address, the reason for the higher limit, the amount you wish to set as your limit and the token you received in captcha verification)
- Once your request is reviewed you receive an email response which will tell you if your request was accepted or rejected (with reason). 
- If you already have your token implemented in your project you do not need to change anything, a higher API request limit will automatically start working.

Request for higher limit can be done in the following form (API and Database have to be running. Both need to be correctly configured):

`http://localhost:3001/app/higher-request-limit`

The limit for this level is:
`Per request`

More on this feature can be found in the following [Pull request](https://github.com/paraspell/xcm-api/pull/14)

Form submit website should look like this:
<img width="808" alt="Screenshot 2023-08-21 at 21 56 45" src="https://user-images.githubusercontent.com/55763425/262140598-22ddf07c-b68b-40c6-bc6c-b433d39ab4ce.png">

Confirmation about successful form submission:
<img width="813" alt="Screenshot 2023-08-21 at 21 57 30" src="https://user-images.githubusercontent.com/55763425/262140580-0f5196dd-e9cc-4534-866c-003e2999c3fa.png">

You should receive an email similar to this one:
<img width="803" alt="Screenshot 2023-08-21 at 21 58 07" src="https://user-images.githubusercontent.com/55763425/262140612-7b6a0663-382a-4d87-b3aa-c7ee6decac7a.png">

**Please verify** that confirmation email comes from address `info.lightspell@gmail.com`. **This only applies to the official deployed version**. If you plan on deploying your own XCM-API fork you can set a custom email address. More on this in the [Deploy API yourself](https://paraspell.github.io/docs/api/deploy.html) section.

## How to implement token into dApp or REST API client

### REST API Client
This guide shows how to implement token into API Client ([Insomnia](https://insomnia.rest/download) in this case)
There are 2 ways. 

The first is to implement the key into the API-KEY section.
<img width="717" alt="Screenshot 2023-08-10 at 20 58 02" src="https://user-images.githubusercontent.com/55763425/259851206-26862032-2cd3-46fb-a5f7-f59c33405174.png">

The second way is to implement the key into the HEADERS section.
<img width="717" alt="Screenshot 2023-08-10 at 20 57 47" src="https://user-images.githubusercontent.com/55763425/259851194-34a78830-697c-4c20-901f-9b230fb278b1.png">

Make sure to name the key as `X-API-KEY` otherwise your key won't be recognized.

### In-app token integration
The following snippet can be observed. See the `Headers` section where the API key is inserted.
```js
const response = await fetch(
        'http://localhost:3001/x-transfer?' +
          new URLSearchParams({
            //Method parameters should be here
            //For eg. from: 'Basilisk'
          }),
        { headers: new Headers({ 'X-API-KEY': '<API_KEY>' }) }, //This is where you implement your API token
      );
```

As observed in the above snippet, adding the following line to fetch requests allows for updating the request count per minute.
```js
{ headers: new Headers({ 'X-API-KEY': '<API_KEY>' }) }, //This is where you implement your API token
```


## Testing request limits in Playground
You can now test request limits in Playground. Just navigate to the API KEY testing category and click the Test API request limit button to proceed. The API Key is an optional parameter (You can test both captcha-verified and higher-request users).

The interface of this test can be seen in the picture below.

<img width="572" alt="Screenshot 2023-09-15 at 21 38 43" src="https://user-images.githubusercontent.com/55763425/268379056-0b370fe2-2368-43af-a51b-487f72be909b.png">