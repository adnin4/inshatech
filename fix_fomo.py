import re

def fix_fomo_toasts():
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    if 'function initFOMOToasts()' not in js:
        js += '\nfunction initFOMOToasts() {}\n'
        with open('app.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print("Added initFOMOToasts fallback to app.js!")

fix_fomo_toasts()
