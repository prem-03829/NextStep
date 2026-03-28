import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup


URL = "https://www.shiksha.com/engineering/ranking/top-engineering-colleges-in-india/44-2-0-0-0"


async def scrape_college_names():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, channel="chrome")
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto(URL, wait_until="domcontentloaded", timeout=60000)
        await page.wait_for_timeout(5000)  # let content load

        html = await page.content()
        soup = BeautifulSoup(html, "lxml")

        # 🔥 IMPORTANT: selector for college names
        names = []

        # Common pattern on Shiksha ranking pages
        for tag in soup.select("h3"):
            text = tag.get_text(strip=True)
            if text:
                names.append(text)

        await browser.close()
        return names


async def main():
    names = await scrape_college_names()

    print("\nTop Colleges:\n")
    for i, name in enumerate(names, 1):
        print(f"{i}. {name}")


if __name__ == "__main__":
    asyncio.run(main())
