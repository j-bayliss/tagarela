# Tagarela — Brazilian Portuguese study companion

A mobile-first Brazilian Portuguese learning app with a calmer, learner-first flow:
**Hoje**, **Aulas**, **Praticar**, and **Revisão**.

This build focuses on user feel, onboarding, lesson quality, Brazilian Portuguese consistency,
and a cleaner codebase structure.

---

## What's new in this quality/refactor build

### User feel and tabs

- Reduced the bottom navigation from six tabs to four learner-focused tabs:
  - **Hoje** — daily mission and next best step.
  - **Aulas** — structured A1 Brazilian Portuguese course path.
  - **Praticar** — phrasebook, AI conversation, missions, grammar, translation, listening and speaking.
  - **Revisão** — spaced review, mistake log and backup/restore.
- Moved former **Conversa**, **Viagem**, **Essenciais** and **Treino** into the new **Praticar** hub.
- Added a clearer daily flow: next lesson → review due cards → one speaking/listening task.
- Added lesson completion result screens.
- Improved mobile layout, button hierarchy and learner feedback.

### Brazilian Portuguese only

- The app is now fixed to **Brazilian Portuguese (`pt-BR`)**.
- Removed the `pt-PT` option from the user-facing flow.
- Tutor prompts, speech synthesis, browser speech recognition and Azure pronunciation assessment use `pt-BR`.
- UI copy has been cleaned up to avoid mixed European/Brazilian Portuguese wording.

### Onboarding

- New first-run onboarding.
- The user chooses:
  - learning goal
  - daily target: 5, 10 or 15 minutes
- API keys are now optional and can be added later via the settings gear.
- The learner can start lessons and review without adding Anthropic or Azure keys.

### Lesson quality

- The A1 course path now has richer lessons with:
  - mission-based titles
  - tiny grammar/use rule
  - friendly coach tip
  - phrase pack
  - multiple-choice recognition
  - word-order practice
  - fill-the-blank practice
  - listen-and-type dictation
  - completion screen and review-card integration
- 32 lessons are retained but improved and organised into four themed units:
  - Começo esperto
  - Café e comida
  - Pela cidade
  - Pessoas e planos

### Refactored codebase

The old large `App.jsx` has been split into smaller modules:

```text
src/
  components/
    Header.jsx
    TabBar.jsx
    Onboarding.jsx
    SettingsSheet.jsx
    Common.jsx
    Icons.jsx
  data/
    lessons.js
    essentials.js
    scenarios.js
    pronunciation.js
  services/
    anthropic.js
    azureSpeech.js
    spacedRepetition.js
    storage.js
  utils/
    language.js
    progress.js
  views/
    TodayView.jsx
    LessonsView.jsx
    PracticeView.jsx
    ReviewView.jsx
  App.jsx
  main.jsx
  index.css
```

Azure Speech is dynamically imported only when pronunciation scoring is used, so the main app bundle is smaller and the speech SDK is split into a separate production chunk.

---

## 1. Run locally

You need Node.js. Node 22 is recommended.

```bash
npm install
npm run dev
```

Open the printed local URL.

The app no longer blocks startup with an API-key screen. Lessons and review work immediately.

---

## 2. Optional Anthropic setup

Anthropic is used for:

- AI conversation
- role-play missions
- grammar correction
- translation grading

Setup:

1. Go to Anthropic Console and create an API key.
2. Set a monthly spend limit.
3. Open the app → gear icon → paste the key.

This prototype stores the key in localStorage on your device. For a public version, move AI calls behind a backend.

---

## 3. Optional Azure Speech setup

Azure Speech is used for pronunciation scoring in **Praticar → Fala**.

Setup:

1. In Azure Portal, create an **Azure AI Speech** resource.
2. Use the **Free F0** tier while testing if available in your subscription/region.
3. Copy one Speech key and region, for example `uksouth`.
4. Open the app → gear icon → paste the Azure key and region.
5. Go to **Praticar → Fala**, allow microphone access, listen to the phrase, then record.

Pronunciation assessment is fixed to Brazilian Portuguese (`pt-BR`) in this build.

---

## 4. Build

```bash
npm run build
```

The production app is written to `dist/`.

---

## 5. Deploy to GitHub Pages

```bash
npm run deploy
```

Then in GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `gh-pages` / root**.

`vite.config.js` uses `base: "./"`, so the app works at a GitHub Pages sub-path.

---

## 6. Data and backup

Your progress lives in localStorage on that device. Use **Revisão → Backup** before clearing browser data or moving to another device.

The backup includes:

- review deck
- mistakes
- streak
- lesson progress
- onboarding preferences

---

## Security note

This build is suitable for a private/local prototype. Before public release:

- move Anthropic calls behind a backend
- use an Azure token endpoint instead of storing the Azure key in the browser
- add account/cloud sync only after the local learning loop is polished

---

## Audit note

`npm audit --audit-level=high` reports no high-severity issues. The Microsoft Speech SDK currently pulls in a moderate `uuid` advisory through its dependency tree; monitor the SDK for an upstream fix.

---

## Continuous integration & deployment

`.github/workflows/deploy.yml` runs on every push/PR to `main`:

1. installs dependencies
2. runs `npm test` (Vitest unit tests)
3. runs `npm run build`
4. on `main`, deploys `dist/` to GitHub Pages

**One-time setup:** in the repo, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**. After that, every push to `main` that passes tests deploys automatically — no manual `npm run deploy` needed (that script remains available for local one-off deploys).

The workflow uses `npm install` rather than `npm ci` because the committed lockfile may predate recent dependency additions. Run `npm install` locally and commit the refreshed `package-lock.json`, then you can switch the workflow to `npm ci` for stricter, reproducible builds.
