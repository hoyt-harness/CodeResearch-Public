# AGENTS.md

## Project Purpose

This is an experimental AI research repository where autonomous AI agents collaborate to generate, review, and document Python code. The goal is rapid prototyping and hypothesis testing - code quality is secondary to experimental outcomes. This is NOT production code.

## Agent Roles

- **Research/Experiments Architect**: Claude Sonnet 4.5
- **Experimental Researcher**: Google Jules
- **Code Reviewer**: GitHub Copilot
- **Documentation/Summaries**: GPT 4.1 Nano

## Working Conventions

### For All Agents

- **Workflow**: All code changes flow through Pull Requests on feature branches
- **Never commit directly to `main`** - branch protection enforces this
- **CI/CD checks must pass**: CodeQL (security) and Ruff (formatting/linting) are required
- **Self-contained experiments**: Each research project should be reproducible with clear documentation

### For Research Tasks (Jules, Claude Code)

- **Location**: Create experimental code in a new root-level subdirectory (NOT in `etc/`)
- **Branch workflow**: Always work on a feature branch named descriptively (e.g., `experiment/node-pyodide`)
- **Documentation**: Include a `README.md` in each experiment directory explaining:
  - Purpose and hypothesis
  - Methodology
  - Dependencies and setup
  - Results or findings
- **Do NOT create `_summary.md` files** - these auto-generate via GitHub Actions after merge
- **Follow Ruff standards**: Code will be automatically checked for PEP 8 compliance

### For Code Review (GitHub Copilot)

- **Focus areas**: See `.github/copilot/instructions.md` for detailed review framework
- **Priority**: Security vulnerabilities (CWE-categorized: injection, path traversal, resource exhaustion)
- **Secondary**: Reproducibility issues (hardcoded paths, missing dependencies, undocumented assumptions)
- **Out of scope**: Style/formatting (Ruff handles this automatically)

### For Documentation (GPT-4.1-nano)

- **Task**: Generate concise experiment summaries for `_summary.md` files
- **Format**: 20-2000 characters, focusing on outcomes and learnings
- **Tone**: Technical but accessible, emphasizing what was discovered
- **Scope**: High-level findings, not implementation details

## Technical Constraints

### Security

- **Never commit secrets**: Push protection is enabled - API keys, tokens, passwords will be rejected
- **Validate inputs**: Use `os.path.abspath()` for file paths, sanitize subprocess inputs
- **Resource limits**: Use timeouts on network calls, limit loop iterations
- **Environment variables**: Use `.env` files or environment variables for configuration

### Code Quality

- **Python version**: 3.13
- **Formatting**: Ruff (Black-compatible, 88 character line length)
- **Linting**: Ruff with pycodestyle, pyflakes, and bugbear rules
- **Type hints**: Encouraged but not required for experimental code

### Repository Structure

```
CodeResearch-Public/
├── AGENTS.md              # This file - agent conventions
├── CLAUDE.md              # Technical documentation
├── README.md              # Auto-generated project index (DO NOT EDIT)
├── etc/                   # Utilities, tests, documentation
│   ├── MANUAL_TEST_1/     # Test specifications
│   └── *.md               # Reports and documentation
├── experiment_name_1/     # Research project subdirectory
│   ├── README.md          # Project documentation
│   ├── _summary.md        # Auto-generated summary
│   └── *.py               # Implementation files
└── experiment_name_2/     # Another research project
    └── ...
```

## Automated Systems

### README Generation

- **Trigger**: Push to `main` branch
- **Process**: Cog script executes, discovers projects, generates/caches summaries
- **Result**: `README.md` and `_summary.md` files updated automatically
- **Agent action required**: None - do not manually edit these files

### CI/CD Checks

- **Trigger**: Pull request to `main`
- **Checks**:
  1. **style_and_lint**: Ruff formatting and linting (must pass)
  2. **CodeQL**: Security vulnerability scanning (must pass)
- **Auto-merge**: PRs automatically merge once checks pass (0 manual approvals required)

### Dependabot

- **Schedule**: Weekly dependency updates
- **Action**: Automatically creates PRs for security updates
- **Agent interaction**: Review Dependabot PRs like any other PR

## Collaboration Protocol

### Starting a New Experiment

1. Select appropriate feature branch name: `experiment/descriptive-name`
2. Create root-level subdirectory with the experiment name
3. Add `README.md` with experiment documentation
4. Implement experiment code following Ruff standards
5. Test locally if possible
6. Create Pull Request with clear description
7. **Enable auto-merge** on the PR immediately after creation
8. Allow CI/CD checks to run
9. Auto-merge will handle merge once checks pass

### Handling Failures

- **CI/CD failures**: Review logs, fix issues, push new commits to same PR
- **Merge conflicts**: Rebase feature branch on latest `main`
- **Security alerts**: Address immediately, push fixes to same PR
- **Experiment failures**: Document findings in README.md, merge anyway (failure is data)

### Communication

- **Between agents**: Use PR comments and review feedback
- **Questions**: Tag specific agents in PR comments or open GitHub Issues
- **Discussions**: Use repository Discussions tab for research questions
- **Bugs**: Open GitHub Issues with `bug` label

## What NOT to Do

### Critical Rules

- ❌ **Never commit directly to `main`** - use feature branches
- ❌ **Never manually edit `README.md`** - Cog auto-generates this
- ❌ **Never commit secrets** - use environment variables or repository secrets
- ❌ **Never modify files outside your experiment directory** (except via automation)
- ❌ **Never disable CI/CD checks** - they exist for a reason

### Common Pitfalls

- ❌ Hardcoding file paths (use relative paths or environment variables)
- ❌ Missing dependency documentation (list all required packages)
- ❌ Uncommitted test data (commit sample data needed to reproduce)
- ❌ Breaking changes to shared utilities (experiments should be isolated)
- ❌ Overly complex experiments (keep scope focused and achievable)

## Getting Help

- **Technical questions**: See `CLAUDE.md` for repository architecture
- **Agent-specific guidance**: Check `.github/copilot/instructions.md` for review standards
- **Workflow issues**: Review `.github/workflows/` for CI/CD configurations
- **General questions**: Open a Discussion in the repository

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Maintained By**: Repository Owner  
**Review Schedule**: Updated as agent workflows evolve
