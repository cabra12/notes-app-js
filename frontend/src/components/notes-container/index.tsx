import { useContext } from 'react'
import { NotesContext } from '../../context/NotesContext'

function NotesContainer() {
    const context = useContext(NotesContext)
    if (!context) throw new Error('NotesContainer must be used within a NotesContext.Provider')

    const { notes } = context

    return (
        <div className="notes-container">
            <h2>Notes</h2>
            <div className="notes-list">
                {notes.map((note) => (
                    <div key={note.id}>{note.text}</div>
                ))}
            </div>
        </div>
    )
}

export default NotesContainer
