# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is an **AI-driven research repository** where autonomous AI agents (Claude Sonnet 4.5, Google Jules, GitHub Copilot, GPT 4.1 Nano) collaboratively generate, review, and document experimental Python code. This is NOT production code - it's a research environment focused on rapid prototyping and hypothesis testing. Code quality is secondary to experimental outcomes.

## Development Commands

### Code Quality
```bash
# Format and lint Python code (uses Ruff configured in pyproject.toml)
ruff check . --fix
ruff format .

# Check formatting and linting without changes
ruff check . --exit-non-zero-on-fix
ruff format . --check --diff

# Pre-commit hooks (Ruff linter + formatter)
pre-commit run --all-files
```

### Documentation
```bash
# Manually regenerate README.md with project list and summaries
# Requires cogapp, llm, and llm-github-models (see requirements.txt)
cog -r -P README.md

# Delete a project's _summary.md to force regeneration on next run
rm <project_dir>/_summary.md
cog -r -P README.md
```

## Code Architecture

### Repository Structure
- **Root level**: Research project subdirectories (not in `etc/`)
- **`etc/`**: Utility files, test data, documentation, and temporary logs
- **Research projects**: Each subdirectory at root contains an isolated experiment with:
  - `README.md` - Project description and methodology
  - `_summary.md` - Auto-generated summary (cached, created by GitHub Actions)

### Automated Documentation System
The README.md contains an embedded Cog script (lines 24-137) that:
1. Discovers all root-level subdirectories (excluding `.` prefixed and `etc`)
2. Retrieves first commit date via `git log` for chronological ordering
3. Checks for cached `_summary.md`, otherwise generates using `llm -m openai/gpt-4.1-nano`
4. Creates GitHub links to each project folder
5. Caches summaries to avoid regeneration

**Key implementation details**:
- Uses `subprocess.run()` with timeouts for git operations
- Falls back to directory `st_mtime` if git history unavailable
- Validates LLM summaries (20-2000 chars) before caching
- GitHub Action triggers on push to main (`.github/workflows/update-readme.yml`)

### Code Review Philosophy
See `.github/copilot/instructions.md` for the review framework. Copilot focuses on:
- **Security**: CWE-categorized vulnerabilities (injection, path traversal, resource exhaustion)
- **Reproducibility**: Hard-coded paths, missing dependencies, undocumented assumptions
- **Functional correctness**: Edge cases, error handling, algorithmic efficiency
- **Out of scope**: Style/formatting (handled by Ruff)

## Python Configuration

### Ruff Settings (pyproject.toml)
- **Linting**: Pycodestyle (E), Pyflakes (F), Warnings (W), Import sorting (I), Bugbear (B)
- **Ignored**: E501 (line length, handled by formatter)
- **Line length**: 88 characters
- **Formatter**: Black-compatible via `[tool.ruff.format]`

### Dependencies (requirements.txt)
- `cogapp==3.6.0` - Embedded script execution in Markdown
- `llm==0.27.1` - CLI for LLM interactions (Simon Willison's tool)
- `llm-github-models==0.18.0` - GitHub Models API integration for GPT-4.1-nano

## GitHub Actions

### update-readme.yml
- **Trigger**: Push to main
- **Function**: Runs `cog -r -P README.md` with `GH_MODELS_TOKEN` for API access
- **Commits**: Auto-commits updated README.md and `_summary.md` files with `[skip ci]`

### style_and_lint.yml
- **Trigger**: Pull requests to main
- **Function**: Enforces Ruff formatting/linting as PR status check
- **Behavior**: Fails if auto-fixable issues found (forces local fixes)

## Important Context for AI Agents

### When Creating New Research Projects
1. Create subdirectory at repository root (NOT in `etc/`)
2. Include `README.md` with clear methodology and purpose
3. Do NOT manually create `_summary.md` - it auto-generates
4. Follow Ruff formatting rules (will be checked on PR)

### Security Considerations
While this is research code, avoid:
- Hardcoded API keys or credentials (use environment variables)
- Path traversal vulnerabilities (validate file paths with `os.path.abspath()`)
- Uncontrolled resource consumption (use timeouts, limit loops)
- Command injection (sanitize subprocess inputs)

### Commit Workflow
- Direct commits to main are allowed for automated documentation updates
- PRs are recommended for research code (triggers style/lint checks and Copilot review)
- Pre-commit hooks auto-fix Ruff issues before commit
