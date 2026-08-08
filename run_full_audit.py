import os
import re

def audit_project():
    files = ['index.html', 'app.js', 'style.css', 'affiliate.html', 'blog.html', 'compare.html', 'marketplace.html', 'portal.html', 'store.html']
    issues = []

    for fname in files:
        if not os.path.exists(fname):
            issues.append(f"Missing file: {fname}")
            continue
        
        with open(fname, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # Check for unclosed HTML tags or broken JS console errors
        if fname.endswith('.html'):
            if content.count('<script') != content.count('</script>'):
                issues.append(f"Script tag count mismatch in {fname}")
            if content.count('<div') != content.count('</div>'):
                issues.append(f"Div tag count warning in {fname}: {content.count('<div')} divs vs {content.count('</div>')} closing divs")

        if fname == 'app.js':
            # Check for potential null reference crashes
            null_derefs = re.findall(r'document\.getElementById\([\'"](.*?)[\'"]\)\.(onclick|value|style|innerHTML|textContent)', content)
            print(f"Total direct element accesses in app.js: {len(null_derefs)}")

    print("Audit Complete!")
    print(f"Total Issues Found: {len(issues)}")
    for iss in issues:
        print(" -", iss)

if __name__ == '__main__':
    audit_project()
