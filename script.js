
const addBtn = document.getElementById('addNoteBtn');
const popUp = document.getElementById('notePopUp');
const closeBtn = document.getElementById('closeBtn');
const submitNoteBtn = document.getElementById('submitNoteBtn');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesContainer = document.getElementById('notesContainer');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

const onLoad = () => {
    const divCard = document.createElement('h3');
    divCard.classList.add('note-card');
    const emptyCardText = document.createTextNode("Click 'Add Note' to start adding cards!");
    notesContainer.appendChild(divCard);
    divCard.appendChild(emptyCardText);

    if(notes.length === 0) {
        divCard.style.display = 'block';
    }else {
        divCard.style.display = 'none';
        createNote(notes);
    }
};

const submitNote = (e) => {
    e.preventDefault();
    const titleInput = noteTitle.value; 
    const contentInput = noteContent.value;
        
    notes.unshift({noteID: Date.now().toString(36), noteTitle: titleInput.trim(), noteContent: contentInput.trim()});

    createNote(notes);

    localStorage.setItem('notes', JSON.stringify(notes));
    noteTitle.value = '';
    noteContent.value = '';

    popUp.close();
};

const createNote = (notes) => {
    //converts items in array for HTML rendering, using map to simplify 
    //.join() to make array that map produces into a string for innerHTML
    const cardItem = notes.map(item => {
        return `<div class="note-card" data-id="${item.noteID}">
            <div class="card-buttons">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
            <h3>${item.noteTitle}</h3>
            <p>${item.noteContent.length > 100 ? item.noteContent.slice(0, 100) + "..." : item.noteContent}</p>
        </div>`;
    }).join('');

    notesContainer.innerHTML = cardItem;
}

const deleteNote = (e) => {
    if(e.target.classList.contains('delete')) {
        const id = e.target.closest('.note-card').dataset.id;
        notes = notes.filter((note) => note.noteID !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        createNote(notes);
        onLoad();
    }
}

//Event Listener

addBtn.addEventListener('click', () => popUp.showModal());
closeBtn.addEventListener('click', () => popUp.close());
document.addEventListener('DOMContentLoaded', onLoad);
submitNoteBtn.addEventListener('click', submitNote);
notesContainer.addEventListener('click', deleteNote);

