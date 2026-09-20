const cors = require('cors')
const express = require('express')
const app = express()
const pool = require('./config/db.js')
const helmet = require('helmet')
const { noteSchema } = require('./validation.js')
const rateLimit = require('express-rate-limit')

app.set('trust proxy', 1)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.NODE_ENV === 'test' ? 10000 : 100,
    standardHeaders: true,
    legacyHeaders: false,
})

//middleware
app.use(helmet())

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5500', 'https://notes-app-js.onrender.com', 'https://notes-app-jsadd.netlify.app'],
    }),
)

app.use(limiter)

app.use(express.json()) //parse incoming JSON from the frontend

//Routes

app.get('/ping', (req, res) => {
    res.send('ok')
})

app.post('/notes', async (req, res) => {
    try {
        const result = noteSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues[0].message })
        }
        const { noteTitle, noteCategory, noteContent } = result.data

        const id = Date.now().toString(36)
        const newNote = await pool.query('INSERT INTO notes(id, noteTitle, noteCategory, noteContent) VALUES ($1, $2, $3, $4) RETURNING *', [id, noteTitle, noteCategory, noteContent])

        res.status(201).json({ message: 'Note saved!', note: newNote.rows[0] })
    } catch (error) {
        console.error(error.message)
    }
})

app.get('/notes', async (req, res) => {
    try {
        const allNotes = await pool.query('SELECT * FROM notes')
        res.json(allNotes.rows)
    } catch (error) {
        console.error(error.message)
    }
})

app.get('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params
        const note = await pool.query('SELECT * FROM notes WHERE id = $1', [id])

        if (note.rows.length === 0) {
            return res.status(404).json({ error: 'Note not found' })
        }

        res.json(note.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

app.put('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params

        const result = noteSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues[0].message })
        }
        const { noteTitle, noteCategory, noteContent } = result.data

        const updateNote = await pool.query('UPDATE notes SET notetitle = $1, notecategory = $2, notecontent = $3 WHERE id = $4 RETURNING *', [noteTitle, noteCategory, noteContent, id])

        if (updateNote.rows.length === 0) {
            return res.status(404).json({ error: 'Note not found' })
        }

        res.json({ message: 'Note updated!', note: updateNote.rows[0] })
    } catch (error) {
        console.error(error.message)
    }
})

app.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params
        const note = await pool.query('DELETE FROM notes WHERE id = $1', [id])

        if (note.rowCount === 0) {
            return res.status(404).json({ error: 'Note not found' })
        }

        res.json({ sucess: true, data: note })
    } catch (error) {
        console.error(error.message)
    }
})

module.exports = app
