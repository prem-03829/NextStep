import asyncio
import json
import logging
from typing import List, Dict
from backend.scraper.scraper import ShikshaScraper
from backend.db.supabase_client import get_supabase_client
from backend.utils.cleaner import safe_get

logger = logging.getLogger("NextStepMain")

async def insert_to_supabase(data: List[Dict]):
    """Inserts scraped data into Supabase with proper relationships."""
    supabase = get_supabase_client()
    
    for item in data:
        try:
            # 1. Insert College
            college_obj = {
                "name": item.get("name"),
                "url": item.get("url"),
                "city": item.get("city"),
                "state": item.get("state"),
                "nirf_rank": item.get("nirf_rank"),
                "naac_grade": item.get("naac_grade")
            }
            
            # Use upsert to avoid duplicates by URL
            res = supabase.table("colleges").upsert(college_obj, on_conflict="url").execute()
            college_id = res.data[0]["id"]
            
            # 2. Insert Placements
            placement_data = item.get("placements", {})
            if placement_data:
                placement_obj = {
                    "college_id": college_id,
                    "avg_package": placement_data.get("avg_package"),
                    "highest_package": placement_data.get("highest_package"),
                    "placement_rate": placement_data.get("placement_rate")
                }
                supabase.table("placements").upsert(placement_obj, on_conflict="college_id").execute()
            
            # 3. Insert Courses
            courses = item.get("courses", [])
            for course in courses:
                course_obj = {
                    "college_id": college_id,
                    "name": course.get("name"),
                    "degree_type": course.get("degree"),
                    "duration": course.get("duration"),
                    "entrance_exam": course.get("entrance_exam")
                }
                # Upsert based on college_id + name
                c_res = supabase.table("courses").upsert(course_obj, on_conflict="college_id, name").execute()
                course_id = c_res.data[0]["id"]
                
                # 4. Insert Course Details (Categories/Ranks)
                details = course.get("details", [])
                for detail in details:
                    detail_obj = {
                        "course_id": course_id,
                        "category": detail.get("category"),
                        "quota": detail.get("quota"),
                        "fees": detail.get("fees"),
                        "intake": detail.get("intake"),
                        "eligibility": detail.get("eligibility"),
                        "opening_rank": detail.get("opening_rank"),
                        "closing_rank": detail.get("closing_rank"),
                        "year": detail.get("year")
                    }
                    supabase.table("course_details").insert(detail_obj).execute()
                    
            logger.info(f"Successfully inserted/updated data for {item['name']}")
            
        except Exception as e:
            logger.error(f"Failed to insert data for {item.get('name', 'Unknown')}: {e}")

async def main():
    # Sample URLs for Shiksha
    urls = [
        "https://www.shiksha.com/university/iit-delhi-indian-institute-of-technology-299",
        "https://www.shiksha.com/university/bits-pilani-birla-institute-of-technology-and-science-467"
    ]
    
    scraper = ShikshaScraper(headless=True)
    logger.info("Starting scraper...")
    
    # Scrape data
    results = await scraper.scrape_batch(urls)
    
    # Optional: Save raw JSON for debugging
    with open("raw_output.json", "w") as f:
        json.dump(results, f, indent=4)
        logger.info("Saved raw output to raw_output.json")
    
    # Insert into Supabase
    if results:
        logger.info("Inserting data into Supabase...")
        await insert_to_supabase(results)
    else:
        logger.warning("No data scraped to insert.")

if __name__ == "__main__":
    asyncio.run(main())
