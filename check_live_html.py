import urllib.request
req = urllib.request.Request('https://inshatech.pages.dev/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    print('admin-control-modal in html:', 'admin-control-modal' in html)
    print('Duplicate style in html:', 'style="display:none;" style="max-width:420px;"' in html)
    
    # Check what happens inside admin-control-modal
    import re
    modal_match = re.search(r'<div id="admin-control-modal".*?>(.*?)</div>\s*<!--', html, re.DOTALL)
    if modal_match:
        print("Modal content length:", len(modal_match.group(1)))
    else:
        print("Modal not found")
except Exception as e:
    print("Error:", e)
