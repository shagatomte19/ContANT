export enum ContentFormat {
  BLOG = 'BLOG',
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  NEWSLETTER = 'NEWSLETTER'
}

export enum InputType {
  TEXT = 'TEXT',
  FILE = 'FILE'
}

export interface BrandVoice {
  name: string;
  tone: string;
  audience: string;
  keywords: string[];
  exampleText?: string;
}

export interface GeneratedContent {
  id: string;
  format: ContentFormat;
  content: string;
  createdAt: number;
  originalTitle?: string;
  psychology?: PsychologyAnalysis;
  imageUrl?: string;
}

export interface ContentRequest {
  sourceText: string;
  sourceFile?: {
    data: string;
    mimeType: string;
    name: string;
  };
  inputType: InputType;
  selectedFormats: ContentFormat[];
  brandVoice: BrandVoice;
  customInstructions?: string;
  seoKeywords?: string[];
  toneOverride?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

export interface PsychologyAnalysis {
  toneScore: number;
  viralityScore: number;
  readingLevel: string;
  triggers: string[];
  structuralTension: number;
  explanation: string;
}

export interface ContentStrategy {
  targetAudience: string;
  painPoints: string[];
  suggestedHooks: string[];
  contentAngle: string;
}

// --- Power Tool Types ---

export interface HookSuggestion {
  text: string;
  type: string;
  viralityScore: number;
  explanation: string;
}

export interface NarrativePoint {
  index: number;
  snippet: string;
  tension: number;
  pacing: number;
  insight: string;
}

export interface BrandLore {
  originStory: string;
  manifesto: string;
  archetype: string;
  enemy: string;
}

export interface ResurrectionVariant {
  style: string;
  content: string;
  reasoning: string;
}

export interface DeepAnalysis {
  overallScore: number;
  cognitiveBiases: { name: string; description: string }[];
  copyTriggers: string[];
  improvementTips: string[];
  audienceReaction: string;
}

// --- SEO Suite Types ---

export interface SEOKeyword {
  term: string;
  intent: 'Informational' | 'Transactional' | 'Commercial' | 'Navigational';
  difficulty: number; // 0-100
  volume: string; // e.g., "High", "Med", "Low"
  potential: number; // AI score 0-100
  trend: 'Up' | 'Down' | 'Stable';
}

export interface SEOAudit {
  score: number;
  breakdown: {
    technical: number;
    content: number;
    ux: number;
    readability: number;
  };
  keywordDensity: number;
  readabilityScore: number;
  missingLSI: string[];
  suggestions: string[];
  sentiment: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  type: string; // e.g. "Clickbait", "Professional", "Question"
}

export interface SEOGapAnalysis {
  missingTopics: string[];
  competitorStrengths: string[];
  yourOpportunities: string[];
  strategicAdvice: string;
}

export interface BacklinkStrategy {
  linkableAssets: { title: string; type: string; description: string }[];
  outreachTargets: { type: string; reason: string }[];
  emailTemplate: { subject: string; body: string };
}

export interface LocalSEO {
  gmbTitle: string;
  categories: string[];
  description: string;
  citationOpportunities: string[];
  postsIdeas: string[];
}