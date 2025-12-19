"""
Gemini AI Service - Handles all AI content generation and analysis.
"""
import json
from typing import List, Optional
from google import genai
from google.genai import types

from ..config import get_settings
from ..schemas import (
    ContentFormat,
    InputType,
    ContentRequest,
    PsychologyAnalysis,
    ContentStrategy,
    HookSuggestion,
    NarrativePoint,
    BrandLore,
    ResurrectionVariant,
    DeepAnalysis,
    SEOKeyword,
    SEOAudit,
    SEOMeta,
    SEOGapAnalysis,
    BacklinkStrategy,
    LocalSEO,
)

# Model names
TEXT_MODEL = "gemini-2.0-flash"
IMAGE_MODEL = "gemini-2.0-flash-exp-image-generation"

# Format-specific prompts
FORMAT_PROMPTS = {
    ContentFormat.BLOG: """Create a comprehensive, SEO-optimized blog post. 
    Structure:
    - Catchy H1 Title
    - Engaging Introduction (hook the reader)
    - Well-structured body paragraphs with H2/H3 subheaders
    - Bullet points for readability where appropriate
    - A strong Conclusion with a Call to Action (CTA)
    - Formatting: Use Markdown headers (#, ##, ###) and bolding (**text**) for emphasis.""",
    
    ContentFormat.TWITTER: """Create a viral Twitter/X thread.
    Structure:
    - Tweet 1: The Hook (compelling statement/question)
    - Tweets 2-N: The Value (break down the core concepts into punchy, standalone tweets)
    - Last Tweet: The Summary & CTA (ask for a retweet or follow)
    - Formatting: Separate each tweet with "---" for parsing. Keep each tweet under 280 characters. Use relevant emojis moderately.""",

    ContentFormat.LINKEDIN: """Create a professional, high-engagement LinkedIn post.
    Structure:
    - The Hook: A one-liner that stops the scroll.
    - The Story/Insight: Personal or professional narrative related to the content.
    - The Lesson: Concrete takeaways.
    - The Engagement Question: Ask the audience something specific.
    - Formatting: Use plenty of whitespace (line breaks). Use Markdown for bolding key points.""",

    ContentFormat.NEWSLETTER: """Create a personal, direct-response style newsletter entry.
    Structure:
    - Subject Line ideas (provide 3 options)
    - Salutation (e.g., "Hey [Name],")
    - The "Why it matters" section
    - Deep dive into the content
    - Key takeaways
    - CTA (e.g., "Reply to this email if...")
    - Formatting: Use Markdown headers and lists."""
}


def _get_client() -> genai.Client:
    """Get Gemini AI client."""
    settings = get_settings()
    return genai.Client(api_key=settings.gemini_api_key)


async def generate_platform_content(request: ContentRequest, format: ContentFormat) -> str:
    """Generate content for a specific platform format."""
    client = _get_client()
    
    active_tone = request.tone_override or request.brand_voice.tone
    
    brand_voice_instruction = f"""
    Brand Voice Settings:
    - Tone: {active_tone}
    - Target Audience: {request.brand_voice.audience}
    - Keywords to weave in: {', '.join(request.brand_voice.keywords)}
    {f'- Style Reference: "{request.brand_voice.example_text[:300]}..."' if request.brand_voice.example_text else ''}
    """
    
    specific_instruction = FORMAT_PROMPTS[format]
    
    if format == ContentFormat.BLOG and request.seo_keywords:
        specific_instruction += f"""
        
        IMPORTANT SEO INSTRUCTIONS:
        1. Primary Keywords to target: {', '.join(request.seo_keywords)}
        2. Optimize the Title (H1) and Subheaders (H2/H3) with these keywords naturally.
        3. Include a "Meta Description" block at the very top of the response (max 160 characters), labeled "**Meta Description:**".
        """
    
    system_instruction = f"""
    You are ContANT AI, an expert content strategist and copywriter.
    Your goal is to repurpose source material into a high-quality {format.value} format.
    
    {brand_voice_instruction}
    
    Specific Instructions for {format.value}:
    {specific_instruction}

    {f'Additional User Instructions: {request.custom_instructions}' if request.custom_instructions else ''}
    """
    
    # Build content parts
    contents = []
    if request.input_type == InputType.FILE and request.source_file:
        contents.append(types.Part.from_bytes(
            data=request.source_file.data.encode(),
            mime_type=request.source_file.mime_type
        ))
        contents.append("Source Material (see attached file above).")
    else:
        contents.append(f"Source Material:\n{request.source_text}")
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7,
        )
    )
    
    return response.text or "Error: No content generated."


async def modify_content(full_context: str, selected_text: str, instruction: str) -> str:
    """Modify selected text based on instruction."""
    client = _get_client()
    
    prompt = f"""
    You are an AI editor assistant.
    
    FULL CONTEXT OF THE ARTICLE:
    {full_context}
    
    TEXT SELECTED BY USER TO MODIFY:
    {selected_text}
    
    USER INSTRUCTION:
    {instruction}
    
    TASK: Rewrite ONLY the "TEXT SELECTED BY USER" based on the instruction. Output only the replacement text.
    """
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt
    )
    
    return response.text.strip() if response.text else selected_text


