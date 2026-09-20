import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import app from '../app.js'
import pool from '../config/db.js'

beforeEach(async () => {
    await pool.query('TRUNCATE notes')
})

afterAll(async () => {
    await pool.end()
})

describe('POST /notes', () => {
    it('creates a note', async () => {
        const res = await request(app).post('/notes').send({ noteTitle: 'Test', noteCategory: 'Work', noteContent: 'Hello' })

        expect(res.status).toBe(201)
        expect(res.body.note.notetitle).toBe('Test')
    })

    it('rejects a note with no title', async () => {
        const res = await request(app).post('/notes').send({ noteCategory: 'Work', noteContent: 'No title' })

        expect(res.status).toBe(400)
    })
})

describe('GET /notes', () => {
    it('returns an empty list when there are no notes', async () => {
        const res = await request(app).get('/notes')

        expect(res.status).toBe(200)
        expect(res.body).toEqual([])
    })

    it('returns all saved notes', async () => {
        await pool.query('INSERT INTO notes(id, notetitle, notecategory, notecontent) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)', [
            'a1',
            'First',
            'Work',
            'One',
            'b2',
            'Second',
            'Idea',
            'Two',
        ])

        const res = await request(app).get('/notes')

        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(2)
    })
})

describe('GET /notes/:id', () => {
    it('returns one note by id', async () => {
        await pool.query('INSERT INTO notes(id, notetitle, notecategory, notecontent) VALUES ($1, $2, $3, $4)', ['a1', 'First', 'Work', 'One'])

        const res = await request(app).get('/notes/a1')

        expect(res.status).toBe(200)
        expect(res.body.notetitle).toBe('First')
    })

    it('returns 404 for a note that does not exist', async () => {
        const res = await request(app).get('/notes/doesnotexist')

        expect(res.status).toBe(404)
    })
})

describe('PUT /notes/:id', () => {
    it('updates an existing note', async () => {
        await pool.query('INSERT INTO notes(id, notetitle, notecategory, notecontent) VALUES ($1, $2, $3, $4)', ['a1', 'Old title', 'Work', 'Old content'])

        const res = await request(app).put('/notes/a1').send({ noteTitle: 'New title', noteCategory: 'Idea', noteContent: 'New content' })

        expect(res.status).toBe(200)
        expect(res.body.note.notetitle).toBe('New title')

        const saved = await pool.query('SELECT * FROM notes WHERE id = $1', ['a1'])
        expect(saved.rows[0].notecategory).toBe('Idea')
    })

    it('returns 404 for a note that does not exist', async () => {
        const res = await request(app).put('/notes/doesnotexist').send({ noteTitle: 'Title', noteCategory: 'Work', noteContent: 'Text' })

        expect(res.status).toBe(404)
    })

    it('rejects an update with no title', async () => {
        await pool.query('INSERT INTO notes(id, notetitle, notecategory, notecontent) VALUES ($1, $2, $3, $4)', ['a1', 'Old title', 'Work', 'Old content'])

        const res = await request(app).put('/notes/a1').send({ noteCategory: 'Work', noteContent: 'Text' })

        expect(res.status).toBe(400)
    })
})

describe('DELETE /notes/:id', () => {
    it('deletes an existing note', async () => {
        await pool.query('INSERT INTO notes(id, notetitle, notecategory, notecontent) VALUES ($1, $2, $3, $4)', ['a1', 'First', 'Work', 'One'])

        const res = await request(app).delete('/notes/a1')

        expect(res.status).toBe(200)

        const remaining = await pool.query('SELECT * FROM notes WHERE id = $1', ['a1'])
        expect(remaining.rows).toHaveLength(0)
    })

    it('returns 404 for a note that does not exist', async () => {
        const res = await request(app).delete('/notes/doesnotexist')

        expect(res.status).toBe(404)
    })
})

describe('input validation', () => {
    it('rejects an unknown category', async () => {
        const res = await request(app).post('/notes').send({ noteTitle: 'Test', noteCategory: 'banana', noteContent: 'Hi' })

        expect(res.status).toBe(400)
    })

    it('rejects a title over 100 characters', async () => {
        const res = await request(app)
            .post('/notes')
            .send({ noteTitle: 'a'.repeat(101), noteCategory: 'Work', noteContent: 'Hi' })

        expect(res.status).toBe(400)
    })

    it('rejects content over 5000 characters', async () => {
        const res = await request(app)
            .post('/notes')
            .send({ noteTitle: 'Test', noteCategory: 'Work', noteContent: 'a'.repeat(5001) })

        expect(res.status).toBe(400)
    })

    it('trims spaces around the title before saving', async () => {
        const res = await request(app).post('/notes').send({ noteTitle: '  Spaced  ', noteCategory: 'Work', noteContent: 'Hi' })

        expect(res.status).toBe(201)
        expect(res.body.note.notetitle).toBe('Spaced')
    })
})
