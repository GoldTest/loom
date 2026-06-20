# CliMaster

<p align="center">
  <img src="crates/gui/src-tauri/icons/tray.png" alt="CliMaster Logo" width="120" />
</p>

<p align="center">
  <b>A Modern CLI Tool Manager, scanner, and supervisor built with Rust & Tauri.</b>
  <br />
  <b>基于 Rust 和 Tauri 构建的现代化 CLI 工具管理、扫描及进程监视面板。</b>
</p>

<p align="center">
  <a href="https://github.com/GoldTest/CliMaster/actions/workflows/ci.yml">
    <img src="https://github.com/GoldTest/CliMaster/actions/workflows/ci.yml/badge.svg" alt="Rust & Frontend CI Status" />
  </a>
  <a href="https://github.com/GoldTest/CliMaster/releases">
    <img src="https://img.shields.io/github/v/release/GoldTest/CliMaster?color=blue" alt="Latest Release" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/GoldTest/CliMaster?color=green" alt="MIT License" />
  </a>
</p>

---

<p align="center">
  <a href="#english">English</a> | <a href="#简体中文">简体中文</a>
</p>

---

<a name="english"></a>
## English

CliMaster is a local command-line interface (CLI) tool manager and supervisor featuring a high-performance Rust core, a unified clap-based command line interface (`climaster`), and a modern Tauri-based GUI dashboard.

It enables developers to scan, import, categorize, and execute CLI commands with custom environment variables and parameterized run templates, all while offering real-time process monitoring and stdout/stderr log streaming.

### 🌟 Key Features

- **CLI Auto-Scanner & Importer**: Crawl the Windows `PATH` environment variable or scan specific directories to automatically discover executable CLI tools, deduplicating them and storing them locally.
- **Categorization & Custom Environments**: Group discovered CLI tools into categories and specify custom, persistent environment variables to run them with.
- **Run Parameter Templates**: Create reusable execution templates with pre-configured arguments, working directories (`pwd`), and overrides for environment variables.
- **Process Lifecycle Manager**: Launch CLI templates from the GUI dashboard, stream stdout/stderr log output in real-time, and cleanly terminate running processes (including process trees on Windows).
- **System Tray Icon & Close-to-Tray**:
  - The application automatically starts with a system tray icon.
  - Clicking the top-right close (`X`) button hides the main window, allowing it to run in the background.
  - Use the system tray context menu to quickly restore the GUI ("Show CliMaster") or cleanly terminate the process ("Quit").
  - Left-clicking the tray icon restores and focuses the window.
- **Bilingual Interface**: Chinese (`zh`) and English (`en`) support with state persistence.

### 🏗️ Project Architecture

```
├── .github/
│   └── workflows/
│       ├── ci.yml      # Rust & Frontend CI Workflow
│       └── release.yml # Auto-Release & Packaging Workflow
├── crates/
│   ├── core/           # Common logic: persistence, scanner, process runner
│   ├── cli/            # clap-based command-line binary `climaster`
│   └── gui/            # Tauri desktop application backend & React frontend
├── specs/              # Spec-Driven Development (HarnSpec) definitions
└── e2e/                # Playwright/Vitest E2E integration test suite
```

#### Technical Stack
- **Backend & Core**: Rust, Tauri v2
- **Frontend Dashboard**: React, TypeScript, Vite
- **Testing Suite**: Vitest, Execa for CLI integration

### 🚀 Getting Started

#### Prerequisites

