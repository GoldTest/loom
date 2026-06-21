---
status: complete
created: 2026-06-21
priority: high
tags:
- brand
- refactor
created_at: 2026-06-21T08:06:17.907263200Z
updated_at: 2026-06-21T08:26:52.766714300Z
completed_at: 2026-06-21T08:26:52.766714300Z
transitions:
- status: complete
  at: 2026-06-21T08:26:52.766714300Z
---

# Brand Rename to Loom

Rename the project from "CliMaster" to "Loom" to align with the new positioning as a unified hub for multi-project management, multi-environment multi-CLI process management, and rapid task dispatching.

## Overview
As the project evolved from a static CLI tool manager into a workspace-centric process supervisor, the name "CliMaster" became outdated and misleading. The new name "Loom" represents the weaving and scheduling of multiple CLI processes and project environments. This spec outlines the complete renaming process across crates, build configurations, configurations, documentation, and the frontend.

## Requirements

- [x] **Core Cargo/Crate Renaming**:
  - [x] Rename the crates (e.g. `climaster-cli` to `loom-cli`, `climaster-core` to `loom-core`, etc., if applicable, or keep internal crate names but change binary names).
  - [x] Rename the generated binary outputs to `loom` (CLI) and `loom-gui` (GUI).
- [x] **Tauri App Renaming**:
  - [x] Update `tauri.conf.json` with the new product name `"Loom"` and bundle identifier `com.loom.app`.
  - [x] Update window title, icons, package, and installer configuration to reflect the Loom brand.
- [x] **Persistence & Environment Renaming**:
  - [x] Update config resolution in `core` to use `LOOM_CONFIG_PATH` env var.
  - [x] Update AppData storage directory to `Loom` (e.g. `AppData/Local/Loom`) and configuration file to `loom.json`.
- [x] **Frontend Branding & UI Updates**:
  - [x] Update main page headings, document title, and text references in React code.
  - [x] Update English and Chinese translation files (i18n) to replace "CliMaster" with "Loom".
- [x] **E2E & CI Integration Updates**:
  - [x] Update Playwright/Vitest E2E tests to execute `loom` instead of `climaster`.
  - [x] Update GitHub Actions build workflows (`ci.yml`, `release.yml`) to compile and package `loom`.
- [x] **Documentation Updates**:
  - [x] Update `README.md`, `AGENTS.md`, and other files to reflect the new brand positioning.

## Non-Goals
- Automatic migration of old `climaster.json` data to `loom.json` (users will start with a fresh config or copy manually).
- Architectural changes to the process supervisor or environment isolation code itself.

## Acceptance Criteria
- Running `cargo build --release` produces `loom.exe` (or `loom`) and `loom-gui.exe`.
- Launching the GUI shows "Loom" as the window title and branding throughout the application.
- Configuration and logs are saved to the new `Loom` AppData directory as `loom.json`.
- E2E tests run and pass without error using the new binaries.
- GitHub Actions CI/CD workflows compile and package the new Loom binary successfully.
