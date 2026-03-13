import { NextRequest, NextResponse } from "next/server";

async function generateDemoJobMatchAnalysis(cvText: string, jobDescription: string) {
  const cvLower = cvText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Extract skills mentioned
  const technicalSkills = ["python", "javascript", "typescript", "java", "c++", "react", "nodejs", "aws", "docker", "sql", "git", "agile", "project management"];
  const cvSkills = technicalSkills.filter(skill => cvLower.includes(skill));
  const jobSkills = technicalSkills.filter(skill => jobLower.includes(skill));
  
  const matchedSkills = cvSkills.filter(skill => jobSkills.includes(skill));
  const missingSkills = jobSkills.filter(skill => !cvSkills.includes(skill));
  
  // Calculate base skill match
  const skillMatch = jobSkills.length > 0 
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 60;
  
  // Experience analysis
  const yearsMatch = cvText.match(/(\d+)\+?\s*years?/i);
  const yearsRequiredMatch = jobDescription.match(/(\d+)\+?\s*years?/i);
  const cvYears = yearsMatch ? parseInt(yearsMatch[1]) : 0;
  const requiredYears = yearsRequiredMatch ? parseInt(yearsRequiredMatch[1]) : 0;
  
  const experienceScore = cvYears >= requiredYears ? 100 : Math.round((cvYears / Math.max(requiredYears, 1)) * 100);
  const experienceGap = cvYears >= requiredYears ? "Perfect match" : `${requiredYears - cvYears}+ years needed`;
  
  // Profile completeness (based on skill count and descriptions)
  const profileCompleteness = Math.min(100, cvSkills.length * 10 + (cvText.length > 200 ? 30 : 20));
  
  // Overall fit score: weighted calculation
  // 50% skills match, 30% experience, 20% profile completeness
  const overallMatch = Math.round(
    skillMatch * 0.5 + 
    experienceScore * 0.3 + 
    profileCompleteness * 0.2
  );
  
  return {
    overallMatch,
    skillMatch,
    experienceScore,
    profileCompleteness,
    summary: `Your overall job match is ${overallMatch}%! You have ${matchedSkills.length}/${jobSkills.length} required skills (${skillMatch}%). Your experience level scores ${experienceScore}%. ${missingSkills.length > 0 ? `Focus on ${missingSkills.slice(0, 2).join(" and ")} to strengthen your candidacy.` : "Excellent alignment!"}`,
    skillMatches: [
      ...matchedSkills.map(skill => ({
        skill,
        proficiency: cvLower.match(new RegExp(`senior|expert|advanced.*${skill}`)) ? "expert" : "intermediate" as const,
        importance: jobLower.match(new RegExp(`must have|required.*${skill}`)) ? "required" as const : "preferred" as const,
      })),
      ...missingSkills.map(skill => ({
        skill,
        proficiency: "missing" as const,
        importance: "required" as const,
      })),
    ],
    missingSkills,
    strengths: [
      `Skills match: ${skillMatch}% (${matchedSkills.length}/${jobSkills.length} required skills)`,
      `Experience level: ${cvYears} year${cvYears !== 1 ? 's' : ''} ${experienceScore >= 80 ? '✓ Meets requirement' : '⚠️ Below requirement'}`,
      `Profile strength: ${profileCompleteness}% (${cvSkills.length} skills documented)`,
    ],
    weaknesses: [
      missingSkills.length > 0 ? `Missing ${missingSkills.length} key skills: ${missingSkills.slice(0, 2).join(", ")}` : "All key skills covered!",
      experienceScore < 60 ? `Experience gap: ${requiredYears - cvYears}+ more years needed` : "Experience is appropriate",
      cvSkills.length < jobSkills.length ? `Only ${cvSkills.length}/${jobSkills.length} potential skills mentioned` : "Well-rounded skill set",
    ],
    recommendations: [
      {
        title: "Priority: Acquire Missing Skills",
        description: `Focus on ${missingSkills.slice(0, 1).join(", ")}. This would increase your match from ${skillMatch}% to ${Math.round(((matchedSkills.length + 1) / jobSkills.length) * 100)}%.`,
        priority: "high" as const,
      },
      experienceScore < 80
        ? {
            title: "Build More Experience",
            description: `You need ${Math.max(0, requiredYears - cvYears)} more year${Math.max(0, requiredYears - cvYears) !== 1 ? 's' : ''} of relevant experience. Consider projects or roles in this domain.`,
            priority: "high" as const,
          }
        : {
            title: "Deepen Your Expertise",
            description: "Your experience is solid. Focus on becoming an expert in your main technologies.",
            priority: "medium" as const,
          },
      {
        title: "Expand Your Skill Documentation",
        description: `Add more details about your ${cvSkills.length} skills. Include proficiency levels and projects.`,
        priority: "medium" as const,
      },
    ],
    fitScore: overallMatch,
    experienceGap,
  };
}

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

async function analyzeJobMatchWithOllama(cvText: string, jobDescription: string) {
  const matchPrompt = `You are an expert job matching AI. Analyze the CV and job description, then provide a JSON response ONLY with this exact structure (no additional text):
{
  "overallMatch": <0-100>,
  "summary": "<2-3 sentence summary of the match>",
  "skillMatches": [
    {"skill": "<skill>", "proficiency": "expert|intermediate|beginner|missing", "importance": "required|preferred|nice-to-have"},
    ...
  ],
  "missingSkills": ["<skill1>", "<skill2>"],
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "recommendations": [
    {"title": "<title>", "description": "<advice>", "priority": "high|medium|low"},
    {"title": "<title>", "description": "<advice>", "priority": "high|medium|low"},
    ...
  ],
  "fitScore": <0-100>,
  "experienceGap": "<description>"
}

CV:
${cvText.substring(0, 2000)}

Job Description:
${jobDescription.substring(0, 2000)}`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: matchPrompt,
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
    console.log("Falling back to demo job match analysis...");
    return generateDemoJobMatchAnalysis(cvText, jobDescription);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, jobDescription, mode } = await request.json();
    let profileText = text || "";

    // Job Match Mode
    if (mode === "match" && jobDescription) {
      if (!profileText.trim() || !jobDescription.trim()) {
        return NextResponse.json(
          { error: "Both CV and job description are required" },
          { status: 400 }
        );
      }

      let analysis;
      try {
        analysis = await analyzeJobMatchWithOllama(profileText, jobDescription);
      } catch (error) {
        console.error("Job match analysis error:", error);
        analysis = await generateDemoJobMatchAnalysis(profileText, jobDescription);
      }

      return NextResponse.json(analysis);
    }

    // Profile Analysis Mode (default)
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

