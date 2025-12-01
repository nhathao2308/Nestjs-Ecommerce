import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

config({
  path: '.env',
})

// Check if .env file exists
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('No .env file found, creating a new one...')
  process.exit(1)
}

// Define the schema using Zod
const configSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET is required'),
  ACCESS_TOKEN_EXPIRES_IN: z.string().min(1, 'ACCESS_TOKEN_EXPIRES_IN is required'),
  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET is required'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1, 'REFRESH_TOKEN_EXPIRES_IN is required'),
  SECRET_API_KEY: z.string().min(1, 'SECRET_API_KEY is required'),
})

// Validate and parse the environment variables
const parseResult = configSchema.safeParse(process.env)

if (!parseResult.success) {
  console.log('❌ Invalid environment variables:')
  console.error(parseResult.error)
  process.exit(1)
}

const envConfig = parseResult.data

export default envConfig

// Type export for TypeScript
export type EnvConfig = z.infer<typeof configSchema>
