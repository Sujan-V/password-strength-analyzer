/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, HelpCircle, Shield, Key, Terminal, Brain, ArrowUpRight } from 'lucide-react';
import CyberTipsSlider from '../components/CyberTipsSlider';
import { motion } from 'motion/react';

export default function AboutPage() {
  return (
    <div id="about-container" className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-sans font-semibold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          CRYPTOGRAPHIC_EDUCATION_CENTRE
        </h2>
        <p className="text-slate-400 text-xs font-mono tracking-wide uppercase mt-1">
          UNDERSTANDING ENTROPY CALCULATIONS // NIST SECURITY CRITERIA
        </p>
      </div>

      {/* Cyber training slider component integration */}
      <CyberTipsSlider />

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Card: Mathematical Entropy */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/45 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900 text-cyan-400">
            <Brain className="w-5 h-5" />
            <h3 className="font-sans font-semibold text-white text-md">
              The Mathematics of Password Entropy
            </h3>
          </div>

          <p className="font-sans text-sm text-slate-300 leading-relaxed font-light">
            Password strength is measured scientifically using <strong>Information Entropy (Bits)</strong>. 
            This value represents the difficulty an attacker faces when attempting to guess a secret password 
            using pure randomized search logic.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 font-mono text-xs text-white space-y-2">
            <p className="text-cyan-400 font-semibold uppercase text-[10px]">
              INFORMATION ENTROPY FORMULA [SHANNON]:
            </p>
            <p className="text-base text-center py-2 text-white">
              H = L × log<sub>2</sub>(R)
            </p>
            <div className="border-t border-slate-800/80 pt-2 text-slate-400 text-[10px] space-y-1">
              <p>• <strong>H</strong> = Entropy value in bits</p>
              <p>• <strong>L</strong> = Number of characters in the password (Length)</p>
              <p>• <strong>R</strong> = Pool size of character dictionary set (Diversity)</p>
            </div>
          </div>

          <p className="font-sans text-xs text-slate-400 font-light">
            An entropy of <strong>50 bits</strong> is weak and highly vulnerable to offline crackers. 
            An entropy above <strong>80-92 bits</strong> represents a strong threshold, 
            which is mathematically uncrackable using modern supercomputers.
          </p>
        </div>

        {/* Right Card: How crackers operate */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/45 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900 text-rose-400">
            <Terminal className="w-5 h-5 animate-pulse" />
            <h3 className="font-sans font-semibold text-white text-md">
              How Hacker Cracking Pipelines Function
            </h3>
          </div>

          <p className="font-sans text-sm text-slate-300 leading-relaxed font-light">
            Experienced attackers rarely conduct password guessing manually. They utilize massive high-speed offline 
            GPU computational hashing rigs that try billions of combinations per second.
          </p>

          <div className="space-y-4.5 text-xs">
            {/* Step 1 */}
            <div className="flex gap-3">
              <span className="font-mono text-rose-500 font-bold">01 /</span>
              <div className="space-y-0.5">
                <p className="font-sans font-semibold text-white">Dictionary / Rainbow List Lookup</p>
                <p className="text-slate-400 font-light">
                  Attackers query exposed credentials directly from historical breaches (Credential Stuffing). 
                  Common words like "football" or "admin123" are bypassable instantly.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <span className="font-mono text-rose-500 font-bold">02 /</span>
              <div className="space-y-0.5">
                <p className="font-sans font-semibold text-white">Rule-Based Leet Substitutions</p>
                <p className="text-slate-400 font-light">
                  Standard dictionaries perform substitutions using rules (e.g. replacing 's' with '$' or 'e' with '3'). 
                  Thus, "P@ssw0rd1" offers zero tangible security.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <span className="font-mono text-rose-500 font-bold">03 /</span>
              <div className="space-y-0.5">
                <p className="font-sans font-semibold text-white">Brute-Force Search Grid</p>
                <p className="text-slate-400 font-light">
                  Attackers programmatically test combinations in ascendending length order (aaaa, aaab...). 
                  Short passwords under 8 characters vanish under this grid immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final standard defenses recommendation card */}
      <div className="p-6 rounded-2xl border border-cyan-500/15 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 flex flex-col md:flex-row gap-6 items-center">
        <div className="p-4 rounded-xl bg-cyan-950/80 border border-cyan-400/20 text-cyan-400">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 flex-grow">
          <h4 className="font-sans font-semibold text-white text-sm">
            Core NIST 800-63B Recommendations
          </h4>
          <p className="font-sans text-xs text-slate-300 leading-relaxed font-light">
            Modern cybersecurity standard advises choosing long, easily remembered passphrases without needing complex, 
            artificial substitutions. Always enable hardware token-based multi-factor authentication, recycle nothing, 
            and rely on heavily audited password managers to organize your secret records.
          </p>
        </div>
      </div>
    </div>
  );
}
