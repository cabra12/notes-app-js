import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NotesContext } from '../../context/NotesContext'
import type { NoteType, NotesContextType } from '../../context/NotesContext'
import Note from './index'

const sampleNote: NoteType = {
    id: 'abc123',
    title: 'Groceries',
    text: 'Milk, eggs, bread',
    category: 'Personal',
    timestamp: 1700000000000,
    editmode: false,
}

// jsdom doesn't do layout, so fake the sizes the component reads
function mockSizes(scrollHeight: number, clientHeight: number) {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
        configurable: true,
        get: () => scrollHeight,
    })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
        configurable: true,
        get: () => clientHeight,
    })
}

afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollHeight')
    Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight')
})

function renderNote() {
    const deleteNote = vi.fn()
    const openEditModal = vi.fn()
    const value: NotesContextType = {
        notes: [],
        addNote: vi.fn(),
        deleteNote,
        saveNote: vi.fn(),
        activeFilter: 'All',
        setActiveFilter: vi.fn(),
        isModalOpen: false,
        editingNote: null,
        openAddModal: vi.fn(),
        openEditModal,
        closeModal: vi.fn(),
    }

    const { container } = render(
        <NotesContext.Provider value={value}>
            <Note note={sampleNote} />
        </NotesContext.Provider>,
    )

    return { container, deleteNote, openEditModal }
}

describe('Note', () => {
    it('shows the title and text', () => {
        mockSizes(50, 100)
        renderNote()
        expect(screen.getByText('Groceries')).toBeInTheDocument()
        expect(screen.getByText('Milk, eggs, bread')).toBeInTheDocument()
    })

    it('hides View More when the text fits', () => {
        mockSizes(50, 100)
        renderNote()
        expect(screen.queryByText(/View More/)).not.toBeInTheDocument()
    })

    it('shows View More when the text overflows', () => {
        mockSizes(200, 100)
        renderNote()
        expect(screen.getByText(/View More/)).toBeInTheDocument()
    })

    it('toggles between View More and View Less', async () => {
        mockSizes(200, 100)
        renderNote()

        await userEvent.click(screen.getByText(/View More/))
        expect(screen.getByText('View Less')).toBeInTheDocument()

        await userEvent.click(screen.getByText('View Less'))
        expect(screen.getByText(/View More/)).toBeInTheDocument()
    })

    it('calls deleteNote with the note id', async () => {
        mockSizes(50, 100)
        const { container, deleteNote } = renderNote()

        await userEvent.click(container.querySelector('.fa-trash')!)

        expect(deleteNote).toHaveBeenCalledWith('abc123')
    })

    it('calls openEditModal with the note', async () => {
        mockSizes(50, 100)
        const { container, openEditModal } = renderNote()

        await userEvent.click(container.querySelector('.fa-pencil')!)

        expect(openEditModal).toHaveBeenCalledWith(sampleNote)
    })
})
