import { useContext, useState } from 'react'
import { categories, categoryColors, NotesContext } from '../../context/NotesContext'
import type { Category } from '../../context/NotesContext'
import './styles.css'

function NoteModal() {
    const context = useContext(NotesContext)
    if (!context) throw new Error('NoteModal must be used within a NotesContext.Provider')

    const { editingNote, addNote, saveNote, closeModal } = context

    const [title, setTitle] = useState(editingNote?.title ?? '')
    const [text, setText] = useState(editingNote?.text ?? '')
    const [category, setCategory] = useState<Category>(editingNote?.category ?? 'Personal')

    const handleSubmit = () => {
        if (editingNote) {
            saveNote(editingNote.id, title, text, category)
        } else {
            addNote(title, text, category)
        }
        closeModal()
    }

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{editingNote ? 'Edit Note' : 'New Note'}</h2>

                <div className="category-bubbles">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`category-bubble ${category === cat ? 'active' : ''}`}
                            style={{ background: categoryColors[cat] }}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <label>
                    Title
                    <input className="cream-input-background" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>

                <label>
                    Content
                    <textarea className="fixed-content cream-input-background" value={text} onChange={(e) => setText(e.target.value)} />
                </label>

                <div className="modal-actions">
                    <button className="modal-button" onClick={closeModal}>
                        Cancel
                    </button>
                    <button className="modal-button" onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NoteModal
