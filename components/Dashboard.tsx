import WeatherInfo from "./WeatherInfo";
import QuoteOfTheDay from "./QuoteOfTheDay";

export default function Dashboard() {
  return (
    <div >
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5 bg-white dark:bg-black/20">
          <WeatherInfo />
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5 bg-white dark:bg-black/20">
          <QuoteOfTheDay />
        </div>
      </div>
    </div>
  );
}


