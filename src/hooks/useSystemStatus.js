import { useState, useEffect } from 'react';

export const useSystemStatus = (endpointUrl) => {
  const [status, setStatus] = useState({
    loading: true,
    online: false,
    lastChecked: null
  });

  const checkStatus = async () => {
    try {
      // Basta una semplice chiamata HEAD o GET
      const response = await fetch(endpointUrl, { method: 'GET' });
      
      if (response.ok) {
        setStatus({ loading: false, online: true, lastChecked: new Date() });
      } else {
        setStatus({ loading: false, online: false, lastChecked: new Date() });
      }
    } catch (error) {
      setStatus({ loading: false, online: false, lastChecked: new Date() });
    }
  };

  useEffect(() => {
    checkStatus();
    // Opzionale: ricontrolla ogni 30 secondi
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [endpointUrl]);

  return status;
};