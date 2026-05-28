/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CYBER_TIPS } from '../utils/security';
import { ShieldCheck, ArrowRight, ArrowLeft, Lightbulb, Shield, KeyRound, Users, Smartphone, ClipboardX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const iconsMap: { [key: string]: any } = {
  ShieldAlert: Shield,
  Smartphone: Smartphone,
  RefreshCw: Shield,
  KeyRound: KeyRound,
  Users: Users,
  ClipboardX: ClipboardX,
};

export default function CyberTipsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredTips = activeCategory === 'All' 
    ? CYBER_TIPS 
    : CYBER_TIPS.filter(t => t.category === activeCategory);

  useEffect(() => {
    // Reset index if filtered list changes and current index is out of bounds
    if (currentIndex >= filteredTips.length) {
      setCurrentIndex(0);
    }
  }, [activeCategory, filteredTips, currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (filteredTips.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % filteredTips.length);
      }
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [filteredTips]);

  const handleNext = () => {
    if (filteredTips.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % filteredTips.length);
    }
  };

  const handlePrev = () => {
    if (filteredTips.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + filteredTips.length) % filteredTips.length);
    }
  };

  const currentTip = filteredTips[currentIndex] || CYBER_TIPS[0];
  const IconComponent = iconsMap[currentTip.iconName] || Lightbulb;

  const categories = ['All', 'General', 'MFA', 'Personal', 'Advanced'];

  return (
    <div id="cyber-tips-panel" className="relative p-6 rounded-2xl border border-cyan-500/20 bg-slate-950/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-950/20">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-950">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="font-mono text-sm tracking-wider text-cyan-100 uppercase">
            SEC_ADVISORY // BRIEF_TRAINING
          </h3>
        </div>
        <span className="font-mono text-xs text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
          SYSTEM_BULLETIN
        </span>
      </div>

      {/* Categories Filter bar */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentIndex(0);
            }}
            className={`font-mono text-[10px] uppercase px-2 py-1 rounded transition-all duration-200 border ${
              activeCategory === cat
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active slide tip content with AnimatePresence */}
      <div className="min-h-[140px] flex flex-col justify-between relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentTip.id}-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 mt-1">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-white tracking-tight">
                    {currentTip.title}
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/10">
                    {currentTip.category}
                  </span>
                </div>
                <p className="font-sans text-sm text-slate-300 leading-relaxed font-light">
                  {currentTip.content}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer controls */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-950/50 select-none">
          <span className="font-mono text-[10px] text-cyan-600">
            PAGE {currentIndex + 1} OF {filteredTips.length || 1}
          </span>
          <div className="flex items-center gap-1.2">
            <button
              onClick={handlePrev}
              disabled={filteredTips.length <= 1}
              className="p-1 rounded bg-cyan-950/20 hover:bg-cyan-950/60 border border-cyan-950 hover:border-cyan-500/30 text-cyan-400 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={filteredTips.length <= 1}
              className="p-1 rounded bg-cyan-950/20 hover:bg-cyan-950/60 border border-cyan-950 hover:border-cyan-500/30 text-cyan-400 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
