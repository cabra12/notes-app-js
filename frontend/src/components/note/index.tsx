import { useContext, useEffect, useRef, useState } from 'react'
import { categoryColors, NotesContext } from '../../context/NotesContext'
import type { NoteType } from '../../context/NotesContext'
import './styles.css'

function Note({ note }: { note: NoteType }) {
    const context = useContext(NotesContext)
    if (!context) throw new Error('Note must be used within a NotesContext.Provider')

    const { deleteNote, openEditModal } = context
    const [isExpanded, setIsExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const textRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const el = textRef.current
        if (!el) return
        setIsOverflowing(el.scrollHeight > el.clientHeight)
    }, [note.text])

    const getDateString = (timestamp: number) => {
        const temp = new Date(timestamp).toDateString().split(' ')
        return `${temp[2]} ${temp[1]} ${temp[3]}`
    }

    return (
        <div className={`note ${isExpanded ? 'expanded' : ''}`} style={{ background: categoryColors[note.category] }}>
            <h3 className="note-title">{note.title}</h3>
            <p ref={textRef} className={`note-text ${isExpanded ? '' : 'clamped'}`}>
                {note.text}
            </p>

            {isOverflowing && !isExpanded && (
                <button className="view-more" onClick={() => setIsExpanded(true)}>
                    ...View More
                </button>
            )}
            {isOverflowing && isExpanded && (
                <button className="view-more" onClick={() => setIsExpanded(false)}>
                    View Less
                </button>
            )}

            <div className="footer">
                <p className="date">{getDateString(note.timestamp)}</p>
                <button onClick={() => openEditModal(note)}>
                    <i className="fa fa-pencil fa-2x"></i>
                </button>
                <button onClick={() => deleteNote(note.id)}>
                    <i className="fa fa-trash fa-2x"></i>
                </button>
            </div>
        </div>
    )
}

export default Note
