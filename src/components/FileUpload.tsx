"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface FileUploadProps {
  onUpload: (text: string) => void;
  loading: boolean;
  error: string;
}

export default function FileUpload({ onUpload, loading, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Helper to extract text from PDF using pdfjs-dist (browser-only)
  const extractTextFromPDF = async (file: File) => {
    // Dynamically import only in the browser
    // @ts-ignore
    const pdfjsLib: any = await import("pdfjs-dist/legacy/build/pdf");
    // Use CDN worker for browser compatibility
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.5.207/pdf.worker.min.js";

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        const text = await extractTextFromPDF(file);
        onUpload(text);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        const text = await extractTextFromPDF(file);
        onUpload(text);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="w-full"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 p-16 text-center cursor-pointer backdrop-blur-sm ${
          isDragging
            ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 scale-105"
            : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <motion.div
          animate={isDragging ? { scale: 1.08, y: -8 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <motion.div
            animate={{ y: isDragging ? -8 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              className="mx-auto h-24 w-24 text-blue-600 mb-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Modern file icon with upload arrow */}
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-4" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
          </motion.div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-sans">
              Upload Your Profile
            </h3>
            <p className="text-slate-700 text-base font-medium">
              Drag your LinkedIn PDF here or click to select
            </p>
          </div>

          <motion.button
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
            whileHover={!loading ? { scale: 1.05, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`mx-auto mt-8 px-10 py-3.5 rounded-full font-semibold transition-all duration-300 ${
              loading
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Analyzing...
              </span>
            ) : (
              "Select PDF"
            )}
          </motion.button>
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
