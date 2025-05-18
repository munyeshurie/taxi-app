'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

interface LeafletMapProps {
  onLocationSelect?: (location: string) => void;
}

const LeafletMap = ({ onLocationSelect }: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const map = L.map('map').setView([1.3521, 103.8198], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapRef.current = map;

      return () => {
        map.remove();
      };
    }
  }, []);

  return <div id="map" className="w-full h-[400px]" />;
};

export default LeafletMap;