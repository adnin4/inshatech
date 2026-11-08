import re

def fix_performance_and_html():
    # 1. Add Hardware Acceleration & Smooth Rendering CSS Rules to style.css
    with open('style.css', 'r', encoding='utf-8') as f:
        css = f.read()

    perf_css = '''
/* ============================================================
   HARDWARE ACCELERATION & ZERO-LAG SCROLLING OPTIMIZATIONS
   ============================================================ */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

.glass-card, .btn, .modal-box, .admin-modal-box {
  transform: translateZ(0);
  backface-visibility: hidden;
}

section {
  content-visibility: auto;
  contain-intrinsic-size: 1px 800px;
}
'''

    if 'HARDWARE ACCELERATION' not in css:
        css += '\n' + perf_css
        with open('style.css', 'w', encoding='utf-8') as f:
            f.write(css)
        print("Hardware acceleration CSS added!")

    # 2. Fix closing div mismatch in index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Balance div count if needed
    open_divs = html.count('<div')
    close_divs = html.count('</div>')

    if close_divs > open_divs:
        diff = close_divs - open_divs
        # Remove extra trailing </div> if at the bottom before body
        html = html.replace('</div>\n</body>', '</body>', diff)
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Fixed {diff} extra closing div(s) in index.html!")

fix_performance_and_html()
