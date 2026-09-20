import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../app.js'

describe('GET /ping', () => {
    it('responds with ok', async () => {
        const res = await request(app).get('/ping')
        expect(res.status).toBe(200)
        expect(res.text).toBe('ok')
    })
})
