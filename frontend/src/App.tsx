import NotesContainer from './components/notes-container'
import { NotesContext } from './context/NotesContext'
import type { NoteType, FilterOption, Category } from './context/NotesContext'
import { useEffect, useState } from 'react'
import './index.css'
import Header from './components/header'
import FilterBar from './components/filter-bar'
import NoteModal from './components/note-modal'

function App() {
    const [activeFilter, setActiveFilter] = useState<FilterOption>('All')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingNote, setEditingNote] = useState<NoteType | null>(null)

    const [notes, setNotes] = useState<NoteType[]>(() => {
        const notes = localStorage.getItem('notes-data')

        if (notes) {
            return JSON.parse(notes)
        }

        return []
    })

    const addNote = (title: string, text: string, category: Category) => {
        setNotes([
            {
                id: Math.random().toString(36),
                title,
                text,
                category,
                timestamp: +new Date(),
                editmode: false,
            },
            ...notes,
        ])
    }

    const deleteNote = (noteId: string) => {
        setNotes(notes.filter((note) => note.id !== noteId))
    }

    const saveNote = (noteId: string, title: string, text: string, category: Category) => {
        setNotes(notes.map((singleNote) => (singleNote.id === noteId ? { ...singleNote, title, text, category, editmode: false } : singleNote)))
    }

    const openAddModal = () => {
        setEditingNote(null)
        setIsModalOpen(true)
    }

    const openEditModal = (note: NoteType) => {
        setEditingNote(note)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingNote(null)
    }

    useEffect(() => {
        //add DB/backend?
        localStorage.setItem('notes-data', JSON.stringify(notes))
    }, [notes])

    const value = {
        notes,
        addNote,
        deleteNote,
        saveNote,
        activeFilter,
        setActiveFilter,
        isModalOpen,
        editingNote,
        openAddModal,
        openEditModal,
        closeModal,
    }

    return (
        <NotesContext.Provider value={value}>
            <div className="notes-app">
                <Header />
                <FilterBar />
                <NotesContainer />
                {isModalOpen && <NoteModal key={editingNote?.id ?? 'new'} />}
            </div>
        </NotesContext.Provider>
    )
}

export default App
