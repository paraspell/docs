# Effortlessly visualize cross-chain data ⛓️

Following guide contains information about XCM Visualizer. It is designed to inform both interface users and developers about the possibilities and use cases they can enhance with this tool.

<img width="200" alt="logo" src="https://github.com/paraspell/xcm-tools/assets/55763425/2a2a071d-32c5-4fea-a6cb-fc5177c73548">

## User startup guide

Project is deployed on following link: https://xcm-visualizator.paraspell.xyz/.

For user guide refer to following section: [User guide](https://paraspell.github.io/docs/visualizator/user-guide.html)

## Developer startup guide
To run the project locally, you need to have Node.js v.20^ installed, as well as PostgreSQL database.

In backend folder create .env file following .env.example file. After your database is set up, you can import the database dump from the [xcm_database_dump.tar](https://drive.google.com/file/d/1mBYi9zh8iuEWtQtcZdg-sgGtRwJFRLje/view?usp=sharing) file to try the XCM Visualizer with the example data.

Then, run the following commands:

Before you begin with any commands make sure to run following from monorepository root:

```bash
pnpm install
pnpm build
```

Then run backend from [backend folder](https://github.com/paraspell/xcm-tools/tree/main/apps/visualizator-be):

```bash
cd ./apps/visualizator-be
pnpm start
```

And run frontend from [frontend folder](https://github.com/paraspell/xcm-tools/tree/main/apps/visualizator-fe):

```bash
cd ./apps/visualizator-fe
pnpm dev
```

Both front-end and back-end must run in their own terminal at the same time.