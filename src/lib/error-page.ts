export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Something went wrong — Winteriors Decor LLC</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:#faf7ff; color:#1a1033; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
  .card { max-width:520px; text-align:center; }
  h1 { font-size:28px; margin:0 0 12px; color:#6b21a8; }
  p { color:#4b3a6b; line-height:1.5; }
  .row { display:flex; gap:12px; justify-content:center; margin-top:24px; flex-wrap:wrap; }
  a, button { font:inherit; padding:10px 20px; border-radius:4px; border:0; cursor:pointer; text-decoration:none; }
  .primary { background:#6b21a8; color:#fff; }
  .ghost { background:transparent; color:#6b21a8; border:1px solid #6b21a8; }
</style>
</head>
<body>
  <div class="card">
    <h1>Something went wrong</h1>
    <p>We hit an unexpected error rendering this page. Please try again, or head back to the home page.</p>
    <div class="row">
      <button class="primary" onclick="location.reload()">Try again</button>
      <a class="ghost" href="/">Go home</a>
    </div>
  </div>
</body>
</html>`;
}
