"use strict";

const addBtn = document.getElementById('addNoteBtn');
const popUp = document.getElementById('notePopUp');
const closeBtn = document.getElementById('closeBtn');
const submitNoteBtn = document.getElementById('submitNoteBtn');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesContainer = document.getElementById('notesContainer');

const deleteBtn = document.getElementById('delete');


let notes = [];

const onLoad = () => {
    if(notes.length === 0) {
        const divCard = document.createElement('h3');
        divCard.classList.add('note-card');
        const emptyCardText = document.createTextNode("Click 'Add Note' to start adding cards!");
        const plusSign = document.createTextNode('+');
        // plusSign.style.fontSize = '2rem';
        notesContainer.appendChild(divCard);
        divCard.appendChild(emptyCardText);
        divCard.style.display = 'block';
        // emptyCardText.appendChild(plusSign);
    }else {
        divCard.style.display = 'none';
    }
};


//CRUD Operations 

//Create and Read

const createNote = (e) => {
    e.preventDefault();
    const titleInput = noteTitle.value; 
    const contentInput = noteContent.value;
        
    notes.unshift({noteID: Date.now().toString(36), noteTitle: titleInput.trim(), noteContent: contentInput.trim()});

    //converts items in array for HTML rendering, using map to simplify 
    //.join() to make array that map produces into a string for innerHTML
    const cardItem = notes.map(item => {
    return `<div class="note-card">
        <div class="card-buttons">
            <p>id:${item.noteID}</p>
            <button id="edit">Edit</button>
            <button id="delete">Delete</button>
        </div>
        <h3>${item.noteTitle}</h3>
        <p>${item.noteContent}</p>
    </div>`;
    }).join('');

    notesContainer.innerHTML = cardItem;
    noteTitle.value = '';
    noteContent.value = '';

    popUp.close();
};

const deleteNote = (item) => {
    console.log(item.noteID);
}


//Event Listener

addBtn.addEventListener('click', () => popUp.showModal());
closeBtn.addEventListener('click', () => popUp.close());
document.addEventListener('DOMContentLoaded', onLoad);
submitNoteBtn.addEventListener('click', createNote);
deleteBtn.addEventListener('click', deleteNote);