- [Rust & Cargo](https://rustup.rs/) (Stable channel)
- [Node.js](https://nodejs.org/) (v22+ recommended)
- [pnpm](https://pnpm.io/) (for E2E tests, optional but recommended)

#### 1. Installation & Environment Setup

Clone the repository:
```bash
git clone https://github.com/GoldTest/CliMaster.git
cd CliMaster
```

Install frontend dependencies:
```bash
cd crates/gui/frontend
npm install
cd ../../..
```

Install E2E test suite dependencies:
```bash
cd e2e
pnpm install
cd ..
```

#### 2. Development Mode

To run the GUI in development mode with hot-reloading:
- **Step 1**: Start the frontend development server:
  ```bash
  cd crates/gui/frontend
  npm run dev
  ```
- **Step 2**: Start the Tauri development desktop window:
  ```bash
  cd crates/gui/src-tauri
  cargo tauri dev
  ```

#### 3. Testing

Run Rust core unit tests:
```bash
cargo test --workspace
```

Run E2E integration tests:
```bash
cd e2e
pnpm run test
```

#### 4. Compilation & Production Build

To build the binaries locally (producing `climaster` CLI and `climaster-gui` in the `target/release` folder):
```bash
cargo build --release --workspace
```

To build and package the Tauri GUI distribution locally (this outputs the NSIS Installer `.exe` in `target/release/bundle/nsis/`):
```bash
npx @tauri-apps/cli build
```

### 🤖 CI/CD Workflows

This project uses GitHub Actions to automate verification and packaging:

#### 1. Continuous Integration (`ci.yml`)
Runs on every push or pull request to the `master` branch:
- Installs Rust, Node.js v22, and dependencies.
- Runs Rust workspace tests (`cargo test`).
- Compiles the workspace binaries.
- Executes the Vitest E2E test suite.

#### 2. Continuous Delivery (`release.yml`)
Runs on pushing a version tag (e.g., `git tag v1.0.0` & `git push origin v1.0.0`):
- Compiles the release binaries in workspace.
- Packages the **Windows EXE Installer** using Tauri's NSIS bundler.
- Compresses `CliMaster.exe` and `climaster.exe` alongside the README into a **Windows Portable Package** (`CliMaster-portable-x64.zip`).
- Publishes a new GitHub Release with these assets attached.

### ⚙️ Configuration & Data Storage

CliMaster stores all CLI tools, categories, execution logs, and templates in a single JSON registry file:
- **Location**: `climaster.json` located in the user's local application data directory (e.g. `AppData/Local/climaster/climaster.json` on Windows).

---

<a name="简体中文"></a>
## 简体中文

CliMaster 是一个本地命令行工具（CLI）管理与监视面板。它包含高性能的 Rust 核心、基于 clap 编写的统一命令行工具（`climaster`）以及基于 Tauri 开发的现代 GUI 仪表盘。

开发者可以使用 CliMaster 扫描、导入、分类和运行 CLI 命令，设置自定义环境变量与参数运行模板，并支持实时的进程监控和 stdout/stderr 日志流推送。

### 🌟 主要功能

- **CLI 工具自动扫描与导入**：自动爬取 Windows 的 `PATH` 环境变量，或扫描特定目录以自动发现可执行 CLI 工具，并进行排重和本地存储。
- **分组管理与自定义环境变量**：将发现的 CLI 工具划分到不同分类，并为它们指定持久化的自定义环境变量。
- **参数运行模板**：为 CLI 创建可复用的运行模板，预先配置好参数、工作目录 (`pwd`) 以及环境变量覆盖项。
- **进程生命周期管理**：在 GUI 仪表盘直接启动运行模板，实时流式传输 stdout/stderr 日志，并可以安全地终止运行中的进程（在 Windows 上支持销毁整个进程树）。
- **系统托盘图标与最小化到托盘**：
  - 启动后自动常驻系统托盘。
  - 点击窗口右上角关闭 (`X`) 按钮时隐藏主窗口，使其在后台持续运行。
  - 右键托盘菜单可快速恢复界面（"Show CliMaster"）或安全退出程序（"Quit"）。
  - 双击或单击托盘图标恢复并聚焦窗口。
- **双语界面**：提供中文 (`zh`) 与英文 (`en`) 支持，并持久化保存用户的语言状态。

### 🏗️ 项目架构

```
├── .github/
│   └── workflows/
│       ├── ci.yml      # Rust & 前端 CI 构建工作流
│       └── release.yml # 自动 Release 自动打包发布工作流
├── crates/
│   ├── core/           # 核心逻辑：数据持久化、扫描器、进程运行器
│   ├── cli/            # 基于 clap 的命令行工具 binary `climaster`
│   └── gui/            # Tauri 桌面端应用后端以及 React 前端代码
├── specs/              # HarnSpec 规范驱动开发定义的规格文档
└── e2e/                # 基于 Playwright/Vitest 的 E2E 集成测试套件
```

#### 技术栈
- **后端与核心**：Rust, Tauri v2
- **前端仪表盘**：React, TypeScript, Vite
- **测试框架**：Vitest, Execa（用于 CLI 集成测试）

### 🚀 快速开始

#### 前提条件

- [Rust & Cargo](https://rustup.rs/) (Stable channel)
- [Node.js](https://nodejs.org/) (推荐 v22 及以上版本)
- [pnpm](https://pnpm.io/) (用于运行 E2E 测试)

#### 1. 安装与环境配置

克隆项目仓库：
```bash
git clone https://github.com/GoldTest/CliMaster.git
cd CliMaster
```

安装前端依赖项：
```bash
cd crates/gui/frontend
npm install
cd ../../..
```

安装 E2E 测试套件依赖：
```bash
cd e2e
pnpm install
cd ..
```

#### 2. 开发模式

在开发环境下运行并开启热重载：
- **步骤 1**：启动前端 Vite 开发服务器：
  ```bash
  cd crates/gui/frontend
  npm run dev
  ```
- **步骤 2**：启动 Tauri 桌面端应用窗口：
  ```bash
  cd crates/gui/src-tauri
  cargo tauri dev
  ```

#### 3. 运行测试

运行 Rust Core 单元测试：
```bash
cargo test --workspace
```

运行 E2E 集成测试：
```bash
cd e2e
pnpm run test
```

#### 4. 生产编译与打包

本地编译二进制文件（在 `target/release` 目录下生成 `climaster` CLI 和 `climaster-gui` 可执行文件）：
```bash
cargo build --release --workspace
```

在本地进行打包（输出 Windows NSIS 安装包 `.exe` 到 `target/release/bundle/nsis/` 目录下）：
```bash
npx @tauri-apps/cli build
```

### 🤖 CI/CD 自动化工作流

本项目使用 GitHub Actions 实现了以下自动化流程：

#### 1. 持续集成 (`ci.yml`)
在向 `master` 分支提交推送 (Push) 或拉取请求 (PR) 时自动触发：
- 配置 Rust、Node.js v22 并安装各依赖包。
- 运行整个 Rust 工作区的单元测试 (`cargo test`)。
- 编译生成项目所有二进制文件。
- 运行 Vitest 编写的 74 个 E2E 测试用例。

#### 2. 持续部署/发布 (`release.yml`)
在推送版本标签 (例如 `git tag v1.0.0` 并且 `git push origin v1.0.0`) 时自动触发：
- 在 Release 模式下编译 Rust 代码。
- 通过 Tauri NSIS 打包工具打包生成 **Windows EXE 安装包**。
- 将 `CliMaster.exe` 和 `climaster.exe` 与项目 `README.md` 打包为 **Windows 便携包** (`CliMaster-portable-x64.zip`)。
- 自动生成 GitHub Release，并将安装包和便携包上传为发布资产。

### ⚙️ 配置及本地存储路径

CliMaster 的注册表、分组、命令运行历史、参数模板和应用设置均保存在单个 JSON 配置文件中：
- **配置文件路径**：`climaster.json`，存储在本地的应用数据目录（例如 Windows 下的 `AppData/Local/climaster/climaster.json`）。

---

## 📄 开源协议

本项目采用 [MIT 许可证](LICENSE) 开源。
