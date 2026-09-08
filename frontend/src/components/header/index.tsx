import { useContext } from 'react'
import { NotesContext } from '../../context/NotesContext'
import './styles.css'

function Header() {
    const context = useContext(NotesContext)
    if (!context) throw new Error('Header must be used within a NotesContext.Provider')

    const { addNote } = context

    return (
        <div className="header">
            <h1>Notes App.</h1>
            <button className="add-note-btn" onClick={() => addNote('New Note', '', 'Personal')}>
                + Add Note
            </button>
        </div>
    )
}

export default Header
