import { useContext } from 'react'
import { getFilterColor, NotesContext } from '../../context/NotesContext'
import { categories } from '../../context/NotesContext'
import type { FilterOption } from '../../context/NotesContext'
import './styles.css'

function FilterBar() {
    const context = useContext(NotesContext)
    if (!context) throw new Error('FilterBar must be used within a NotesContext.Provider')

    const { activeFilter, setActiveFilter } = context

    const options: FilterOption[] = ['All', ...categories]

    return (
        <div className="filter-bar">
            {options.map((option) => {
                const color = getFilterColor(option)
                return (
                    <button
                        key={option}
                        className={`filter-pill ${activeFilter === option ? 'active' : ''}`}
                        style={{ '--hover-color': color } as React.CSSProperties}
                        onClick={() => setActiveFilter(option)}
                    >
                        {option}
                    </button>
                )
            })}
        </div>
    )
}

export default FilterBar
