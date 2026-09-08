import { useContext, useEffect, useRef, useState } from 'react'
import { NotesContext } from '../../context/NotesContext'
import type { NoteType } from '../../context/NotesContext'
import './styles.css'

function Note({ note }: { note: NoteType }) {
    const context = useContext(NotesContext)
    if (!context) throw new Error('')

    const { saveNote, deleteNote } = context

    const [isEditMode, setIsEditMode] = useState(note.editmode)
    const [text, setText] = useState(note.text)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    const handleSaveNote = () => {
        saveNote(note.id, text)
        setIsEditMode(false)
    }

    const getDateString = (timestamp: string) => {
        const temp = new Date(timestamp).toDateString().split(' ')
        return `${temp[2]} ${temp[1]} ${temp[3]}`
    }

    const adjustTextAreaHeight = () => {
        if (!textAreaRef.current) return

        textAreaRef.current.style.maxHeight = '1px'
        textAreaRef.current.style.minHeight = '1px'
        textAreaRef.current.style.height = '1px'

        textAreaRef.current.style.minHeight = Math.max(textAreaRef.current.scrollHeight, 100) + 'px'
        textAreaRef.current.style.height = ''
        textAreaRef.current.style.maxHeight = ''
    }

    useEffect(() => {
        adjustTextAreaHeight()
    }, [text])

    useEffect(() => {
        window.addEventListener('resize', adjustTextAreaHeight)
        return () => {
            window.removeEventListener('resize', adjustTextAreaHeight)
        }
    }, [])

    return (
        <div className="note" style={{ background: note.theme }}>
            <textarea ref={textAreaRef} readOnly={!isEditMode} onChange={(e) => setText(e.target.value)}>
                {text}
            </textarea>

            <div className="footer">
                <p className="date">{getDateString(`${note.timestamp}`)}</p>
                {!isEditMode && (
                    <button onClick={() => setIsEditMode(true)}>
                        <i className="fa fa-pencil"></i>
                    </button>
                )}

                {isEditMode && (
                    <button onClick={() => handleSaveNote()}>
                        <i className="fa fa-save"></i>
                    </button>
                )}

                <button onClick={() => deleteNote(note.id)}>
                    <i className="fa fa-trash"></i>
                </button>
            </div>
        </div>
    )
}

export default Note
