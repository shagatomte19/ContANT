/**
 * ContANT AI - API Service
 * Handles all communication with the FastAPI backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types imported from types.ts
import {
    ContentFormat,
    InputType,
    BrandVoice,
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
    ContentRequest
} from '../types';


// ============== HELPER FUNCTIONS ==============

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('supabase_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
}


// ============== CONTENT GENERATION ==============

export const generatePlatformContent = async (
    request: ContentRequest,
    format: ContentFormat
): Promise<string> => {
    const result = await apiRequest<{ content: string }>('/api/content/generate', {
        method: 'POST',
        body: JSON.stringify({ ...request, format }),
    });
    return result.content;
};

export const generateContentBatch = async (
    request: ContentRequest
): Promise<{ format: ContentFormat; content: string }[]> => {
    const result = await apiRequest<{ results: { format: ContentFormat; content: string }[] }>(
        '/api/content/generate-batch',
        {
            method: 'POST',
            body: JSON.stringify(request),
        }
    );
    return result.results;
};

export const modifyContent = async (
    fullContext: string,
    selectedText: string,
    instruction: string
): Promise<string> => {
    const result = await apiRequest<{ content: string }>('/api/content/modify', {
        method: 'POST',
        body: JSON.stringify({ fullContext, selectedText, instruction }),
    });
    return result.content;
};

export const analyzeContentPsychology = async (
    content: string
): Promise<PsychologyAnalysis> => {
    return apiRequest<PsychologyAnalysis>('/api/content/psychology', {
        method: 'POST',
        body: JSON.stringify({ content }),
    });
};

export const generateContentStrategy = async (
    topic: string
): Promise<ContentStrategy> => {
    return apiRequest<ContentStrategy>('/api/content/strategy', {
        method: 'POST',
        body: JSON.stringify({ topic }),
    });
};

export const generateMarketingImage = async (
    prompt: string
): Promise<string> => {
    const result = await apiRequest<{ imageUrl: string }>('/api/content/image', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
    });
    return result.imageUrl;
};


// ============== CONTENT HISTORY ==============

export const getContentHistory = async (): Promise<any[]> => {
    return apiRequest<any[]>('/api/content/history');
};

export const deleteContentHistory = async (contentId: string): Promise<void> => {
    await apiRequest<{ success: boolean }>(`/api/content/history/${contentId}`, {
        method: 'DELETE',
    });
};


// ============== POWER TOOLS ==============

export const generateContextualHooks = async (
    context: string,
    platform: string,
    frameworks: string[]
): Promise<HookSuggestion[]> => {
    return apiRequest<HookSuggestion[]>('/api/tools/hooks', {
        method: 'POST',
        body: JSON.stringify({ context, platform, frameworks }),
    });
};

export const generateEmotionalContent = async (
    topic: string,
    emotion: string,
    intensity: string,
    sensory: string[],
    format: string,
    audience: string
): Promise<string> => {
    const result = await apiRequest<{ content: string }>('/api/tools/emotional', {
        method: 'POST',
        body: JSON.stringify({ topic, emotion, intensity, sensory, format, audience }),
    });
    return result.content;
};

export const analyzeNarrativePhysics = async (
    content: string
): Promise<NarrativePoint[]> => {
    return apiRequest<NarrativePoint[]>('/api/tools/narrative', {
        method: 'POST',
        body: JSON.stringify({ content }),
    });
};

export const generateBrandLore = async (
    brandInfo: string,
    archetype: string,
    style: string
): Promise<BrandLore> => {
    return apiRequest<BrandLore>('/api/tools/lore', {
        method: 'POST',
        body: JSON.stringify({ brandInfo, archetype, style }),
    });
};

export const resurrectIdea = async (
    content: string,
    pivotAngle: string
): Promise<ResurrectionVariant[]> => {
    return apiRequest<ResurrectionVariant[]>('/api/tools/resurrect', {
        method: 'POST',
        body: JSON.stringify({ content, pivotAngle }),
    });
};

export const analyzeWhyItWorks = async (
    content: string,
    audiencePersona: string
): Promise<DeepAnalysis> => {
    return apiRequest<DeepAnalysis>('/api/tools/analyze', {
        method: 'POST',
        body: JSON.stringify({ content, audiencePersona }),
    });
};


// ============== SEO TOOLS ==============

export const generateSEOKeywords = async (
    topic: string,
    region: string
): Promise<SEOKeyword[]> => {
    return apiRequest<SEOKeyword[]>('/api/seo/keywords', {
        method: 'POST',
        body: JSON.stringify({ topic, region }),
    });
};

export const performSEOAudit = async (
    content: string,
    targetKeyword: string
): Promise<SEOAudit> => {
    return apiRequest<SEOAudit>('/api/seo/audit', {
        method: 'POST',
        body: JSON.stringify({ content, targetKeyword }),
    });
};

export const generateSEOMetaTags = async (
    content: string,
    keyword: string
): Promise<SEOMeta[]> => {
    return apiRequest<SEOMeta[]>('/api/seo/meta', {
        method: 'POST',
        body: JSON.stringify({ content, keyword }),
    });
};

export const analyzeCompetitorGap = async (
    myContent: string,
    competitorContent: string
): Promise<SEOGapAnalysis> => {
    return apiRequest<SEOGapAnalysis>('/api/seo/gap', {
        method: 'POST',
        body: JSON.stringify({ myContent, competitorContent }),
    });
};

export const generateBacklinkStrategy = async (
    domain: string,
    niche: string
): Promise<BacklinkStrategy> => {
    return apiRequest<BacklinkStrategy>('/api/seo/backlinks', {
        method: 'POST',
        body: JSON.stringify({ domain, niche }),
    });
};

export const generateLocalSEOAudit = async (
    businessName: string,
    location: string,
    type: string
): Promise<LocalSEO> => {
    return apiRequest<LocalSEO>('/api/seo/local', {
        method: 'POST',
        body: JSON.stringify({ businessName, location, type }),
    });
};
