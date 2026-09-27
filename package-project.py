import zipfile
import os
import shutil

project_root = os.getcwd()
output_zip = os.path.join(project_root, 'viancapital-website.zip')

include_files = [
    'index.html',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'server.ts',
    'metadata.json',
    '.env.example',
    '.gitignore',
    'README.md',
    'app.py',
    'requirements.txt',
]

include_dirs = ['src', 'dist', 'streamlit_app']

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # Add top-level individual files
    for fname in include_files:
        fpath = os.path.join(project_root, fname)
        if os.path.isfile(fpath):
            zipf.write(fpath, fname)
            print(f"Added file: {fname}")

    # Add directories recursively
    for dirname in include_dirs:
        dirpath = os.path.join(project_root, dirname)
        if os.path.isdir(dirpath):
            for root, _, files in os.walk(dirpath):
                for f in files:
                    if f.endswith('.zip'):
                        continue
                    full_path = os.path.join(root, f)
                    rel_path = os.path.relpath(full_path, project_root)
                    zipf.write(full_path, rel_path)
                    print(f"Added: {rel_path}")

print("Successfully created:", output_zip)
print("File size:", os.path.getsize(output_zip), "bytes")

# Copy to dist so it can be served statically as well
dist_dir = os.path.join(project_root, 'dist')
if os.path.isdir(dist_dir):
    shutil.copy2(output_zip, os.path.join(dist_dir, 'viancapital-website.zip'))
    print("Copied to dist/viancapital-website.zip")

# Copy to public
public_dir = os.path.join(project_root, 'public')
os.makedirs(public_dir, exist_ok=True)
shutil.copy2(output_zip, os.path.join(public_dir, 'viancapital-website.zip'))
print("Copied to public/viancapital-website.zip")
