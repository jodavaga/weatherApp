import { NextResponse } from 'next/server';

interface QuoteResponse {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}

interface QuoteData {
  quote: string;
  author: string;
  tags: string[];
}

const transformQuoteResponse = (data: QuoteResponse): QuoteData => {
  return {
    quote: data.content,
    author: data.author,
    tags: data.tags,
  };
};

const fetchQuoteFromQuotable = async (): Promise<QuoteData> => {
  try {
    const response = await fetch('https://api.quotable.io/random?maxLength=150&tags=inspirational|motivational|success|life', {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: QuoteResponse = await response.json();
    return transformQuoteResponse(data);
  } catch (error) {
    console.warn('Quotable API failed:', error);
    throw error;
  }
};

// Fallback quotes for when API fails
const FALLBACK_QUOTES: QuoteData[] = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", tags: ["inspirational", "success"] },
  { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon", tags: ["life", "inspirational"] },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", tags: ["inspirational", "motivational"] },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", tags: ["success", "motivational"] },
  { quote: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", tags: ["inspirational", "life"] },
];

export async function GET() {
  try {
    const quote = await fetchQuoteFromQuotable();
    
    return NextResponse.json(quote, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // Cache for 1 hour, stale for 24 hours
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.warn('Quotable API failed, using fallback quote:', error);
    
    // Return a random fallback quote
    const fallbackQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    
    return NextResponse.json(fallbackQuote, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600', // Shorter cache for fallback
        'Content-Type': 'application/json',
      },
    });
  }
}
