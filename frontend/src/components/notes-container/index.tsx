import { useContext } from 'react'
import { NotesContext } from '../../context/NotesContext'
import Note from '../note'
import './style.css'

function NotesContainer() {
    const context = useContext(NotesContext)
    if (!context) throw new Error('NotesContainer must be used within a NotesContext.Provider')

    const { notes, activeFilter } = context

    const filteredNotes = activeFilter === 'All' ? notes : notes.filter((note) => note.category === activeFilter)

    return (
        <div className="notes-container">
            <div className="notes-list">
                {filteredNotes.length === 0 ? (
                    <div className="empty-notes-message">
                        {activeFilter === 'All' ? (
                            <>
                                <p>No notes yet.</p>
                                <p>Click the "Add Note" button to add one!</p>
                            </>
                        ) : (
                            <>
                                <p>No notes are in the {activeFilter} category.</p>
                                <p>Add a note with this category or choose a different category.</p>
                            </>
                        )}
                    </div>
                ) : (
                    filteredNotes.map((note) => <Note key={note.id} note={note} />)
                )}
            </div>
        </div>
    )
}

export default NotesContainer
