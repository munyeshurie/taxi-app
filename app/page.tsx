'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-gray-800 rounded-lg">
      <div className="animate-pulse text-gray-400">Loading map...</div>
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Book Your Taxi</h1>
          <p className="text-gray-400 mb-8">Enter your pickup and destination details</p>
          
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Pickup Section */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl font-semibold text-white mb-4">Pickup Location</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Street Name
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter street name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        House Number
                      </label>
                      <input
                        type="text"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="No."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1000"
                        pattern="[0-9]{4}"
                        title="Belgian postal code (4 digits)"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination Section */}
              <div className="border-l-4 border-green-500 pl-4">
                <h2 className="text-xl font-semibold text-white mb-4">Destination</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Street Name
                    </label>
                    <input
                      type="text"
                      value={destStreet}
                      onChange={(e) => setDestStreet(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter street name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        House Number
                      </label>
                      <input
                        type="text"
                        value={destHouseNumber}
                        onChange={(e) => setDestHouseNumber(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="No."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={destPostalCode}
                        onChange={(e) => setDestPostalCode(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="1000"
                        pattern="[0-9]{4}"
                        title="Belgian postal code (4 digits)"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Calculate Fare
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
