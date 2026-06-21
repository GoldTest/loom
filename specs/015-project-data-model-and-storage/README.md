---
status: complete
created: 2026-06-20
priority: high
tags:
- project
- storage
- rust
parent: 014-project-centric-agent-supervisor
created_at: 2026-06-20T16:44:40.333783Z
updated_at: 2026-06-20T16:57:22.581448600Z
completed_at: 2026-06-20T16:57:22.581448600Z
transitions:
- status: complete
  at: 2026-06-20T16:57:22.581448600Z
---

# Project Data Model and Storage

## Overview
Implement the database/JSON storage schema changes to support Project entities, project-specific environment configurations, and execution history.

## Requirements
- [x] **Data Model Extension**:
  - Add `Project` struct: `id`, `name`, `root_path`, `env_profiles` (key-value maps), `quick_commands` (list of predefined CLI commands).
  - Add `AgentInstance` struct to store execution history under a project: `id`, `project_id`, `command`, `arguments`, `status` (success/failed/interrupted), `env_mode` (inherit/isolated/custom), `custom_envs` (key-value map), `start_time`, `end_time`.
- [x] **Storage Updates**:
  - Update `CliMasterStorage` in `crates/core/src/storage/models.rs` to persist projects and historic instances.
  - Implement CRUD operations in `crates/core/src/storage/manager.rs` for projects.
- [x] **Unit Tests**:
  - Write test cases verifying project insertion, update, deletion, and retrieval of active/historical instances.

## Acceptance Criteria
- [x] Core storage unit tests compile and pass successfully.
- [x] JSON registry structure properly serializes and deserializes the new `projects` array.
