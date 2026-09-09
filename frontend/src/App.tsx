import NotesContainer from './components/notes-container'
import { NotesContext } from './context/NotesContext'
import type { NoteType, FilterOption, Category } from './context/NotesContext'
import { useEffect, useState } from 'react'
import './index.css'
import Header from './components/header'
import FilterBar from './components/filter-bar'
import NoteModal from './components/note-modal'
import ErrorBanner from './components/error-banner'

//swap this for Render URL when deployed
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type DbNoteType = {
    id: string
    notetitle: string
    notecategory: string
    notecontent: string
    created_at: string
}

function mapDbNoteToNoteType(dbNote: DbNoteType): NoteType {
    return {
        id: dbNote.id,
        title: dbNote.notetitle,
        text: dbNote.notecontent,
        category: dbNote.notecategory as Category,
        timestamp: new Date(dbNote.created_at).getTime(), // convert Postgres timestamp string into a number, since NoteType.timestamp is a number
        editmode: false,
    }
}

function App() {
    const [activeFilter, setActiveFilter] = useState<FilterOption>('All')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingNote, setEditingNote] = useState<NoteType | null>(null)

    //notes now starts as an empty array instead of reading from localStorage.
    const [notes, setNotes] = useState<NoteType[]>([])
    const [error, setError] = useState<string | null>(null)

    //on first render, fetch all notes from the backend and populate state.
    useEffect(() => {
        fetch(`${API_URL}/notes`)
            .then((res) => res.json())
            .then((data: DbNoteType[]) => {
                setNotes(data.map(mapDbNoteToNoteType))
            })
            .catch((err) => {
                console.error('Failed to fetch notes:', err)
                setError('Failed to load notes. Please refresh the page.')
            })
    }, [])

    //addNote is now async and calls the backend via POST instead of just updating local state directly.
    const addNote = async (title: string, text: string, category: Category) => {
        try {
            const res = await fetch(`${API_URL}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // NEW: keys sent here must match exactly what server.js destructures:
                // noteTitle, noteContent, noteCategory
                body: JSON.stringify({ noteTitle: title, noteContent: text, noteCategory: category }),
            })
            const data = await res.json()
            const newNote = mapDbNoteToNoteType(data.note)
            setNotes([newNote, ...notes])
            setActiveFilter('All')
        } catch (err) {
            console.error('Failed to add note:', err)
            setError('Failed to add note. Please try again.')
        }
    }

    //deleteNote is now async and calls the backend via DELETE first.
    const deleteNote = async (noteId: string) => {
        try {
            await fetch(`${API_URL}/notes/${noteId}`, { method: 'DELETE' })
            setNotes(notes.filter((note) => note.id !== noteId))
        } catch (err) {
            console.error('Failed to delete note:', err)
            setError('Failed to delete note. Please try again.')
        }
    }

    //now async and calls the backend via PUT, then updates local state using the server's response.
    const saveNote = async (noteId: string, title: string, text: string, category: Category) => {
        try {
            const res = await fetch(`${API_URL}/notes/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteTitle: title, noteContent: text, noteCategory: category }),
            })
            const data = await res.json()
            const updatedNote = mapDbNoteToNoteType(data.note)
            setNotes(notes.map((note) => (note.id === noteId ? updatedNote : note)))
        } catch (err) {
            console.error('Failed to save note:', err)
            setError('Failed to save note. Please try again.')
        }
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
                {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
                <FilterBar />
                <NotesContainer />
                {isModalOpen && <NoteModal key={editingNote?.id ?? 'new'} />}
            </div>
        </NotesContext.Provider>
    )
}

export default App
