---
status: complete
created: 2026-06-20
priority: high
tags:
- project
- gui
- tauri
- react
parent: 014-project-centric-agent-supervisor
created_at: 2026-06-20T16:45:09.642125600Z
updated_at: 2026-06-20T16:57:22.834301600Z
completed_at: 2026-06-20T16:57:22.834301600Z
transitions:
- status: complete
  at: 2026-06-20T16:57:22.834301600Z
---

# Project Dashboard UI Overhaul

## Overview
Redesign the Tauri GUI frontend to present a project-centric layout, replacing the global categories and static templates view with a workspace manager, active running agent cards (with breathing lights), and a quick spawn input bar with flexible environment configuration.

## Requirements
- [x] **Project Navigation Side Panel**:
  - Allow adding, removing, and switching between projects (directory paths).
- [x] **Project Dashboard Main View**:
  - Show project name, directory path, and current active/running agent cards.
  - Render a status breathing light for each card (🟢 Running, ⚪ Success, 🔴 Failed/Crashed) driven by PID status queries.
- [x] **Quick Command Launcher (Spawn Bar)**:
  - Add an input field at the top of the project view.
  - Allow selecting or typing the command (e.g. `agy`, `geminicli`), adding arguments, and toggling the environment mode:
    - **Inherit Default Env**: Toggle switch to run using system environment variables.
    - **Isolated Custom Env**: Form/key-value editor to specify environment overrides.
  - Clicking "Run" immediately spawns the agent instance and appends a card to the active list.

## Acceptance Criteria
- [x] Frontend sidebar lets user manage projects cleanly.
- [x] Environment toggle works dynamically, letting users run commands with standard env or custom overrides.
- [x] UI displays running agent processes with dynamic OS-driven breathing lights.
