import { useContext, useState } from 'react'
import { NotesContext } from '../../context/NotesContext'
import './style.css'

const colors = ['#ebcfad', '#f5b0a4', '#84dada', '#eff5b1', '#9adbf6']

function Sidebar() {
    const context = useContext(NotesContext)
    if (!context) throw new Error('Sidebar must be used within a NotesContext.Provider')

    const { addNote } = context

    const [selectedTheme, setSelectedTheme] = useState(colors[0])

    return (
        <div className="sidebar">
            <button className="add-note-btn" onClick={() => addNote(selectedTheme)}>
                <i className="fa fa-plus"></i>
            </button>
            <div className="colors-input-list">
                {colors.map((color) => (
                    <div className="color-input">
                        <input type="radio" name="color-input" value={color} id={'color-' + color} checked={selectedTheme === color} onChange={() => setSelectedTheme(color)}></input>
                        <label htmlFor={'color-' + color} style={{ background: color }}></label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
