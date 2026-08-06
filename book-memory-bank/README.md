# Book Memory Bank

A structured documentation system for maintaining context and consistency throughout the writing of this book — a true story, told in storytelling style, about the author's real father and family. This memory bank helps the author work with an AI assistant (Claude Code, using the `book-writer` skill) by providing a persistently updated knowledge base that lets a stateless AI maintain full context across writing sessions.

## Overview

The Book Memory Bank solves a key challenge when writing a book with AI assistance: maintaining consistent, *factually accurate* context across sessions. It consists of:

1. **Core documentation files** for real people, real places, and the real timeline
2. **Specialized templates** for people, timeline, and structure
3. **Automation scripts** for manuscript preparation
4. **Workflow guidelines** for effective AI collaboration
5. **Conversational memory updating** that eliminates the need for scripts

## Getting Started

This memory bank is already copied into the project root (see `../../../../book-memory-bank/` relative to this file, i.e. `book-memory-bank/` at the repository root). The `book-writer` skill (in `.agents/skills/book-writer/`) reads and maintains it automatically — there's no separate configuration step needed for Claude Code.

1. **Start Your Session:**
 - Just describe what you want to work on (fill in a person's profile, outline a chapter, draft a chapter, etc.).
 - If Core files still show `[TBD]` placeholders for the basics, Claude will run the Story Forge gate (`references/story_forge.md`) to gather real project details — one question at a time, all skippable.

2. **Writing Process:**
 - Ask to "write chapter 1 outline" (or "write the next chapter outline").
 - Review and give feedback.
 - Ask to "write chapter 1" (or "write the next chapter").
 - Review and give feedback.
 - Say "update memory bank" — this captures new people, places, and timeline facts into the Core files.
 - Repeat until the book is complete.
 - It's recommended to review each chapter as it's written — later changes are always possible, but get more error-prone the longer they wait.
 - Periodically review the memory bank files yourself; if you see something wrong (a fact, a name, a date), just tell Claude to correct it.

3. **Publishing Preparation:**
 - Run the automation scripts in `Production/Scripts/` to assemble and format the manuscript.

## Complete Project Structure

```
book/                                  # Repository root
├── Chapters/                          # ACTUAL chapter files
│   └── Chapter01.md
│   └── Chapter02.md
├── Outlines/                          # ACTUAL outlines
│   ├── Master_Outline.md
│   └── Chapter_Outlines/
│       └── Chapter01_Outline.md
├── book-memory-bank/                  # Memory bank files (context only)
│   ├── README.md                      # This file
│   ├── Core/                          # Core project documentation
│   │   ├── projectbrief.md            # Core project definition
│   │   ├── story_structure.md         # Story purpose and narrative patterns
│   │   ├── people_and_places.md       # Real people, real settings, timeline
│   │   ├── activeContext.md           # Current work status
│   │   ├── progress.md                # Completion tracking
│   │   └── Templates/                 # Template files for new content
│   ├── Style/
│   │   └── style_guide.md
│   └── Production/                    # Book production resources
│       ├── README.md
│       ├── AI_Generation/
│       │   └── cover_prompts.md
│       └── Scripts/
│           ├── combine_chapters.ps1
│           ├── combine_chapters.sh
│           ├── generate_docx.bat
│           ├── generate_docx.sh
│           └── prepare_word_template.ps1
└── .agents/skills/book-writer/        # The book-writer skill itself
```

### Key Distinction

1. **Memory Bank** (`book-memory-bank/`): Metadata and context that helps the AI maintain understanding — information *about* the book, not the book itself.
2. **Book Content** (project root): The actual manuscript and planning documents — `Chapters/`, `Outlines/`.

## Core Files

The foundation of the memory bank consists of five core files in `Core/`:

1. **projectbrief.md** — High-level concept, scope, and goals
2. **story_structure.md** — Purpose, reader experience, and narrative techniques
3. **people_and_places.md** — Real people, real places, and the real timeline
4. **activeContext.md** — Current work focus and near-term plans
5. **progress.md** — Project tracking and completion status

These files build on each other in a hierarchical structure, moving from foundational elements to current status.

## Automated Memory Updating

The Book Memory Bank updates through Claude's built-in file access — no scripts or manual updates required. Just tell it:

```
update memory bank
```

or, for a specific chapter:

```
I've just completed Chapter 5: [Title].

Please:
1. Read the entire chapter content
2. Identify all new information about real people, places, and events
3. Automatically update all relevant memory bank files
4. Provide a summary of the updates you've made
```

Claude will analyze the content, identify what's new, and directly update the memory bank files.

### Consistency Checking

```
Please perform a comprehensive memory bank consistency check.

1. Review all memory bank files for internal and factual consistency
2. Check for contradictions between different memory bank files
3. Verify that timeline and biographical facts line up across chapters
```

## Workflow Guide

### Initial Planning
1. Gather real project details (Story Forge)
2. Populate Core files with real facts, marking unknowns `[TBD]` or `[NEED RESEARCH]`
3. Build out `people_and_places.md`
4. Create a master outline of the real timeline and chapter structure

### Chapter Development
1. Write individual chapters in `Chapters/`
2. Tell Claude: "I've completed Chapter X. Please update the memory bank."
3. Review the summary of updates made
4. Continue with the next chapter based on the updated memory bank

### Publishing Preparation
1. Run `Production/Scripts/combine_chapters.ps1` (Windows) or `.sh` (Mac/Linux) to assemble the complete book into `Manuscript/COMBINED.md`.
2. Use `Production/Scripts/generate_docx.bat`/`.sh` to create a properly formatted Word document.

## Benefits

- **Continuity**: Maintains consistent facts, people, and timeline across writing sessions
- **Accuracy**: Keeps real details straight so the book stays trustworthy as a true story
- **Efficiency**: Automates tedious documentation and formatting tasks
- **Organization**: Provides clear structure for a complex real-life story
- **Simplicity**: Updates happen through natural conversation, not scripts

By using the Book Memory Bank, a stateless AI assistant becomes a persistent, context-aware writing partner that maintains full knowledge of this real family's story as it's written.
