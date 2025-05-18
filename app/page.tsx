'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="animate-pulse text-gray-600">Loading map...</div>
    </div>
  )
});

export default function BookingForm() {
  const router = useRouter();
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [destStreet, setDestStreet] = useState('');
  const [destHouseNumber, setDestHouseNumber] = useState('');
  const [destPostalCode, setDestPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState('');
  const [fare, setFare] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMap(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pickup: `${street} ${houseNumber}, ${postalCode}`,
          dropoff: `${destStreet} ${destHouseNumber}, ${destPostalCode}`,
          distance,
          estimatedFare: fare 
        }),
      });

      if (response.ok) {
        router.push('/bookings/list');
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchAddress = async (query: string, isPickup: boolean) => {
    if (query.length < 3) return;
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=be`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Book Your Taxi</h1>
          <p className="text-gray-600 text-center mb-8">Enter your pickup and destination details</p>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <form onSubmit={handleCalculate} className="divide-y divide-gray-200">
              {/* Pickup Location Card */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-900">Pickup Location</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-3">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="street"
                        value={street}
                        onChange={(e) => {
                          setStreet(e.target.value);
                          searchAddress(e.target.value, true);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-2">
                          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-48 overflow-auto">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setStreet(suggestion.display_name);
                              setSuggestions([]);
                            }}
                          >
                            {suggestion.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      House Number
                    </label>
                    <input
                      type="text"
                      id="houseNumber"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      pattern="[0-9]{4}"
                      title="Belgian postal code (4 digits)"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Destination Card */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-900">Destination</h2>
                </div>
                
                {/* ... Similar structure for destination fields ... */}
              </div>

              <div className="p-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Calculate Fare
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
