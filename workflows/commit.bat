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
