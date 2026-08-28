import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobDescriptionPanel } from '../JobDescriptionPanel'

function ControlledHarness() {
  const [value, setValue] = require('react').useState('')
  return <JobDescriptionPanel value={value} onChange={setValue} />
}

describe('JobDescriptionPanel', () => {
  it('renders a focusable, typeable textarea', async () => {
    const user = userEvent.setup()
    render(<ControlledHarness />)

    const textarea = screen.getByTestId('jd-textarea')
    expect(textarea).toBeInTheDocument()
    expect(textarea).not.toBeDisabled()

    await user.click(textarea)
    await user.type(textarea, 'Senior AI Engineer, remote')

    expect(textarea).toHaveValue('Senior AI Engineer, remote')
  })

  it('updates the character counter as the user types', async () => {
    const user = userEvent.setup()
    render(<ControlledHarness />)

    const textarea = screen.getByTestId('jd-textarea')
    const counter = screen.getByTestId('jd-char-count')

    expect(counter).toHaveTextContent('0 / 20,000')

    await user.type(textarea, 'hello')

    expect(counter).toHaveTextContent('5 / 20,000')
  })

  it('calls onChange with the new value on every keystroke, not just on blur', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    function Harness() {
      return <JobDescriptionPanel value="" onChange={handleChange} />
    }

    render(<Harness />)
    const textarea = screen.getByTestId('jd-textarea')

    await user.type(textarea, 'hi')

    expect(handleChange).toHaveBeenNthCalledWith(1, 'h')
    expect(handleChange).toHaveBeenNthCalledWith(2, 'i')
    expect(handleChange).toHaveBeenCalledTimes(2)
  })

  it('reflects an externally-controlled value, e.g. restored from storage', () => {
    render(<JobDescriptionPanel value="restored draft text" onChange={() => {}} />)

    const textarea = screen.getByTestId('jd-textarea')
    expect(textarea).toHaveValue('restored draft text')
  })
})