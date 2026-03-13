"use client";

import { motion } from "framer-motion";

interface SuggestionCardProps {
  suggestion: {
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    category: string;
  };
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const impactConfig = {
    high: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-300 hover:border-red-400",
      text: "text-red-700",
      badge: "bg-red-100 text-red-700",
      icon: "🔴",
    },
    medium: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100",
      border: "border-amber-300 hover:border-amber-400",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-700",
      icon: "🟡",
    },
    low: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-300 hover:border-green-400",
      text: "text-green-700",
      badge: "bg-green-100 text-green-700",
      icon: "🟢",
    },
  };

  const config = impactConfig[suggestion.impact];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${config.bg} ${config.border}`}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl mt-1">{config.icon}</div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-slate-900 mb-2 font-sans">
            {suggestion.title}
          </h4>
          <p className="text-slate-800 text-sm leading-relaxed font-medium">
            {suggestion.description}
          </p>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${config.badge}`}
            >
              {suggestion.impact.toUpperCase()}
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-300 text-slate-800">
              {suggestion.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
