/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, Cell 
} from 'recharts';
import { 
  Activity, ShieldAlert, Award, Clock, Database, BarChart3, 
  Trash2, ShieldCheck, Terminal, AlertTriangle, Zap, Download, RefreshCw 
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnalyzedLog, StrengthLevel } from '../types';

interface DashboardPageProps {
  logs: AnalyzedLog[];
  onClearLogs: () => void;
  isLightTheme: boolean;
}

export default function DashboardPage({ logs, onClearLogs, isLightTheme }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'realtime' | 'sim' | 'benchmark'>('realtime');
  const [secMetric, setSecMetric] = useState<number>(3); // simulated active GPU hashes

  const totalAnalyzed = logs.length;
  const averageScore = logs.length > 0 
    ? Math.round(logs.reduce((sum, item) => sum + item.score, 0) / logs.length) 
    : 0;

  // Derive counts for weakness indices
  let shortCount = 0;
  let dictCount = 0;
  let sequentialCount = 0;
  let repeatCount = 0;
  let keyboardCount = 0;

  logs.forEach(log => {
    if (log.length < 12) shortCount++;
    if (log.score < 40) dictCount++; // simplified heuristic
    if (log.vulnerabilitiesFound > 3) repeatCount++;
    if (log.entropy < 45) keyboardCount++;
    if (log.maskedPassword.includes('*') && log.score < 60) sequentialCount++;
  });

  // Provide realistic demo values if there are no logs yet to make sure the charts look stunning
  const displayLogs = totalAnalyzed > 0 ? logs : [
    { id: '1', timestamp: '2026-05-28 05:01:21', maskedPassword: 'p*********d', length: 11, score: 28, strength: 'Weak' as StrengthLevel, entropy: 32.1, vulnerabilitiesFound: 4 },
    { id: '2', timestamp: '2026-05-28 05:02:10', maskedPassword: 'S***********n', length: 13, score: 72, strength: 'Strong' as StrengthLevel, entropy: 68.4, vulnerabilitiesFound: 1 },
    { id: '3', timestamp: '2026-05-28 05:03:02', maskedPassword: 'c****************e', length: 18, score: 95, strength: 'Very Strong' as StrengthLevel, entropy: 104.2, vulnerabilitiesFound: 0 },
    { id: '4', timestamp: '2026-05-28 05:04:15', maskedPassword: '1****6', length: 6, score: 5, strength: 'Very Weak' as StrengthLevel, entropy: 18.0, vulnerabilitiesFound: 5 },
  ];

  const chartData = [
    { name: 'Short Length', count: totalAnalyzed > 0 ? shortCount : 3 },
    { name: 'Dictionary risk', count: totalAnalyzed > 0 ? dictCount : 2 },
    { name: 'Low Entropy', count: totalAnalyzed > 0 ? keyboardCount : 2 },
    { name: 'Pattern Triggers', count: totalAnalyzed > 0 ? sequentialCount : 1 },
  ];

  // Cracking time benchmarking comparison data (GPU guessing simulation curve)
  const crackTimeBenchmark = [
    { length: '6 chars', time: 0.1, label: 'Instant' },
    { length: '8 chars', time: 5, label: '5s' },
    { length: '10 chars', time: 420, label: '7m' },
    { length: '12 chars', time: 345600, label: '4 days' },
    { length: '14 chars', time: 25920000, label: '300 days' },
    { length: '16 chars', time: 1814400000, label: '57 years' },
  ];

  const getLogBadge = (str: StrengthLevel) => {
    switch (str) {
      case 'Very Weak': return 'text-rose-400 bg-rose-950/40 border-rose-500/20';
      case 'Weak': return 'text-amber-400 bg-amber-950/40 border-amber-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-905/10 border-yellow-500/15';
      case 'Strong': return 'text-emerald-500 bg-emerald-950/20 border-emerald-500/30';
      case 'Very Strong': return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30 font-bold neon-text';
      default: return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div id="dashboard-container" className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400 animate-pulse" />
            CYBERSECURITY_ANALYTICS_DASHBOARD
          </h2>
          <p className="text-slate-400 text-xs font-mono tracking-wide uppercase mt-1">
            LOCAL SECURITY TELEMETRY // INTELLIGENCE DATABASE METRICS
          </p>
        </div>

        {totalAnalyzed > 0 && (
          <button
            onClick={onClearLogs}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 rounded-xl border border-rose-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            WIPE TEMPORARY DATABASE
          </button>
        )}
      </div>

      {/* Cyber Security Metrics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Total Audited */}
        <div className="p-5 rounded-2xl glass relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl" />
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">
              DEVICES_AUDITED_INDEX
            </span>
            <Database className="w-4 h-4 text-emerald-450" />
          </div>
          <p className="text-3xl font-mono font-bold text-white tracking-tight leading-none">
            {totalAnalyzed}
          </p>
          <p className="text-[10px] text-slate-500 mt-2">
            Active session queries audited in RAM.
          </p>
        </div>

        {/* Card 2: Average Score */}
        <div className="p-5 rounded-2xl glass relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl" />
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">
              AVG_INTEGRITY_INDEX
            </span>
            <Award className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-3xl font-mono font-bold text-white tracking-tight leading-none">
            {averageScore || '--'}
            <span className="text-xs text-slate-500">/100</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-2">
            Session credentials strength rating.
          </p>
        </div>

        {/* Card 3: Vulnerabilities Identifed */}
        <div className="p-5 rounded-2xl glass relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full filter blur-xl" />
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">
              CRITICAL_THREAT_DETECTIONS
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-mono font-bold text-white tracking-tight leading-none">
            {logs.reduce((tot, l) => tot + l.vulnerabilitiesFound, 0)}
          </p>
          <p className="text-[10px] text-slate-500 mt-2">
            Identified pattern sequence leaks.
          </p>
        </div>

        {/* Card 4: Hardware Mitigation Recommendation */}
        <div className="p-5 rounded-2xl glass relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full filter blur-xl" />
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">
              SUGGESTED_MITIGATION_LEVEL
            </span>
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-sm font-sans font-semibold text-white tracking-tight leading-tight">
            Enable MFA Tokens
          </p>
          <p className="text-[10px] text-slate-500 mt-3.5">
            Mandatory layer for weak scores.
          </p>
        </div>
      </div>

      {/* Charts Block Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Weaknesses indicators (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="font-mono text-xs tracking-wider text-emerald-450 uppercase">
              SESSION VULNERABILITY VECTORS
            </h3>
            {totalAnalyzed === 0 && (
              <span className="font-mono text-[8px] text-amber-500 uppercase px-1.5 py-0.5 rounded bg-amber-500/10 tracking-widest animate-pulse">
                SHOWING TYPICAL DEMO VALUES
              </span>
            )}
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  axisLine={false} 
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  allowDecimals={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(9, 15, 30, 0.9)', 
                    borderColor: 'rgba(16, 185, 129, 0.2)',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="count" fill="rgba(16, 185, 129, 0.6)">
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.count > 1 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.65)'} // highlight red if multiple
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Attack GPU simulation (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="font-mono text-xs tracking-wider text-slate-400 uppercase">
              LENGTH VS ENTROPY BENCHMARK CURVE
            </h3>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crackTimeBenchmark} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="length" 
                  stroke="rgba(255,255,255,0.2)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.1)" 
                  tick={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: 'rgba(239, 68, 68, 0.3)', 
                    fontSize: '11px',
                    fontFamily: 'sans-serif'
                  }}
                  formatter={(value, name, props) => [`${props.payload.label}`, 'Crack Duration']}
                />
                <Area type="monotone" dataKey="time" stroke="#ef4444" fillOpacity={1} fill="url(#colorTime)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="font-mono text-[9px] text-slate-500 leading-normal">
            *Offline computational brute-force resistance increases key complexity exponentially rather than linearly. Keep passwords longer than 12 characters.
          </p>
        </div>
      </div>

      {/* Cyber Audit Registry / History Grid */}
      <div className="p-6 rounded-2xl glass space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-900">
          <h3 className="font-mono text-xs tracking-wider text-emerald-400 uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-450 animate-pulse" />
            VULNERABILITY_AUDIT_LOG_JOURNAL
          </h3>
          <span className="font-mono text-[10px] text-slate-500 uppercase">
            RAM_VOLATILE // SECURE_LOGGED
          </span>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 pb-2">
                <th className="py-3 px-2">TIMESTAMP</th>
                <th className="py-3 px-2">MASKED_CREDENTIAL</th>
                <th className="py-3 px-2 text-center">LENGTH</th>
                <th className="py-3 px-2 text-center">SCORE</th>
                <th className="py-3 px-2 text-center">ENTROPY</th>
                <th className="py-3 px-2 text-center">VULNERABILITIES</th>
                <th className="py-3 px-3 text-right">RATING</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/45">
              {displayLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/20 transition-all">
                  <td className="py-3.5 px-2 text-slate-500">{log.timestamp}</td>
                  <td className="py-3.5 px-2 font-mono text-white tracking-widest">{log.maskedPassword}</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">{log.length}</td>
                  <td className="py-3.5 px-2 text-center font-bold text-white">{log.score}</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">{log.entropy} b</td>
                  <td className="py-3.5 px-2 text-center">
                    <span className={log.vulnerabilitiesFound > 0 ? 'text-amber-500 font-semibold' : 'text-emerald-400'}>
                      {log.vulnerabilitiesFound} found
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`inline-block font-mono text-[9px] uppercase px-2 py-0.5 rounded border ${getLogBadge(log.strength)}`}>
                      {log.strength}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
