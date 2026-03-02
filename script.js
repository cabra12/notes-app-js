"use strict";

const addBtn = document.getElementById('addNoteBtn');
const popUp = document.getElementById('notePopUp');
const closeBtn = document.getElementById('closeBtn');
const submitNoteBtn = document.getElementById('submitNoteBtn');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesContainer = document.getElementById('notesContainer');

let notes = [];

addBtn.addEventListener('click', ()=> {
    popUp.showModal();
});

closeBtn.addEventListener('click', () => {
    popUp.close();
});

//CRUD Operations 

//Create (Person A)
submitNoteBtn.addEventListener('click', () => {
    const titleInput = noteTitle.value; 
    const contentInput = noteContent.value;

    if(titleInput !== "" && contentInput !== "") {
        notes.unshift({noteTitle: titleInput.trim(), noteContent: contentInput.trim()});
        
        const cardItem = `<div class = "card">
            <h3>${titleInput.trim()}</h3>
            <p>${contentInput.trim()}</p>
        </div>`

        notesContainer.innerHTML += cardItem;
        noteTitle.value = '';
        noteContent.value = '';
        
    }

    popUp.close();
});
//Read (Person A)

//Update/Edit (Person B)

//Delete (Person B)

