"""
Power Tools Router - API endpoints for advanced content tools.
"""
from typing import List
from fastapi import APIRouter, HTTPException

from ..schemas import (
    HookRequest,
    HookSuggestion,
    EmotionalContentRequest,
    NarrativeRequest,
    NarrativePoint,
    BrandLoreRequest,
    BrandLore,
    ResurrectionRequest,
    ResurrectionVariant,
    AnalyzeWhyItWorksRequest,
    DeepAnalysis,
)
from ..services import (
    generate_contextual_hooks,
    generate_emotional_content,
    analyze_narrative_physics,
    generate_brand_lore,
    resurrect_idea,
    analyze_why_it_works,
)

router = APIRouter(prefix="/api/tools", tags=["Power Tools"])


@router.post("/hooks", response_model=List[HookSuggestion])
async def generate_hooks(request: HookRequest):
    """Generate contextual viral hooks."""
    try:
        result = await generate_contextual_hooks(
            request.context,
            request.platform,
            request.frameworks
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/emotional")
async def generate_emotional(request: EmotionalContentRequest):
    """Generate emotionally-charged content."""
    try:
        result = await generate_emotional_content(
            request.topic,
            request.emotion,
            request.intensity,
            request.sensory,
            request.format,
            request.audience
        )
        return {"content": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/narrative", response_model=List[NarrativePoint])
async def analyze_narrative(request: NarrativeRequest):
    """Analyze narrative physics (tension/pacing)."""
    try:
        result = await analyze_narrative_physics(request.content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/lore", response_model=BrandLore)
async def generate_lore(request: BrandLoreRequest):
    """Generate brand mythology and lore."""
    try:
        result = await generate_brand_lore(
            request.brand_info,
            request.archetype,
            request.style
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/resurrect", response_model=List[ResurrectionVariant])
async def resurrect_content(request: ResurrectionRequest):
    """Resurrect old content with new angles."""
    try:
        result = await resurrect_idea(request.content, request.pivot_angle)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze", response_model=DeepAnalysis)
async def analyze_content(request: AnalyzeWhyItWorksRequest):
    """Deep psychological analysis of why content works."""
    try:
        result = await analyze_why_it_works(request.content, request.audience_persona)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
