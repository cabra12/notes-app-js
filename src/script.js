
const addBtn = document.getElementById('addNoteBtn');
const addPopUp = document.getElementById('notePopUp');
const closeAddBtns = document.querySelectorAll('.close-add-btn');
const addViewPopUp = document.getElementById('viewNotePopUp');
const closeViewBtns = document.querySelectorAll('.close-view-btn');
const submitNoteBtn = document.getElementById('submitNoteBtn');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesContainer = document.getElementById('notesContainer');
const categoryBtns = document.querySelectorAll('.cat-btn');
const filterBtns = document.querySelectorAll('.filter-button');

let notes = [];
let selectedCategory = 'Personal';
let currentNoteId;
let currentNote;
let isEditing = false;

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterCards(btn.dataset.category);
    });
});

const onLoad = async () => {
    document.querySelectorAll('dialog').forEach(d => d.close());

    try {
        const response = await fetch('https://notes-app-js.onrender.com/notes', { method: 'GET' });
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
    divCard.classList.add('intro-card');
    divCard.textContent = "Click 'Add Note' to start adding cards!";

    notesContainer.appendChild(divCard);

    if(document.querySelectorAll('.note-card').length > 0) {
        filterCards('All');
    }
    
};

const filterCards = (type) => {
    const cards = document.querySelectorAll('.note-card');
    let anyVisible = false; 
    const introCard = document.querySelector('.intro-card');
    const totalCards = cards.length;

    cards.forEach((card) => {
        if(card.getAttribute('data-category') === type || type === 'All') {
            card.style.display = 'block';
            anyVisible = true;
        } else {
            card.style.display = 'none';
        }
    });

    document.querySelector('.no-notes-warning')?.remove(); //if not there, it will throw undefined instead of crashing the program
    if(introCard) introCard.style.display = totalCards === 0 ? 'block' : 'none';

    if(!anyVisible) {
        const noNotesDiv = document.createElement('div');
        noNotesDiv.classList.add('no-notes-warning');
        noNotesDiv.textContent = 'No notes match that category';
        notesContainer.appendChild(noNotesDiv);
    }
};

const submitNote = async (e) => {
    e.preventDefault();
    const titleInput = noteTitle.value; 
    const contentInput = noteContent.value;

    try {
        if (isEditing) {
            const editResponse = await fetch(`https://notes-app-js.onrender.com/notes/${currentNoteId}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ noteTitle: titleInput.trim(), noteCategory: selectedCategory, noteContent: contentInput.trim() })
            });

            const editResponseQuery = await editResponse.json();
            const editResponseObj = editResponseQuery.note;

            const editCard = document.querySelector(`[data-id=${currentNoteId}]`);

            editCard.setAttribute('data-id', cleanInput(editResponseObj.id));
            editCard.setAttribute('style', `background: var(--cat-${editResponseObj.notecategory.toLowerCase()}`)

            editCard.innerHTML = `
                <div class="card-buttons">
                    <button class="view">View</button>
                    <button class="delete">Delete</button>
                </div>
                <h3>${cleanInput(editResponseObj.notetitle)}</h3>
                <p>${cleanInput(editResponseObj.notecontent.length > 100 ? editResponseObj.notecontent.slice(0, 100) + "..." : editResponseObj.notecontent)}</p>
            `;
            isEditing = false;
        } else {
            const response = await fetch('https://notes-app-js.onrender.com/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ noteTitle: titleInput.trim(), noteCategory: selectedCategory, noteContent: contentInput.trim() })
            }); 

            const noteResponse = await response.json();
            createNote(noteResponse.note);
        }

        noteTitle.value = '';
        noteContent.value = '';

        addPopUp.close();
        
    } catch (error) {
        console.error(`Error fetching items: ${error}`);
    }
};

const createNote = (noteObj) => {
    const cardItem = 
        `<div class="note-card" data-id="${cleanInput(noteObj.id)}" data-category="${cleanInput(noteObj.notecategory)}" style="background: var(--cat-${noteObj.notecategory.toLowerCase()})">
            <div class="card-buttons">
                <button class="view">View</button>
                <button class="delete">Delete</button>
            </div>
            <h3>${cleanInput(noteObj.notetitle)}</h3>
            <p>${cleanInput(noteObj.notecontent.length > 100 ? noteObj.notecontent.slice(0, 100) + "..." : noteObj.notecontent)}</p>
        </div>`;

    notesContainer.insertAdjacentHTML('afterbegin', cardItem);

    if(document.querySelectorAll('.note-card').length > 0) {
        filterCards('All');
    }
};

const cleanInput = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

const viewNote = async (e) => {
    if(e.target.classList.contains('view')) {
        const id = e.target.closest('.note-card').dataset.id;

        try {
            const response = await fetch(`https://notes-app-js.onrender.com/notes/${id}`, { method: 'GET'});

            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            currentNoteId = id;
            currentNote = await response.json();

            document.getElementById('viewNoteTitle').textContent = currentNote.notetitle;
            document.getElementById('viewNoteCategory').textContent = currentNote.notecategory;
            document.getElementById('viewNoteContent').textContent = currentNote.notecontent;
            document.querySelector('#viewNotePopUp .dialogHeader').style.background = `var(--cat-${currentNote.notecategory.toLowerCase()})`;
            addViewPopUp.showModal();

        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }
};

const editNote = (e) => {
    e.preventDefault();
    addViewPopUp.close();
    isEditing = true;
    noteTitle.value = currentNote.notetitle;
    noteContent.value = currentNote.notecontent;
    addPopUp.showModal();
};

const deleteNote = async (e) => {
    if(e.target.classList.contains('delete')) {
        const id = e.target.closest('.note-card').dataset.id;
        try {
            const response = await fetch(`https://notes-app-js.onrender.com/notes/${id}`, { method: 'DELETE'});

            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            document.querySelector(`[data-id=${id}]`).remove();

            if(document.querySelectorAll('.note-card').length === 0) {
                introCardCreate();
            }

        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }
};

//Event Listener

addBtn.addEventListener('click', () => addPopUp.showModal());
closeAddBtns.forEach(btn => {
    btn.addEventListener('click', () => addPopUp.close());
});
closeViewBtns.forEach(btn => {
    btn.addEventListener('click', () => addViewPopUp.close());
});
document.addEventListener('DOMContentLoaded', onLoad);
submitNoteBtn.addEventListener('click', submitNote);
notesContainer.addEventListener('click', viewNote);
notesContainer.addEventListener('click', deleteNote);
document.getElementById('edit-button').addEventListener('click', editNote);

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

