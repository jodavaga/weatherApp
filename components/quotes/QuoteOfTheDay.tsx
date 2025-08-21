'use client';
import { useQuote } from './useQuote';

export default function QuoteOfTheDay() {
  const { quote, loading, error, refreshQuote } = useQuote();

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Quote of the Day</h2>
          <button
            onClick={refreshQuote}
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
            onClick={refreshQuote}
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
          onClick={refreshQuote}
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


