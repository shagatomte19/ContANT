from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Gemini AI (required)
    gemini_api_key: str
    
    # Supabase (optional - only needed for auth and content history)
    supabase_url: Optional[str] = None
    supabase_anon_key: Optional[str] = None
    supabase_service_key: Optional[str] = None
    
    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # Rate Limiting
    rate_limit: str = "10/minute"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def supabase_enabled(self) -> bool:
        """Check if Supabase is configured."""
        return all([self.supabase_url, self.supabase_anon_key, self.supabase_service_key])
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
