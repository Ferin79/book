# Print edition

Builds one print-ready A5 PDF that holds the whole book: Gujarati first, then English.

```bash
npm install          # first time only
npm run build        # -> output/Treat_Your_Father_as_a_God_print.pdf
npm run build -- --preview 1,5,9,last   # also save those pages as PNGs in output/preview/
```

The covers in `assets/` are exported from `../book.pen` with the Pencil MCP. The full
step-by-step process, including the cover export and checks, is in
[`.claude/skills/print-book/SKILL.md`](../.claude/skills/print-book/SKILL.md).
Ask Claude to "make a new print-ready PDF" and it follows that skill.
