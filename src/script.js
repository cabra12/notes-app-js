
const addBtn = document.getElementById('addNoteBtn');
const addPopUp = document.getElementById('notePopUp');
const closeAddBtn = document.getElementById('closeAddBtn');
const addViewPopUp = document.getElementById('viewNotePopUp');
const closeViewBtn = document.getElementById('closeViewBtn');
const submitNoteBtn = document.getElementById('submitNoteBtn');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesContainer = document.getElementById('notesContainer');
const categoryBtns = document.querySelectorAll('.cat-btn');

let notes = [];
let selectedCategory = 'Personal';

const onLoad = async () => {
    try {
        const response = await fetch('http://localhost:3000/notes', { method: 'GET' });
        //get requests don't have headers or body

        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const getAllNotesResponse = await response.json();

        getAllNotesResponse.forEach(note => createNote(note));

    } catch (error) {
        console.error('Error fetching items:', error);
    }

    introCardCreate();
};

const introCardCreate = () =>  {
    const divCard = document.createElement('h3');
    divCard.classList.add('note-card');
    const emptyCardText = document.createTextNode("Click 'Add Note' to start adding cards!");
    divCard.appendChild(emptyCardText);

    if(notesContainer.children.length > 0) {
        divCard.style.display = 'none';
    }else {
        divCard.style.display = 'block';
    }

    notesContainer.appendChild(divCard);
};

const submitNote = async (e) => {
    e.preventDefault();
    const titleInput = noteTitle.value; 
    const contentInput = noteContent.value;

    const response = await fetch('http://localhost:3000/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ noteTitle: titleInput.trim(), noteCategory: selectedCategory, noteContent: contentInput.trim() })
    });

    const noteResponse = await response.json();
    createNote(noteResponse.note);

    noteTitle.value = '';
    noteContent.value = '';

    addPopUp.close();
};

const createNote = (noteObj) => {
    const cardItem = 
        `<div class="note-card" data-id="${cleanInput(noteObj.id)}" style="background: var(--cat-${noteObj.notecategory.toLowerCase()})">
            <div class="card-buttons">
                <button class="view">View</button>
                <button class="delete">Delete</button>
            </div>
            <h3>${cleanInput(noteObj.notetitle)}</h3>
            <p>${cleanInput(noteObj.notecontent.length > 100 ? noteObj.notecontent.slice(0, 100) + "..." : noteObj.notecontent)}</p>
        </div>`;

    notesContainer.insertAdjacentHTML('afterbegin', cardItem);
};

const cleanInput = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

const deleteNote = (e) => {
    if(e.target.classList.contains('delete')) {
        const id = e.target.closest('.note-card').dataset.id;
        notes = notes.filter((note) => note.noteID !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        createNote(notes);
        onLoad();
    }
};

const viewNote = async (e) => {
    if(e.target.classList.contains('view')) {
        const id = e.target.closest('.note-card').dataset.id;

        try {
            const response = await fetch(`http://localhost:3000/notes/${id}`, { method: 'GET'});

            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const note = await response.json();

            document.getElementById('viewNoteTitle').textContent = note.notetitle;
            document.getElementById('viewNoteCategory').textContent = note.notecategory;
            document.getElementById('viewNoteContent').textContent = note.notecontent;
            document.querySelector('#viewNotePopUp .dialogHeader').style.background = `var(--cat-${note.notecategory.toLowerCase()})`;
            addViewPopUp.showModal();
        } catch (error) {
            console.error(error.message);
        }
    }
};

//Event Listener

addBtn.addEventListener('click', () => addPopUp.showModal());
closeAddBtn.addEventListener('click', () => addPopUp.close());
closeViewBtn.addEventListener('click', () => addViewPopUp.close());
document.addEventListener('DOMContentLoaded', onLoad);
submitNoteBtn.addEventListener('click', submitNote);
notesContainer.addEventListener('click', deleteNote);
notesContainer.addEventListener('click', viewNote);

const initCategoryBtns = () => {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () =>{
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.dataset.category;
        });
    });
};

initCategoryBtns();

