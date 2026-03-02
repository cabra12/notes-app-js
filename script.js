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
        
        //converts items in array for HTML rendering, using map to simplify 
        //.join() to make array that map produces into a string for innerHTML
        const cardItem = notes.map(item => {
        return `<div class = "card">
            <h3>${item.noteTitle}</h3>
            <p>${item.noteContent}</p>
        </div>`;
        }).join('');

        notesContainer.innerHTML = cardItem;
        noteTitle.value = '';
        noteContent.value = '';
        
    }

    popUp.close();
});
//Read (Person A)

//Update/Edit (Person B)

//Delete (Person B)

