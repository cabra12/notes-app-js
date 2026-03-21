"use strict";

const addBtn = document.getElementById('addNoteBtn');
const popUp = document.getElementById('notePopUp');
const closeBtn = document.getElementById('closeBtn');
const submitNoteBtn = document.getElementById('submitNoteBtn');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesContainer = document.getElementById('notesContainer');


let notes = [];

const onLoad = () => {
    if(notes.length === 0) {
        const divCard = document.createElement('div');
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

//Create (Person A)

const createNote = () => {
    const titleInput = noteTitle.value; 
    const contentInput = noteContent.value;

    if(titleInput !== "" && contentInput !== "") {
        notes.unshift({noteTitle: titleInput.trim(), noteContent: contentInput.trim()});

        //converts items in array for HTML rendering, using map to simplify 
        //.join() to make array that map produces into a string for innerHTML
        const cardItem = notes.map(item => {
        return `<div class="note-card">
            <h3>${item.noteTitle}</h3>
            <p>${item.noteContent}</p>
        </div>`;
        }).join('');

        notesContainer.innerHTML = cardItem;
        noteTitle.value = '';
        noteContent.value = '';
        
    }

    popUp.close();
};


//Event Listener

addBtn.addEventListener('click', () => popUp.showModal());
closeBtn.addEventListener('click', () => popUp.close());
document.addEventListener('DOMContentLoaded', onLoad);
submitNoteBtn.addEventListener('click', createNote);

