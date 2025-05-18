'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

interface MapProps {
  pickup: string;
  dropoff: string;
  onRouteCalculated: (distance: string, fare: string) => void;
  visible: boolean;
}

export default function Map({ pickup, dropoff, onRouteCalculated, visible }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!visible || !pickup || !dropoff) return;

    const initializeMap = async () => {
      // Initialize map centered on Belgium
      const map = L.map('map').setView([50.8503, 4.3517], 8); // Belgium coordinates
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapRef.current = map;

      // Get coordinates for pickup and dropoff addresses
      const [pickupCoords, dropoffCoords] = await Promise.all([
        getCoordinates(pickup + ', Belgium'),
        getCoordinates(dropoff + ', Belgium')
      ]);

      if (pickupCoords && dropoffCoords) {
        // Add markers
        L.marker([pickupCoords.lat, pickupCoords.lon], {
          icon: L.icon({
            iconUrl: '/leaflet/marker-icon-2x-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        }).addTo(map);

        L.marker([dropoffCoords.lat, dropoffCoords.lon], {
          icon: L.icon({
            iconUrl: '/leaflet/marker-icon-2x-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        }).addTo(map);

        // Calculate route
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(pickupCoords.lat, pickupCoords.lon),
            L.latLng(dropoffCoords.lat, dropoffCoords.lon)
          ],
          routeWhileDragging: false,
          show: false,
          addWaypoints: false,
          router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving'
          })
        }).addTo(map);

        routingControlRef.current.on('routesfound', (e: any) => {
          const routes = e.routes;
          const distanceInMeters = routes[0].summary.totalDistance;
          const distanceInKm = (distanceInMeters / 1000).toFixed(1);
          
          // Calculate fare (adjust rates for Belgium)
          const baseFare = 2.50; // Base fare in EUR
          const perKmRate = 1.20; // Rate per km in EUR
          const calculatedFare = (baseFare + (distanceInMeters / 1000) * perKmRate).toFixed(2);
          
          onRouteCalculated(distanceInKm, calculatedFare);
        });
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pickup, dropoff, visible]);

  const getCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
      );
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  if (!visible) return null;

  return (
    <div className="map-container">
      <div id="map" className="w-full h-[400px]" />
    </div>
  );
}