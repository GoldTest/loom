---
status: complete
created: 2026-06-20
priority: high
created_at: 2026-06-20T17:10:36.348332700Z
updated_at: 2026-06-20T17:25:00.815688900Z
completed_at: 2026-06-20T17:25:00.815688900Z
transitions:
- status: complete
  at: 2026-06-20T17:25:00.815688900Z
---

# Foreground Process Bring and Kill Fix

> **Status**: planned · **Priority**: high · **Created**: 2026-06-20

Add a feature to bring the currently running agent process to the foreground, and fix the issue where the process is killed but the console log modal still exists.

## Overview

We need to support two main features/fixes:
1. **Bring Agent OS Process to Foreground**: If the spawned agent has a visible console/terminal window on Windows, provide a way to bring it to the foreground when clicking the "Bring to Front" button in the GUI (which also opens the logs modal in the Tauri frontend).
2. **Close Log Modal/Window on Kill**: When an agent process is killed (either from the card or inside the modal), the terminal log modal in the frontend (which displays the logs) should be closed immediately instead of lingering.

## Design

### 1. Windows API Integration for Bringing PID to Front
Using raw FFI with `user32.dll` on Windows:
- `EnumWindows` to enumerate all top-level windows.
- `GetWindowThreadProcessId` to filter windows owned by the agent's PID.
- `IsWindowVisible` to ensure we target visible console/command prompt windows.
- `IsIconic` and `ShowWindow(hwnd, SW_RESTORE)` to restore the window if minimized.
- `SetForegroundWindow` to bring it to the front.

### 2. Tauri Command Registration
- Register a `bring_agent_to_foreground` command in `crates/gui/src-tauri/src/main.rs`.
- Extract PID from active in-memory instances or fall back to the JSON list.
- Call the Windows FFI helper conditionalized for Windows, return no-op on non-Windows.

### 3. Frontend Component Adjustments
- Register the Tauri command in `api.ts`.
- In `ProjectsPage.tsx`, in `handleKill`, check if `selectedAgentLogs` matches the killed agent, and set it to `null` to close the log modal.
- In the "Bring to Front" button onClick handler, invoke both `bringAgentToForeground` and `setSelectedAgentLogs`.

## Plan

- [x] Task 1: Add FFI code in `crates/gui/src-tauri/src/main.rs` to find and bring a PID's window to the foreground on Windows.
- [x] Task 2: Register the `bring_agent_to_foreground` Tauri command in `main.rs` and link it to the frontend `api.ts`.
- [x] Task 3: Update `ProjectsPage.tsx` to call `bringAgentToForeground` when clicking "Bring to Front" / "前台显示".
- [x] Task 4: Update `ProjectsPage.tsx`'s `handleKill` to close the terminal log modal if it is open for the killed agent.

## Test

- [x] Verify that building the Tauri app succeeds.
- [x] Verify that killing an agent closes the frontend console log modal immediately.
- [x] Run E2E vitest tests to ensure no regressions.

## Notes

<!-- Optional: Research findings, alternatives considered, open questions -->
