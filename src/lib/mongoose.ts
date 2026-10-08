import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: ['.env.local', '.env'], quiet: true })

type MongooseCache = { promise?: Promise<typeof mongoose> }

const globalForMongoose = globalThis as unknown as { mongoose?: MongooseCache }

const cache: MongooseCache = (globalForMongoose.mongoose ??= {})

export async function connectDb() {
  const uri = process.env.DATABASE_URL

  if (!uri) {
    throw new Error('DATABASE_URL is not set')
  }

  cache.promise ??= mongoose.connect(uri, { bufferCommands: false })

  try {
    return await cache.promise
  } catch (error) {
    // Allow the next call to retry instead of caching the failure.
    cache.promise = undefined
    throw error
  }
}
