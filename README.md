# Anki Prompt Builder

A small static website that writes the perfect prompt for turning **any source** — a PDF, an image, a YouTube transcript, a book chapter or your notes — into **import-ready Anki cards** that use **your own note types** (no new, badly-styled note types get created).

You see how every card will look in Anki (front and back) before you pick it, choose the note types that suit your information, fill a few settings, then copy the prompt (or download it as `.txt`) and paste it into ChatGPT, Gemini or Claude together with your file.

## Features

- **84 note types + 21 Smart modes**, each with a real front/back preview rendered by Anki itself.
- **🌐 Universal prompt** for anyone: uses Anki’s built-in Basic and Cloze note types — simple cloze (half question style, half fill-in-the-blank), basic and table cloze — with context, explanation and a memory trick on every back.
- **Smart Basic and Smart Cloze** are selected as whole note types by default (the AI picks the best mode per fact); open *“Specific modes chuno”* to keep only certain modes.
- **📘 Card-making guide** — every note type has an “ℹ️ Kaise banayein” button and a Guide section: step-by-step how to make the card by hand in Anki, each field with an example, format rules, and a one-click “copy as import file”.
- **Search by kind of information** — `dates`, `map`, `article text`, `numbers`, `causes`, `statements`… (Hinglish works too: `saal tarikh`, `naksha`, `samkaleen`).
- **🎯 Universal MCQ** — one tap-to-answer MCQ note type for every subject (GS, Maths, Reasoning, English, Hindi, Law…), with options shuffled on every review, multi-correct support, 16 subject colour themes, and light/dark/phone layouts. Download the note type from its tile (`assets/notetypes/Universal_MCQ.apkg`).
- **14 ready subject sets** — Polity, History, Geography, Economy, Environment, Science, Culture, Current Affairs, Law, Mains, English, Prelims practice, Chronology pack, Universal.
- Prompt rules built in: compulsory question-style cloze hints, first-timer friendly cards, a memory trick on every note, fact-checking, PYQ merging, no typed-answer cards.
- Optional extra cards from **NCERT, Wikipedia, current affairs and PIB** up to the date you set.
- Three deck modes: choose the deck while importing, AI sub-decks under a parent deck, or one fixed deck.
- Light / dark theme, works on phones, no sign-up, no tracking — settings stay in your browser.

## Use it

1. Open the site.
2. Pick note types (search, a ready set, or tap a card preview).
3. Fill the settings → **Copy prompt** (or **⬇ .txt**).
4. Paste into your AI, attach your file, and save its answer as `anki_import.txt`.
5. Anki → **File → Import** → pick the file. Cards land in your existing note types.

## Put it on GitHub Pages

1. Create a new **public** repository on GitHub, e.g. `anki-prompt-builder`.
2. Upload **everything in this folder** (keep the folder structure; include the hidden `.nojekyll` file).
3. Repository → **Settings → Pages** → *Build and deployment* → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → **Save**.
4. After a minute the site is live at `https://YOUR-USERNAME.github.io/anki-prompt-builder/`.
5. In `index.html`, replace `YOUR-USERNAME` in the GitHub link with your GitHub username.

## Folder structure

```
index.html              the page
assets/css/style.css    all styles (light + dark)
assets/js/data.js       note-type catalog: names, fields, format rules, examples, presets
assets/js/app.js        picker, search, previews and prompt builder
assets/js/previews.js  front (-q) and back (-a) preview of every card, embedded as images
assets/img/             favicon and social-share image
assets/notetypes/       downloadable note types (.apkg)
.nojekyll               tells GitHub Pages to serve the files as they are
```

## Notes

- Note-type names in `data.js` must match your Anki note types exactly (emoji and spaces included). If you rename a note type in Anki, rename it here too.
- Map cards (Map Pin, Map Select, State Trail, Line Drop) need `_arcade_india.js` in your Anki media folder.
- Previews show the light theme with sample content; interactive cards are shown as they first open.
