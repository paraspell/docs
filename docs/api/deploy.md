# Deploy API on your server 💻

To deploy our API on your server you only need to create a `.env` file and fill it with your secret phrase to allow for token autentification. This file should be located in the root folder. You can also set request limits in that file.

### Before you begin:
>[!IMPORTANT]
>⚠️ Latest version of API migrated to Prisma, so to connect to the database, only the database_url parameter is needed.
>
>⚠️ Since migration to Prisma, POSTGRESQL is no longer the only database that works. However provider needs to be replaced in prisma.schema file.
>
>⚠️ Make sure to also test every form before deploying to ensure everything is configured correctly.

## .env file

The example file should look like this:
```
RATE_LIMIT_TTL_SEC=60 
RATE_LIMIT_REQ_COUNT_PUBLIC=20
RATE_LIMIT_REQ_COUNT_AUTH=100
JWT_SECRET_KEY=YourSecretPhrase
RECAPTCHA_SECRET_KEY=YourRecaptchaSecretKey
PORT=YourHTTPServerPort
DATABASE_URL="yourDbUrl"
EMAIL_ADDRESS_SENDER=sender@gmail.com
EMAIL_ADDRESS_RECIPIENT_ARR=admin1@gmail.com,admin2@gmail.com
EMAIL_CLIENT_ID=YourClientId
EMAIL_CLIENT_SECRET=YourClientSecret
EMAIL_REDIRECT_URI=YourRedirectUri
EMAIL_REFRESH_TOKEN=YourClientRefreshToken
MIXPANEL_PROJECT_TOKEN=YourMixPanelToken
SENTRY_DSN=YourSentryToken
```

Each variable listed below **must be configured** unless explicitly marked as optional. The API will not start if required variables are missing.

| Variable Name | Description | Required |
|--------------|-------------|----------|
| `RATE_LIMIT_TTL_SEC` | Specifies the time window (in seconds) before the request counter is reset. | Yes |
| `RATE_LIMIT_REQ_COUNT_PUBLIC` | Defines the maximum number of requests allowed within the specified time window for unauthenticated requests. | Yes |
| `RATE_LIMIT_REQ_COUNT_AUTH` | Defines the maximum number of requests allowed within the specified time window for authenticated requests. | Yes |
| `JWT_SECRET_KEY` | Secret key used to derive and validate JWT tokens (Defined by you, can be any string). Must be set before the server starts. | Yes |
| `RECAPTCHA_SECRET_KEY` | Secret key for Google reCAPTCHA. Ensure **reCAPTCHA v3** is selected when generating the key. (Guide on how to [obtain](https://docs.cloud.google.com/recaptcha/docs/create-key-website?fbclid=IwAR0wbzgUfKo-ih12jfNAC8MJIUUEMX15vszzfMdwvizXgqBdcrQW_9nCtx4)) | Yes |
| `PORT` | Port on which the API server runs. Defaults to `3001` if not provided. | No |
| `DATABASE_URL` | Database connection URL. Refer to the [documentation](https://www.prisma.io/docs/orm/reference/connection-urls#env) for instructions on generating this value. | Yes |
| `EMAIL_ADDRESS_SENDER` | Email address used to send responses to submitted forms. | Yes |
| `EMAIL_ADDRESS_RECIPIENT_ARR` | One or more email addresses that receive submitted form responses. | Yes |
| `EMAIL_CLIENT_ID` | OAuth client ID required by Nodemailer. (Guide on how to [obtain](https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a).) | Yes |
| `EMAIL_CLIENT_SECRET` | OAuth client secret required by Nodemailer. (Guide on how to [obtain](https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a).) | Yes |
| `EMAIL_REDIRECT_URI` | OAuth redirect URI required by Nodemailer. (Guide on how to [obtain](https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a).) | Yes |
| `EMAIL_REFRESH_TOKEN` | OAuth refresh token required by Nodemailer. (Guide on how to [obtain](https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a).) | Yes |
| `MIXPANEL_PROJECT_TOKEN` | Token used for request-level analytics (no amounts or wallet addresses are stored). | No |
| `SENTRY_DSN` | DSN token for Sentry error tracking and debugging. | No |


If you have configured everything correctly, you should receive emails similar to the one showcased below. These should be received at the email addresses you specified in the `EMAIL_ADDRESS_RECIPIENT_ARR` configuration line.

<img width="784" alt="Screenshot 2023-08-21 at 22 40 34" src="https://user-images.githubusercontent.com/55763425/262149103-cb3398c0-b186-452f-bb67-b8aac9608173.png">

Based on the UserID received in the email you can edit the maximum request amount for a specific API key. 

> [!NOTE] Database overrides maximum request count. 
> If the value is left on `null`, the user can generate a default of 100 requests per minute just like before, as a Captcha-verified user.

<img width="437" alt="Screenshot 2023-08-21 at 21 58 57" src="https://user-images.githubusercontent.com/55763425/262140588-8353a1a5-e4be-4be7-92bd-a37cfe26ca39.png">

## Setting up Sentry
Recently, LightSpell introduced the Sentry error tracking service implementation. This guide covers how to use it.

- First step is to register at this [website](https://sentry.io/lcome/).
- Create a new project to get the DSN token for the .env file used by LightSpell
  
<img width="420" alt="Screenshot 2023-11-16 at 10 23 28" src="https://user-images.githubusercontent.com/55763425/283396658-98339f19-04ab-4ee8-9dfa-a0efec722e73.png">

- Monitor your issues through the dashboard. If you receive any unhandled issues, you should be notified by email also

### How to trigger Sentry test error

Open your REST API client, client we use is [Insomnia](https://insomnia.rest/).

Paste in the following details and input the following link to test out Sentry:
`http://localhost:3001/v5/sentry-test`

LightSpell has integrated this test for you so you can test out error 500 in localhost mode.
Once you paste the link into the browser, Sentry should notify you about a new error 500. It should look like this in your project:

<img width="1223" alt="Snímka obrazovky 2024-03-08 o 19 16 35" src="https://gist.github.com/assets/55763425/c342e184-a7df-4a58-ad70-9d08fd7c59ff">

You can see that the exact line where the error was triggered is shown, and you can even try to ask AI for help with resolving the task for you.

This confirms that the sentry is working correctly.
