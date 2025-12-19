"""
Content Generation Router - API endpoints for content creation and modification.
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends

from ..schemas import (
    ContentRequest,
    ContentFormat,
    ModifyContentRequest,
    AnalyzePsychologyRequest,
    GenerateStrategyRequest,
    GenerateImageRequest,
    PsychologyAnalysis,
    ContentStrategy,
    ContentHistoryResponse,
    UserResponse,
)
from ..services import (
    generate_platform_content,
    modify_content,
    analyze_content_psychology,
    generate_content_strategy,
    generate_marketing_image,
    get_current_user,
    require_auth,
    save_content_history,
    get_content_history,
    delete_content_history,
)

router = APIRouter(prefix="/api/content", tags=["Content"])


@router.post("/generate")
async def generate_content(
    request: ContentRequest,
    format: ContentFormat,
    user: Optional[UserResponse] = Depends(get_current_user)
):
    """Generate content for a specific platform format."""
    try:
        content = await generate_platform_content(request, format)
        
        # Save to history if user is authenticated
        if user:
            await save_content_history(
                user_id=user.id,
                format=format.value,
                content=content,
                original_title=request.source_file.name if request.source_file else request.source_text[:50]
            )
        
        return {"content": content, "format": format.value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-batch")
async def generate_content_batch(
    request: ContentRequest,
    user: Optional[UserResponse] = Depends(get_current_user)
):
    """Generate content for multiple formats at once."""
    try:
        results = []
        for format in request.selected_formats:
            content = await generate_platform_content(request, format)
            results.append({"format": format.value, "content": content})
            
            # Save to history if user is authenticated
            if user:
                await save_content_history(
                    user_id=user.id,
                    format=format.value,
                    content=content,
                    original_title=request.source_file.name if request.source_file else request.source_text[:50]
                )
        
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/modify")
async def modify_content_endpoint(request: ModifyContentRequest):
    """Modify selected content based on instruction."""
    try:
        result = await modify_content(
            request.full_context,
            request.selected_text,
            request.instruction
        )
        return {"content": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/psychology", response_model=PsychologyAnalysis)
async def analyze_psychology(request: AnalyzePsychologyRequest):
    """Analyze content for psychological impact."""
    try:
        result = await analyze_content_psychology(request.content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/strategy", response_model=ContentStrategy)
async def generate_strategy(request: GenerateStrategyRequest):
    """Generate content strategy for a topic."""
    try:
        result = await generate_content_strategy(request.topic)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/image")
async def generate_image(request: GenerateImageRequest):
    """Generate a marketing image."""
    try:
        image_url = await generate_marketing_image(request.prompt)
        return {"imageUrl": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============== CONTENT HISTORY ENDPOINTS ==============

@router.get("/history", response_model=List[ContentHistoryResponse])
async def get_history(user: UserResponse = Depends(require_auth)):
    """Get user's content generation history."""
    try:
        history = await get_content_history(user.id)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/history/{content_id}")
async def delete_history_item(
    content_id: str,
    user: UserResponse = Depends(require_auth)
):
    """Delete a content history item."""
    try:
        success = await delete_content_history(user.id, content_id)
        if not success:
            raise HTTPException(status_code=404, detail="Content not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
