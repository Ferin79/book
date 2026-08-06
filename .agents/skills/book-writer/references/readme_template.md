# README Template — This Project

This template is used by the AI to generate/refresh the `README.md` at the project root as real project details are gathered. This project is fixed as a true, non-fiction, storytelling-style memoir about the author's father and family — so this template skips genre selection entirely.

**Instructions for the AI:**
1. Read all `{{TOKEN}}` placeholders below.
2. Fill each one using answers from the Story Forge gate (`references/story_forge.md`) and the current memory bank files.
3. Leave a section as `[TBD]` (don't delete it) if its data isn't known yet — this project's details arrive incrementally, and the README should visibly reflect what's still open rather than disappear sections.
4. This repository is private by default (per the author's stated preference) — keep real names and personal details in the README freely unless the author says otherwise.
5. Write the completed file to `README.md` in the project root.
6. After writing, do NOT ask the author to review it unless they ask — it is a living document they can edit anytime, and should be regenerated whenever meaningful new information (title, chapter count, key people) is captured.

---

<!-- ============================================================ -->
<!-- BEGIN README TEMPLATE — everything below goes into README.md -->
<!-- ============================================================ -->

<div align="center">

# {{BOOK_EMOJI}} {{BOOK_TITLE}}

*{{BOOK_TAGLINE}}*

[![Status](https://img.shields.io/badge/status-in%20progress-orange?style=flat-square)](#)
[![Chapters](https://img.shields.io/badge/chapters-{{CHAPTER_COUNT}}%20drafted-blue?style=flat-square)](#)
[![Type](https://img.shields.io/badge/type-memoir%20%2F%20true%20story-purple?style=flat-square)](#)

</div>

> *This repository is private. This is a true story — every person named is real and every event is real (or the author's honest recollection of it). Nothing here is invented.*

---

## About the Book

**{{BOOK_TITLE}}** {{PREMISE_PARAGRAPH}}

> *This is a work of narrative non-fiction — a memoir told in storytelling style. Dates, names, and events are grounded in the author's memory, family record, and research. Where a detail is reconstructed (a remembered conversation, a composite scene) rather than directly documented, that distinction is tracked in the memory bank, never hidden from the writing process.*

<!-- Add an opening quote block here if the author has one they want featured -->

---

## Scope

{{SCOPE_DESCRIPTION}}

| Period | Arc | Chapters |
|---|---|---|
{{SCOPE_TABLE_ROWS}}

<!-- SCOPE_TABLE_ROWS format (one row per arc):
| {{TIME_PERIOD}} | **{{ARC_NAME}}** — {{ARC_DESCRIPTION}} | {{CHAPTER_RANGE}} |
Leave as "[TBD]" if scope isn't set yet -->

---

## Repository Structure

```
{{PROJECT_ROOT_NAME}}/
├── Chapters/                       # Finished chapters (Markdown)
├── Outlines/
│   └── Master_Outline.md           # Full timeline and chapter notes
├── book-memory-bank/                # AI writing memory bank (context continuity)
│   ├── Core/                        # Project brief, story structure, people & places, progress
│   └── Style/                       # Style guide and voice conventions
└── .agents/                         # Book-writer skill and AI agent configuration
```

---

## Central Figures

| Figure | Role |
|---|---|
{{FIGURES_TABLE_ROWS}}

<!-- FIGURES_TABLE_ROWS format:
| **{{PERSON_NAME}}** {{LIFE_DATES}} | {{PERSON_ROLE}} |
Include the father and any key family members gathered so far -->
<!-- Leave as "[TBD]" if no people are recorded yet -->

---

## Key Events

{{KEY_EVENTS_LIST}}

<!-- KEY_EVENTS_LIST format:
- **{{LOCATION}}, {{YEAR}}** — {{EVENT_DESCRIPTION}}
Leave as "[TBD]" if no key events are recorded yet -->

---

## Writing Approach

{{WRITING_APPROACH_PARAGRAPH}}

<!-- If a style reference was given:
The prose aims for the register of **{{STYLE_REFERENCE}}** — {{STYLE_DESCRIPTION}}.
Always add: Reconstructed scenes/dialogue are marked in the memory bank; the book never presents an invented event as fact. -->

---

## Progress

| Component | Status |
|---|---|
{{PROGRESS_TABLE_ROWS}}

<!-- PROGRESS_TABLE_ROWS: generate one row per chapter/component.
Start with all chapters as Not started. AI updates this table on each chapter write.
Format:
| {{CHAPTER_NAME}} | {{STATUS_EMOJI}} {{STATUS_TEXT}} |
Status options: Complete / Draft / Not yet written -->

---

{{SOURCES_SECTION}}

<!-- SOURCES_SECTION: include once any sources are known (letters, documents, interviews, photos).
Format:
## Sources

**Primary:**
- {{SOURCE_1}}

**Secondary:**
- {{SOURCE_2}}

Leave as "[TBD — sources not yet gathered]" if none are recorded yet -->

---

## Status

This book is actively being written. The repository serves as the living manuscript — chapters are added and revised as the project progresses, and this README is regenerated as real details (title, timeline, sources) are confirmed.

*Started: {{START_DATE}}*

<!-- ============================================================ -->
<!-- END README TEMPLATE -->
<!-- ============================================================ -->

---

## Token Reference

| Token | Source |
|---|---|
| `{{BOOK_EMOJI}}` | A neutral, warm choice appropriate to memoir (e.g., 🕯️, 📖, 🏡) — not genre-specific |
| `{{BOOK_TITLE}}` | Story Forge Step 2, or `[Book Title — TBD]` |
| `{{BOOK_TAGLINE}}` | AI generates from what's known of the premise; 8–12 words; `[TBD]` if premise unknown |
| `{{CHAPTER_COUNT}}` | Start at 0; update on each chapter write |
| `{{PREMISE_PARAGRAPH}}` | Story Forge Steps 3–4; expand to 2–3 sentences; `[TBD]` if not yet shared |
| `{{SCOPE_DESCRIPTION}}` / `{{SCOPE_TABLE_ROWS}}` | Story Forge Step 4 (timeline/setting) + master outline once it exists |
| `{{PROJECT_ROOT_NAME}}` | Name of the project directory |
| `{{FIGURES_TABLE_ROWS}}` | People recorded in `people_and_places.md`; include life dates |
| `{{KEY_EVENTS_LIST}}` | Real events from the timeline/master outline |
| `{{WRITING_APPROACH_PARAGRAPH}}` | Style reference (if any) + the standard memoir/factual-license note |
| `{{PROGRESS_TABLE_ROWS}}` | One row per chapter, all start as Not yet written |
| `{{SOURCES_SECTION}}` | Story Forge Step 8 sources, or "not yet gathered" |
| `{{START_DATE}}` | Current month + year at time of initialization |
