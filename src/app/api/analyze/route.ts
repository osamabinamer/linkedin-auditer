import { NextRequest, NextResponse } from "next/server";

async function generateDemoAnalysis(profileText: string) {
  // Demo/fallback analysis when Ollama is not available
  // Analyzes the actual profile text to generate realistic metrics
  
  const text = profileText.toLowerCase();
  
  // Calculate basic metrics based on profile content
  const skills = text.match(/python|javascript|typescript|java|c\+\+|react|nodejs|aws|docker/gi) || [];
  const experience = text.match(/years|experience|senior|lead|manager|director/gi) || [];
  const achievements = text.match(/award|achievement|success|led|built|designed|improved/gi) || [];
  
  const scoreFactors = {
    headlineStrength: Math.min(100, 40 + (text.includes("headline") ? 20 : 0) + skills.length * 3),
    seoKeywords: Math.min(100, 30 + skills.length * 4),
    narrativeClarity: Math.min(100, 50 + achievements.length * 2),
    experienceDepth: Math.min(100, 40 + experience.length * 3),
    skillsShowcase: Math.min(100, 35 + skills.length * 5),
  };

  const overallScore = Math.round(
    (scoreFactors.headlineStrength +
      scoreFactors.seoKeywords +
      scoreFactors.narrativeClarity +
      scoreFactors.experienceDepth +
      scoreFactors.skillsShowcase) /
      5
  );

  return {
    overallScore,
    summary: `Your LinkedIn profile demonstrates ${
      overallScore > 70 ? "strong" : "solid"
    } professional presence with ${skills.length} key technical skills and ${
      experience.length > 0 ? "relevant work experience" : "opportunity for experience highlights"
    }. Focus on enhancing narrative clarity and SEO optimization to improve recruiter visibility.`,
    metrics: [
      { name: "Headline Strength", value: scoreFactors.headlineStrength },
      { name: "SEO Keywords", value: scoreFactors.seoKeywords },
      { name: "Narrative Clarity", value: scoreFactors.narrativeClarity },
      { name: "Experience Depth", value: scoreFactors.experienceDepth },
      { name: "Skills Showcase", value: scoreFactors.skillsShowcase },
    ],
    suggestions: [
      {
        title: "Optimize Headline with Keywords",
        description: `Include 2-3 key technical skills (e.g., "${skills[0] || "Python"}", "${skills[1] || "React"}") directly in your headline to improve recruiter searchability.`,
        impact: "high",
        category: "Visibility",
      },
      {
        title: "Expand Skills Section",
        description: `Your profile mentions ${skills.length} skills. Expand to 10-15 core skills with endorsements to increase keyword density and discoverability.`,
        impact: "high",
        category: "Optimization",
      },
      {
        title: "Add Quantifiable Achievements",
        description: "Replace generic descriptions with metrics. E.g., 'Led a team of 8' instead of 'Led teams'. Use percentages and dollar amounts where applicable.",
        impact: "high",
        category: "Content",
      },
      {
        title: "Strengthen About Section",
        description: "Write a 3-4 sentence summary highlighting your unique value proposition. Use keywords naturally and include a call-to-action for recruiter engagement.",
        impact: "medium",
        category: "Content",
      },
      {
        title: "Leverage Recommendations & Endorsements",
        description: "Request recommendations from colleagues. Ask 5-10 people to endorse your top skills. Social proof significantly increases profile traffic.",
        impact: "medium",
        category: "Engagement",
      },
    ],
  };
}

async function analyzeProfileWithOllama(profileText: string) {
  const analysisPrompt = `You are an expert LinkedIn career auditor. Analyze the following LinkedIn profile and provide a JSON response ONLY with this exact structure (no additional text):
{
  "overallScore": <0-100>,
  "summary": "<2-3 sentence summary>",
  "metrics": [
    {"name": "Headline Strength", "value": <0-100>},
    {"name": "SEO Keywords", "value": <0-100>},
    {"name": "Narrative Clarity", "value": <0-100>},
    {"name": "Experience Depth", "value": <0-100>},
    {"name": "Skills Showcase", "value": <0-100>}
  ],
  "suggestions": [
    {"title": "<title>", "description": "<advice>", "impact": "high|medium|low", "category": "<category>"},
    {"title": "<title>", "description": "<advice>", "impact": "high|medium|low", "category": "<category>"},
    {"title": "<title>", "description": "<advice>", "impact": "high|medium|low", "category": "<category>"},
    {"title": "<title>", "description": "<advice>", "impact": "high|medium|low", "category": "<category>"},
    {"title": "<title>", "description": "<advice>", "impact": "high|medium|low", "category": "<category>"}
  ]
}

LinkedIn Profile to analyze:
${profileText.substring(0, 3000)}`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: analysisPrompt,
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.response || "";

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Ollama error:", error);
    console.log("Falling back to demo analysis...");
    // Fallback to demo mode
    return generateDemoAnalysis(profileText);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    let profileText = text || "";

    if (!profileText.trim()) {
      console.log("No text extracted - using demo mode analysis");
      const genericProfile = "LinkedIn Profile - Software Engineer with experience in web development, cloud technologies, problem solving and team collaboration. Skills include JavaScript, React, Node.js, Python, AWS. Led projects improving system performance by 40%.";
      const analysis = await generateDemoAnalysis(genericProfile);
      return NextResponse.json(analysis);
    }

    let analysis;
    try {
      analysis = await analyzeProfileWithOllama(profileText);
    } catch (error) {
      console.error("Analysis error:", error);
      analysis = await generateDemoAnalysis(profileText);
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Request error:", error);
    const analysis = await generateDemoAnalysis("LinkedIn Profile");
    return NextResponse.json(analysis);
  }
}
