const cors = require('cors');
const express = require('express');
const app = express();
const pool = require('./config/db.js');
app.use(express.json()); //parse incoming JSON from the frontend


//middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500']
}));

//Routes

app.post('/notes', async(req, res) => {
    try {
        const { noteTitle, noteCategory, noteContent } = req.body;
        const id = Date.now().toString(36);
        const newNote = await pool.query(
            "INSERT INTO notes(id, noteTitle, noteCategory, noteContent) VALUES ($1, $2, $3, $4) RETURNING *",
            [id, noteTitle, noteCategory, noteContent]
        );

        res.json({ message: 'Note saved!', note: newNote.rows[0]}); //.rows will give you the specific row you just inserted
    } catch(error) {
        console.error(error.message);
    }
});

app.get('/notes', async (req, res) => {
    try {
        const allNotes = await pool.query("SELECT * FROM notes");
        res.json(allNotes.rows); //pg provides you with .rows, which you can use to get an array of objects, with each row being a row from the database
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
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

app.listen(3000, () => {
    console.log('Server is listening on port 3000'); 
});