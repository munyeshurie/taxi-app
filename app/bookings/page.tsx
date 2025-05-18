'use client';
import { useState } from 'react';

export default function BookingsPage() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pickup, dropoff }),
    });

    if (res.ok) {
      setMessage('Booking saved!');
      setPickup('');
      setDropoff('');
    } else {
      setMessage('Error saving booking.');
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Book a Taxi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="block border p-2 w-full" type="text" value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Pickup location" />
        <input className="block border p-2 w-full" type="text" value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Drop-off location" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Book Ride</button>
      </form>
      <p className="mt-4">{message}</p>
    </main>
  );
}

  