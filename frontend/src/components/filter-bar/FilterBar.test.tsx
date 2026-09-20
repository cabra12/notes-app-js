import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NotesContext } from '../../context/NotesContext'
import type { FilterOption, NotesContextType } from '../../context/NotesContext'
import FilterBar from './index'

function renderFilterBar(activeFilter: FilterOption = 'All') {
    const setActiveFilter = vi.fn()
    const value: NotesContextType = {
        notes: [],
        addNote: vi.fn(),
        deleteNote: vi.fn(),
        saveNote: vi.fn(),
        activeFilter,
        setActiveFilter,
        isModalOpen: false,
        editingNote: null,
        openAddModal: vi.fn(),
        openEditModal: vi.fn(),
        closeModal: vi.fn(),
    }

    render(
        <NotesContext.Provider value={value}>
            <FilterBar />
        </NotesContext.Provider>,
    )

    return { setActiveFilter }
}

describe('FilterBar', () => {
    it('shows All plus every category', () => {
        renderFilterBar()
        for (const name of ['All', 'Personal', 'Work', 'Idea', 'Journal']) {
            expect(screen.getByRole('button', { name })).toBeInTheDocument()
        }
    })

    it('marks the active filter', () => {
        renderFilterBar('Work')
        expect(screen.getByRole('button', { name: 'Work' })).toHaveClass('active')
        expect(screen.getByRole('button', { name: 'All' })).not.toHaveClass('active')
    })

    it('calls setActiveFilter when a filter is clicked', async () => {
        const { setActiveFilter } = renderFilterBar()
        await userEvent.click(screen.getByRole('button', { name: 'Idea' }))
        expect(setActiveFilter).toHaveBeenCalledWith('Idea')
    })
})
