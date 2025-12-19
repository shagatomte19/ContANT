from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# ============== ENUMS ==============

class ContentFormat(str, Enum):
    BLOG = "BLOG"
    TWITTER = "TWITTER"
    LINKEDIN = "LINKEDIN"
    NEWSLETTER = "NEWSLETTER"


class InputType(str, Enum):
    TEXT = "TEXT"
    FILE = "FILE"


# ============== BRAND VOICE ==============

class BrandVoice(BaseModel):
    name: str
    tone: str
    audience: str
    keywords: List[str]
    example_text: Optional[str] = None


# ============== CONTENT REQUESTS/RESPONSES ==============

class SourceFile(BaseModel):
    data: str
    mime_type: str = Field(alias="mimeType")
    name: str
    
    class Config:
        populate_by_name = True


class ContentRequest(BaseModel):
    source_text: str = Field(alias="sourceText")
    source_file: Optional[SourceFile] = Field(default=None, alias="sourceFile")
    input_type: InputType = Field(alias="inputType")
    selected_formats: List[ContentFormat] = Field(alias="selectedFormats")
    brand_voice: BrandVoice = Field(alias="brandVoice")
    custom_instructions: Optional[str] = Field(default=None, alias="customInstructions")
    seo_keywords: Optional[List[str]] = Field(default=None, alias="seoKeywords")
    tone_override: Optional[str] = Field(default=None, alias="toneOverride")
    
    class Config:
        populate_by_name = True


class GenerateContentRequest(BaseModel):
    request: ContentRequest
    format: ContentFormat


class ModifyContentRequest(BaseModel):
    full_context: str = Field(alias="fullContext")
    selected_text: str = Field(alias="selectedText")
    instruction: str
    
    class Config:
        populate_by_name = True


class AnalyzePsychologyRequest(BaseModel):
    content: str


class GenerateStrategyRequest(BaseModel):
    topic: str


class GenerateImageRequest(BaseModel):
    prompt: str


# ============== PSYCHOLOGY ANALYSIS ==============

class PsychologyAnalysis(BaseModel):
    tone_score: float = Field(alias="toneScore")
    virality_score: float = Field(alias="viralityScore")
    reading_level: str = Field(alias="readingLevel")
    triggers: List[str]
    structural_tension: float = Field(alias="structuralTension")
    explanation: str
    
    class Config:
        populate_by_name = True


class ContentStrategy(BaseModel):
    target_audience: str = Field(alias="targetAudience")
    pain_points: List[str] = Field(alias="painPoints")
    suggested_hooks: List[str] = Field(alias="suggestedHooks")
    content_angle: str = Field(alias="contentAngle")
    
    class Config:
        populate_by_name = True


# ============== POWER TOOLS ==============

class HookRequest(BaseModel):
    context: str
    platform: str
    frameworks: List[str] = []


class HookSuggestion(BaseModel):
    text: str
    type: str
    virality_score: float = Field(alias="viralityScore")
    explanation: str
    
    class Config:
        populate_by_name = True


class EmotionalContentRequest(BaseModel):
    topic: str
    emotion: str
    intensity: str
    sensory: List[str]
    format: str
    audience: str


class NarrativeRequest(BaseModel):
    content: str


class NarrativePoint(BaseModel):
    index: int
    snippet: str
    tension: float
    pacing: float
    insight: str


class BrandLoreRequest(BaseModel):
    brand_info: str = Field(alias="brandInfo")
    archetype: str
    style: str
    
    class Config:
        populate_by_name = True


class BrandLore(BaseModel):
    origin_story: str = Field(alias="originStory")
    manifesto: str
    archetype: str
    enemy: str
    
    class Config:
        populate_by_name = True


class ResurrectionRequest(BaseModel):
    content: str
    pivot_angle: str = Field(alias="pivotAngle")
    
    class Config:
        populate_by_name = True


class ResurrectionVariant(BaseModel):
    style: str
    content: str
    reasoning: str


