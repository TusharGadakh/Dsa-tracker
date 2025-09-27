import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddSession from "./components/AddSession";
import ProblemEntry from "./components/ProblemEntry";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/sonner";
import "./App.css";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-session" element={<AddSession />} />
              <Route path="/add-problem" element={<ProblemEntry />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;