# Working in this repo

## Build + push

After source changes, run `npm run build` then commit and push without
asking (matches the user's standing preference for this plugin).

## CHANGELOG.md

Maintain `CHANGELOG.md` in the repo root. After every user-visible change,
append a new entry with two parts:

1. **Requested** — verbatim or near-verbatim summary of what the user asked
   for, in their words.
2. **Done** — what was actually implemented, with file references when
   useful.

Newest entries go at the top. Group entries by date (`## YYYY-MM-DD`) and
use sub-bullets for each request within a session. If a request spans
multiple iterations (clarifying follow-ups, reverts, mid-course changes),
record the final outcome rather than each intermediate step — but call out
explicitly when something was reverted or left in a clarifying-questions
state.
