import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookingForm from '../page'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

// Mock Leaflet
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  Routing: {
    control: jest.fn(() => ({
      addTo: jest.fn(),
      setWaypoints: jest.fn(),
      on: jest.fn(),
    })),
  },
  marker: jest.fn(() => ({
    addTo: jest.fn(),
    remove: jest.fn(),
    getLatLng: jest.fn(() => ({ lat: 1, lng: 1 })),
  })),
  icon: jest.fn(),
}))

describe('BookingForm', () => {
  beforeEach(() => {
    // Create a div for the map
    const mapDiv = document.createElement('div')
    mapDiv.setAttribute('id', 'map')
    document.body.appendChild(mapDiv)
  })

  afterEach(() => {
    // Clean up
    document.body.innerHTML = ''
    jest.clearAllMocks()
  })

  it('renders booking form', () => {
    render(<BookingForm />)
    
    expect(screen.getByText('Book a Taxi')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Click on map to set pickup location')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Click on map to set drop-off location')).toBeInTheDocument()
  })

  it('disables submit button when form is empty', () => {
    render(<BookingForm />)
    
    const submitButton = screen.getByRole('button', { name: /book now/i })
    expect(submitButton).toBeDisabled()
  })

  it('handles form submission', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock

    render(<BookingForm />)
    
    // Simulate setting pickup and dropoff locations
    const pickupInput = screen.getByPlaceholderText('Click on map to set pickup location')
    const dropoffInput = screen.getByPlaceholderText('Click on map to set drop-off location')
    
    fireEvent.change(pickupInput, { target: { value: 'Test Pickup' } })
    fireEvent.change(dropoffInput, { target: { value: 'Test Dropoff' } })
    
    // Wait for the form to be valid
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /book now/i })).not.toBeDisabled()
    })
    
    fireEvent.click(screen.getByRole('button', { name: /book now/i }))
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/bookings', expect.any(Object))
    })
  })
})