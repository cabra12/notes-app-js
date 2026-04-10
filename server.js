const cors = require('cors');
const express = require('express');
const app = express();
const pool = require('./config/db.js');
const PORT = process.env.PORT || 3000


//middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://notes-app-js.onrender.com']
}));

app.use(express.json()); //parse incoming JSON from the frontend

//Routes

app.post('/notes', async(req, res) => {
    try {
        const { noteTitle, noteCategory, noteContent } = req.body;
        const id = Date.now().toString(36);
        const newNote = await pool.query(
            "INSERT INTO notes(id, noteTitle, noteCategory, noteContent) VALUES ($1, $2, $3, $4) RETURNING *",
            [id, noteTitle, noteCategory, noteContent]
        );

        res.json({ message: 'Note saved!', note: newNote.rows[0]}); //.rows is specifically given through pg
    } catch(error) {
        console.error(error.message);
    }
});

app.get('/notes', async (req, res) => {
    try {
        const allNotes = await pool.query("SELECT * FROM notes");
        res.json(allNotes.rows); 
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        //equivalent to const id = req.params.id
        const note = await pool.query("SELECT * FROM notes WHERE id = $1", 
            [id]
        );

        res.json(note.rows[0]); //pool.query returns a result object, where the actual data is in an array valu within a key called "rows"
        //rows[0] gets the first and only item from it
        //returns an object
    } catch (error) {
        console.error(error.message);
    }
});

app.put('/notes/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { noteTitle, noteCategory, noteContent } = req.body;

        const updateNote = await pool.query("UPDATE notes SET notetitle = $1, notecategory = $2, notecontent = $3 WHERE id = $4 RETURNING *", 
            [noteTitle, noteCategory, noteContent, id]
        );

        res.json({ message: 'Note updated!', note: updateNote.rows[0] });
    } catch (error) {
        console.error(error.message);
    }
});

app.delete('/notes/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const note = await pool.query("DELETE FROM notes WHERE id = $1", [id]);
        res.json({ sucess: true, data: note });
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`); 
});