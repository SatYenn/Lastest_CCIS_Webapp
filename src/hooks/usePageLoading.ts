import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Minimum loading time to prevent flashing

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return isLoading;
}