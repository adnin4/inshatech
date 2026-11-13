import sys
import os

try:
    import tomllib
except ImportError:
    try:
        import tomli as tomllib
    except ImportError:
        # Fallback simple parser if tomllib is missing
        tomllib = None

def main():
    if not os.path.exists('wrangler.toml'):
        print('ERROR: wrangler.toml not found')
        sys.exit(1)

    errors = []
    if tomllib:
        with open('wrangler.toml', 'rb') as f:
            data = tomllib.load(f)

        if 'main' in data:
            errors.append('Worker key "main" is forbidden in Cloudflare Pages configuration')
        if 'assets' in data:
            errors.append('Worker key "[assets]" is forbidden in Cloudflare Pages configuration')

        out_dir = data.get('pages_build_output_dir')
        if not out_dir:
            errors.append('Missing "pages_build_output_dir" in wrangler.toml')
        elif out_dir != 'dist-pages' and out_dir != '.':
            errors.append(f'Unexpected pages_build_output_dir: "{out_dir}". Expected "dist-pages"')

        if data.get('name') != 'inshatech':
            errors.append(f'Unexpected project name: "{data.get("name")}". Expected "inshatech"')

        do_bindings = data.get('durable_objects', {}).get('bindings', [])
        for b in do_bindings:
            if not b.get('name') or not b.get('class_name') or not b.get('script_name'):
                errors.append(f'Invalid Durable Object binding structure: {b}')
    else:
        with open('wrangler.toml', 'r', encoding='utf-8') as f:
            content = f.read()
        if 'main =' in content:
            errors.append('main = key present')
        if '[assets]' in content:
            errors.append('[assets] section present')
        if 'pages_build_output_dir = "dist-pages"' not in content and 'pages_build_output_dir = "."' not in content:
            errors.append('pages_build_output_dir is not "dist-pages"')
        out_dir = 'dist-pages' if 'dist-pages' in content else '.'

    if errors:
        print('INVALID WRANGLER CONFIG:', errors)
        sys.exit(1)

    print(f'Wrangler config valid for Cloudflare Pages! (output_dir={out_dir})')

if __name__ == '__main__':
    main()
