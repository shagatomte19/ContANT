
import { GoogleGenAI, GenerateContentResponse, Part, Type } from "@google/genai";
import { BrandVoice, ContentFormat, ContentRequest, InputType, PsychologyAnalysis, ContentStrategy, HookSuggestion, NarrativePoint, BrandLore, ResurrectionVariant, DeepAnalysis, SEOKeyword, SEOAudit, SEOMeta, SEOGapAnalysis, BacklinkStrategy, LocalSEO } from '../types';

// Recommended model for basic text tasks
const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const formatPrompts: Record<ContentFormat, string> = {
  [ContentFormat.BLOG]: `Create a comprehensive, SEO-optimized blog post. 
    Structure:
    - Catchy H1 Title
    - Engaging Introduction (hook the reader)
    - Well-structured body paragraphs with H2/H3 subheaders
    - Bullet points for readability where appropriate
    - A strong Conclusion with a Call to Action (CTA)
    - Formatting: Use Markdown headers (#, ##, ###) and bolding (**text**) for emphasis.`,
  
  [ContentFormat.TWITTER]: `Create a viral Twitter/X thread.
    Structure:
    - Tweet 1: The Hook (compelling statement/question)
    - Tweets 2-N: The Value (break down the core concepts into punchy, standalone tweets)
    - Last Tweet: The Summary & CTA (ask for a retweet or follow)
    - Formatting: Separate each tweet with "---" for parsing. Keep each tweet under 280 characters. Use relevant emojis moderately.`,

  [ContentFormat.LINKEDIN]: `Create a professional, high-engagement LinkedIn post.
    Structure:
    - The Hook: A one-liner that stops the scroll.
    - The Story/Insight: Personal or professional narrative related to the content.
    - The Lesson: Concrete takeaways.
    - The Engagement Question: Ask the audience something specific.
    - Formatting: Use plenty of whitespace (line breaks). Use Markdown for bolding key points.`,

  [ContentFormat.NEWSLETTER]: `Create a personal, direct-response style newsletter entry.
    Structure:
    - Subject Line ideas (provide 3 options)
    - Salutation (e.g., "Hey [Name],")
    - The "Why it matters" section
    - Deep dive into the content
    - Key takeaways
    - CTA (e.g., "Reply to this email if...")
    - Formatting: Use Markdown headers and lists.`
};

export const generatePlatformContent = async (
  request: ContentRequest, 
  format: ContentFormat
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const activeTone = request.toneOverride || request.brandVoice.tone;

  const brandVoiceInstruction = `
    Brand Voice Settings:
    - Tone: ${activeTone}
    - Target Audience: ${request.brandVoice.audience}
    - Keywords to weave in: ${request.brandVoice.keywords.join(', ')}
    ${request.brandVoice.exampleText ? `- Style Reference: "${request.brandVoice.exampleText.substring(0, 300)}..."` : ''}
  `;

  let specificInstruction = formatPrompts[format];

  if (format === ContentFormat.BLOG && request.seoKeywords && request.seoKeywords.length > 0) {
    specificInstruction += `
    
    IMPORTANT SEO INSTRUCTIONS:
    1. Primary Keywords to target: ${request.seoKeywords.join(', ')}
    2. Optimize the Title (H1) and Subheaders (H2/H3) with these keywords naturally.
    3. Include a "Meta Description" block at the very top of the response (max 160 characters), labeled "**Meta Description:**".
    `;
  }

  const systemInstruction = `
    You are ContANT AI, an expert content strategist and copywriter.
    Your goal is to repurpose source material into a high-quality ${format} format.
    
    ${brandVoiceInstruction}
    
    Specific Instructions for ${format}:
    ${specificInstruction}

    ${request.customInstructions ? `Additional User Instructions: ${request.customInstructions}` : ''}
  `;

  const parts: Part[] = [];

  if (request.inputType === InputType.FILE && request.sourceFile) {
    parts.push({
      inlineData: {
        mimeType: request.sourceFile.mimeType,
        data: request.sourceFile.data
      }
    });
    parts.push({ text: "Source Material (see attached file above)." });
  } else {
    parts.push({ text: `Source Material:\n${request.sourceText}` });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Error: No content generated.";
  } catch (error) {
    console.error(`Error generating ${format}:`, error);
    throw error;
  }
};

export const modifyContent = async (
  fullContext: string,
  selectedText: string,
  instruction: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an AI editor assistant.
    
    FULL CONTEXT OF THE ARTICLE:
    ${fullContext}
    
    TEXT SELECTED BY USER TO MODIFY:
    ${selectedText}
    
    USER INSTRUCTION:
    ${instruction}
    
    TASK: Rewrite ONLY the "TEXT SELECTED BY USER" based on the instruction. Output only the replacement text.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt
    });
    return response.text?.trim() || selectedText;
  } catch (error) {
    console.error("Error modifying content:", error);
    throw error;
  }
};

