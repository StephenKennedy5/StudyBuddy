# StudyBuddy

An App to assist in studying of for classes or work.

## Getting Started

### 1. Install dependencies

It is encouraged to use **yarn** so the husky hooks can work properly.

```bash
yarn install
```

### 2. Run the development server

You can start the server using this command:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/pages/index.tsx`.

3. # Run Docker Database

`docker-compose up -d`

# Docker Database Commands

`docker exec -it {Container ID/Name} bash`

`psql -U {userName} -d {dbName}`

# Knex setup

`npm install pg knex`
https://knexjs.org/guide/migrations.html#migration-cli
