import { render, screen, waitFor } from '@testing-library/react'
import BookingList from '../page'

describe('BookingList', () => {
  const mockBookings = [
    {
      id: 1,
      pickup: 'Test Pickup 1',
      dropoff: 'Test Dropoff 1',
      createdAt: new Date().toISOString(),
      status: 'pending'
    },
    {
      id: 2,
      pickup: 'Test Pickup 2',
      dropoff: 'Test Dropoff 2',
      createdAt: new Date().toISOString(),
      status: 'completed'
    }
  ]

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBookings),
      })
    ) as jest.Mock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<BookingList />)
    expect(screen.getByText('Loading bookings...')).toBeInTheDocument()
  })

  it('renders bookings after loading', async () => {
    render(<BookingList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Pickup 1')).toBeInTheDocument()
      expect(screen.getByText('Test Pickup 2')).toBeInTheDocument()
    })
  })

  it('handles fetch error', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    ) as jest.Mock

    render(<BookingList />)
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument()
    })
  })
})