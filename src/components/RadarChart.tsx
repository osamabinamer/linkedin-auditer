"use client";

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";

interface Metric {
  name: string;
  value: number;
}

interface RadarChartProps {
  metrics: Metric[];
}

export default function RadarChart({ metrics }: RadarChartProps) {
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<number | null>(null);

  // Metric explanations and improvement suggestions
  const metricDetails: { [key: string]: { explanation: string; working: string; improvement: string } } = {
    "Headline Strength": {
      explanation: "Measures how compelling and keyword-rich your headline is at grabbing recruiters' attention.",
      working: "Your headline effectively communicates your professional value.",
      improvement: "Include 2-3 relevant keywords and specific role titles for better discoverability."
    },
    "SEO Keywords": {
      explanation: "Tracks how well your profile incorporates industry-specific keywords that help with search visibility.",
      working: "Your profile contains strong industry-relevant keywords.",
      improvement: "Add more niche keywords from your target job descriptions and industry specializations."
    },
    "Narrative Clarity": {
      explanation: "Evaluates how clearly you communicate your achievements and skills in your profile narrative.",
      working: "Your story is well-articulated and easy to follow.",
      improvement: "Use more specific metrics and quantifiable results (e.g., 'increased sales by 30%') in descriptions."
    },
    "Experience Depth": {
      explanation: "Assesses the detail and impact descriptions in your experience section.",
      working: "Your experience highlights are comprehensive and impactful.",
      improvement: "Add more context about challenges overcome and methodologies used in each role."
    },
    "Skills Showcase": {
      explanation: "Evaluates how well you present and organize your skills section for recruiter visibility.",
      working: "Your skills are well-organized and thoroughly listed.",
      improvement: "Prioritize top skills, add skill endorsements, and align them with job descriptions you target."
    }
  };

  const getStatusLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-600";
    if (score >= 60) return "from-blue-500 to-cyan-600";
    if (score >= 40) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  const CustomTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 rounded-lg border-2 border-blue-300 shadow-lg"
        >
          <p className="font-bold text-slate-900">{payload[0].payload.name}</p>
          <p className="text-blue-600 font-semibold">{payload[0].value}%</p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={450}>
        <RechartsRadar
          data={metrics}
          margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
        >
          <PolarGrid stroke="#e2e8f0" strokeDasharray="5 5" />
          <PolarAngleAxis 
            dataKey="name" 
            stroke="#64748b" 
            tick={{ fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            stroke="#cbd5e1"
            tick={{ fontSize: 11 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.5}
            isAnimationActive={true}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: "20px", fontSize: "14px", fontWeight: "600" }}
            formatter={(value) => <span style={{ color: "#334155" }}>{value}</span>}
          />
        </RechartsRadar>
      </ResponsiveContainer>
      
      {/* Interactive metric cards with detailed explanations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <div className="space-y-4">
          {metrics.map((metric, idx) => {
            const details = metricDetails[metric.name];
            const isExpanded = expandedMetric === idx;
            const statusLabel = getStatusLabel(metric.value);
            const statusColor = getStatusColor(metric.value);

            return (
              <motion.div
                key={idx}
                onClick={() => setExpandedMetric(isExpanded ? null : idx)}
                onHoverStart={() => setHoveredMetric(idx)}
                onHoverEnd={() => setHoveredMetric(null)}
                className="cursor-pointer"
                layout
              >
                <motion.div
                  className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                    isExpanded || hoveredMetric === idx
                      ? "border-blue-400 bg-blue-50 shadow-lg"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                  layout
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">{metric.name}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <motion.div
                          animate={{ scale: hoveredMetric === idx ? 1.2 : 1 }}
                          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500"
                        >
                          {metric.value}%
                        </motion.div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${statusColor} text-white inline-block mt-1`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.6 }}
                    className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className={`h-full bg-gradient-to-r ${statusColor} rounded-full`}
                    />
                  </motion.div>

                  {/* Expandable section */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={isExpanded ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-slate-300 space-y-4">
                      {/* What is this metric */}
                      <div>
                        <h5 className="text-sm font-bold text-slate-900 mb-2">📊 What This Metric Measures</h5>
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {details?.explanation}
                        </p>
                      </div>

                      {/* What's working */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                        <h5 className="text-sm font-bold text-green-900 mb-1">✅ What's Working</h5>
                        <p className="text-green-800 text-sm">
                          {metric.value >= 70 
                            ? details?.working 
                            : `You're on the right track. Focus on the improvements below to elevate this metric.`}
                        </p>
                      </div>

                      {/* Improvement suggestions */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
                        <h5 className="text-sm font-bold text-blue-900 mb-1">💡 How to Improve</h5>
                        <p className="text-blue-800 text-sm">
                          {details?.improvement}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expand indicator */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-slate-400 text-centre mt-2"
                  >
                    {!isExpanded && (
                      <p className="text-xs text-slate-500 text-center mt-2">Click to see details</p>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
