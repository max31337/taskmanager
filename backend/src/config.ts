import 'dotenv/config'

const port = Number(process.env.PORT ?? 3001)
const databaseUrl = process.env.DATABASE_URL

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid port number.')
}

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set in the environment.')
}

export const config = { databaseUrl, port }