async def analyze_content_psychology(content: str) -> PsychologyAnalysis:
    """Analyze content for psychological impact."""
    client = _get_client()
    
    prompt = f'Analyze the following content snippet for psychological impact.\n\nCONTENT:\n"{content[:2000]}..."'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "toneScore": {"type": "number"},
                    "viralityScore": {"type": "number"},
                    "readingLevel": {"type": "string"},
                    "triggers": {"type": "array", "items": {"type": "string"}},
                    "structuralTension": {"type": "number"},
                    "explanation": {"type": "string"},
                },
                "required": ["toneScore", "viralityScore", "readingLevel", "triggers", "structuralTension", "explanation"]
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return PsychologyAnalysis(**data)
    
    return PsychologyAnalysis(
        toneScore=0, viralityScore=0, readingLevel="Unknown",
        triggers=[], structuralTension=0, explanation="Analysis failed."
    )


async def generate_content_strategy(topic: str) -> ContentStrategy:
    """Generate content strategy for a topic."""
    client = _get_client()
    
    prompt = f'Develop a brief content strategy for the topic: "{topic}".'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "targetAudience": {"type": "string"},
                    "painPoints": {"type": "array", "items": {"type": "string"}},
                    "suggestedHooks": {"type": "array", "items": {"type": "string"}},
                    "contentAngle": {"type": "string"},
                },
                "required": ["targetAudience", "painPoints", "suggestedHooks", "contentAngle"]
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return ContentStrategy(**data)
    
    raise ValueError("No strategy returned")


async def generate_marketing_image(prompt_text: str) -> str:
    """Generate a marketing image and return base64 data URL."""
    client = _get_client()
    
    response = client.models.generate_content(
        model=IMAGE_MODEL,
        contents=f"Professional marketing illustration for: {prompt_text}. Style: Modern, minimal, vibrant.",
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"]
        )
    )
    
    if response.candidates and response.candidates[0].content.parts:
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data:
                return f"data:{part.inline_data.mime_type};base64,{part.inline_data.data}"
    
    raise ValueError("No image generated")


async def generate_contextual_hooks(context: str, platform: str, frameworks: List[str]) -> List[HookSuggestion]:
    """Generate viral hooks for content."""
    client = _get_client()
    
    prompt = f'Generate 5 high-converting content hooks for {platform}. Context: "{context}"'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "text": {"type": "string"},
                        "type": {"type": "string"},
                        "viralityScore": {"type": "number"},
                        "explanation": {"type": "string"}
                    },
                    "required": ["text", "type", "viralityScore", "explanation"]
                }
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return [HookSuggestion(**item) for item in data]
    return []


async def generate_emotional_content(
    topic: str, emotion: str, intensity: str,
    sensory: List[str], format: str, audience: str
) -> str:
    """Generate emotionally-charged content."""
    client = _get_client()
    
    prompt = f'Evoke {emotion} (intensity {intensity}/10) about "{topic}" for {audience}. Format: {format}. Sensory details: {", ".join(sensory)}.'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt
    )
    
    return response.text or ""


async def analyze_narrative_physics(content: str) -> List[NarrativePoint]:
    """Analyze narrative tension and pacing."""
    client = _get_client()
    
    prompt = f'Analyze narrative beats for tension and pacing. Text: "{content[:3000]}"'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "index": {"type": "integer"},
                        "snippet": {"type": "string"},
                        "tension": {"type": "number"},
                        "pacing": {"type": "number"},
                        "insight": {"type": "string"}
                    },
                    "required": ["index", "snippet", "tension", "pacing", "insight"]
                }
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return [NarrativePoint(**item) for item in data]
    return []


async def generate_brand_lore(brand_info: str, archetype: str, style: str) -> BrandLore:
    """Generate brand mythology."""
    client = _get_client()
    
    prompt = f'Create Brand Lore for: "{brand_info}". Archetype: {archetype}, Style: {style}.'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "originStory": {"type": "string"},
                    "manifesto": {"type": "string"},
                    "archetype": {"type": "string"},
                    "enemy": {"type": "string"}
                },
                "required": ["originStory", "manifesto", "archetype", "enemy"]
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return BrandLore(**data)
    
    raise ValueError("Failed to generate brand lore")


async def resurrect_idea(content: str, pivot_angle: str) -> List[ResurrectionVariant]:
    """Resurrect old content with new angles."""
    client = _get_client()
    
    prompt = f'Resurrect this idea with pivot angle {pivot_angle}: "{content}"'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "style": {"type": "string"},
                        "content": {"type": "string"},
                        "reasoning": {"type": "string"}
                    },
                    "required": ["style", "content", "reasoning"]
                }
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return [ResurrectionVariant(**item) for item in data]
    return []


