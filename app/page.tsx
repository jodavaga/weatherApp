import Dashboard from "../components/Dashboard";
import DynamicBackground from "../components/DynamicBackground";

export default function Home() {
  return (
    <DynamicBackground>
      <div className="min-h-screen p-6 sm:p-10">
        <Dashboard />
      </div>
    </DynamicBackground>
  );
}
