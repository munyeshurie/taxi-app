'use client';
import { useEffect, useState } from 'react';

export default function BookingList() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch bookings');
        return res.json();
      })
      .then(data => setBookings(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading bookings...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">All Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-2">
          {bookings.map((b) => (
            <li key={b.id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow">
              <strong>Pickup:</strong> {b.pickup} <br />
              <strong>Drop-off:</strong> {b.dropoff} <br />
              <div className="text-sm text-gray-500 mt-2">
                <span className={`px-2 py-1 rounded ${
                  b.status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {b.status}
                </span>
                <em className="ml-2">{new Date(b.createdAt).toLocaleString()}</em>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
