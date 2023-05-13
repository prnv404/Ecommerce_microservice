import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export const APP_SECRET = process.env.APP_SECRET as string

export const EXCHANGE_NAME = process.env.EXCHANGE_NAME as string

export const CUSTOMER_SERVICE = "CUSTOMER_SERVICE"

export const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL as string

export const PORT = process.env.PORT

export const MONGO_URI = process.env.MONGO_URI as string