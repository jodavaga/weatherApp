'use client';

import { Suspense } from 'react';
import WeatherInfo from "./WeatherInfo";
import QuoteOfTheDay from "./quotes/QuoteOfTheDay";

function LoadingFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-black/20 dark:border-white/20 p-5 bg-white/80 dark:bg-black/40 backdrop-blur-sm shadow-lg">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="rounded-xl border border-black/20 dark:border-white/20 p-5 bg-white/80 dark:bg-black/40 backdrop-blur-sm shadow-lg">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <Suspense fallback={<LoadingFallback />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-black/20 dark:border-white/20 p-5 bg-white/80 dark:bg-black/40 backdrop-blur-sm shadow-lg">
            <WeatherInfo />
          </div>
          <div className="rounded-xl border border-black/20 dark:border-white/20 p-5 bg-white/80 dark:bg-black/40 backdrop-blur-sm shadow-lg">
            <QuoteOfTheDay />
          </div>
        </div>
      </Suspense>
    </div>
  );
}


