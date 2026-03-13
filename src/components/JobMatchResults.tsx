"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";

interface SkillMatch {
  skill: string;
  proficiency: "expert" | "intermediate" | "beginner" | "missing";
  importance: "required" | "preferred" | "nice-to-have";
}

interface JobMatchAnalysis {
  overallMatch: number;
  summary: string;
  skillMatches: SkillMatch[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  fitScore: number;
  experienceGap: string;
}

interface JobMatchResultsProps {
  analysis: JobMatchAnalysis;
  onReset: () => void;
}

export default function JobMatchResults({ analysis, onReset }: JobMatchResultsProps) {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const getProficiencyColor = (prof: string) => {
    switch (prof) {
      case "expert":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "beginner":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "missing":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case "required":
        return "🎯";
      case "preferred":
        return "📌";
      case "nice-to-have":
        return "✨";
      default:
        return "•";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Overall Match Score */}
      <motion.div className="rounded-2xl bg-white shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Job Match Analysis</h2>
            <motion.div
              className="text-6xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {analysis.overallMatch}%
            </motion.div>
          </div>
          <p className="text-lg opacity-90 mb-4">{analysis.summary}</p>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${analysis.overallMatch}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Fit Score and Experience Gap */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-white shadow-lg p-6 border-l-4 border-emerald-500"
        >
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Fit Score
          </h3>
          <p className="text-4xl font-bold text-emerald-600 mb-2">
            {analysis.fitScore}%
          </p>
          <p className="text-slate-600">Based on skills, experience, and alignment</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-white shadow-lg p-6 border-l-4 border-amber-500"
        >
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Experience Gap
          </h3>
          <p className="text-xl font-semibold text-amber-600 mb-2">
            {analysis.experienceGap}
          </p>
          <p className="text-slate-600">Estimated gap vs. job requirements</p>
        </motion.div>
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white shadow-lg p-6 border-l-4 border-emerald-500"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            ✅ Your Strengths
          </h3>
          <div className="space-y-3">
            {analysis.strengths.map((strength, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900"
              >
                ✓ {strength}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weaknesses */}
      {analysis.weaknesses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white shadow-lg p-6 border-l-4 border-red-500"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            ⚠️ Areas for Improvement
          </h3>
          <div className="space-y-3">
            {analysis.weaknesses.map((weakness, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900"
              >
                ✗ {weakness}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Skill Match Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">📊 Your Skills vs Job Requirements</h3>
        <p className="text-sm text-slate-600 mb-4">Shows your proficiency level (blue) vs what the job requires (orange)</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={generateSkillComparisonData(analysis.skillMatches)}
              margin={{ top: 20, right: 80, bottom: 60, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="skill"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis domain={[0, 100]} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "2px solid #3b82f6",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length >= 2) {
                    const data = payload[0].payload;
                    const yourValue = payload[0].value as number;
                    const requiredValue = payload[1]?.value as number || data.required;
                    return (
                      <div className="p-3 bg-slate-900 rounded-lg border border-blue-500">
                        <p className="font-semibold text-blue-300">{data.skill}</p>
                        <p className="text-blue-200">Your Level: {yourValue}%</p>
                        <p className="text-orange-200">Required: {requiredValue}%</p>
                        <p className="text-green-300 text-xs mt-1">
                          {yourValue >= requiredValue ? "✓ Ready" : `✗ Gap: ${requiredValue - yourValue}%`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="yourLevel" fill="#3b82f6" name="Your Proficiency" radius={[8, 8, 0, 0]} />
              <Bar dataKey="required" fill="#f97316" name="Required Level" radius={[8, 8, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Priority Matrix - What to Focus On */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 shadow-lg p-8 border border-blue-100"
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">🎯 Smart Skill Learning Path</h3>
          <p className="text-sm text-slate-700 mb-3">
            Each bubble is a skill. Left side = most urgent to learn. Bigger bubbles = higher importance to the job.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background: "linear-gradient(135deg, #ef4444, #dc2626)"}}></div><span className="text-red-700 font-semibold">Critical Now</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background: "linear-gradient(135deg, #f59e0b, #d97706)"}}></div><span className="text-amber-700 font-semibold">High Priority</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background: "linear-gradient(135deg, #3b82f6, #1d4ed8)"}}></div><span className="text-blue-700 font-semibold">Medium</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background: "linear-gradient(135deg, #10b981, #059669)"}}></div><span className="text-green-700 font-semibold">You're Ready</span></div>
          </div>
        </div>
        <div className="h-[500px] relative bg-white rounded-xl p-4 border border-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 30, right: 30, bottom: 80, left: 100 }}>
              <CartesianGrid strokeDasharray="5 5" stroke="#cbd5e1" vertical={true} horizontal={true} />
              
              <XAxis
                dataKey="gap"
                name="What to Learn"
                unit="%"
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                label={{ value: "Skill Gap: How much you need to learn (%) →", position: "bottom", offset: 25, fontSize: 12, fontWeight: "bold" }}
                stroke="#64748b"
              />
              <YAxis
                dataKey="importance"
                name="How Critical"
                unit="%"
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                label={{ value: "How Critical to Job: Importance (%)", angle: -90, position: "insideLeft", offset: 20, fontSize: 12, fontWeight: "bold" }}
                stroke="#64748b"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "3px solid #3b82f6",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  padding: "12px",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                }}
                cursor={{ fill: "rgba(59, 130, 246, 0.15)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload as any;
                    const priorityColor =
                      data.gap <= 20
                        ? "text-green-300"
                        : data.gap <= 50
                          ? "text-blue-300"
                          : data.gap <= 75
                            ? "text-yellow-300"
                            : "text-red-300";
                    return (
                      <div className="space-y-2">
                        <p className="font-bold text-lg text-blue-300">{data.name}</p>
                        <div className="border-t border-slate-500 pt-2">
                          <p className="text-slate-300">Importance: <span className="font-bold text-amber-300">{data.importance}%</span></p>
                          <p className="text-slate-300">Your Gap: <span className={`font-bold ${priorityColor}`}>{data.gap}%</span></p>
                        </div>
                        <div className="border-t border-slate-500 pt-2">
                          <p className="text-xs text-slate-200 italic">{data.recommendation}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* Data points with dynamic colors */}
              <Scatter name="Skills" data={getPriorityMatrixWithColors(analysis)}>
                {getPriorityMatrixWithColors(analysis).map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.gap <= 20
                        ? "#10b981"
                        : entry.gap <= 50
                          ? "#3b82f6"
                          : entry.gap <= 75
                            ? "#f59e0b"
                            : "#ef4444"
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Guide */}
        <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="font-bold text-red-900 mb-1">🔴 Critical Now (Gap 75%+)</p>
            <p className="text-red-800">Start learning these immediately. They're essential for the role and you're far behind.</p>
          </div>
          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
            <p className="font-bold text-amber-900 mb-1">🟡 High Priority (Gap 50-74%)</p>
            <p className="text-amber-800">Focus on these next. The job really needs these, and you're somewhat prepared.</p>
          </div>
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <p className="font-bold text-blue-900 mb-1\">🔵 Medium (Gap 20-49%)</p>
            <p className="text-blue-800">Good foundation. Build on your existing knowledge with targeted learning.</p>
          </div>
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="font-bold text-green-900 mb-1\">✅ Ready (Gap 0-19%)</p>
            <p className="text-green-800">You're well-prepared. Maintain and deepen expertise through practice.</p>
          </div>
        </div>
      </motion.div>

      {/* Gap Analysis Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">🔥 Skills Gap Heat Map</h3>
        <p className="text-sm text-slate-600 mb-4">Red = Large gap, Green = You're ready. Sorted by need</p>
        <div className="space-y-2">
          {generateGapAnalysisData(analysis.skillMatches).map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group cursor-pointer"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all">
                <div className="w-24 font-semibold text-sm text-slate-700 truncate">
                  {item.skill.slice(0, 14)}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-8 rounded-lg overflow-hidden bg-gradient-to-r border-2 border-slate-200 group-hover:border-slate-400 transition-all"
                    style={{
                      background: `linear-gradient(90deg, 
                        ${item.gap <= 20 ? "#10b981" : item.gap <= 50 ? "#3b82f6" : item.gap <= 75 ? "#f59e0b" : "#ef4444"}
                        0%,
                        ${item.gap <= 20 ? "#059669" : item.gap <= 50 ? "#1d4ed8" : item.gap <= 75 ? "#d97706" : "#dc2626"}
                        100%)`,
                    }}
                  >
                    <motion.div
                      className="h-full bg-white/20"
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - item.gap}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-sm font-bold text-slate-900">{item.gap}%</span>
                  </div>
                  <span className="text-lg">
                    {item.gap === 0 ? "✅" : item.gap <= 30 ? "⚠️" : item.gap <= 70 ? "🎯" : "❌"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skill Matches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-4">Skills Analysis</h3>
        <div className="space-y-3">
          {analysis.skillMatches.map((skill, idx) => (
            <motion.div
              key={idx}
              onClick={() =>
                setExpandedSkill(expandedSkill === skill.skill ? null : skill.skill)
              }
              className="cursor-pointer"
            >
              <div
                className={`p-4 rounded-lg border-2 transition-colors ${getProficiencyColor(
                  skill.proficiency
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl">
                      {getImportanceLabel(skill.importance)}
                    </span>
                    <div>
                      <p className="font-semibold">{skill.skill}</p>
                      <p className="text-sm opacity-75">
                        {skill.importance === "required" && "Required"}
                        {skill.importance === "preferred" && "Preferred"}
                        {skill.importance === "nice-to-have" && "Nice to have"}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold capitalize">{skill.proficiency}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Missing Skills */}
      {analysis.missingSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white shadow-lg p-6 border-l-4 border-orange-500"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills.map((skill, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-4 py-2 rounded-full bg-orange-100 text-orange-800 border border-orange-300 text-sm font-medium"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-lg border-l-4 bg-slate-50"
                style={{
                  borderColor:
                    rec.priority === "high"
                      ? "#ef4444"
                      : rec.priority === "medium"
                        ? "#f59e0b"
                        : "#6b7280",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">
                    {rec.priority === "high" ? "🔴" : rec.priority === "medium" ? "🟡" : "🟢"}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{rec.title}</p>
                    <p className="text-slate-700 text-sm mt-1">{rec.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reset Button */}
      <motion.button
        onClick={onReset}
        className="w-full py-4 rounded-lg bg-slate-200 text-slate-900 font-semibold text-lg hover:bg-slate-300 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Analyze Another
      </motion.button>
    </motion.div>
  );
}

// Helper functions to prepare data for charts
function generateSkillComparisonData(skillMatches: SkillMatch[]) {
  const proficiencyMap = {
    expert: 100,
    intermediate: 75,
    beginner: 40,
    missing: 0,
  };

  const importanceMap = {
    required: 90,
    preferred: 70,
    "nice-to-have": 40,
  };

  return skillMatches.slice(0, 8).map((skill) => ({
    skill: skill.skill.slice(0, 12),
    yourLevel: proficiencyMap[skill.proficiency],
    required: importanceMap[skill.importance],
  }));
}

function generatePriorityMatrixData(analysis: JobMatchAnalysis) {
  const proficiencyMap = {
    expert: 100,
    intermediate: 75,
    beginner: 40,
    missing: 0,
  };

  const importanceMap = {
    required: 95,
    preferred: 70,
    "nice-to-have": 40,
  };

  return analysis.skillMatches.slice(0, 12).map((skill) => {
    const yourLevel = proficiencyMap[skill.proficiency];
    const required = importanceMap[skill.importance];
    const gap = Math.max(0, required - yourLevel);
    const importance = importanceMap[skill.importance];

    let recommendation = "";
    if (gap <= 20) {
      recommendation = "✓ Ready to go";
    } else if (importance >= 90) {
      recommendation = "🔴 Critical - Start now";
    } else if (gap >= 60) {
      recommendation = "⚠️ Significant effort needed";
    } else {
      recommendation = "📌 Medium priority";
    }

    return {
      name: skill.skill,
      gap: gap,
      importance: importance,
      x: gap,
      y: importance,
      recommendation,
    };
  });
}

function getPriorityMatrixWithColors(analysis: JobMatchAnalysis) {
  return generatePriorityMatrixData(analysis).map((item) => ({
    ...item,
    size: item.importance / 5,
  }));
}

function generateSkillCategoryBreakdown(skillMatches: SkillMatch[]) {
  const proficiencyMap = {
    expert: 100,
    intermediate: 75,
    beginner: 40,
    missing: 0,
  };

  const categories = ["Technical", "Languages", "Soft Skills", "Tools"];
  const result = categories.map((cat) => {
    const categorySkills = skillMatches.filter((s) =>
      s.skill.toLowerCase().includes(cat.toLowerCase())
    );

    if (categorySkills.length === 0) {
      return {
        category: cat,
        proficiency: 0,
        count: 0,
      };
    }

    const avgProficiency = Math.round(
      categorySkills.reduce((sum, skill) => sum + proficiencyMap[skill.proficiency], 0) /
        categorySkills.length
    );

    return {
      category: cat,
      proficiency: avgProficiency,
      count: categorySkills.length,
    };
  });

  return result.filter((r) => r.count > 0);
}

function generateGapAnalysisData(skillMatches: SkillMatch[]) {
  const proficiencyMap = {
    expert: 100,
    intermediate: 75,
    beginner: 40,
    missing: 0,
  };

  const importanceMap = {
    required: 90,
    preferred: 70,
    "nice-to-have": 40,
  };

  return skillMatches
    .map((skill) => ({
      skill: skill.skill,
      yourLevel: proficiencyMap[skill.proficiency],
      required: importanceMap[skill.importance],
      gap: Math.max(0, importanceMap[skill.importance] - proficiencyMap[skill.proficiency]),
      importance: skill.importance,
    }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 10);
}

function generateSkillDistribution(skillMatches: SkillMatch[]) {
  const distribution = {
    expert: 0,
    intermediate: 0,
    beginner: 0,
    missing: 0,
  };

  skillMatches.forEach((skill) => {
    distribution[skill.proficiency as keyof typeof distribution]++;
  });

  return [
    { category: "Expert", count: distribution.expert, fill: "#10b981" },
    { category: "Intermediate", count: distribution.intermediate, fill: "#3b82f6" },
    { category: "Beginner", count: distribution.beginner, fill: "#f59e0b" },
    { category: "Missing", count: distribution.missing, fill: "#ef4444" },
  ];
}

function generateProficiencyData(skillMatches: SkillMatch[]) {
  const proficiencyMap = {
    expert: 100,
    intermediate: 75,
    beginner: 40,
    missing: 0,
  };

  return skillMatches.slice(0, 6).map((skill) => ({
    name: skill.skill.slice(0, 10),
    value: proficiencyMap[skill.proficiency as keyof typeof proficiencyMap],
  }));
}

function generateImportanceData(skillMatches: SkillMatch[]) {
  const proficiencyScore = {
    expert: 100,
    intermediate: 75,
    beginner: 40,
    missing: 10,
  };

  return skillMatches.slice(0, 8).map((skill) => ({
    skill: skill.skill.slice(0, 15),
    proficiency: proficiencyScore[skill.proficiency as keyof typeof proficiencyScore],
    importance: skill.importance,
  }));
}
