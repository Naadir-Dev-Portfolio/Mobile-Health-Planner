export const REGIMEN_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Supplement Plan Demo</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #101113;
      --panel: #1b1d21;
      --line: #30343a;
      --text: #f4f5f6;
      --muted: #aeb4bd;
      --accent: #82d4ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 20px;
    }
    main {
      max-width: 780px;
      margin: 0 auto;
    }
    h1 {
      margin: 0 0 6px;
      font-size: 28px;
      letter-spacing: 0;
    }
    p {
      margin: 0 0 18px;
      color: var(--muted);
      line-height: 1.5;
    }
    section {
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--panel);
      padding: 16px;
      margin: 12px 0;
    }
    h2 {
      margin: 0 0 10px;
      font-size: 15px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    ul {
      margin: 0;
      padding-left: 18px;
      line-height: 1.7;
    }
    .note {
      margin-top: 18px;
      font-size: 13px;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <main>
    <h1>Supplement Plan Demo</h1>
    <p>A public demo schedule showing how the mobile planner can render a simple routine without including private health or personal-care data.</p>

    <section>
      <h2>Morning</h2>
      <ul>
        <li>Multivitamin with breakfast</li>
        <li>Vitamin D</li>
        <li>Omega-3</li>
      </ul>
    </section>

    <section>
      <h2>Midday</h2>
      <ul>
        <li>Hydration reminder</li>
        <li>Optional magnesium or electrolyte support</li>
      </ul>
    </section>

    <section>
      <h2>Evening</h2>
      <ul>
        <li>Magnesium</li>
        <li>Review tomorrow's workout plan</li>
      </ul>
    </section>

    <p class="note">This file is intentionally static for the portfolio version. Replace it with your own generated routine data in a private fork.</p>
  </main>
</body>
</html>`;
