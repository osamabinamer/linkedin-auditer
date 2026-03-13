"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FileUpload from "@/components/FileUpload";
import AnalysisResults from "@/components/AnalysisResults";

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (text: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error("Failed to analyze profile");
      }
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-6xl sm:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 font-sans">
              Career Auditor
            </h1>
          </motion.div>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
            Transform your LinkedIn profile into actionable insights with intelligent analysis
          </p>
        </motion.header>

        {!analysis && (
          <FileUpload
            onUpload={handleUpload}
            loading={loading}
            error={error}
          />
        )}

        {analysis && (
          <AnalysisResults
            analysis={analysis}
            onReset={() => setAnalysis(null)}
          />
        )}
      </div>
    </div>
  );
}
