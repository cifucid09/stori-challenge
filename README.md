# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

- Add .env file containing

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stori?connect_timeout=300"
```

From the terminal:

- Install dependencies
  
```sh
npm i
```

- Start the db container

```sh
npm run docker
```

- Setup prisma

```sh
npm run prisma-setup
```

- Add SMTP API Key to

```text
newsletterApp2/app/services/email.service.ts
```

- Start the application

```sh
npm run dev
```

This should set the App at http://localhost:3002


NOTE: Tried to run both App and DB on docker compose, but Prisma is having issue connecting to the db (leaving the docker compose but only running the DB service)

NOTE2: The code does contain an API Key for sending emails

NOTE3: Please ask Javier for the SMTP service API Key that goes in newsletterApp2/app/services/email.service.ts