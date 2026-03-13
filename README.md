# LinkedIn Career Auditor

A high-fidelity AI-powered career auditor that transforms static LinkedIn profiles into dynamic, actionable insights through a minimalist and fluid interface.

🚀 **Live on Vercel**: [linkedin-auditer.vercel.app](https://linkedin-auditer.vercel.app)

## Features

- 📄 **PDF Upload**: Drag-and-drop or select your LinkedIn profile PDF export
- 🎯 **Two Analysis Modes**:
  - **Profile Analysis**: AI-powered audit of your LinkedIn profile with optimization suggestions
  - **Job Match Analysis**: Compare your CV against job descriptions to see compatibility
- 🤖 **AI-Powered Analysis**: Intelligent insights using Groq LLM integration
- 📊 **Interactive Visualizations**: 
  - Radar charts for profile metrics
  - Skill match comparisons with proficiency levels
  - Overall fit scoring against jobs
- 💡 **Actionable Recommendations**: 
  - Career development suggestions for profile optimization
  - Specific skill gaps for job applications with priority levels
- ✨ **Fluid Animations**: Beautiful, responsive UI with Framer Motion
- 📊 **Detailed Metrics**:
  - Profile: Headline strength, SEO keywords, narrative clarity, experience depth, skills showcase
  - Job Match: Overall match percentage, fit score, experience gap analysis

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **PDF Parsing**: pdf-parse + pdfjs-dist
- **LLM Integration**: Groq SDK with Mixtral 8x7B
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ (v24.14.0+ recommended)
- npm or yarn
- Groq API Key (get one at [console.groq.com](https://console.groq.com))

## Installation

1. **Navigate to the project directory**:
   ```bash
   cd linkedin-auditor
   ```

2. **Install dependencies** (already done if you ran `npm install`):
   ```bash
   npm install
   ```

3. **Configure API Keys**:
   - Copy `.env.local.example` to `.env.local`:
     ```bash
     cp .env.local.example .env.local
     ```
   - Add your Groq API key:
     ```
     GROQ_API_KEY=your_groq_api_key_here
     ```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

```bash
npm run build
npm run start
```

## How to Use

### Profile Analysis
1. **Get Your LinkedIn PDF**: Export your LinkedIn profile as a PDF
2. **Select "Profile Analysis" Mode**: Choose this option to audit your profile
3. **Upload**: Drag and drop the PDF onto the interface or click to select
4. **Analyze**: The AI processes your profile and generates insights
5. **Review**: See your professional metrics and improvement suggestions
6. **Improve**: Follow targeted recommendations to enhance your profile

### Job Match Analysis
1. **Upload Your CV/Profile**: Provide your LinkedIn profile PDF or CV
2. **Select "Job Match Analysis" Mode**: Choose to compare against a job posting
3. **Paste Job Description**: Add the job description you're interested in
4. **Analyze**: The AI compares your background with job requirements
5. **Review Results**: 
   - Overall match percentage
   - Skill alignment analysis
   - Missing skills and gaps
   - Priorities for preparation
6. **Prepare**: Use recommendations to fill skill gaps and strengthen your candidacy

## API Routes

### POST `/api/analyze`

Analyzes a LinkedIn profile PDF or performs job matching.

**Request Body**:
```json
{
  "text": "extracted CV/profile text",
  "jobDescription": "job posting text (optional, for job match mode)",
  "mode": "profile|match"
}
```

**Profile Analysis Response**:
```json
{
  "overallScore": 75,
  "summary": "Your profile demonstrates strong experience...",
  "metrics": [
    {"name": "Headline Strength", "value": 85},
    {"name": "SEO Keywords", "value": 72}
  ],
  "suggestions": [
    {
      "title": "Optimize Headline Keywords",
      "description": "Include 2-3 key skills...",
      "impact": "high",
      "category": "Visibility"
    }
  ]
}
```

**Job Match Analysis Response**:
```json
{
  "overallMatch": 78,
  "summary": "Your profile has a 78% match with this job posting...",
  "skillMatches": [
    {"skill": "React", "proficiency": "expert", "importance": "required"},
    {"skill": "Node.js", "proficiency": "missing", "importance": "required"}
  ],
  "missingSkills": ["Node.js", "TypeScript"],
  "strengths": ["You possess 8 out of 10 required skills"],
  "weaknesses": ["Missing 2 key skills"],
  "recommendations": [
    {
      "title": "Master Node.js",
      "description": "This is a key requirement...",
      "priority": "high"
    }
  ],
  "fitScore": 72,
  "experienceGap": "Minimal"
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # PDF analysis API endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main upload & results page
│   └── globals.css               # Global styles
├── components/
│   ├── FileUpload.tsx            # Drag-drop PDF upload
│   ├── AnalysisResults.tsx       # Results display
│   ├── RadarChart.tsx            # Metrics visualization
│   └── SuggestionCard.tsx        # Suggestions
```

## Environment Variables

- `GROQ_API_KEY`: Your Groq API key for LLM access

## License

MIT
