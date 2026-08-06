# Story Forge — Memoir Onboarding

This file governs the onboarding conversation for this project's book — a true story about the author's father and family. **Read this file in full before asking a single question.**

This project's genre, factual license, and privacy settings are already fixed (see below) — this gate does **not** need to ask about genre or fiction vs. non-fiction. It only needs to gather the specific facts of *this* family's story.

---

## When to Run This Gate

Run this gate only when the Core memory bank files still show `[TBD]` placeholders for the basics (title, father's name, timeline) AND the author hasn't said to skip it. If real answers already exist in `people_and_places.md` / `projectbrief.md`, **skip this gate entirely** — just read the memory bank and assist.

---

## Fixed Project Facts (do not ask about these)

- **Format:** Markdown, divided into chapters.
- **Genre:** True storytelling-style biography/memoir about the author's real father and family. Not fiction. No invented characters or invented worldbuilding.
- **Factual license:** Standard memoir convention — reconstructed dialogue and scene detail are allowed when grounded in real memory; events themselves are never invented. See `references/author_rules.md` §0.
- **Privacy:** This repository is private. The README and memory bank may include real names and personal family details freely.
- **Title:** Not yet decided — use `[Book Title — TBD]` until the author sets one.

---

## Core Principles

1. **One question at a time.** Never stack multiple questions in one message.
2. **Everything is optional.** If the author says "skip", "not sure", "later", or gives a blank answer — accept it and move on.
3. **Run once, never again.** Once real answers exist in the memory bank, never repeat this onboarding. In future sessions, read the memory bank silently and begin.
4. **No repeated pinging.** If the author seems in a rush ("just start", "skip everything") — skip all remaining questions, use `[TBD]` placeholders, and initialize immediately.
5. **Draft-first.** If the author provides existing material (notes, an outline, chapters already written, photos, letters, interview transcripts), extract everything you can from it and skip questions already answered by that material. The author has said the book's content is already fully worked out — prioritize importing/organizing what they give you over asking questions they've already answered elsewhere.
6. **Respect the author's time.** Keep each question brief.

---

## The Gate Flow

### Step 1 — Existing Material

Ask:

> "Do you have existing material ready to bring in — chapter drafts, notes, an outline, photos, letters, interview transcripts? Share file paths or paste content and I'll pull what I can from it. Otherwise say 'no' or 'skip' and we'll go question by question."

- If material is provided: extract the father's name, family members, timeline, chapter structure, and any title/working-title. Pre-fill answers for subsequent steps and skip what's already answered.
- If skipped: proceed to Step 2.

### Step 2 — Title

> "Do you have a title or working title in mind yet? Say 'skip' if not — we'll keep it as TBD."

### Step 3 — The Father & Family

> "Tell me about your father — his name, and who else is central to this story (family members, key people). Skip anything you're not ready to share yet."

Accept partial answers. Anything not given is marked `[TBD]` in `people_and_places.md`.

### Step 4 — Timeline & Setting

> "What time period and places does the story cover? A rough span is fine — we can get specific later."

### Step 5 — Narrative Structure (Optional)

> "Do you already know how the book is divided — number of chapters, whether it's chronological or organized some other way (theme, place, etc.)? Skip if you're still figuring that out."

### Step 6 — Emotional Core (Optional)

Only ask if the conversation is flowing naturally:

> "What's the heart of this story for you — the thing you most want a reader to feel or understand about your father by the end? Say 'skip' if you're not ready to put that into words yet."

Store as "North Star" in `story_structure.md`. This is often the most personal question in the gate — never push if the author hesitates.

### Step 7 — Dialogue Language (Optional)

> "Any specific language or dialect that shows up in family dialogue (e.g., Hinglish, a regional language)? Or standard English throughout?"

### Step 8 — Sources (Optional)

> "Are there specific sources you're drawing on — letters, journals, photos, official records, interviews with relatives? Doesn't need to be exhaustive; just flag what exists so we can track it in the research file."

### Step 9 — Summary & Approval

Present a concise project brief:

```
Here's what we've got so far:

Title: [title or TBD]
Author: [name or TBD]

Father: [name or TBD]
Key family members: [list or TBD]
Timeline / setting: [span and places, or TBD]
Structure: [chapter plan or TBD]
North Star: [emotional core or TBD]
Dialogue language: [language or English]
Sources: [list or TBD]

Ready to fill in the memory bank with this? Say yes — or tell me anything to adjust.
```

On approval → fill `book-memory-bank/Core/` files, replacing `[TBD]` placeholders with real answers, and regenerate `README.md` per `references/readme_template.md`.

---

## Handling Real, Sensitive Family Material

- Treat everything the author shares about their family as sensitive personal information, not as generic "story data."
- Never soften, sanitize, or "improve" a real fact to make it more dramatic — the honesty of the account matters more than narrative polish.
- If the author shares something painful or private, follow their lead on how much detail to record in the memory bank versus keep only in the chapter text itself.
- When in doubt about whether a detail should be recorded (vs. left as the author's private context), ask.

---

## After the Gate — Never Repeat

Once the gate has run and the memory bank has real (non-TBD) answers:
- **Do not run the gate again**, ever, in any session.
- **Do not ask any of these setup questions** in future sessions.
- In all future sessions: silently read memory bank files and assist with the current task.
