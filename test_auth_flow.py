import asyncio
from playwright.async_api import async_playwright

async def debug_login_flow():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(f"[pageerror] {err}"))

        await page.goto("http://localhost:8000/")
        await page.wait_for_timeout(500)

        # 1. Open modal -> see Login Card
        await page.evaluate("openProtectedAdminPanel()")
        await page.wait_for_timeout(500)
        card_html = await page.inner_html("#index-admin-cms-root")
        print("Login Card HTML length:", len(card_html))
        await page.screenshot(path="login_card_screenshot.png")

        # 2. Click 1-Click Master Unlock -> see 20 Module Studio
        await page.evaluate("handleAdminMasterUnlock()")
        await page.wait_for_timeout(500)
        studio_html = await page.inner_html("#index-admin-cms-root")
        print("Studio HTML length after unlock:", len(studio_html))
        await page.screenshot(path="unlocked_studio_screenshot.png")

        print("Console Errors:", console_errors)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(debug_login_flow())
