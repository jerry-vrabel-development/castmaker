"""Build a single-page preview for hosts that wrap the page in their own
<html>/<head>/<body> (such as a claude.ai Artifact). Copies the app into
dist-preview/ with the document skeleton and PWA-only tags removed."""
import re, shutil, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
out = root / "dist-preview"
shutil.rmtree(out, ignore_errors=True)
out.mkdir()
for name in ["styles.css"]:
    shutil.copy(root / name, out / name)
shutil.copytree(root / "js", out / "js")
shutil.copytree(root / "icons", out / "icons")
html = (root / "index.html").read_text()
for pat in [r"<!doctype html>\s*", r"</?html[^>]*>\s*", r"</?head>\s*", r"</?body>\s*",
            r'<meta charset[^>]*>\s*', r'<meta name="viewport"[^>]*>\s*', r'<meta name="theme-color"[^>]*>\s*',
            r'<link rel="manifest"[^>]*>\s*', r'<link rel="icon"[^>]*>\s*']:
    html = re.sub(pat, "", html, flags=re.I)
(out / "index.html").write_text(html.strip() + "\n")
print("preview written to", out)
