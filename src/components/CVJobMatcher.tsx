"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface CVJobMatcherProps {
  onAnalyze: (cvText: string, jobDescription: string, mode: "profile" | "match") => void;
  loading: boolean;
  error: string;
}

export default function CVJobMatcher({ onAnalyze, loading, error }: CVJobMatcherProps) {
  const [mode, setMode] = useState<"profile" | "match">("profile");
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState<"cv" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract text from PDF using pdfjs-dist (browser-only)
  const extractTextFromPDF = async (file: File) => {
    try {
      console.log("Importing pdfjs-dist...");
      // @ts-ignore
      const pdfjsLib: any = await import("pdfjs-dist/legacy/build/pdf");

      // @ts-ignore
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      return text;
    } catch (error) {
      console.error("Error in extractTextFromPDF:", error);
      throw error;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging("cv");
  };

  const handleDragLeave = () => {
    setIsDragging(null);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        try {
          const text = await extractTextFromPDF(file);
          setCvText(text);
        } catch (error) {
          alert(`Error processing PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        try {
          const text = await extractTextFromPDF(file);
          setCvText(text);
        } catch (error) {
          alert(`Error processing PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
    }
  };

  const handleAnalyze = () => {
    if (mode === "profile" && !cvText.trim()) {
      alert("Please upload a CV/LinkedIn profile PDF");
      return;
    }
    if (mode === "match") {
      if (!cvText.trim() || !jobDescription.trim()) {
        alert("Please provide both CV and job description");
        return;
      }
    }
    onAnalyze(cvText, jobDescription, mode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Mode Toggle */}
      <div className="flex gap-4 justify-center">
        <motion.button
          onClick={() => setMode("profile")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            mode === "profile"
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Profile Analysis
        </motion.button>
        <motion.button
          onClick={() => setMode("match")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            mode === "match"
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Job Match Analysis
        </motion.button>
      </div>

      {/* CV Upload */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer p-8 ${
          isDragging === "cv"
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div
          className="text-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-3">📄</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Upload your CV/LinkedIn Profile
          </h3>
          <p className="text-slate-600">
            {cvText.length > 0
              ? `✓ PDF processed (${cvText.length} characters extracted)`
              : "Drag and drop your PDF here or click to select"}
          </p>
        </div>
      </motion.div>

      {/* Job Description Input (visible only in match mode) */}
      {mode === "match" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <label className="block text-sm font-semibold text-slate-900">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-40 p-4 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none resize-none text-slate-900 bg-white"
          />
          <p className="text-sm text-slate-600">
            {jobDescription.length} characters
          </p>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/* Analyze Button */}
      <motion.button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Analyzing...
          </span>
        ) : (
          `Analyze ${mode === "profile" ? "Profile" : "Job Match"}`
        )}
      </motion.button>
    </motion.div>
  );
}
