"use strict";

const addBtn = document.getElementById('addNoteBtn');
const popUp = document.getElementById('notePopUp');
const closeBtn = document.getElementById('closeBtn')

addBtn.addEventListener('click', ()=> {
    popUp.showModal();
});

closeBtn.addEventListener('click', () => {
    popUp.close();
});

