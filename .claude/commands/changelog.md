---
description: Update CHANGELOG.md with recent commits since last changelog entry
---

Analyze the CHANGELOG.md file to find the last update date, then examine all git commits made since that date on the current branch. 

Follow the existing CHANGELOG.md format which uses:
- Date-based sections like `## [2025-08-31]`
- Categories: `### Added`, `### Changed`, `### Fixed`
- Bullet points with descriptive commit messages

Steps to perform:
1. Read CHANGELOG.md to identify the most recent date entry
2. Use git log to get all commits since that date on the current branch
3. Categorize the commits based on their content into Added/Changed/Fixed sections
4. Insert a new date section (using today's date) in the appropriate chronological location
5. Format the commit messages as clear, user-friendly changelog entries
6. Preserve the existing changelog structure and formatting

Make sure to:
- Use today's date (2025-09-02) for the new section
- Place the new section in correct chronological order (after Unreleased, before older dates)
- Transform commit messages into clear, descriptive changelog entries
- Group similar changes together when appropriate
- Follow the established writing style and formatting of existing entries
- Skip commits that were later reverted - when a commit and its revert both exist, exclude both from the changelog