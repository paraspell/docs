# Effortlessly visualize cross-chain data ⛓️

Following guide contains information about XCM Visualizer. It is designed to inform both interface users and developers about the possibilities and use cases they can enhance with this tool.

## User startup guide 

The XCM Visualizer is available at the following URL:
https://xcm-visualizer.paraspell.xyz/

Application usage instructions are available in the documentation:
[User Guide](https://paraspell.github.io/docs/visualizer/user-guide.html)

## Developer startup guide

1. Install dependencies:
   - Node.js `^24`
   - PostgreSQL

2. Configure environment variables:
   - In the `backend` directory, create a `.env` file based on `.env.example`
   - Update it with your local PostgreSQL credentials

3. Initialize the database:
   - Import the [xcm_database_dump_2023_2024](https://drive.google.com/file/d/1v7z85kz-ez_0Vy8GffMEuWlWq2_T2dQq/view) file into your PostgreSQL database to load example data for the XCM Visualizer

4. Run the following commands:

Before you begin with any commands make sure to run following from monorepository root:

```bash
pnpm install
pnpm --filter visualizer-be... --filter visualizer-fe... build
```

Then run backend from [backend folder](https://github.com/paraspell/xcm-tools/tree/main/apps/visualizer-be):

```bash
cd ./apps/visualizer-be
pnpm start
```

And run frontend from [frontend folder](https://github.com/paraspell/xcm-tools/tree/main/apps/visualizer-fe):

```bash
cd ./apps/visualizer-fe
pnpm dev
```

Both front-end and back-end must run in their own terminal at the same time.