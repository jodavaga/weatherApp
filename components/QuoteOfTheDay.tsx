'use client';
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
// const CACHE_DURATION =  24 * 60 * 60 * 1000; // 24 hors
const CACHE_DURATION =  10 * 1000; // 10 segs 

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
    
    // cache expired, remove it
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

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const cachedQuote = getCachedQuote();
        if (cachedQuote) {
          setQuote(cachedQuote);
          setLoading(false);
          return;
        }

        // Fetch from API
        const response = await fetch('/api/quotes');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const quoteData: QuoteData = await response.json();
        
        // Cache the quote
        setCachedQuote(quoteData);
        setQuote(quoteData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  const handleRefresh = async () => {
    // Clear cache and fetch new quote
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
      
      // Cache the new quote
      setCachedQuote(quoteData);
      setQuote(quoteData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Quote of the Day</h2>
          <button
            onClick={handleRefresh}
            disabled
            className="text-xs text-gray-400 dark:text-gray-500 cursor-not-allowed"
          >
            Refresh
          </button>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Quote of the Day</h2>
          <button
            onClick={handleRefresh}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Retry
          </button>
        </div>
        <div className="text-red-600 dark:text-red-400 text-sm">
          <p>Unable to load quote</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Quote of the Day</h2>
        <button
          onClick={handleRefresh}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          title="Get a new quote"
        >
          Refresh
        </button>
      </div>
      {quote && (
        <blockquote className="text-sm italic text-black/70 dark:text-white/70">
          &ldquo;{quote.quote}&rdquo;
          <footer className="mt-2 text-xs text-black/60 dark:text-white/60">
            — {quote.author}
          </footer>
          {quote.tags && quote.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {quote.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </blockquote>
      )}
    </div>
  );
}