async def analyze_why_it_works(content: str, audience_persona: str) -> DeepAnalysis:
    """Deep psychological analysis of content."""
    client = _get_client()
    
    prompt = f'Analyze why this text works for audience: "{audience_persona}". Text: "{content}"'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "overallScore": {"type": "number"},
                    "cognitiveBiases": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "description": {"type": "string"}
                            },
                            "required": ["name", "description"]
                        }
                    },
                    "copyTriggers": {"type": "array", "items": {"type": "string"}},
                    "improvementTips": {"type": "array", "items": {"type": "string"}},
                    "audienceReaction": {"type": "string"}
                },
                "required": ["overallScore", "cognitiveBiases", "copyTriggers", "improvementTips", "audienceReaction"]
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return DeepAnalysis(**data)
    
    raise ValueError("Analysis failed")


# ============== SEO FUNCTIONS ==============

async def generate_seo_keywords(topic: str, region: str) -> List[SEOKeyword]:
    """Generate SEO keywords for a topic."""
    client = _get_client()
    
    prompt = f'Generate 8 SEO keywords for "{topic}" in {region}.'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "term": {"type": "string"},
                        "intent": {"type": "string"},
                        "difficulty": {"type": "number"},
                        "volume": {"type": "string"},
                        "potential": {"type": "number"},
                        "trend": {"type": "string"}
                    },
                    "required": ["term", "intent", "difficulty", "volume", "potential", "trend"]
                }
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return [SEOKeyword(**item) for item in data]
    return []


async def perform_seo_audit(content: str, target_keyword: str) -> SEOAudit:
    """Perform SEO audit on content."""
    client = _get_client()
    
    prompt = f'Perform SEO Audit for keyword "{target_keyword}". Text: "{content[:3000]}"'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "score": {"type": "number"},
                    "breakdown": {
                        "type": "object",
                        "properties": {
                            "technical": {"type": "number"},
                            "content": {"type": "number"},
                            "ux": {"type": "number"},
                            "readability": {"type": "number"}
                        },
                        "required": ["technical", "content", "ux", "readability"]
                    },
                    "keywordDensity": {"type": "number"},
                    "readabilityScore": {"type": "number"},
                    "missingLSI": {"type": "array", "items": {"type": "string"}},
                    "suggestions": {"type": "array", "items": {"type": "string"}},
                    "sentiment": {"type": "string"}
                },
                "required": ["score", "breakdown", "keywordDensity", "readabilityScore", "missingLSI", "suggestions", "sentiment"]
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return SEOAudit(**data)
    
    raise ValueError("SEO Audit failed")


async def generate_seo_meta_tags(content: str, keyword: str) -> List[SEOMeta]:
    """Generate SEO meta tags."""
    client = _get_client()
    
    prompt = f'Generate 3 SEO Meta Tags for "{keyword}". Context: "{content[:500]}"'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "type": {"type": "string"}
                    },
                    "required": ["title", "description", "type"]
                }
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return [SEOMeta(**item) for item in data]
    return []


async def analyze_competitor_gap(my_content: str, competitor_content: str) -> SEOGapAnalysis:
    """Analyze content gap with competitor."""
    client = _get_client()
    
    prompt = f'Perform SEO Gap Analysis. Mine: "{my_content[:1500]}". Theirs: "{competitor_content[:1500]}"'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "missingTopics": {"type": "array", "items": {"type": "string"}},
                    "competitorStrengths": {"type": "array", "items": {"type": "string"}},
                    "yourOpportunities": {"type": "array", "items": {"type": "string"}},
                    "strategicAdvice": {"type": "string"}
                },
                "required": ["missingTopics", "competitorStrengths", "yourOpportunities", "strategicAdvice"]
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return SEOGapAnalysis(**data)
    
    raise ValueError("Gap Analysis failed")


async def generate_backlink_strategy(domain: str, niche: str) -> BacklinkStrategy:
    """Generate backlink strategy."""
    client = _get_client()
    
    prompt = f'Backlink strategy for {domain} in {niche}.'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "linkableAssets": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string"},
                                "type": {"type": "string"},
                                "description": {"type": "string"}
                            },
                            "required": ["title", "type", "description"]
                        }
                    },
                    "outreachTargets": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "type": {"type": "string"},
                                "reason": {"type": "string"}
                            },
                            "required": ["type", "reason"]
                        }
                    },
                    "emailTemplate": {
                        "type": "object",
                        "properties": {
                            "subject": {"type": "string"},
                            "body": {"type": "string"}
                        },
                        "required": ["subject", "body"]
                    }
                },
                "required": ["linkableAssets", "outreachTargets", "emailTemplate"]
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return BacklinkStrategy(**data)
    
    raise ValueError("Backlink strategy failed")


async def generate_local_seo_audit(business_name: str, location: str, business_type: str) -> LocalSEO:
    """Generate local SEO recommendations."""
    client = _get_client()
    
    prompt = f'Local SEO for {business_name} in {location} ({business_type}).'
    
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "gmbTitle": {"type": "string"},
                    "categories": {"type": "array", "items": {"type": "string"}},
                    "description": {"type": "string"},
                    "citationOpportunities": {"type": "array", "items": {"type": "string"}},
                    "postsIdeas": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["gmbTitle", "categories", "description", "citationOpportunities", "postsIdeas"]
            }
        )
    )
    
    if response.text:
        data = json.loads(response.text)
        return LocalSEO(**data)
    
    raise ValueError("Local SEO failed")
