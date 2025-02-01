import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900">
      {/* Logo Section */}
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="w-24 transition-transform hover:scale-110" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="w-24 transition-transform hover:scale-110" alt="React logo" />
        </a>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold tracking-tight">Vite + React</h1>

      {/* Counter Card */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
        <button 
          className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        <p className="mt-4 text-gray-600 text-sm">
          Edit <code className="bg-gray-200 px-2 py-1 rounded-md">src/App.jsx</code> and save to test HMR.
        </p>
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-blue-600 text-sm hover:underline cursor-pointer">
        Click on the Vite and React logos to learn more.
      </p>
    </div>
  );
}

export default App;
