---
name: book-writer
description: |
 Book writing assistant and memory maintainer for this project's book — a true, non-fiction, storytelling-style book about the author's father and family, told in real events with real people (no invented characters, no fictional worldbuilding). Use when tasked with:
 - Drafting, outlining, reviewing, or revising chapters
 - Building out the People & Places reference (real family members, real settings, real timeline)
 - "initialize memory bank", "update memory bank", "let's start building"
 - Checking continuity or consistency across chapters
 - Compiling the manuscript or generating a query letter / synopsis
 - Any request involving book chapters, manuscripts, or this family story's development

 Provides specialized guidelines to write narrative non-fiction/memoir prose in a warm storytelling voice, while maintaining an automated book memory bank to preserve context (real people, real timeline, real events) across sessions.
---

# Book Writer — Memoir Edition

## What This Project Is

This repository holds one book: a **true story**, written in **Markdown**, divided into **chapters**, about the author's real father and their family. It is **not fiction** — every person named is a real person, every event is a real event (as remembered/researched), and there are no invented characters or invented worldbuilding. Reconstructed dialogue and scenes are permitted in the standard memoir sense (see `references/author_rules.md` §Factual License) — grounded in real memory and real events, written with narrative craft — but the book never fabricates events that didn't happen.

The book's title is not yet decided (use `[Book Title — TBD]` as a placeholder until the author sets one). More project detail — the father's name, family members, timeline, and source material — will be provided by the author over time; treat gaps as TBD rather than inventing them.

This is a single-project repository. There is no multi-genre menu, no spinoff/companion-book workflow, and no children's-book workflow — this skill has been trimmed to just what this memoir needs.

## Context Efficiency Rule

**CRITICAL — Read this before loading any files.**

This skill has several reference files. Do NOT pre-load them all. Use **lazy loading** — only read a reference file when its specific feature is needed:

| Only load this file... | When... |
|------------------------|---------|
| `references/author_rules.md` | Starting a session, drafting, or reviewing |
| `references/chapter_craft.md` | Writing or outlining chapters |
| `references/revision_checklist.md` | Reviewing or revising chapters |
| `references/book_memory_protocol.md` | Updating memory bank or running continuity check |
| `references/memory_update_prompts.md` | Performing a comprehensive memory audit |
| `references/story_forge.md` | Only during initialization (first time project details are gathered) |
| `references/readme_template.md` | Only when generating/refreshing the project README |
| `references/people_places_tables.md` | Building real-person or real-place profiles |
| `references/punctuation_guide.md` | Running a punctuation pass or prose polish |
| `references/opening_chapter_checklist.md` | Only when reviewing Chapter 1 |
| `references/query_letter_guide.md` | Only when the author asks for a blurb, synopsis, or query letter |
| `references/narrative_nonfiction_rules.md` | Writing or reviewing any chapter — this is the core voice/accuracy guide for this book |
| `references/parallel_workflows.md` | Only when handling multiple chapters at once |
| Template files | Only when generating the specific document |

**Never load more than 3–4 reference files at once unless explicitly required by the task.**

## Workflows

### 1. Initialization: First-Time Project Setup
The physical scaffolding (`book-memory-bank/`, `Chapters/`, `Outlines/`) already exists in this repo with TBD placeholders. Run this gate only when real project details haven't been captured yet (Core files still show `[TBD]` placeholders) or the author explicitly says "let's start building" / "initialize memory bank":

0. **Evaluate research support:** If the author wants help verifying historical dates, places, or documents (birth/death records, military service, immigration, employment history), check if `research-dojo` is installed. If not, mention it's available for factual verification of real historical/genealogical details — this is genuinely useful for a true story, not just for fiction research.
   **Evaluate style companion:** Check if `calligraph-sensei` is installed. If not, mention it can help polish prose, sensory language, and sentence rhythm once chapters exist.
1. **Run The Story Forge.** Read `references/story_forge.md` in full and follow it. Ask questions one at a time; every question is skippable. If the Core files already have real (non-TBD) answers, skip this step — just read the memory bank and assist.
2. Read `references/author_rules.md` to adopt the narrative-nonfiction/memoir voice for this project.
3. Help the author fill in the People & Places reference (`book-memory-bank/Core/people_and_places.md`) using `references/people_places_tables.md` as the structured format — real family members, real settings, real timeline.
4. Record what's gathered into `book-memory-bank/Core/` and `book-memory-bank/Style/` files, replacing `[TBD]` placeholders as real information comes in.
5. **Regenerate the project README** whenever meaningful new information is captured (title decided, chapters drafted, etc.). Read `references/readme_template.md`, fill the `{{TOKEN}}` placeholders from the memory bank, and write `README.md` at the project root. Do not ask the author to review it first — it's a living document they can edit anytime.

