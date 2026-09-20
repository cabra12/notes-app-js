import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ErrorBanner from './index'

describe('ErrorBanner', () => {
    it('shows the error message', () => {
        render(<ErrorBanner message="Failed to load notes" onDismiss={() => {}} />)
        expect(screen.getByText('Failed to load notes')).toBeInTheDocument()
    })

    it('calls onDismiss when the close button is clicked', async () => {
        const onDismiss = vi.fn()
        render(<ErrorBanner message="Oops" onDismiss={onDismiss} />)

        await userEvent.click(screen.getByRole('button'))

        expect(onDismiss).toHaveBeenCalledTimes(1)
    })
})
