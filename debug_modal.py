import asyncio
from playwright.async_api import async_playwright

async def debug_modal():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Listen for console errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(f"[pageerror] {err}"))

        await page.goto("http://localhost:8000/")
        await page.wait_for_timeout(1000)

        # Click the Control Panel Auth button
        await page.evaluate("openProtectedAdminPanel()")
        await page.wait_for_timeout(1000)

        # Check if index-admin-cms-root is empty or populated
        inner_html = await page.inner_html("#index-admin-cms-root")
        print("Length of innerHTML in #index-admin-cms-root:", len(inner_html))
        
        # Take screenshot of open modal
        await page.screenshot(path="debug_modal_screenshot.png")
        
        print("Console Errors:", console_errors)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(debug_modal())
