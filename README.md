<div align="center">

# 🕯️ [Book Title — TBD]

*A true story, told chapter by chapter — the life of a father, the family he made, and a mirror for every household still living behind a mask like his.*

[![Status](https://img.shields.io/badge/status-drafting-orange?style=flat-square)](#)
[![Chapters](https://img.shields.io/badge/chapters-3%20drafted-blue?style=flat-square)](#)
[![Type](https://img.shields.io/badge/type-memoir%20%2F%20true%20story-purple?style=flat-square)](#)

</div>

> *This repository is private. This is a true story — every person named is real and every event is real (or the author's honest recollection of it). Nothing here is invented.*

---

## Start Here: `CONTEXT.md`

📖 **Read [`CONTEXT.md`](CONTEXT.md) before doing anything else in this project.** It holds the book's thesis, the real people involved, the proposed structure, and the scripture-reference framework this book is built around. `book-memory-bank/Core/activeContext.md` points here too, but `CONTEXT.md` is the source of truth for *why* this book exists and *how* it argues its case.

> ### ⚠️ Big Note: Scriptural References Are Load-Bearing
> This book uses verses from the **Shreemad Bhagavad Gita, Mahabharata, Valmiki Ramayana, Chanakya Niti, and the Vedas** — quoted in Devanagari with translation and analysis — as its central rhetorical device: measuring the father's private conduct against the very religious standard his public image claims to uphold. **Use these references as much as the material can bear**, per the full framework, format, and accuracy rules in `CONTEXT.md` → *The Scripture & Reference Framework*.

---

## About the Book

This repository holds one book: a **non-fiction, storytelling-style memoir**, written in **Markdown** and divided into **chapters**, about the author's real father and family — a close, unflinching account of the gap between a carefully maintained public image and private conduct at home. It is not fiction — there are no invented characters and no invented worldbuilding.

Beyond the personal account, the author intends this book as a **role-model / eye-opening work for readers — especially in India — living under a similarly authoritative, image-conscious household figure**: recognition, a scripturally grounded vocabulary for real vs. performed dharma, and encouragement to raise their voice. Full thesis and context: [`CONTEXT.md`](CONTEXT.md).

- **Title:** not yet decided (`[Book Title — TBD]` is used as a placeholder throughout the project until one is chosen).
- **Content:** arriving incrementally, chapter by chapter. Drafted so far: Chapter 1, "Shambu" (`Chapters/Chapter_01_Shambu.md`, opening Part I — The Mask); Chapter 2, "A Glass of Water" (`Chapters/Chapter_02_A_Glass_of_Water.md`, opening Part II — Where It Began); and Chapter 3, "The Money He Wouldn't Take" (`Chapters/Chapter_03_The_Money_He_Wouldnt_Take.md`, opening Part III — The Husband).
- **Factual license:** standard memoir convention. Reconstructed dialogue and scene detail are allowed when grounded in real memory — but events, dates, and outcomes are never invented. Anything uncertain is flagged rather than guessed at.

---

## Writing Style

Confirmed with the author starting Chapter 1 (2026-08-17), then corrected the same day for complexity. Full mechanics live in `.claude/skills/book-writer/references/author_rules.md` and `references/narrative_nonfiction_rules.md`; project-specific decisions are recorded in `book-memory-bank/Style/style_guide.md`. Every future chapter should follow this:

- **Simplicity is a firm requirement, not a preference.** The author flagged the first pass at Chapter 1 as too complex to follow. Default to short, direct, subject-verb-object sentences. Two short sentences beat one joined by a semicolon or several commas. If a sentence needs a second read, rewrite it. See `book-memory-bank/Style/style_guide.md` → "Sentence Structure" for the full corrected rule.
- **Voice**: Warm, observational, grounded — the voice of someone who loved and studied this person closely, not a detached reporter or a eulogy. Emotionally honest, never melodramatic. No hagiography, no character assassination — real strengths and real flaws, both. The warmth comes from true, specific detail, not from ornate sentences.
- **POV**: First person. Ferin Patel narrates throughout; other family members (starting with his father) are written in third person within that first-person frame.
- **Tense**: Past tense for narrated events and biography; present tense only when the narrator steps back to name a lasting pattern or general truth.
- **Chapter openings**: Scene-first by default — a concrete, lived image or moment, not a flat factual statement. (Chapter 1 opens on a street in Pal Gam calling a man by a name that wasn't his.)
- **Concrete over abstract**: Never explain an emotion or circumstance when a specific, physical detail can show it instead. Biography is woven into scene as it becomes relevant, never dumped in a block.
- **Restraint**: Let silence, subtext, and small gestures carry emotional weight. The facts, told specifically, are the argument — the narrator doesn't editorialize or lecture.
- **Honesty about gaps**: If a detail isn't known, that gap is acknowledged in the prose (or flagged `[NEED RESEARCH]`) rather than filled with invented specifics.
- **Mechanics**: Oxford comma always; em dashes used sparingly (interruption/sharp shifts only); semicolons essentially never (split the sentence instead); no bold text in narrative prose; italics for foreign-language words/phrases and inner emphasis; scene breaks are three centered dashes (`---`).
- **Scripture placement**: The Gita/Mahabharata/Ramayana/Chanakya Niti/Vedas framework (see `CONTEXT.md`) is load-bearing for the book overall but is a per-chapter decision, not automatic — introduced starting wherever a chapter first shows the gap between image and private conduct, not before.

---

## Repository Structure

```
book/
├── CONTEXT.md                         # Thesis, real people, structure, scripture framework — read first
├── Chapters/                          # Finished chapters (Markdown), one file per chapter
│   ├── Chapter_01_Shambu.md           # Drafted
│   ├── Chapter_02_A_Glass_of_Water.md # Drafted
│   └── Chapter_03_The_Money_He_Wouldnt_Take.md # Drafted
├── Outlines/
│   └── Chapter_Outlines/              # Per-chapter outlines, filled in as chapters are planned
│       ├── Chapter_01_Shambu.md       # Drafted
│       ├── Chapter_02_A_Glass_of_Water.md # Drafted
│       └── Chapter_03_The_Money_He_Wouldnt_Take.md # Drafted
├── Research/
│   └── scripture_reference_tracker.md # Log of every scripture citation used, with verification notes
├── book-memory-bank/                  # AI writing memory bank — context continuity across sessions
│   ├── Core/
│   │   ├── projectbrief.md            # Title, scope, goals (currently TBD)
│   │   ├── story_structure.md         # Narrative purpose and structure (currently TBD)
│   │   ├── people_and_places.md       # Real people, real places, real timeline (Rakesh Patel's core facts confirmed)
│   │   ├── activeContext.md           # Current session status — read this first
│   │   ├── progress.md                # Completion tracking
│   │   └── Templates/                 # Reusable templates for outlines, scene cards, etc.
│   ├── Style/
│   │   └── style_guide.md             # Voice and formatting conventions — confirmed, see "Writing Style" above
│   └── Production/                    # Manuscript compilation scripts and cover-art prompts
└── .agents/skills/book-writer/        # The Claude Code skill that drives this project
```

---

## How This Project Works (for future Claude sessions and the author)

This repository uses a customized `book-writer` skill (`.agents/skills/book-writer/`) built specifically for this one project — it has no fiction, multi-genre, spinoff, or children's-book workflows; those were stripped out because this repo will only ever be used for this memoir.

1. **`CONTEXT.md` first, always.** It holds the thesis, the confirmed real people, the proposed part structure, and the full scripture-reference framework and format rules.
2. **Memory bank next.** Read `book-memory-bank/Core/activeContext.md` — it tracks what's confirmed vs. still `[TBD]`, and points back to `CONTEXT.md`.
3. **Onboarding for anything still open.** Title and specific incidents/chapters haven't been captured yet — run the Story Forge (`.agents/skills/book-writer/references/story_forge.md`) for anything `CONTEXT.md` doesn't already answer, one question at a time, everything skippable.
4. **Writing.** Chapters are outlined in `Outlines/Chapter_Outlines/` and drafted in `Chapters/`, following the voice rules in `references/author_rules.md`, the factual-accuracy rules in `references/narrative_nonfiction_rules.md`, and the scripture framework in `CONTEXT.md`.
5. **Memory updates.** After each chapter, the memory bank (`people_and_places.md`, the timeline, `activeContext.md`) and the Scripture Reference Tracker are updated to keep real facts and citations consistent across the whole book.
6. **No invention.** Nothing in this project — not a name, a date, a line of dialogue, or a scripture citation — is invented. Reconstructed scenes are allowed and clearly the norm for memoir, but they're tracked as reconstructions, not presented as verbatim record. Uncertain verses are marked `[VERIFY VERSE]`, uncertain facts `[NEED RESEARCH]`.

---

## Status

**Current phase:** Drafting. The repository structure, writing skill, and confirmed writing style are in place; the thesis, family members, and scripture-reference framework are confirmed in `CONTEXT.md`. Chapters 1–3 are drafted (Parts I, II, and III each now have their opening chapter). Title and most specific incidents for the rest of Part III onward are still open.

| Component | Status |
|---|---|
| Repository & skill setup | ✅ Complete |
| Thesis & scripture framework (`CONTEXT.md`) | ✅ Complete |
| Writing style confirmed | ✅ Complete |
| Central people confirmed | ✅ Complete (list will grow) |
| Title | ⏳ Not yet decided |
| Chapter outlines | 🟡 3 of many (Chapters 1–3) |
| Chapters drafted | 🟡 3 drafted — "Shambu" (Part I), "A Glass of Water" (Part II), "The Money He Wouldn't Take" (Part III) |

*Started: August 2026*