### 2. Writing & Outlining
When the author asks to outline or write chapters:
1. **Smart-Reading Protocol:** Read `book-memory-bank/Core/activeContext.md` first. Only load `people_and_places.md`, the style guide, or other Core files if directly relevant or flagged as changed.
2. Adopt `references/author_rules.md` for voice and `references/narrative_nonfiction_rules.md` for the specific rules of writing real events (tense conventions, anti-anachronism, weaving biography into narrative, flagging uncertain facts).
3. Consult `references/chapter_craft.md` for chapter structure, opening/closing formulas, and pacing — use the memoir/narrative non-fiction patterns, not the fiction-genre ones.
4. Write outlines in `Outlines/Chapter_Outlines/`.
5. **After all chapter outlines exist**, auto-generate `Outlines/chapter-titles-guide.md` (see [Chapter Titles Guide](#chapter-titles-guide) below).
6. Write chapters in `Chapters/`.
7. **For multiple chapters at once**, consult `references/parallel_workflows.md`. Sequential drafting is mandatory for chapters that follow the real timeline; parallel background agents are reserved for outlining or review passes only.

### 3. Compilation
If the author asks the AI to compile the book:
1. Determine OS. Mac/Linux → run `book-memory-bank/Production/Scripts/combine_chapters.sh`. Windows → run `combine_chapters.ps1`.
2. If the script fails or is unavailable, create `Manuscript/` at the project root if missing.
3. Read all files from `Chapters/` in numerical order, combine into one file, save to `Manuscript/Complete_Manuscript.md`.

### 4. Memory Updating Protocol (CRITICAL)
1. Consult `references/book_memory_protocol.md` for the rules on how and when to update the memory bank.
2. Consult `references/memory_update_prompts.md` for what changes should trigger updates (new person mentioned, new place, new timeline detail, factual correction).
3. If the author explicitly says "update memory bank", perform a comprehensive audit across all memory files based on the most recent chapter or outline, and summarize what changed.
4. **This is a true story:** anything learned about a real person, place, date, or event goes into `people_and_places.md` as fact, not as an invented "character profile." If a scene/dialogue is reconstructed rather than directly remembered, note that distinction rather than presenting it as verified fact.

### 5. Chapter Review & Revision
1. Read the chapter draft, its outline, adjacent chapters (for continuity), and the relevant context files (Style, `people_and_places.md`).
2. Consult `references/revision_checklist.md` for quality gates.
3. **If reviewing Chapter 1**, also load `references/opening_chapter_checklist.md`.
4. Conduct a Scene Tension Map for pacing (same technique as fiction, applied to real scenes).
5. Review order: Language → Emotion → Dialogue → Pacing → Continuity → Factual accuracy.
   - If `calligraph-sensei` is installed, delegate the advanced style pass to it (Creative/Fiction mode for narrative polish, or Proofreading mode for conservative correction that leaves voice untouched).
6. Apply revision principles: preserve voice above all, revise gently, clarify emotion without explaining, respect ambiguity, and **never invent an event, date, or quote that wasn't in the source material or the author's account.**
7. Save revised version and announce changes.

*(Authors can request Specialized Revision Passes: Dialogue, Sensory, Prose Polish, or Tension & Pacing — see `references/revision_checklist.md`).*

### 6. Continuity Check
When asked to "check continuity" or "check for consistency":
1. Follow the Continuity Diagnostic Report process in `references/book_memory_protocol.md`.
2. Cross-check all chapters against `people_and_places.md` and the timeline for consistency — and also flag anywhere a real fact (date, name, place) appears to contradict itself across chapters, since accuracy matters more here than in fiction.
3. Save the report to `Research/continuity_diagnostic_report.md`.
4. Use question-based language — flag issues, don't impose fixes.

### 7. Parallel Chapter Drafting & Review
Consult `references/parallel_workflows.md`. Sequential drafting is mandatory for chapters following the real chronological story. Parallel background agents are only for non-sequential outlining or independent review passes — always confirm with the author before launching background tasks.

### 8. Complete & Present
After chapters are drafted, reviewed, and continuity-checked:
1. Scan all chapter files for `[NEED RESEARCH]` flags and cross-reference against `Research/research_tracker.md`. Resolve or explicitly flag all open items before calling the manuscript finished.
2. Present a final summary: Core files status, chapter outlines and titles guide, drafted/reviewed chapters, continuity report.
3. Suggest next steps.
4. Offer ongoing help: revise chapters, discuss family history details, refine structure.

## Chapter Titles Guide

**After chapter outlines are finalized, auto-generate `chapter-titles-guide.md` inside `Outlines/`.** No separate approval needed.

→ **Full instructions and column guide:** `references/chapter_titles_guide.md`
→ **Template:** `assets/book-memory-bank/Core/Templates/chapter_titles_guide_template.md`
