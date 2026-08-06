<div align="center">

# 🕯️ [Book Title — TBD]

*A true story, told chapter by chapter — the life of a father, the family he made, and a mirror for every household still living behind a mask like his.*

[![Status](https://img.shields.io/badge/status-early%20setup-orange?style=flat-square)](#)
[![Chapters](https://img.shields.io/badge/chapters-0%20drafted-blue?style=flat-square)](#)
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
- **Content:** the author has all of the book's material ready; it will be added to this repository over upcoming sessions.
- **Factual license:** standard memoir convention. Reconstructed dialogue and scene detail are allowed when grounded in real memory — but events, dates, and outcomes are never invented. Anything uncertain is flagged rather than guessed at.

---

## Repository Structure

```
book/
├── CONTEXT.md                         # Thesis, real people, structure, scripture framework — read first
├── Chapters/                          # Finished chapters (Markdown), one file per chapter
├── Outlines/
│   └── Chapter_Outlines/              # Per-chapter outlines, filled in as chapters are planned
├── book-memory-bank/                  # AI writing memory bank — context continuity across sessions
│   ├── Core/
│   │   ├── projectbrief.md            # Title, scope, goals (currently TBD)
│   │   ├── story_structure.md         # Narrative purpose and structure (currently TBD)
│   │   ├── people_and_places.md       # Real people, real places, real timeline (currently TBD)
│   │   ├── activeContext.md           # Current session status — read this first
│   │   ├── progress.md                # Completion tracking
│   │   └── Templates/                 # Reusable templates for outlines, scene cards, etc.
│   ├── Style/
│   │   └── style_guide.md             # Voice and formatting conventions
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

**Current phase:** Early setup. The repository structure and writing skill are in place; the thesis, family members, and scripture-reference framework are confirmed in `CONTEXT.md`. Title, specific incidents, and chapter structure are still open.

| Component | Status |
|---|---|
| Repository & skill setup | ✅ Complete |
| Thesis & scripture framework (`CONTEXT.md`) | ✅ Complete |
| Central people confirmed | ✅ Complete (list will grow) |
| Title | ⏳ Not yet decided |
| Chapter outlines | ⏳ Not started |
| Chapters drafted | ⏳ Not started (0) |

*Started: August 2026*
