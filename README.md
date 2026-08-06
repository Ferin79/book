<div align="center">

# 🕯️ [Book Title — TBD]

*A true story, told chapter by chapter — the life of a father, and the family he made.*

[![Status](https://img.shields.io/badge/status-early%20setup-orange?style=flat-square)](#)
[![Chapters](https://img.shields.io/badge/chapters-0%20drafted-blue?style=flat-square)](#)
[![Type](https://img.shields.io/badge/type-memoir%20%2F%20true%20story-purple?style=flat-square)](#)

</div>

> *This repository is private. This is a true story — every person named is real and every event is real (or the author's honest recollection of it). Nothing here is invented.*

---

## About the Book

This repository holds one book: a **non-fiction, storytelling-style memoir**, written in **Markdown** and divided into **chapters**, about the author's real father and their family. It is not fiction — there are no invented characters and no invented worldbuilding.

- **Title:** not yet decided (`[Book Title — TBD]` is used as a placeholder throughout the project until one is chosen).
- **Content:** the author has all of the book's material ready; it will be added to this repository over upcoming sessions.
- **Factual license:** standard memoir convention. Reconstructed dialogue and scene detail are allowed when grounded in real memory — but events, dates, and outcomes are never invented. Anything uncertain is flagged rather than guessed at.

---

## Repository Structure

```
book/
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

1. **Memory bank first.** Every session should read `book-memory-bank/Core/activeContext.md` before doing anything else — it tracks what's real project detail vs. still `[TBD]`.
2. **Onboarding.** Because the title, family details, and timeline haven't been captured yet, the first substantive session will run the Story Forge (`.agents/skills/book-writer/references/story_forge.md`) to gather them — one question at a time, everything skippable, and it prioritizes importing the author's existing material over asking questions that material already answers.
3. **Writing.** Chapters are outlined in `Outlines/Chapter_Outlines/` and drafted in `Chapters/`, following the voice rules in `references/author_rules.md` and the factual-accuracy rules in `references/narrative_nonfiction_rules.md`.
4. **Memory updates.** After each chapter, the memory bank (`people_and_places.md`, the timeline, `activeContext.md`) is updated automatically to keep real facts consistent across the whole book.
5. **No invention.** Nothing in this project — not a name, a date, or a line of dialogue — is invented. Reconstructed scenes are allowed and clearly the norm for memoir, but they're tracked as reconstructions, not presented as verbatim record.

---

## Status

**Current phase:** Early setup. The repository structure and writing skill are in place; the memory bank is scaffolded with `[TBD]` placeholders waiting on the author's father's name, family members, timeline, and existing material.

| Component | Status |
|---|---|
| Repository & skill setup | ✅ Complete |
| Project details (title, people, timeline) | ⏳ Not yet gathered |
| Chapter outlines | ⏳ Not started |
| Chapters drafted | ⏳ Not started (0) |

*Started: August 2026*
