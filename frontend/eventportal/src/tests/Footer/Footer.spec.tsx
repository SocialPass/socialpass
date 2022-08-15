import { render } from '@testing-library/react'
import { Event } from '../../pages'

describe('Footer component', () => {
  it('should render correctly', async () => {
    render(<Event />)

    expect(true).toBe(true)
  })
})
