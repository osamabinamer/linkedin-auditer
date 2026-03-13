"use client";

import { motion } from "framer-motion";
import RadarChart from "./RadarChart";
import SuggestionCard from "./SuggestionCard";

interface Metric {
  name: string;
  value: number;
}

interface Suggestion {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
}

interface AnalysisResult {
  metrics: Metric[];
  suggestions: Suggestion[];
  overallScore: number;
  summary: string;
}

interface AnalysisResultsProps {
  analysis: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResults({
  analysis,
  onReset,
}: AnalysisResultsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div variants={itemVariants} className="mb-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-slate-900 font-sans">Your Analysis</h2>
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-900 font-semibold transition-all duration-300 shadow-lg font-sans"
          >
            Analyze Another
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 backdrop-blur-sm hover:border-blue-300 transition-all duration-300"
          >
            <div className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
              Overall Score
            </div>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {analysis.overallScore}<span className="text-3xl">%</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 backdrop-blur-sm"
          >
            <div className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
              Executive Summary
            </div>
            <p className="text-slate-800 text-base leading-relaxed font-medium">
              {analysis.summary}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-16">
        <h3 className="text-3xl font-bold mb-8 text-slate-900 font-sans">Professional Metrics</h3>
        <div className="bg-white rounded-2xl p-10 border border-slate-200 backdrop-blur-sm">
          {analysis.metrics && analysis.metrics.length > 0 ? (
            <RadarChart metrics={analysis.metrics} />
          ) : (
            <p className="text-slate-600 text-center py-8">No metrics available</p>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-3xl font-bold mb-8 text-slate-900 font-sans">Improvement Opportunities</h3>
        <div className="space-y-4">
          {analysis.suggestions && analysis.suggestions.length > 0 ? (
            analysis.suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SuggestionCard suggestion={suggestion} />
              </motion.div>
            ))
          ) : (
            <p className="text-slate-400">No suggestions available</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
