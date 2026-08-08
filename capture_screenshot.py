import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Set viewport to a good desktop size
        await page.set_viewport_size({"width": 1280, "height": 800})
        
        await page.goto("http://localhost:8000/")
        # Wait for the auto-open script to trigger (it has a 500ms timeout)
        await page.wait_for_timeout(2000)
        
        # Take a screenshot
        await page.screenshot(path="screenshot.png", full_page=True)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
