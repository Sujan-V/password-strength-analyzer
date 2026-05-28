/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Key, Database, AlertCircle, Play, ArrowRight, Activity, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { PageId } from '../types';

interface LandingPageProps {
  setPage: (page: PageId) => void;
  isLightTheme: boolean;
}

export default function LandingPage({ setPage, isLightTheme }: LandingPageProps) {
  // Container staggered animations
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const threatStats = [
    { label: 'GLOBAL CREDENTIAL LEAKS INDEX', value: '14.8B+', icon: Database, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { label: 'BRUTE FORCE GPU HASHRATE SPEED', value: '350B/sec', icon: Activity, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { label: 'AVG MEMORY CRACK TIME VULNERABLE', value: '< 2.4 sec', icon: AlertCircle, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  ];

  return (
    <div id="landing-container" className="relative space-y-12 py-6">
      {/* Hero Header Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono text-xs uppercase mb-2 animate-pulse tracking-wide"
        >
          <Shield className="w-4 h-4" />
          NIST 800-63B ALIGNED SECURE CHECKER
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-white leading-tight"
        >
          Is Your Password Truly <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 font-semibold drop-shadow-[0_2px_15px_rgba(16,185,129,0.2)]">
            Brute-Force Resistant?
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed font-light"
        >
          Most passwords can be cracked in seconds under advanced GPU-accelerated hashing arrays. 
          Audit your entropy score, analyze keyboard slide tracks, and detect weak sequences instantly.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => setPage('analyzer')}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-xl bg-emerald-500 text-slate-950 font-sans font-bold text-sm tracking-wide cursor-pointer overflow-hidden transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            INITIATE SCANNER
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => setPage('generator')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-xl bg-slate-900 border border-emerald-500/35 text-emerald-400 hover:text-white hover:border-emerald-400 hover:bg-slate-900/60 transition-all duration-300 font-sans font-bold text-sm tracking-wide cursor-pointer"
          >
            <Key className="w-4 h-4" />
            PASSWORD GENERATOR
          </button>
        </motion.div>
      </section>

      {/* Cyber threat monitoring terminal stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {threatStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="p-5 rounded-xl border flex items-center gap-4 glass hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300"
            >
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">
                  {stat.label}
                </p>
                <p className="font-mono text-xl md:text-2xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Dashboard Feature Preview Cards */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <h2 className="font-mono text-xs tracking-widest text-emerald-500 text-center uppercase">
          CRYPTOSHIELD_CORES // DETAILED NEURAL CAPABILITIES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="p-6 rounded-2xl glass hover:border-emerald-500/40 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          >
            <div className="p-3 w-fit rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 mb-4 transition-transform group-hover:scale-105">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-semibold text-white text-lg mb-2">
              Real-Time Leak Analysis
            </h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Scan password metrics concurrently as you enter characters. The engine evaluates Shannon entropy values and filters standard database benchmarks.
            </p>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="p-6 rounded-2xl glass hover:border-emerald-500/40 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          >
            <div className="p-3 w-fit rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-4 transition-transform group-hover:scale-105">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="font-sans font-semibold text-white text-lg mb-2">
              Multi-Attack Model Simulator
            </h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Verify how your secrets hold up against automated offline GPU hash rigs, multi-dictionary setups, and basic online rate-limiting firewalls.
            </p>
          </motion.div>

          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="p-6 rounded-2xl glass hover:border-emerald-500/40 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          >
            <div className="p-3 w-fit rounded-lg bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 mb-4 transition-transform group-hover:scale-105">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-semibold text-white text-lg mb-2">
              Secure Entropy Generator
            </h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Construct raw, random string streams of tailored length using cryptographic shufflers to eliminate pattern bias.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cyber Trust Disclaimer Box */}
      <section className="p-6 rounded-2xl border border-emerald-500/10 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-center">
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-400/20 text-emerald-400 text-center animate-pulse">
          <Shield className="w-8 h-8 mx-auto" />
        </div>
        <div className="space-y-1.5 flex-grow text-center md:text-left">
          <h4 className="font-mono text-xs font-semibold tracking-wider text-emerald-355 uppercase">
            PRIVACY GUARANTEE (LOCAL SANDBOXED MODE ENFORCED)
          </h4>
          <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
            All algorithms, checks, and password scans operate exclusively client-side in your local browser sandbox. No characters, substrings, or metadata are ever transmitted, logged, or uploaded to any remote server. Zero trackers, perfect cryptographic containment.
          </p>
        </div>
      </section>
    </div>
  );
}
