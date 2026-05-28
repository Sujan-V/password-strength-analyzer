/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Sun, Moon, Sparkles, Database, KeyRound, 
  Terminal, Activity, HelpCircle, LayoutGrid, Monitor, Play, BookOpen 
} from 'lucide-react';
import { PageId, AnalyzedLog, StrengthLevel } from './types';
import LandingPage from './pages/LandingPage';
import AnalyzerPage from './pages/AnalyzerPage';
import GeneratorPage from './pages/GeneratorPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import CyberGrid from './components/CyberGrid';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [page, setPage] = useState<PageId>('landing');
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [logs, setLogs] = useState<AnalyzedLog[]>([]);

  // Telemetry logger interface to populate real-time dashboards
  const handleLoggedScan = (
    password: string, 
    score: number, 
    strength: StrengthLevel, 
    entropy: number, 
    vulnerabilities: number
  ) => {
    if (!password || password.length < 2) return;
    
    setLogs((prev) => {
      const masked = password[0] + '*'.repeat(password.length - 1);
      
      // Skip if the last entry is identical to avoid logs spam
      if (prev.length > 0 && prev[0].maskedPassword === masked) {
        return prev;
      }

      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const newLog: AnalyzedLog = {
        id: Math.random().toString(),
        timestamp,
        maskedPassword: masked,
        length: password.length,
        score,
        strength,
        entropy,
        vulnerabilitiesFound: vulnerabilities
      };

      return [newLog, ...prev.slice(0, 24)]; // Buffer up to 25 items in volatile RAM
    });
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
  };

  const handleTriggerAnalyzer = (password: string) => {
    setPage('analyzer');
  };

  return (
    <div className={`min-h-screen text-slate-300 font-sans relative overflow-hidden transition-all duration-300 ${
      isLightTheme 
        ? 'bg-[#050608] text-slate-100 font-mono'
        : 'bg-[#050608] text-slate-100 font-mono'
    }`}>
      {/* 1. Futuristic Glowing Digital Grid Background */}
      <CyberGrid />

      {/* Decorative top glass gradient row */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-b from-emerald-950/15 via-transparent to-transparent pointer-events-none z-0" />

      {/* Main Content Layout Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col min-h-screen justify-between">
        
        {/* HEADER & FUTURISTIC TOP NAVBAR */}
        <header className="border-b border-emerald-500/20 pb-4 mb-6 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Title & Brand logo */}
            <div 
              onClick={() => setPage('landing')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tighter text-emerald-400 neon-text font-sans">
                  CRYPTOSHIELD <span className="text-white opacity-50 text-xs">v2.0.4</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-mono">
                  Real-Time Neural Pattern Analysis
                </p>
              </div>
            </div>

            {/* Futuristic Tab Navigation Menu */}
            <nav className="flex flex-wrap items-center gap-1.5 bg-slate-900/40 p-1.5 rounded-xl border border-emerald-500/20 backdrop-blur-md">
              
              {/* Landing Page */}
              <button
                onClick={() => setPage('landing')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs uppercase cursor-pointer tracking-wider transition-all duration-200 border ${
                  page === 'landing'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-850/45'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Home
              </button>

              {/* Analyzer Page */}
              <button
                onClick={() => setPage('analyzer')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs uppercase cursor-pointer tracking-wider transition-all duration-200 border ${
                  page === 'analyzer'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-850/45'
                }`}
              >
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                Decrypt Scan
              </button>

              {/* Generator Page */}
              <button
                onClick={() => setPage('generator')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs uppercase cursor-pointer tracking-wider transition-all duration-200 border ${
                  page === 'generator'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-850/45'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Keygen
              </button>

              {/* Dashboard Page */}
              <button
                onClick={() => setPage('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs uppercase cursor-pointer tracking-wider transition-all duration-200 border ${
                  page === 'dashboard'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-850/45'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Dashboard
              </button>

              {/* About Page */}
              <button
                onClick={() => setPage('about')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs uppercase cursor-pointer tracking-wider transition-all duration-200 border ${
                  page === 'about'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-850/45'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Cyber Guide
              </button>
            </nav>

            {/* Top Right Auxiliary Actions: System Status & Theme toggler */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] text-slate-500 uppercase">System Status</span>
                <span className="text-emerald-400 text-xs flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></span>
                  ENCRYPTED CONNECTION
                </span>
              </div>
              <div className="hidden lg:flex w-8 h-8 rounded-full border border-emerald-500/50 items-center justify-center">
                <div className="w-6.5 h-6.5 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 text-[10px] font-bold">JD</div>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-slate-850 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer"
                title={isLightTheme ? 'Switch to cosmic theme' : 'Switch to crisp high-contrast theme'}
              >
                {isLightTheme ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* PRIMARY SUB-PAGE COMPONENT ROUTING WITH MOUNT TRANSITIONS */}
        <main className="flex-grow py-2 z-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {page === 'landing' && (
                <LandingPage setPage={setPage} isLightTheme={isLightTheme} />
              )}
              {page === 'analyzer' && (
                <AnalyzerPage isLightTheme={isLightTheme} onLoggedScan={handleLoggedScan} />
              )}
              {page === 'generator' && (
                <GeneratorPage isLightTheme={isLightTheme} onLoggedScan={handleLoggedScan} />
              )}
              {page === 'dashboard' && (
                <DashboardPage logs={logs} onClearLogs={handleClearLogs} isLightTheme={isLightTheme} />
              )}
              {page === 'about' && (
                <AboutPage />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* SECURITY STATUS FOOTER WITH LIVE SIMULATION TICKER */}
        <footer className="border-t border-emerald-500/10 mt-8 pt-4 pb-2 z-10 select-none">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-slate-500 font-mono text-[10px] tracking-wider uppercase">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p>SECURE_GRID_STATUS // 100% CONTAINED [LOCAL RAM SANDBOX]</p>
            </div>
            
            <p className="font-mono text-emerald-600">
              AUDIT RATE: 0.04 ms RECORDED DATA TRANSFER
            </p>

            <p className="text-right">
              SPDX-License-Identifier: Apache-2.0 © 2026
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
