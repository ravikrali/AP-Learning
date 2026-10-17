# Courses workspace

One folder per course being planned or built. Used by the `/new-course` playbook.

```
docs/courses/<courseId>/
  source/            # the official CED PDF or text (owner adds this; required)
  outline.md         # Course Architect's plan: units, topics, lessons (owner approves)
  progress.md        # unit-by-unit status (written / checked / tested / published)
  accuracy-report.md # Accuracy Checker findings and fixes
  launch.md          # announcement email + social posts for launch day
```

`<courseId>` is the id in `app/shared/catalog.ts` (e.g. `stats`, `bio`, `calcab`).

## Course status

| Course | Id | Status |
|---|---|---|
| AP Chemistry | chem | ✅ live |
| AP Statistics | stats | ✅ built 2026-10-17 (Fall 2026 CED), independent review and publish pending |

Before starting a course, put the current CED in `source/`. Agents will not invent the topic list.
