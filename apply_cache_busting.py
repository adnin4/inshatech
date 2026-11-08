import re

def apply_cache_busting():
    # 1. Update _headers file
    headers_content = '''/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0
'''
    with open('_headers', 'w', encoding='utf-8') as f:
        f.write(headers_content)
    print("Updated _headers with no-cache rules.")

    # 2. Update index.html head & script tags with version query string
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    meta_cache = '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n    <meta http-equiv="Pragma" content="no-cache">\n    <meta http-equiv="Expires" content="0">\n'
    if 'http-equiv="Cache-Control"' not in html:
        html = html.replace('<head>', '<head>\n    ' + meta_cache)

    html = html.replace('href="style.css"', 'href="style.css?v=1000.1"')
    html = html.replace('src="app.js"', 'src="app.js?v=1000.1"')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated index.html with cache-busting tags.")

apply_cache_busting()
