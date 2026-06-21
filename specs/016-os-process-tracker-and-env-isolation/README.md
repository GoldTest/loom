---
status: complete
created: 2026-06-20
priority: high
tags:
- project
- process
- supervisor
- rust
parent: 014-project-centric-agent-supervisor
created_at: 2026-06-20T16:44:57.607603600Z
updated_at: 2026-06-20T16:57:22.702997400Z
completed_at: 2026-06-20T16:57:22.702997400Z
transitions:
- status: complete
  at: 2026-06-20T16:57:22.702997400Z
---

# OS Process Tracker and Environment Isolation

## Overview
Implement the process supervisor logic in Rust to track child processes by OS Process ID (PID) and support customizable environment variable blocks (inheriting default environments or running under isolated, custom environments).

## Requirements
- [x] **Dynamic Environment Variable Builder**:
  - Implement environment building logic in Rust command runner.
  - If `Inherit` mode: Use the default environment inherited from the host system.
  - If `Isolated` mode: Build a custom environment variable block (using `.env_clear()` or selective environment overrides) to launch the CLI tool in an isolated sandbox.
- [x] **PID-based Process Tracking**:
  - Track active processes by PID and expose status query APIs (`is_active(pid)`).
  - Dynamically read the OS process list or use process handles to determine if the child is running, finished (exit code 0), or crashed/failed (exit code != 0).
- [x] **Tauri Commands**:
  - Expose `spawn_project_agent(project_id, cmd, args, env_mode, custom_envs)` Tauri command.
  - Expose `get_agent_status(pid)` and `kill_agent_process(pid)`.

## Acceptance Criteria
- [x] Multiple agent instances can be spawned simultaneously with duplicate env names but different values.
- [x] Process status (breathing lights) updates correctly when processes exit or crash, driven entirely by OS process tracking.