export const analyzeContentPsychology = async (content: string): Promise<PsychologyAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze the following content snippet for psychological impact.
  
  CONTENT:
  "${content.substring(0, 2000)}..."`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            toneScore: { type: Type.NUMBER },
            viralityScore: { type: Type.NUMBER },
            readingLevel: { type: Type.STRING },
            triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
            structuralTension: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["toneScore", "viralityScore", "readingLevel", "triggers", "structuralTension", "explanation"]
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text) as PsychologyAnalysis;
    }
    throw new Error("No JSON returned");
  } catch (error) {
    console.error("Error analyzing psychology:", error);
    return {
      toneScore: 0,
      viralityScore: 0,
      readingLevel: "Unknown",
      triggers: [],
      structuralTension: 0,
      explanation: "Analysis failed."
    };
  }
};

export const generateContentStrategy = async (topic: string): Promise<ContentStrategy> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Develop a brief content strategy for the topic: "${topic}".`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetAudience: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
            contentAngle: { type: Type.STRING },
          },
          required: ["targetAudience", "painPoints", "suggestedHooks", "contentAngle"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ContentStrategy;
    }
    throw new Error("No Strategy returned");
  } catch (error) {
    console.error("Error generating strategy:", error);
    throw error;
  }
};

export const generateMarketingImage = async (promptText: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: `Professional marketing illustration for: ${promptText}. Style: Modern, minimal, vibrant.` }]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const generateContextualHooks = async (context: string, platform: string, frameworks: string[]): Promise<HookSuggestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate 5 high-converting content hooks for ${platform}. Context: "${context}"`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
                text: { type: Type.STRING },
                type: { type: Type.STRING },
                viralityScore: { type: Type.NUMBER },
                explanation: { type: Type.STRING }
             },
             required: ["text", "type", "viralityScore", "explanation"]
          }
        }
      }
    });
    if (response.text) return JSON.parse(response.text) as HookSuggestion[];
    return [];
  } catch(e) {
    console.error("Hook Gen Error", e);
    throw e;
  }
};

export const generateEmotionalContent = async (
  topic: string, 
  emotion: string, 
  intensity: string, 
  sensory: string[], 
  format: string,
  audience: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Evoke ${emotion} (intensity ${intensity}/10) about "${topic}" for ${audience}. Format: ${format}. Sensory details: ${sensory.join(', ')}.`;

  const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt
  });
  return response.text || "";
};

export const analyzeNarrativePhysics = async (content: string): Promise<NarrativePoint[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze narrative beats for tension and pacing. Text: "${content.substring(0, 3000)}"`;

  try {
    const response = await ai.models.generateContent({
       model: TEXT_MODEL,
       contents: prompt,
       config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: {
                   index: { type: Type.INTEGER },
                   snippet: { type: Type.STRING },
                   tension: { type: Type.NUMBER },
                   pacing: { type: Type.NUMBER },
                   insight: { type: Type.STRING }
                },
                required: ["index", "snippet", "tension", "pacing", "insight"]
             }
          }
       }
    });
    if (response.text) return JSON.parse(response.text) as NarrativePoint[];
    return [];
  } catch (e) {
    console.error("Narrative Physics Error", e);
    throw e;
  }
};

export const generateBrandLore = async (brandInfo: string, archetype: string, style: string): Promise<BrandLore> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Create Brand Lore for: "${brandInfo}". Archetype: ${archetype}, Style: ${style}.`;

  try {
     const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
        config: {
           responseMimeType: "application/json",
           responseSchema: {
              type: Type.OBJECT,
              properties: {
                 originStory: { type: Type.STRING },
                 manifesto: { type: Type.STRING },
                 archetype: { type: Type.STRING },
                 enemy: { type: Type.STRING }
              },
              required: ["originStory", "manifesto", "archetype", "enemy"]
           }
        }
     });
     if (response.text) return JSON.parse(response.text) as BrandLore;
     throw new Error("Failed");
  } catch (e) {
     console.error("Brand Lore Error", e);
     throw e;
  }
};

export const resurrectIdea = async (content: string, pivotAngle: string): Promise<ResurrectionVariant[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Resurrect this idea with pivot angle ${pivotAngle}: "${content}"`;

  try {
     const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
        config: {
           responseMimeType: "application/json",
           responseSchema: {
              type: Type.ARRAY,
              items: {
                 type: Type.OBJECT,
                 properties: {
                    style: { type: Type.STRING },
                    content: { type: Type.STRING },
                    reasoning: { type: Type.STRING }
                 },
                 required: ["style", "content", "reasoning"]
              }
           }
        }
     });
     if (response.text) return JSON.parse(response.text) as ResurrectionVariant[];
     return [];
  } catch (e) {
     console.error("Resurrection Error", e);
     throw e;
  }
};

export const analyzeWhyItWorks = async (content: string, audiencePersona: string): Promise<DeepAnalysis> => {
   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
 
   const prompt = `Analyze why this text works for audience: "${audiencePersona}". Text: "${content}"`;
 
   try {
      const response = await ai.models.generateContent({
         model: TEXT_MODEL,
         contents: prompt,
         config: {
            responseMimeType: "application/json",
            responseSchema: {
               type: Type.OBJECT,
               properties: {
                  overallScore: { type: Type.NUMBER },
                  cognitiveBiases: { 
                     type: Type.ARRAY, 
                     items: { 
                        type: Type.OBJECT, 
                        properties: { name: { type: Type.STRING }, description: { type: Type.STRING } },
                        required: ["name", "description"]
                     } 
                  },
                  copyTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  improvementTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  audienceReaction: { type: Type.STRING }
               },
               required: ["overallScore", "cognitiveBiases", "copyTriggers", "improvementTips", "audienceReaction"]
            }
         }
      });
      if (response.text) return JSON.parse(response.text) as DeepAnalysis;
      throw new Error("Failed");
   } catch (e) {
      console.error("Deep Analysis Error", e);
      throw e;
   }
 };

export const generateSEOKeywords = async (topic: string, region: string): Promise<SEOKeyword[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Generate 8 SEO keywords for "${topic}" in ${region}.`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              intent: { type: Type.STRING },
              difficulty: { type: Type.NUMBER },
              volume: { type: Type.STRING },
              potential: { type: Type.NUMBER },
              trend: { type: Type.STRING }
            },
            required: ["term", "intent", "difficulty", "volume", "potential", "trend"]
          }
        }
      }
    });
    if (response.text) return JSON.parse(response.text) as SEOKeyword[];
    return [];
  } catch (e) {
    console.error("Keyword Gen Error", e);
    throw e;
  }
};

