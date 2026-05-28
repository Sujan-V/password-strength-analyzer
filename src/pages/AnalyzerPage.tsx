/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { analyzePassword, formatCrackTime } from '../utils/security';
import { PasswordAnalysis, StrengthLevel } from '../types';
import { generateAnalysisReportPdf } from '../utils/pdfGenerator';
import { 
  ShieldAlert, ShieldCheck, Eye, EyeOff, FileText, Sparkles, Copy, 
  Trash2, HelpCircle, HardDrive, RefreshCw, Cpu, Award, Zap, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnalyzerPageProps {
  initialPassword?: string;
  isLightTheme: boolean;
  onLoggedScan: (password: string, score: number, strength: StrengthLevel, entropy: number, vulnerabilities: number) => void;
}

export default function AnalyzerPage({ initialPassword = '', isLightTheme, onLoggedScan }: AnalyzerPageProps) {
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clipboardWarning, setClipboardWarning] = useState(false);

  const analysis = analyzePassword(password);

  // Trigger logging up stream for the analytics dashboard
  useEffect(() => {
    if (password.length >= 2) {
      const totalVuls = analysis.recommendations.length;
      // Debounce or slightly regulate logging to prevent spam, or update live values
      const timer = setTimeout(() => {
        onLoggedScan(password, analysis.score, analysis.strength, analysis.entropy, totalVuls);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [password]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setClipboardWarning(true);
      setTimeout(() => setCopied(false), 2000);
      // Keep clear/security warning on screen for safety brief
      setTimeout(() => setClipboardWarning(false), 8000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const clearClipboardBuffer = () => {
    // Write empty block to clipboard for safety
    try {
      navigator.clipboard.writeText('');
      setClipboardWarning(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = () => {
    setPassword('');
  };

  // Score thematic styling classes
  const getScoreTheme = (score: number) => {
    if (score <= 20) {
      return {
        bg: 'bg-rose-500',
        text: 'text-rose-400',
        glow: 'shadow-rose-500/20 shadow-lg border-rose-500/30',
        barBg: 'bg-rose-950/40',
        accentText: 'text-rose-500',
        bgGradient: 'from-rose-500/10 to-transparent'
      };
    } else if (score <= 45) {
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-400',
        glow: 'shadow-amber-500/20 shadow-lg border-amber-500/30',
        barBg: 'bg-amber-950/40',
        accentText: 'text-amber-500',
        bgGradient: 'from-amber-500/10 to-transparent'
      };
    } else if (score <= 65) {
      return {
        bg: 'bg-yellow-400',
        text: 'text-yellow-400',
        glow: 'shadow-yellow-500/20 shadow-lg border-yellow-500/30',
        barBg: 'bg-yellow-950/40',
        accentText: 'text-yellow-400',
        bgGradient: 'from-yellow-400/10 to-transparent'
      };
    } else if (score <= 85) {
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-400',
        glow: 'shadow-emerald-500/25 shadow-lg border-emerald-500/30',
        barBg: 'bg-emerald-950/40',
        accentText: 'text-emerald-500',
        bgGradient: 'from-emerald-500/10 to-transparent'
      };
    } else {
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-400 neon-text',
        glow: 'shadow-emerald-505/30 border-emerald-400/40 neon-glow',
        barBg: 'bg-emerald-950/45',
        accentText: 'text-emerald-400',
        bgGradient: 'from-emerald-400/15 via-emerald-950/5 to-transparent'
      };
    }
  };

  const theme = getScoreTheme(analysis.score);

  // Requirement items check state
  const checklist = [
    { id: 'len', label: 'Minimum 12 Characters', met: password.length >= 12 },
    { id: 'upper', label: 'Uppercase Letters (A-Z)', met: analysis.hasUppercase },
    { id: 'lower', label: 'Lowercase Letters (a-z)', met: analysis.hasLowercase },
    { id: 'nums', label: 'Numeric Digits (0-9)', met: analysis.hasNumbers },
    { id: 'syms', label: 'Special Symbols (*, #, @)', met: analysis.hasSymbols },
  ];

  return (
    <div id="analyzer-container" className="space-y-8 py-4">
      {/* Title & PDF Export Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
            PASSWORD_ANALYSIS_HARNESS
          </h2>
          <p className="text-slate-400 text-xs font-mono tracking-wide uppercase mt-1">
            DEEP EXTREME LAYER SCANNER // NIST 800-63B SECURE COMPLIANT
          </p>
        </div>

        <button
          onClick={() => password && generateAnalysisReportPdf(analysis)}
          disabled={!password}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-sans font-medium text-xs tracking-wide bg-emerald-500/15 hover:bg-emerald-500/35 border border-emerald-500/30 text-emerald-400 cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <FileText className="w-4 h-4" />
          EXPORT AUDIT CERTIFICATE (PDF)
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Analyzer Input and Progress Rings (7cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Input Card */}
          <div className="p-6 rounded-2xl glass space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-mono text-xs tracking-wider text-slate-400 uppercase">
                ENTER SECRET PHRASE TO AUDIT:
              </label>
              {password && (
                <span className="font-mono text-[10px] text-emerald-400 uppercase py-0.5 px-1.5 rounded bg-emerald-950/40 border border-emerald-500/25 animate-pulse">
                  ACTIVE SCANNER ONLINE
                </span>
              )}
            </div>

            {/* Input field wrapper */}
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type password, phrase, or tokens..."
                className="w-full pr-24 pl-5 py-4 rounded-xl border-2 border-emerald-500/50 bg-slate-950 p-5 text-xl font-bold tracking-widest text-[#e2e8f0] placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-all shadow-2xl"
              />
              <div className="absolute right-3 flex items-center gap-2">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 rounded hover:bg-slate-800/80 text-slate-500 hover:text-emerald-400 transition-all cursor-pointer"
                  title={showPassword ? 'Mask characters' : 'Reveal characters'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {password && (
                  <button
                    onClick={handleClear}
                    className="p-2 rounded hover:bg-slate-800/80 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                    title="Clear password"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Micro warning regarding leaked matches */}
            <AnimatePresence>
              {analysis.hasCommonWeakMatches && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-400 flex items-start gap-2 text-xs"
                >
                  <ShieldAlert className="w-4 h-4 mt-0.5 text-rose-500 animate-bounce flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-semibold uppercase tracking-wider font-mono text-[10px]">
                      HACKER DATABASE THREAT DETECTED
                    </p>
                    <p className="font-light">
                      This password represents an extremely common leak indexed in dictionaries. An attacker with standard tools can bypass this instantly.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons: Copy */}
            {password && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-emerald-400 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-emerald-500/20 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied' : 'Copy String'}
                </button>
              </div>
            )}
          </div>

          {/* Clipboard clear alerting banner */}
          <AnimatePresence>
            {clipboardWarning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 flex items-center justify-between text-xs text-amber-300"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                  <p className="font-sans font-light">
                    <strong>Clipboard Danger Alert:</strong> The password string remains buffered in your clipboard history!
                  </p>
                </div>
                <button
                  onClick={clearClipboardBuffer}
                  className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px] hover:bg-amber-900 duration-200 cursor-pointer"
                >
                  WIPE CLIPBOARD
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entropy & Detailed Crack Timelines */}
          <div className="p-6 rounded-2xl glass space-y-6">
            <h3 className="font-mono text-xs tracking-wider text-emerald-500 uppercase">
              BRUTE-FORCE ATTACK METHOD TIMELINES
            </h3>

            {/* Simulated attack modes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Online Attack Mode */}
              <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-950/60 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <p className="font-sans font-semibold text-white text-xs">ONLINE ATTACK</p>
                    <p className="font-mono text-[9px] text-slate-500">FIREWALL / AUTH LIMITSS</p>
                  </div>
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold text-emerald-400 neon-text">
                    {password ? (analysis.hasCommonWeakMatches ? 'Instant (1 sec)' : formatCrackTime(analysis.entropy > 0 ? (Math.pow(2, analysis.entropy) / 2 / 100) : 0)) : '--'}
                  </p>
                  <p className="font-sans text-[10px] text-slate-500 mt-1">~100 rate-limited attempts/sec</p>
                </div>
              </div>

              {/* Offline GPU Hash Rig */}
              <div className="p-4 rounded-xl border border-rose-500/25 bg-slate-950/60 flex flex-col justify-between space-y-4 shadow shadow-rose-950/15">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <p className="font-sans font-semibold text-rose-400 text-xs">OFFLINE GPU RIG</p>
                    <p className="font-mono text-[9px] text-slate-500">BRUTE FORCE PARALLEL</p>
                  </div>
                  <Cpu className="w-4 h-4 text-rose-500 animate-pulse" />
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold text-rose-400">
                    {password ? (analysis.hasCommonWeakMatches ? 'Instant (1 sec)' : formatCrackTime(analysis.entropy > 0 ? (Math.pow(2, analysis.entropy) / 2 / 100000000000) : 0)) : '--'}
                  </p>
                  <p className="font-sans text-[10px] text-slate-500 mt-1">100 Billion hashed attempts/sec</p>
                </div>
              </div>

              {/* Dictionary Attack */}
              <div className="p-4 rounded-xl border border-emerald-500/25 bg-slate-950/60 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <p className="font-sans font-semibold text-white text-xs">DICTIONARY SCAN</p>
                    <p className="font-mono text-[9px] text-slate-500 font-light">INDEX LOOKUP TABLES</p>
                  </div>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className={`font-mono text-sm font-semibold ${analysis.hasCommonWeakMatches ? 'text-rose-500' : 'text-emerald-400'}`}>
                    {password ? (analysis.hasCommonWeakMatches ? 'Vulnerable (Instant)' : 'Protected') : '--'}
                  </p>
                  <p className="font-sans text-[10px] text-slate-500 mt-1">Rainbow table dictionary indexed</p>
                </div>
              </div>
            </div>

            {/* Pattern diagnostics labels grid */}
            <AnimatePresence>
              {password && analysis.detectedPatterns.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2.5"
                >
                  <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-900">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span className="font-mono text-xs text-rose-400 uppercase font-semibold">
                      DETECTED SYSTEM WEAKNESS_TRIGGERS
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {analysis.detectedPatterns.map((pat) => (
                      <span
                        key={pat}
                        className="px-2.5 py-1 rounded bg-rose-950/20 text-rose-400 border border-rose-500/20 font-mono text-[11px]"
                      >
                        {pat}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Score, Requirement checklist and suggestions (5cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Strength Circle & Meter Card */}
          <div className={`p-6 rounded-2xl glass relative overflow-hidden transition-all duration-300 ${theme.glow}`}>
            {/* Top decorative gradient glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-25 bg-gradient-to-br ${theme.bgGradient}`} />

            <div className="space-y-6 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider text-emerald-500 uppercase">
                  VULNERABILITY ASSESSMENT
                </span>
                <span className={`font-mono text-sm font-bold uppercase ${theme.text}`}>
                  {analysis.strength}
                </span>
              </div>

              {/* Progress dial & score representation */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-5xl font-mono font-bold text-white leading-tight">
                    {password ? analysis.score : 0}
                    <span className="text-xl text-slate-500">/100</span>
                  </p>
                  <p className="font-sans text-xs text-slate-400 font-light mt-1">
                    Entropy calculation: <strong className="font-mono text-white">{analysis.entropy} bits</strong>
                  </p>
                </div>

                {/* Score Status Rings */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      className="stroke-slate-900 fill-none"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      className={`fill-none ${theme.accentText} transition-all duration-500`}
                      strokeWidth="5"
                      strokeDasharray="175.92"
                      strokeDashoffset={175.92 - (175.92 * (password ? analysis.score : 0)) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {analysis.score > 65 ? (
                      <ShieldCheck className={`w-6 h-6 ${theme.text}`} />
                    ) : (
                      <ShieldAlert className={`w-6 h-6 ${theme.text}`} />
                    )}
                  </div>
                </div>
              </div>

              {/* Sleek horizontal progress line */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>WEAK</span>
                  <span>MED</span>
                  <span>SECURE</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${password ? analysis.score : 0}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${theme.bg}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic checklist card */}
          <div className="p-6 rounded-2xl glass space-y-4">
            <h4 className="font-mono text-xs tracking-wider text-emerald-500 uppercase">
              REQUISITE CRITERIA STATUS
            </h4>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.met ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.met ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-800 flex items-center justify-center" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Recommendations lists */}
          {password && analysis.recommendations.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-xs tracking-wider text-slate-400 uppercase block pl-1">
                ADVISED REMEDIATIONS ({analysis.recommendations.length})
              </span>

              <div className="space-y-3">
                {analysis.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-xl border ${
                      rec.critical 
                        ? 'border-rose-500/20 bg-rose-950/10 text-rose-300' 
                        : 'border-amber-500/20 bg-amber-950/10 text-amber-200'
                    } text-xs space-y-1.5 transition-all duration-300`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className={`w-4.5 h-4.5 ${rec.critical ? 'text-rose-500' : 'text-amber-500'}`} />
                      <span className="font-sans font-semibold text-white">{rec.title}</span>
                    </div>
                    <p className="font-sans font-light text-slate-300 leading-relaxed">
                      {rec.description}
                    </p>
                    <div className="p-2.5 rounded bg-slate-950/60 border border-slate-900/60 font-mono text-[10px] text-cyan-400">
                      <strong>FIX:</strong> {rec.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