class AnalyzeWhyItWorksRequest(BaseModel):
    content: str
    audience_persona: str = Field(alias="audiencePersona")
    
    class Config:
        populate_by_name = True


class CognitiveBias(BaseModel):
    name: str
    description: str


class DeepAnalysis(BaseModel):
    overall_score: float = Field(alias="overallScore")
    cognitive_biases: List[CognitiveBias] = Field(alias="cognitiveBiases")
    copy_triggers: List[str] = Field(alias="copyTriggers")
    improvement_tips: List[str] = Field(alias="improvementTips")
    audience_reaction: str = Field(alias="audienceReaction")
    
    class Config:
        populate_by_name = True


# ============== SEO TYPES ==============

class SEOKeywordRequest(BaseModel):
    topic: str
    region: str


class SEOKeyword(BaseModel):
    term: str
    intent: str
    difficulty: float
    volume: str
    potential: float
    trend: str


class SEOAuditRequest(BaseModel):
    content: str
    target_keyword: str = Field(alias="targetKeyword")
    
    class Config:
        populate_by_name = True


class SEOAuditBreakdown(BaseModel):
    technical: float
    content: float
    ux: float
    readability: float


class SEOAudit(BaseModel):
    score: float
    breakdown: SEOAuditBreakdown
    keyword_density: float = Field(alias="keywordDensity")
    readability_score: float = Field(alias="readabilityScore")
    missing_lsi: List[str] = Field(alias="missingLSI")
    suggestions: List[str]
    sentiment: str
    
    class Config:
        populate_by_name = True


class SEOMetaRequest(BaseModel):
    content: str
    keyword: str


class SEOMeta(BaseModel):
    title: str
    description: str
    type: str


class SEOGapRequest(BaseModel):
    my_content: str = Field(alias="myContent")
    competitor_content: str = Field(alias="competitorContent")
    
    class Config:
        populate_by_name = True


class SEOGapAnalysis(BaseModel):
    missing_topics: List[str] = Field(alias="missingTopics")
    competitor_strengths: List[str] = Field(alias="competitorStrengths")
    your_opportunities: List[str] = Field(alias="yourOpportunities")
    strategic_advice: str = Field(alias="strategicAdvice")
    
    class Config:
        populate_by_name = True


class BacklinkRequest(BaseModel):
    domain: str
    niche: str


class LinkableAsset(BaseModel):
    title: str
    type: str
    description: str


class OutreachTarget(BaseModel):
    type: str
    reason: str


class EmailTemplate(BaseModel):
    subject: str
    body: str


class BacklinkStrategy(BaseModel):
    linkable_assets: List[LinkableAsset] = Field(alias="linkableAssets")
    outreach_targets: List[OutreachTarget] = Field(alias="outreachTargets")
    email_template: EmailTemplate = Field(alias="emailTemplate")
    
    class Config:
        populate_by_name = True


class LocalSEORequest(BaseModel):
    business_name: str = Field(alias="businessName")
    location: str
    type: str
    
    class Config:
        populate_by_name = True


class LocalSEO(BaseModel):
    gmb_title: str = Field(alias="gmbTitle")
    categories: List[str]
    description: str
    citation_opportunities: List[str] = Field(alias="citationOpportunities")
    posts_ideas: List[str] = Field(alias="postsIdeas")
    
    class Config:
        populate_by_name = True


# ============== CONTENT HISTORY ==============

class ContentHistoryCreate(BaseModel):
    format: ContentFormat
    content: str
    original_title: Optional[str] = None
    psychology: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None


class ContentHistoryResponse(BaseModel):
    id: str
    user_id: str
    format: ContentFormat
    content: str
    original_title: Optional[str]
    psychology: Optional[Dict[str, Any]]
    image_url: Optional[str]
    created_at: str


# ============== AUTH ==============

class UserResponse(BaseModel):
    id: str
    email: str
    created_at: Optional[str] = None