export const performSEOAudit = async (content: string, targetKeyword: string): Promise<SEOAudit> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Perform SEO Audit for keyword "${targetKeyword}". Text: "${content.substring(0, 3000)}"`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            breakdown: {
                type: Type.OBJECT,
                properties: {
                    technical: { type: Type.NUMBER },
                    content: { type: Type.NUMBER },
                    ux: { type: Type.NUMBER },
                    readability: { type: Type.NUMBER }
                },
                required: ["technical", "content", "ux", "readability"]
            },
            keywordDensity: { type: Type.NUMBER },
            readabilityScore: { type: Type.NUMBER },
            missingLSI: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { type: Type.STRING }
          },
          required: ["score", "breakdown", "keywordDensity", "readabilityScore", "missingLSI", "suggestions", "sentiment"]
        }
      }
    });
    if (response.text) return JSON.parse(response.text) as SEOAudit;
    throw new Error("Audit Failed");
  } catch (e) {
    console.error("SEO Audit Error", e);
    throw e;
  }
};

export const generateSEOMetaTags = async (content: string, keyword: string): Promise<SEOMeta[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Generate 3 SEO Meta Tags for "${keyword}". Context: "${content.substring(0, 500)}"`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["title", "description", "type"]
          }
        }
      }
    });
    if (response.text) return JSON.parse(response.text) as SEOMeta[];
    return [];
  } catch (e) {
    console.error("Meta Gen Error", e);
    throw e;
  }
};

export const analyzeCompetitorGap = async (myContent: string, competitorContent: string): Promise<SEOGapAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Perform SEO Gap Analysis. Mine: "${myContent.substring(0, 1500)}". Theirs: "${competitorContent.substring(0, 1500)}"`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            missingTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            competitorStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            yourOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicAdvice: { type: Type.STRING }
          },
          required: ["missingTopics", "competitorStrengths", "yourOpportunities", "strategicAdvice"]
        }
      }
    });
    if (response.text) return JSON.parse(response.text) as SEOGapAnalysis;
    throw new Error("Gap Analysis Failed");
  } catch (e) {
    console.error("Gap Analysis Error", e);
    throw e;
  }
};

export const generateBacklinkStrategy = async (domain: string, niche: string): Promise<BacklinkStrategy> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
    const prompt = `Backlink strategy for ${domain} in ${niche}.`;
  
    try {
      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              linkableAssets: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT, 
                    properties: { title: { type: Type.STRING }, type: { type: Type.STRING }, description: { type: Type.STRING } },
                    required: ["title", "type", "description"]
                  } 
              },
              outreachTargets: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT, 
                    properties: { type: { type: Type.STRING }, reason: { type: Type.STRING } },
                    required: ["type", "reason"]
                  } 
              },
              emailTemplate: { 
                  type: Type.OBJECT, 
                  properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } },
                  required: ["subject", "body"]
              }
            },
            required: ["linkableAssets", "outreachTargets", "emailTemplate"]
          }
        }
      });
      if (response.text) return JSON.parse(response.text) as BacklinkStrategy;
      throw new Error("Backlink Gen Failed");
    } catch (e) {
      console.error("Backlink Gen Error", e);
      throw e;
    }
  };

  export const generateLocalSEOAudit = async (businessName: string, location: string, type: string): Promise<LocalSEO> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
    const prompt = `Local SEO for ${businessName} in ${location} (${type}).`;
  
    try {
      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gmbTitle: { type: Type.STRING },
              categories: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: { type: Type.STRING },
              citationOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              postsIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["gmbTitle", "categories", "description", "citationOpportunities", "postsIdeas"]
          }
        }
      });
      if (response.text) return JSON.parse(response.text) as LocalSEO;
      throw new Error("Local SEO Failed");
    } catch (e) {
      console.error("Local SEO Error", e);
      throw e;
    }
  };
