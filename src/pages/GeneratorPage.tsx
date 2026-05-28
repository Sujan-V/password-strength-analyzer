/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { generatePassword, analyzePassword } from '../utils/security';
import { GeneratorSettings } from '../types';
import { Key, Copy, RefreshCw, Eye, EyeOff, ShieldAlert, CheckCircle2, ListFilter, Activity, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GeneratorPageProps {
  isLightTheme: boolean;
  onLoggedScan: (password: string, score: number, strength: any, entropy: number, vulnerabilities: number) => void;
}

export default function GeneratorPage({ isLightTheme, onLoggedScan }: GeneratorPageProps) {
  const [settings, setSettings] = useState<GeneratorSettings>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{ password: string; entropy: number; strength: string }>>([]);

  // Auto generate on startup or when settings update
  const handleGenerate = () => {
    const passwd = generatePassword(settings);
    setGeneratedPassword(passwd);
    setCopied(false);

    // Calculate details for history
    const report = analyzePassword(passwd);
    
    // Log scanning events so they propagate in the cybersecurity dashboard stats!
    onLoggedScan(passwd, report.score, report.strength, report.entropy, report.recommendations.length);

    // Add to local generator history
    setHistory((prev) => [
      { password: passwd, entropy: report.entropy, strength: report.strength },
      ...prev.slice(0, 9) // keep last 10
    ]);
  };

  useEffect(() => {
    handleGenerate();
  }, [
    settings.length,
    settings.includeUppercase,
    settings.includeLowercase,
    settings.includeNumbers,
    settings.includeSymbols,
  ]);

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const report = analyzePassword(generatedPassword);

  const getBarColor = (score: number) => {
    if (score < 40) return 'bg-rose-500';
    if (score < 65) return 'bg-amber-500';
    if (score < 85) return 'bg-emerald-500/80';
    return 'bg-emerald-400';
  };

  return (
    <div id="generator-container" className="space-y-8 py-4">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight flex items-center gap-2">
          <Key className="w-6 h-6 text-emerald-400" />
          CRYPTOGRAPHIC_KEY_GENERATOR
        </h2>
        <p className="text-slate-400 text-xs font-mono tracking-wide uppercase mt-1">
          RANDOMIZED ENTROPY SEED GENERATION // HIGH DEGREE RANDOMLY SHUFFLED
        </p>
      </div>

      {/* Main Grid: Controls vs History Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns - Standard generator controllers */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl glass space-y-6">
            
            {/* Display Output Section */}
            <div className="space-y-2">
              <span className="font-mono text-xs tracking-wider text-emerald-400 uppercase">
                GENERATED CRITICAL SECRET:
              </span>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  readOnly
                  value={generatedPassword}
                  className="w-full pr-28 pl-5 py-4 rounded-xl border border-slate-805 bg-slate-950 font-mono text-sm md:text-md tracking-wider text-white duration-300 select-all"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 rounded hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-all cursor-pointer"
                    title={showPassword ? 'Mask character stream' : 'Reveal character stream'}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                  <button
                    onClick={() => handleCopy(generatedPassword)}
                    className="p-2 rounded hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-all cursor-pointer"
                    title="Copy token to clipboard"
                  >
                    <Copy className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="p-2 rounded hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-all cursor-pointer"
                    title="Generate different password"
                  >
                    <RefreshCw className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Mini entropy/score feedback for current gen */}
              {generatedPassword && (
                <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-mono">
                  <p className="flex items-center gap-1">
                    Score: <strong className="text-white">{report.score}/100</strong>
                    (<span className={`${report.score > 65 ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`}>{report.strength}</span>)
                  </p>
                  <p>
                    Entropy: <strong className="text-white">{report.entropy} bits</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Config Sliders */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex justify-between items-center">
                <span className="font-sans font-medium text-white text-sm">Keyword String Length:</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-950/45 px-2.5 py-1 rounded border border-emerald-500/20 text-sm">
                  {settings.length} chars
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={settings.length}
                onChange={(e) => setSettings({ ...settings, length: parseInt(e.target.value) })}
                className="w-full h-2 rounded bg-slate-900 border border-slate-805 accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Minimal (6)</span>
                <span>Highly Secure (32)</span>
                <span>Hyper Cloud (64)</span>
              </div>
            </div>

            {/* Pool Filter Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-900">
              {/* Include Uppercase */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-850 bg-slate-900/20 select-none cursor-pointer hover:border-emerald-500/40 duration-200">
                <div className="space-y-0.5">
                  <p className="font-sans font-medium text-white text-xs">Uppercase Letters</p>
                  <p className="font-mono text-[9px] text-slate-500">POOL: A - Z</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.includeUppercase}
                  onChange={(e) => setSettings({ ...settings, includeUppercase: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-800 text-emerald-500 focus:ring-emerald-500 accent-emerald-400 cursor-pointer"
                />
              </label>

              {/* Include Lowercase */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-850 bg-slate-900/20 select-none cursor-pointer hover:border-emerald-500/40 duration-200">
                <div className="space-y-0.5">
                  <p className="font-sans font-medium text-white text-xs">Lowercase Letters</p>
                  <p className="font-mono text-[9px] text-slate-500">POOL: a - z</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.includeLowercase}
                  onChange={(e) => setSettings({ ...settings, includeLowercase: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-800 text-emerald-500 focus:ring-emerald-500 accent-emerald-400 cursor-pointer"
                />
              </label>

              {/* Include Numbers */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-855 bg-slate-900/20 select-none cursor-pointer hover:border-emerald-500/40 duration-200">
                <div className="space-y-0.5">
                  <p className="font-sans font-medium text-white text-xs">Numerical Digits</p>
                  <p className="font-mono text-[9px] text-slate-500">POOL: 0 - 9</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.includeNumbers}
                  onChange={(e) => setSettings({ ...settings, includeNumbers: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-800 text-emerald-500 focus:ring-emerald-500 accent-emerald-400 cursor-pointer"
                />
              </label>

              {/* Include Symbols */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-850 bg-slate-900/20 select-none cursor-pointer hover:border-emerald-500/40 duration-200">
                <div className="space-y-0.5">
                  <p className="font-sans font-medium text-white text-xs">Special Characters</p>
                  <p className="font-mono text-[9px] text-slate-500">POOL: !, @, #, $, %</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.includeSymbols}
                  onChange={(e) => setSettings({ ...settings, includeSymbols: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-800 text-emerald-500 focus:ring-emerald-500 accent-emerald-400 cursor-pointer"
                />
              </label>
            </div>

            {/* Warning when selecting zero boxes */}
            {!settings.includeUppercase && !settings.includeLowercase && !settings.includeNumbers && !settings.includeSymbols && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                <p><strong>Config Warning:</strong> Please check at least one character set above to start generating seeds.</p>
              </div>
            )}

            {/* Entropy check status banner */}
            <div className="p-4 rounded-xl border border-emerald-500/10 bg-gradient-to-r from-emerald-950/20 to-transparent flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <p className="font-sans font-semibold text-white text-xs uppercase font-mono tracking-wider">
                  NIST PASSWORD COMPLIANCE BRIEF
                </p>
                <p className="font-sans text-slate-400 text-xs leading-relaxed font-light">
                  A character length of 16 guarantees greater mathematical resistance than adding complicated glyph replacements to an 8-character string. Check all pools to generate robust entropy keys.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns - Generator history logs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass space-y-4">
            <h3 className="font-mono text-xs tracking-wider text-emerald-400 uppercase flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <ListFilter className="w-4 h-4 text-emerald-400" />
              HISTORIC_KEYPHRASE_LOGS
            </h3>

            {/* History rows */}
            {history.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-light">
                No passwords generated in this session yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-900 bg-slate-950/80 hover:border-emerald-500/25 duration-150 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-mono text-white tracking-wider break-all pr-4 font-bold">
                        {item.password}
                      </p>
                      <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500">
                        <span>ENTROPY: <strong className="text-slate-400">{item.entropy} b</strong></span>
                        <span>•</span>
                        <span className="text-emerald-400 uppercase font-semibold">{item.strength}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(item.password)}
                      className="p-1 px-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-emerald-400 duration-150 flex items-center justify-center cursor-pointer"
                      title="Copy item password"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copy Prompt Success Notice with AnimatePresence */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 p-4 rounded-xl border border-emerald-400 bg-emerald-950 text-emerald-100 flex items-center gap-2 shadow-2xl z-55"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            <span className="font-mono text-xs font-semibold uppercase">CREDENTIAL_BUF_COPIED // SAFE</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
