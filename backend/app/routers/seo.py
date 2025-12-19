"""
SEO Tools Router - API endpoints for SEO analysis and optimization.
"""
from typing import List
from fastapi import APIRouter, HTTPException

from ..schemas import (
    SEOKeywordRequest,
    SEOKeyword,
    SEOAuditRequest,
    SEOAudit,
    SEOMetaRequest,
    SEOMeta,
    SEOGapRequest,
    SEOGapAnalysis,
    BacklinkRequest,
    BacklinkStrategy,
    LocalSEORequest,
    LocalSEO,
)
from ..services import (
    generate_seo_keywords,
    perform_seo_audit,
    generate_seo_meta_tags,
    analyze_competitor_gap,
    generate_backlink_strategy,
    generate_local_seo_audit,
)

router = APIRouter(prefix="/api/seo", tags=["SEO Tools"])


@router.post("/keywords", response_model=List[SEOKeyword])
async def generate_keywords(request: SEOKeywordRequest):
    """Generate SEO keywords for a topic."""
    try:
        result = await generate_seo_keywords(request.topic, request.region)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/audit", response_model=SEOAudit)
async def audit_content(request: SEOAuditRequest):
    """Perform SEO audit on content."""
    try:
        result = await perform_seo_audit(request.content, request.target_keyword)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/meta", response_model=List[SEOMeta])
async def generate_meta(request: SEOMetaRequest):
    """Generate SEO meta tags."""
    try:
        result = await generate_seo_meta_tags(request.content, request.keyword)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/gap", response_model=SEOGapAnalysis)
async def analyze_gap(request: SEOGapRequest):
    """Analyze content gap with competitor."""
    try:
        result = await analyze_competitor_gap(request.my_content, request.competitor_content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/backlinks", response_model=BacklinkStrategy)
async def generate_backlinks(request: BacklinkRequest):
    """Generate backlink strategy."""
    try:
        result = await generate_backlink_strategy(request.domain, request.niche)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/local", response_model=LocalSEO)
async def generate_local_seo(request: LocalSEORequest):
    """Generate local SEO recommendations."""
    try:
        result = await generate_local_seo_audit(
            request.business_name,
            request.location,
            request.type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
