import express from 'express'
import rateLimit from 'express-rate-limit'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

describe('rate limiting', () => {
    it('returns 429 after too many requests', async () => {
        const app = express()
        app.use(rateLimit({ windowMs: 60000, limit: 2 }))
        app.get('/ping', (req, res) => res.send('ok'))

        await request(app).get('/ping')
        await request(app).get('/ping')
        const res = await request(app).get('/ping')

        expect(res.status).toBe(429)
    })
})
