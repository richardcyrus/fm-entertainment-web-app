import mongoose from 'mongoose'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('mongoose', () => ({
  default: { connect: vi.fn() },
}))

const globalForMongoose = globalThis as unknown as { mongoose?: unknown }

async function load() {
  vi.resetModules()
  return import('@/lib/mongoose')
}

describe('connectDb', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    delete globalForMongoose.mongoose
    vi.stubEnv('DATABASE_URL', 'mongodb://localhost:27017/test')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws when DATABASE_URL is not set', async () => {
    const { connectDb } = await load()
    vi.stubEnv('DATABASE_URL', '')

    await expect(connectDb()).rejects.toThrow('DATABASE_URL is not set')
    expect(mongoose.connect).not.toHaveBeenCalled()
  })

  it('connects once and reuses the cached connection', async () => {
    vi.mocked(mongoose.connect).mockResolvedValue(mongoose)
    const { connectDb } = await load()

    await connectDb()
    await connectDb()

    expect(mongoose.connect).toHaveBeenCalledTimes(1)
    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://localhost:27017/test',
      { bufferCommands: false }
    )
  })

  it('does not cache a failed connection', async () => {
    vi.mocked(mongoose.connect)
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(mongoose)
    const { connectDb } = await load()

    await expect(connectDb()).rejects.toThrow('boom')
    await expect(connectDb()).resolves.toBe(mongoose)
    expect(mongoose.connect).toHaveBeenCalledTimes(2)
  })
})
