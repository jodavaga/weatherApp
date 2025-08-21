import { useState, useEffect } from 'react';

interface QuoteData {
  quote: string;
  author: string;
  tags: string[];
}

interface CachedQuote extends QuoteData {
  timestamp: number;
}

const CACHE_KEY = 'weather-app-quote';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hors

const getCachedQuote = (): CachedQuote | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const quoteData: CachedQuote = JSON.parse(cached);
    const now = Date.now();
    
    const isCacheValid = (timestamp: number): boolean => {
      return (now - timestamp) < CACHE_DURATION;
    };

    if (isCacheValid(quoteData.timestamp)) {
      return quoteData;
    }
    
    // expired, remove it
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.warn('Failed to parse cached quote:', error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const setCachedQuote = (quote: QuoteData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cachedQuote: CachedQuote = {
      ...quote,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedQuote));
  } catch (error) {
    console.warn('Failed to cache quote:', error);
  }
};

export const useQuote = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedQuote = getCachedQuote();
      if (cachedQuote) {
        setQuote(cachedQuote);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/quotes');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const quoteData: QuoteData = await response.json();
      
      setCachedQuote(quoteData);
      setQuote(quoteData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refreshQuote = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    
    setQuote(null);
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch('/api/quotes');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const quoteData: QuoteData = await response.json();
      
      setCachedQuote(quoteData);
      setQuote(quoteData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return {
    quote,
    loading,
    error,
    refreshQuote,
  };
};
