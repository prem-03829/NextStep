import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from backend/.env
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

def get_supabase_client() -> Client:
    """Returns a configured Supabase client using environment variables."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")
        
    return create_client(url, key)
