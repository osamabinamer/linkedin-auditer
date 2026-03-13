import { NextRequest, NextResponse } from "next/server";

// Helper function to extract years of experience from date ranges
function extractExperienceFromDates(text: string): { years: number; message: string } {
  // Regex patterns for various date formats
  const dateRangePatterns = [
    // "Jan 2020 - Dec 2023", "January 2020 - December 2023", "2020 - 2023"
    /(\w+\s*\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–to]\s*(\w+\s*\d{4}|Present|Current|\d{1,2}\/\d{4}|\d{4})/gi,
    // "Jan/2020 - Dec/2023", "01/2020 - 12/2023"
    /(\d{1,2}\/\d{4})\s*[-–to]\s*(\d{1,2}\/\d{4}|Present|Current)/gi,
  ];

  let totalMonths = 0;
  let foundDateRanges = 0;

  for (const pattern of dateRangePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      foundDateRanges++;
      const startDate = parseDate(match[1]);
      const endDate = match[2].toLowerCase().includes("present") || 
                     match[2].toLowerCase().includes("current") 
        ? new Date() 
        : parseDate(match[2]);

      if (startDate && endDate) {
        const months = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
        totalMonths += Math.max(0, months);
      }
    }
  }

  const cvYears = Math.round((totalMonths / 12) * 10) / 10; // Round to 1 decimal place

  if (foundDateRanges > 0 && cvYears > 0) {
    return { 
      years: cvYears, 
      message: `${cvYears} year${cvYears !== 1 ? 's' : ''} of experience` 
    };
  }

  // Fallback: look for explicit "X years" mentions
  const explicitYearsMatch = text.match(/(\d+)\+?\s*years?\s*(of|of\s*)?experience/i);
  if (explicitYearsMatch) {
    const years = parseInt(explicitYearsMatch[1]);
    return { 
      years, 
      message: `${years} year${years !== 1 ? 's' : ''} of experience` 
    };
  }

  return { 
    years: 0, 
    message: "Experience dates are not provided in the CV" 
  };
}

// Helper function to parse various date formats
function parseDate(dateStr: string): Date | null {
  const months: { [key: string]: number } = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, september: 8, oct: 9, october: 9,
    nov: 10, november: 10, dec: 11, december: 11,
  };

  const trimmed = dateStr.trim();

  // Try MM/YYYY format
  const slashMatch = trimmed.match(/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const month = parseInt(slashMatch[1]) - 1;
    const year = parseInt(slashMatch[2]);
    if (month >= 0 && month <= 11) {
      return new Date(year, month, 1);
    }
  }

  // Try Month YYYY format
  const monthYearMatch = trimmed.match(/(\w+)\s+(\d{4})/);
  if (monthYearMatch) {
    const monthName = monthYearMatch[1].toLowerCase();
    const year = parseInt(monthYearMatch[2]);
    const month = months[monthName];
    if (month !== undefined) {
      return new Date(year, month, 1);
    }
  }

  // Try YYYY only
  const yearMatch = trimmed.match(/(\d{4})/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    return new Date(year, 0, 1);
  }

  return null;
}

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
  
  // Experience analysis - extract from date ranges
  const cvExperience = extractExperienceFromDates(cvText);
  const jobExperience = extractExperienceFromDates(jobDescription);
  
  const cvYears = cvExperience.years;
  const requiredYears = jobExperience.years;
  
  let experienceScore: number;
  let experienceGap: string;
  
  if (cvYears === 0) {
    experienceScore = 0;
    experienceGap = cvExperience.message;
  } else if (requiredYears === 0) {
    experienceScore = 100;
    experienceGap = `${cvYears} year${cvYears !== 1 ? 's' : ''} of experience`;
  } else if (cvYears >= requiredYears) {
    experienceScore = 100;
    experienceGap = "Perfect match";
  } else {
    experienceScore = Math.round((cvYears / requiredYears) * 100);
    experienceGap = `${(requiredYears - cvYears).toFixed(1)} more year${Math.round(requiredYears - cvYears) !== 1 ? 's' : ''} needed`;
  }
  
  // Profile completeness (based on skill count and descriptions)
  const profileCompleteness = Math.min(100, cvSkills.length * 10 + (cvText.length > 200 ? 30 : 20));
  
  // Overall fit score: weighted calculation
  // 50% skills match, 30% experience, 20% profile completeness
  const overallMatch = Math.round(
    skillMatch * 0.5 + 
    experienceScore * 0.3 + 
    profileCompleteness * 0.2
  );
  
  const experienceDisplay = cvYears > 0 ? `${cvYears} year${cvYears !== 1 ? 's' : ''}` : "Not specified";
  const experienceStatus = cvYears === 0 ? "⚠️ No dates found" : (experienceScore >= 80 ? "✓ Meets requirement" : "⚠️ Below requirement");
  
  return {
    overallMatch,
    skillMatch,
    experienceScore,
    profileCompleteness,
    summary: `Your overall job match is ${overallMatch}%! You have ${matchedSkills.length}/${jobSkills.length} required skills (${skillMatch}%). ${cvYears > 0 ? `Your ${cvYears} year${cvYears !== 1 ? 's' : ''} of experience scores ${experienceScore}%.` : "Experience dates are not provided in your CV."} ${missingSkills.length > 0 ? `Focus on ${missingSkills.slice(0, 2).join(" and ")} to strengthen your candidacy.` : "Excellent alignment!"}`,
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
      `Experience level: ${experienceDisplay} ${experienceStatus}`,
      `Profile strength: ${profileCompleteness}% (${cvSkills.length} skills documented)`,
    ],
    weaknesses: [
      missingSkills.length > 0 ? `Missing ${missingSkills.length} key skills: ${missingSkills.slice(0, 2).join(", ")}` : "All key skills covered!",
      cvYears === 0 ? "Experience dates are not provided in your CV" : (experienceScore < 60 ? `Experience gap: ${(requiredYears - cvYears).toFixed(1)} more years needed` : "Experience is appropriate"),
      cvSkills.length < jobSkills.length ? `Only ${cvSkills.length}/${jobSkills.length} potential skills mentioned` : "Well-rounded skill set",
    ],
    recommendations: [
      {
        title: "Priority: Acquire Missing Skills",
        description: `Focus on ${missingSkills.slice(0, 1).join(", ")}. This would increase your match from ${skillMatch}% to ${Math.round(((matchedSkills.length + 1) / jobSkills.length) * 100)}%.`,
        priority: "high" as const,
      },
      cvYears === 0
        ? {
            title: "Add Experience Dates",
            description: "Include date ranges (e.g., Jan 2020 - Dec 2023) for all your work experience. This helps us accurately calculate your experience level.",
            priority: "high" as const,
          }
        : experienceScore < 80
        ? {
            title: "Build More Experience",
            description: `You need ${(requiredYears - cvYears).toFixed(1)} more year${Math.round(requiredYears - cvYears) !== 1 ? 's' : ''} of relevant experience. Consider projects or roles in this domain.`,
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

