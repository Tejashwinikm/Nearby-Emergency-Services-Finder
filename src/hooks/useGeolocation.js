import { useState, useCallback } from 'react';

/**
 * Wraps the browser Geolocation API in a simple, retryable hook.
 * Returns { coords, status, error, locate }.
 * status: 'idle' | 'locating' | 'success' | 'error'
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setStatus('locating');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus('success');
      },
      (err) => {
        setStatus('error');
        // err.code: 1 = permission denied, 2 = unavailable, 3 = timeout
        const messages = {
          1: 'Location permission was denied. Enable it in your browser settings to find nearby help.',
          2: 'Your location is currently unavailable. Try again in a moment.',
          3: 'Locating you took too long. Check your connection and try again.',
        };
        setError(messages[err.code] || 'Could not determine your location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return { coords, status, error, locate };
}
