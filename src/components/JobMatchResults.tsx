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
        <h3 className="text-xl font-bold text-slate-900 mb-6">Skills Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Skills Distribution */}
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={generateSkillDistribution(analysis.skillMatches)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #64748b",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-slate-600 mt-4 text-center">
              Distribution of skill proficiency levels in your profile
            </p>
          </div>

          {/* Proficiency Radar */}
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={generateProficiencyData(analysis.skillMatches)}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="name" stroke="#64748b" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
                <Radar
                  name="Your Proficiency"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #64748b",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-sm text-slate-600 mt-4 text-center">
              Your proficiency levels across key skills
            </p>
          </div>
        </div>
      </motion.div>

      {/* Importance Priority Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Skills by Importance</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateImportanceData(analysis.skillMatches)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="skill" type="category" stroke="#64748b" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #64748b",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              />
              <Legend />
              <Bar dataKey="proficiency" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
