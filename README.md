# 🔬 AI Code Research Repository (PUBLIC)
This repository is dedicated to **autonomous Artificial Intelligence code research** and experimentation utilizing advanced AI agents. The primary goal is to rapidly prototype, test hypotheses, and generate functional code snippets related to modern computing challenges, while leveraging AI to both develop and refine software, tools, methods, and solutions.

---
### ⚙️ Configuration & Technology
- **Research/Experiments Architect:** Claude Sonnet 4.5
- **Experimental Researcher:** Google Jules
- **Code Reviewer:** GitHub Copilot
- **Documentation/Summaries:** GPT 4.1 Nano
- **Core Language:** Python (enforced with **Ruff** formatting and linting rules defined in `pyproject.toml`).
- **Methodology:** All code is generated in response to specific research prompts.
- **Contribution Process:** The AI agent directly commits its work via **Pull Requests (PRs)** as long as the working repository enforces it, which serve as the primary audit log for each experiment.

---
### 🤝 Community and Reuse Policy
- **⚠️ WARNING:** **This is a research environment.** Code quality is secondary to experimental outcome. **DO NOT** use any code from this repository in production or high-stakes environments without rigorous human review, testing, and validation.
- **License:** All code is published under the **MIT License** (see `LICENSE` file for details).
- **Discussion:** Use the **Discussions** tab to propose new research questions, discuss experimental results, or provide feedback on the AI agent's performance.
- **Seeking Contribution:** If you wish to contribute test validation scripts or refined versions of the AI's output, please open a separate Pull Request targeting the specific experiment's folder.

---
## 💼 Research Projects

<!--[[[cog
import os
import subprocess
import pathlib
from datetime import datetime

# Model to use for generating summaries
MODEL = "openai/gpt-4.1-nano"

# Get all subdirectories with their first commit dates
research_dir = pathlib.Path.cwd()
subdirs_with_dates = []

for d in research_dir.iterdir():
    if d.is_dir() and not d.name.startswith('.'):
        # Get the date of the first commit that touched this directory
        try:
            result = subprocess.run(
                ['git', 'log', '--diff-filter=A', '--follow', '--format=%aI', '--reverse', '--', d.name],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0 and result.stdout.strip():
                # Parse first line (oldest commit)
                date_str = result.stdout.strip().split('\n')[0]
                commit_date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                subdirs_with_dates.append((d.name, commit_date))
            else:
                # No git history, use directory modification time
                subdirs_with_dates.append((d.name, datetime.fromtimestamp(d.stat().st_mtime)))
        except (subprocess.TimeoutExpired, subprocess.SubprocessError, ValueError, OSError):
            # Fallback to directory modification time if git fails or date parsing fails
            subdirs_with_dates.append((d.name, datetime.fromtimestamp(d.stat().st_mtime)))

# Sort by date, most recent first
subdirs_with_dates.sort(key=lambda x: x[1], reverse=True)

for dirname, commit_date in subdirs_with_dates:
    folder_path = research_dir / dirname
    readme_path = folder_path / "README.md"
    summary_path = folder_path / "_summary.md"

    date_formatted = commit_date.strftime('%Y-%m-%d')

    # Get GitHub repo URL
    github_url = None
    try:
        result = subprocess.run(
            ['git', 'remote', 'get-url', 'origin'],
            capture_output=True,
            text=True,
            timeout=2
        )
        if result.returncode == 0 and result.stdout.strip():
            origin = result.stdout.strip()
            # Convert SSH URL to HTTPS URL for GitHub
            if origin.startswith('git@github.com:'):
                origin = origin.replace('git@github.com:', 'https://github.com/')
            if origin.endswith('.git'):
                origin = origin[:-4]
            github_url = f"{origin}/tree/main/{dirname}"
    except (subprocess.TimeoutExpired, subprocess.SubprocessError, OSError):
        # Git command may fail if not in a git repo or network issues
        pass

    if github_url:
        print(f"### [{dirname}]({github_url}) ({date_formatted})\n")
    else:
        print(f"### {dirname} ({date_formatted})\n")

    # Check if summary already exists
    if summary_path.exists():
        # Use cached summary
        with open(summary_path, 'r') as f:
            description = f.read().strip()
            if description:
                print(description)
            else:
                print("*No description available.*")
    elif readme_path.exists():
        # Generate new summary using llm command
        prompt = """Summarize this research project concisely. Write just 1 paragraph (3-5 sentences) followed by an optional short bullet list if there are key findings. Vary your opening - don't start with "This report" or "This research". Include 1-2 links to key tools/projects. Be specific but brief. No emoji."""
        with open(readme_path) as f:
            result = subprocess.run(
                ['llm', '-m', MODEL, '-s', prompt],
                stdin=f,
                capture_output=True,
                text=True,
                timeout=60
            )
        if result.returncode != 0:
            error_msg = f"LLM command failed for {dirname} with return code {result.returncode}"
            if result.stderr:
                error_msg += f"\nStderr: {result.stderr}"
            raise RuntimeError(error_msg)
        if result.stdout.strip():
            description = result.stdout.strip()
            # Validate summary is reasonable before caching (at least 20 chars, not too long)
            if len(description) < 20:
                raise RuntimeError(f"LLM summary for {dirname} is too short: {description}")
            if len(description) > 2000:
                raise RuntimeError(f"LLM summary for {dirname} is too long ({len(description)} chars)")
            print(description)
            # Save to cache file
            with open(summary_path, 'w') as f:
                f.write(description + '\n')
        else:
            raise RuntimeError(f"LLM command returned no output for {dirname}")
    else:
        print("*No description available.*")

    print()  # Add blank line between entries

]]]-->
<!--[[[end]]]-->

---
## 📰 Documentation
The **Documentation/Summaries agent** (GPT 4.1 Nano) automatically generates project descriptions which are recorded in `_summary.md` in the target experiment's root home subdirectory.

### Automatic Updates
A GitHub Action auto-triggers an update of the repository's `README.md` (this file) to add or update new target experiment information on every push to main.

### Manual updates
To manually update the local repository that can then be manually pushed to GitHub, install [Cog](https://cog.readthedocs.io/en/latest/ "Cog"), then:

```bash
cd /path/to/repo

# Run cogapp to regenerate the project list:
cog -r -P README.md
```

The embedded script in `README.md` automatically:
- Discovers all subdirectories in the repository root
- Gets the first commit date for each subdirectory and sorts by most recent first
- Checks subdirectories for a `_summary.md` file
- If the summary exists, it uses the cached version
- If not, it generates a new summary using:
  ```bash
  # Includes prompt that creates engaging descriptions with bullets and links
  llm -m openai/gpt-4.1-nano
  ```
- Creates Markdown links to each project folder on GitHub
- New summaries are saved to `_summary.md` to avoid regenerating them on every run

To regenerate a specific project's description, delete its `_summary.md` file and run `cog -r -P README.md` again.
