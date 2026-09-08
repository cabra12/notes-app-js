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
            <div className="notes-list">
                {notes.length === 0 ? (
                    <div className="empty-notes-message">
                        <p>No notes yet.</p>
                        <p>Click the "Add Note" button to add one!</p>
                    </div>
                ) : (
                    notes.map((note) => <Note key={note.id} note={note} />)
                )}
            </div>
        </div>
    )
}

export default NotesContainer
