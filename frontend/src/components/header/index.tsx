import { useContext } from 'react'
import { NotesContext } from '../../context/NotesContext'
import './styles.css'

function Header() {
    const context = useContext(NotesContext)
    if (!context) throw new Error('Header must be used within a NotesContext.Provider')

    const { openAddModal } = context

    return (
        <div className="header">
            <h1>
                Notes App<span className="orange-dot">.</span>
            </h1>
            <button className="add-note-btn" onClick={openAddModal}>
                + Add Note
            </button>
        </div>
    )
}

export default Header
