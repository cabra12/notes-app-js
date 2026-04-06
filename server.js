const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();
let notes = [];

// app.get('/', (req, res) => {
//     res.send(path.join(__dirname, 'index.html'));
// });

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500']
}));

app.use(express.json()); //parse incoming JSON from the frontend

app.post('/notes', (req, res) => {
    const note = {
        noteID: Date.now().toString(36),
        ...req.body //this allows you to not have to do assign all the keys you got from the input
    };
    notes.push(note);
    res.json({ message: 'Note saved!', notes });
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000'); 
});