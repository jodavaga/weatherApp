'use client';
import { useState, useEffect } from 'react';

interface QuoteData {
  quote: string;
  author: string;
}

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock quote data (replace with actual quote API)
        const mockQuotes: QuoteData[] = [
          { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
          { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
          { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
          { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
          { quote: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
        setQuote(randomQuote);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Quote of the Day</h2>
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
        <h2 className="text-xl font-semibold mb-2">Quote of the Day</h2>
        <div className="text-red-600 dark:text-red-400 text-sm">
          <p>Unable to load quote</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Quote of the Day</h2>
      {quote && (
        <blockquote className="text-sm italic text-black/70 dark:text-white/70">
          &ldquo;{quote.quote}&rdquo;
          <footer className="mt-2 text-xs text-black/60 dark:text-white/60">
            — {quote.author}
          </footer>
        </blockquote>
      )}
    </div>
  );
}


