import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'
config({
  path: '.env',
})
//kiểm tra có file env chưa

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('No .env file found, creating a new one...')
  process.exit(1)
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string
  @IsString()
  ACCESS_TOKEN_SECRET: string
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string
  @IsString()
  REFRESH_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
  @IsString()
  SECRET_API_KEY: string
}

const configServer = plainToInstance(ConfigSchema, process.env)

const e = validateSync(configServer)

if (e.length > 0) {
  console.error('Configuration validation failed:', e)
  const errors = e.map((eItem) => {
    return {
      property: eItem.property,
      constraints: eItem.constraints,
      value: eItem.value,
    }
  })
  throw errors
}

const envConfig = configServer
export default envConfig
