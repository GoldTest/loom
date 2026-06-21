---
status: complete
created: 2026-06-20
priority: high
tags:
- project
- agent
- supervisor
parent: 001-climaster-project
created_at: 2026-06-20T16:44:33.014020500Z
updated_at: 2026-06-20T16:57:22.945009700Z
completed_at: 2026-06-20T16:57:22.945009700Z
transitions:
- status: complete
  at: 2026-06-20T16:57:22.945009700Z
---

# Project-Centric Agent Supervisor

## Overview
Shift CliMaster's focus from global static CLI tool listing/categorization to a project-scoped workspace, monitoring active running CLI agents (such as `geminicli`, `agy`) at the OS process level, and providing customizable environment isolation (including inheriting default environments or overriding with isolated environments).

将 CliMaster 从全局静态的 CLI 工具管理，转变为面向项目的开发工作区、系统级进程监控以及实例级环境变量隔离的 CLI Agent 监管中心。

## Requirements
- [x] **Project Workspace Configuration (项目工作区配置)**: Register and switch between local projects (workspace directories).
- [x] **OS-Level Process Supervision (系统级进程状态监控)**: Monitor spawned agent instances using OS process IDs (PIDs) to dynamically drive the UI breathing lights (Running/Success/Failed) without requiring any communication protocol (like MCP/ACP).
- [x] **Flexible Environment Isolation (灵活的环境变量隔离)**: Support spawning agent instances with custom overridden env variables or inheriting the system default environment variables.
- [x] **Quick Spawn Launcher (项目级快捷派生)**: Quick command bar in the project dashboard to spawn new CLI agent instances with customizable parameters and env profiles.

## Child Specs
- `015-project-data-model-and-storage`: Backend storage updates to support projects and instance configuration.
- `016-os-process-tracker-and-env-isolation`: Rust supervisor tracking PIDs and managing flexible environment variables.
- `017-project-dashboard-ui-overhaul`: Tauri GUI redesign to show projects, active agent lists with breathing lights, and the quick spawn launcher.

## Acceptance Criteria
- [x] User can add projects and switch between them in the GUI.
- [x] Spawning a CLI agent (e.g. `agy`) creates a trackable OS process with its own environment block.
- [x] User can toggle between inheriting default environment or using overridden isolated environment variables.
- [x] The dashboard displays active agents with correct breathing lights driven by process status.
