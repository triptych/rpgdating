# Git Commit Workflow

This document provides a streamlined workflow for committing changes to the RPG Dating Game repository, including automatic changelog updates.

## Quick Commit Commands

### 1. Standard Feature Commit
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: add expanded dungeon system with specialized loot

- Added 6 new dungeons with different difficulty levels and loot specialties
- Implemented comprehensive store system for buying/selling items
- Added passive activities system for party members
- Enhanced UI with new navigation sections
- Improved game balance with progressive difficulty"

# Push to remote repository
git push origin main
```

### 2. Update Changelog and Commit
```bash
# First, update the CHANGELOG.md file manually with your changes
# Move items from [Unreleased] to a new version section

# Add the changelog
git add CHANGELOG.md

# Commit changelog update
git commit -m "docs: update changelog for v1.1.0 release"

# Add all other changes
git add .

# Commit feature changes
git commit -m "feat: major game expansion with dungeons, store, and activities

- Expanded dungeon system with 6 specialized areas
- Added merchant store with buy/sell functionality  
- Implemented passive activities for resource generation
- Enhanced game balance and progression
- Updated UI with new navigation sections"

# Push all commits
git push origin main
```

### 3. Automated Workflow Script

Create a script file `commit.sh` (Linux/Mac) or `commit.bat` (Windows) for automation:

#### Linux/Mac (commit.sh):
```bash
#!/bin/bash

# Get commit message from user
echo "Enter commit message:"
read commit_message

# Get version for changelog
echo "Enter version (e.g., 1.1.0) or press Enter to skip changelog update:"
read version

# Update changelog if version provided
if [ ! -z "$version" ]; then
    # Create backup of changelog
    cp CHANGELOG.md CHANGELOG.md.bak
    
    # Update changelog (move Unreleased to version)
    sed -i "s/## \[Unreleased\]/## [$version] - $(date +%Y-%m-%d)\n\n## [Unreleased]/" CHANGELOG.md
    
    echo "Changelog updated for version $version"
fi

# Stage all changes
git add .

# Commit with message
git commit -m "$commit_message"

# Push to remote
git push origin main

echo "Changes committed and pushed successfully!"
```

#### Windows (commit.bat):
```batch
@echo off

set /p commit_message="Enter commit message: "
set /p version="Enter version (e.g., 1.1.0) or press Enter to skip changelog update: "

if not "%version%"=="" (
    echo Updating changelog for version %version%
    powershell -Command "(Get-Content CHANGELOG.md) -replace '## \[Unreleased\]', ('## [' + '%version%' + '] - ' + (Get-Date -Format 'yyyy-MM-dd') + '`n`n## [Unreleased]') | Set-Content CHANGELOG.md"
)

git add .
git commit -m "%commit_message%"
git push origin main

echo Changes committed and pushed successfully!
```

## Commit Message Conventions

Follow conventional commit format for better organization:

### Types:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples:
```bash
git commit -m "feat: add store system with buy/sell functionality"
git commit -m "fix: resolve dungeon difficulty balance issues"
git commit -m "docs: update README with new features"
git commit -m "style: improve UI layout for activities section"
```

## Changelog Management

### Manual Changelog Update Process:

1. **Before committing**, update `CHANGELOG.md`:
   - Move items from `[Unreleased]` to a new version section
   - Add release date
   - Keep `[Unreleased]` section for future changes

2. **Example changelog update**:
```markdown
## [Unreleased]

## [1.1.0] - 2024-08-24

### Added
- Expanded dungeon system with 6 specialized dungeons
- Comprehensive store system with buy/sell functionality
- Passive activities system for party members
```

## Git Status Check

Before committing, always check your changes:
```bash
# See what files have changed
git status

# See detailed changes
git diff

# See staged changes
git diff --cached
```

## Branch Management

For larger features, consider using feature branches:
```bash
# Create and switch to feature branch
git checkout -b feature/dungeon-expansion

# Work on your changes...

# Commit changes
git add .
git commit -m "feat: implement dungeon expansion system"

# Switch back to main
git checkout main

# Merge feature branch
git merge feature/dungeon-expansion

# Delete feature branch
git branch -d feature/dungeon-expansion

# Push to remote
git push origin main
```

## Troubleshooting

### Common Issues:

1. **Merge conflicts**: 
   ```bash
   git status  # See conflicted files
   # Edit files to resolve conflicts
   git add .
   git commit -m "resolve merge conflicts"
   ```

2. **Undo last commit** (if not pushed):
   ```bash
   git reset --soft HEAD~1  # Keep changes staged
   git reset --hard HEAD~1  # Discard changes
   ```

3. **Check commit history**:
   ```bash
   git log --oneline  # Brief history
   git log --graph --oneline --all  # Visual history
   ```

## Best Practices

1. **Commit frequently** with small, focused changes
2. **Write clear commit messages** that explain what and why
3. **Update changelog** before major releases
4. **Test your changes** before committing
5. **Review your changes** with `git diff` before committing
6. **Use branches** for experimental features
7. **Keep commits atomic** - one logical change per commit

---

*This workflow ensures consistent version control practices and maintains a clear project history.*
