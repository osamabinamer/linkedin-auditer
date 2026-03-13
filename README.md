# LinkedIn Career Auditor

A high-fidelity AI-powered career auditor that transforms static LinkedIn profiles into dynamic, actionable insights through a minimalist and fluid interface.

## Features

- 📄 **PDF Upload**: Drag-and-drop or select your LinkedIn profile PDF export
- 🤖 **AI Analysis**: Powered by Groq LLM (Llama 3.1) for instant, multidimensional analysis
- 📊 **Interactive Radar Charts**: Visualize professional impact metrics including:
  - SEO keyword density
  - Headline strength
  - Narrative clarity
  - Experience depth
  - Skills showcase
- 💡 **Smart Suggestions**: Recruiter-grade advice with impact ratings and categories
- ✨ **Fluid Animations**: Beautiful, responsive UI with Framer Motion

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

1. **Get Your LinkedIn PDF**: Export your LinkedIn profile as a PDF
2. **Upload**: Drag and drop the PDF onto the interface or click to select
3. **Analyze**: The AI processes your profile and generates insights
4. **Review**: See your professional metrics in an interactive radar chart
5. **Improve**: Follow targeted suggestions to enhance your profile

## API Routes

### POST `/api/analyze`

Analyzes a LinkedIn profile PDF and returns structured insights.

**Request**: Multipart form data with `file` field (PDF)

**Response**:
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
