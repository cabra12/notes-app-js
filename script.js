"use strict";

const addBtn = document.getElementById('addNoteBtn');
const popUp = document.getElementById('notePopUp');
const closeBtn = document.getElementById('closeBtn');

let notes = [];

addBtn.addEventListener('click', ()=> {
    popUp.showModal();
});

closeBtn.addEventListener('click', () => {
    popUp.close();
});

//CRUD Operations 

//Create (Person A)

//Read (Person A)

//Update/Edit (Person B)

//Delete (Person B)

