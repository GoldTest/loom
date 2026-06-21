---
status: complete
created: 2026-06-21
priority: high
tags:
- gui
- tauri
- react
- drag-drop
created_at: 2026-06-21T06:03:07.977470600Z
updated_at: 2026-06-21T06:09:49.886236600Z
completed_at: 2026-06-21T06:09:49.886236600Z
transitions:
- status: in-progress
  at: 2026-06-21T06:03:43.251123600Z
- status: complete
  at: 2026-06-21T06:09:49.886236600Z
---

# Project List Drag and Drop Sorting

Add drag-and-drop sorting functionality to the projects list in the sidebar of CliMaster, allowing users to reorder their projects interactively and persist the custom sorting order.

## Overview

Currently, projects are displayed in the sidebar in the order they were registered. There is no way for the user to reorganize or prioritize their projects. Introducing a fluid, interactive drag-and-drop reordering mechanism will greatly improve the user experience for managing multiple projects.

## Design

1. **Backend Storage**:
   - We will implement a function `reorder_projects` in `crates/core/src/storage/manager.rs` that accepts an ordered list of project IDs, rearranges `config.projects` according to that list, and saves the updated configuration.
   - Any project IDs not present in the input list (e.g., in concurrent addition edge cases) will be appended to the end of the list to prevent data loss.
   
2. **Tauri API**:
   - Expose the function in `crates/core/src/storage/mod.rs`.
   - Add a new `#[tauri::command]` named `reorder_projects` in `crates/gui/src-tauri/src/main.rs`.
   - Register the new command in `tauri::Builder`'s invoke handler list.
   
3. **Frontend API**:
   - Add `reorderProjects` in `crates/gui/frontend/src/api.ts` to call the Tauri `reorder_projects` command.

4. **Frontend UI/UX**:
   - Leverage native HTML5 Drag and Drop API in React 19 in `crates/gui/frontend/src/App.tsx`.
   - Introduce `draggedIndex: number | null` state.
   - Attach `draggable={true}`, `onDragStart`, `onDragEnd`, `onDragOver`, and `onDragEnter` to each project nav button.
   - On `onDragEnter(index)`, swap the items dynamically in the `projects` state to provide live, fluid feedback as the user drags.
   - On `onDragEnd`, persist the new order to the backend. If saving fails, revert to the original order.
   - Apply polished styling (opacity change, cursor grab, outline highlights, transition animations) to make the drag-and-drop feel premium and responsive.

## Plan

- [x] Implement backend `reorder_projects` function in `crates/core/src/storage/manager.rs`
- [x] Add unit tests for `reorder_projects` in `crates/core/src/storage/tests.rs`
- [x] Expose `reorder_projects` in `crates/core/src/storage/mod.rs` and as a Tauri command in `crates/gui/src-tauri/src/main.rs`
- [x] Implement `reorderProjects` function in frontend `api.ts`
- [x] Implement Drag and Drop logic and state in `App.tsx` sidebar
- [x] Polish styling for dragging, drag-over states in `App.tsx` and ensure smooth transition

## Test

- [x] Unit tests for `reorder_projects` in Rust core pass successfully
- [x] Manual test: drag a project in the sidebar and drop it in a new position, verifying it reorders smoothly in real time
- [x] Manual test: reload/restart the application and verify that the customized project order is correctly loaded and preserved
