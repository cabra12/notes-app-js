import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../app.js'

describe('security headers', () => {
    it('sets Helmet headers on responses', async () => {
        const res = await request(app).get('/ping')

        expect(res.headers['x-content-type-options']).toBe('nosniff')
        expect(res.headers['x-powered-by']).toBeUndefined()
    })
})
