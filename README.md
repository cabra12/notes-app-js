<div style="text-align: center;">
    <img width="500" src="images/Notes App.png" alt="app showing a few multi-colored notes">
</div>

# Notes App
A full-stack notes app with full CRUD functionality. The project was built with vanilla JavaScript, HTML, and CSS on the frontend, and a Node.js/Express RESTful API on the backed connected to a PostgreSQL database. Users can create, view, edit, and delete notes, as well as filter them by category. The project was deployed across Netlify, Render, and Neon.

## Live Demo
[View Site](https://notes-app-jsadd.netlify.app/)

# Technologies
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Node.js/Express
- PostgreSQL
- Netlify (frontend deployment)
- Render (backend deployment)
- Neon (cloud PostgreSQL hosting)

# Features
- the user will be able to create, view, edit, and delete notes
- any changes will be reflected in the database
- users can also filter notes by category, and edited notes update their category for filtering immediately

# Process of Creating the Project
- started as frontend project with just vanilla JS, html and css with localStorage persistence as a database
- the frontend code was changed many times so notes would appear properly when there were no notes and when there were notes in the DOM
- Node.js and Express were added locally, as well as PostgreSQL, to add a backend 
- cleaned up old code and prevented errors as the project moved from localStorage and arrays to PostgreSQL as the database
- project had a RESTful API by the end
- deployed by connecting Neon, Render, and Netlify to each other 
- fixed bugs that appeared in deployment but not locally

# What I learned
- how to create a unique ID with vanilla JavaScript using Date.now().toString(36)
- how to create a RESTful API in the backend 
- how to convert a frontend project to a full stack project
- what code should appear in the frontend or in the backend
- how to filter items that appear in the DOM without an array
- connecting the backend and frontend through fetch and the GET, POST, PUT, and DELETE methods

# How it can be improved
- add message confirming if you would like to delete a card
- add auth to the project so database can be unique for each viewer
- add markdown or better formatting to the notes so bullets and headings can be featured

