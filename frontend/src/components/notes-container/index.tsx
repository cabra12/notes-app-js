import { useContext } from 'react'
import { NotesContext } from '../../context/NotesContext'
import Note from '../note'
import './style.css'

function NotesContainer() {
    const context = useContext(NotesContext)
    if (!context) throw new Error('NotesContainer must be used within a NotesContext.Provider')

    const { notes } = context

    return (
        <div className="notes-container">
            <h2>Notes</h2>
            <div className="notes-list">
                {notes.map((note) => (
                    <Note key={note.id} note={note} />
                ))}
            </div>
        </div>
    )
}

export default NotesContainer
