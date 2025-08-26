import { createClient } from 'redis'
import type { CacheEntry } from '@/types'

class RedisCache {
  private client: ReturnType<typeof createClient> | null = null
  private isConnected = false

  async connect() {
    if (this.isConnected && this.client) return this.client

    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      })

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err)
        this.isConnected = false
      })

      await this.client.connect()
      this.isConnected = true
      console.log('Redis connected successfully')
      return this.client
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      this.isConnected = false
      return null
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const client = await this.connect()
      if (!client) return null

      const cached = await client.get(key)
      if (!cached) return null

      const entry: CacheEntry<T> = JSON.parse(cached)
      
      if (Date.now() > entry.timestamp + entry.ttl) {
        await this.delete(key)
        return null
      }

      return entry.data
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async set<T>(key: string, data: T, ttlSeconds: number = 300): Promise<boolean> {
    try {
      const client = await this.connect()
      if (!client) return false

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlSeconds * 1000,
      }

      await client.setEx(key, ttlSeconds, JSON.stringify(entry))
      return true
    } catch (error) {
      console.error('Redis set error:', error)
      return false
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const client = await this.connect()
      if (!client) return false

      await client.del(key)
      return true
    } catch (error) {
      console.error('Redis delete error:', error)
      return false
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.disconnect()
      this.isConnected = false
    }
  }
}

export const cache = new RedisCache()