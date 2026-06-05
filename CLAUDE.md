# Thughrah Project Rules

You are working on the existing Thughrah website.

Never rebuild the website from scratch.

General rules:
1. Do not remove existing sections unless explicitly requested.
2. Do not change the visual identity, dark theme, logo usage, layout style, or Arabic RTL direction unless explicitly requested.
3. Do not change simulator logic unless the task is specifically about the simulator.
4. Do not change deployment/security files unless the task is specifically about deployment, headers, CSP, YouTube embed, or Cloudflare.
5. Do not expose API keys, tokens, webhook URLs, secrets, or private links in frontend files.
6. Do not install packages unless explicitly approved.
7. Do not run git push unless explicitly approved.
8. Do not make unrelated cleanup or refactoring.

Simulator rules:
1. Exam mode duration must be 150 minutes.
2. Training mode duration may remain 230 minutes.
3. In exam mode, answers and explanations must not appear under the question.
4. In training mode, explanations may appear only after answering.
5. Do not change question IDs, model IDs, or answer keys unless explicitly requested.

Editing rules:
1. Before editing, summarize the exact files you intend to modify.
2. After editing, show a concise diff summary.
3. For small text/layout edits, modify only the relevant section.
4. For risky files like src/App.tsx and src/Simulator.tsx, make the smallest possible change.
5. After any code change, run the available build or type-check command if present.
6. Do not commit or push until I explicitly say: push.
