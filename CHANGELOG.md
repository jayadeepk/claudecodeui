# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial changelog file

## [2025-08-31]

### Added
- VITE_DISABLE_CURSOR feature flag to hide Cursor CLI references
- Auto-collapse behavior for project folders in sidebar
- Quick Settings button to desktop header
- Hamburger menu to toggle desktop sidebar visibility
- 'Use Browser Theme' checkbox to Quick Settings panel
- Message filtering to session display in chat interface
- Clickable logo navigation to homepage in sidebar
- Mobile action buttons as reusable components
- Logout button to sidebar settings section
- BASE_PATH configuration and HTML template transformation
- Dynamic base href tag for relative URL resolution
- Configurable BASE_PATH for WebSocket URL generation

### Changed
- Improved project selection message layout
- Improved UI when Cursor CLI is disabled - hide 'Choose Your AI Assistant' text
- Session summary filters now configurable via environment variables
- Refined session hierarchy tracking to filter out subset sessions
- Improved session name filtering by removing Caveat prefix check and adding isMeta filter
- Improved Claude session name display by falling back from 'Caveat:' summaries to user messages
- Replaced mobile 3-dots menu with direct action buttons
- Moved Task Progress panel controls from desktop toggle to Quick Settings
- Added configurable version checking with VITE_DISABLE_VERSION_CHECK environment variable

### Fixed
- Fixed duplicate Quick Settings buttons in responsive layout
- Fixed QuickSettingsPanel visibility in all tabs
- Fixed Shell component dark theme issue with dynamic theme switching
- Fixed Quick Settings button visibility across all views
- Cleaned up UI text and console logging
- Prevented git operations on non-git directories
- Removed redundant session hierarchy system
- Implemented subset session filtering using parentUuid analysis
- Removed local-command-stdout filter from session message parsing
- Removed old Quick Settings pull tab from desktop view

## [2025-08-30]
### Changed
- Updated asset paths to relative URLs for improved PWA and local deployment compatibility
- Updated API URLs to relative paths and added local Vite config support

### Added
- Added vite.config.local.js to gitignore for local configuration overrides

## [2025-08-28]
### Added
- Progressive Web App (PWA) functionality
- Official Claude branding for PWA icons

### Changed
- PWA name from 'Claude UI' to 'Claude Code'
- Improved 3-dots button with circular design and centered ripple animation
- Replaced mobile floating buttons with 3-dots menu for cleaner UI
- Improved chat input and attachment button positioning for mobile
- Improved text input vertical centering with asymmetric padding
- Reduced send button size from 48px to 32px for more compact UI
- Improved scroll-to-bottom button positioning with absolute layout
- Improved session title truncation and summary length
- Removed Claude/Cursor logo icon from top bar header
- Improved mobile UI header layout and session summary length
- Moved permission mode selector to QuickSettingsPanel for cleaner mobile UI
- Adjusted mobile UI bottom spacing and iOS safe area handling
- Updated chat input placeholder text for simplicity
- Auto-open sidebar on mobile when no project is selected
- Removed mobile UI tip message from main content area

## [2025-08-27]
### Added
- Persistent todo panel with sticky sidebar functionality

### Changed
- Improved auto-scroll behavior to only trigger on initial session load
- Applied blue band styling to Grep tool similar to Read tool
- Removed blue wrapper from Edit and Grep tools for cleaner UI
- Improved Grep tool display with human-readable format
- Improved todo panel visibility and mobile UX
- Improved todo panel UX and cleaned up chat interface
- Improved timestamp visibility for assistant messages

### Fixed
- Fixed inline code detection in ReactMarkdown component

## [2025-08-26]
### Changed
- Hidden timestamps for tool use messages in chat interface
- Enhanced auto-expand tools to hide summaries when enabled
- Hidden tool result visual indicators for successful operations
- Added conditional avatar rendering to ChatInterface

## [2025-08-24]
### Fixed
- Fixed version check to handle uppercase 'V' in version tags

## [2025-08-23]
### Added
- Systemd service configuration to CLAUDE.md
- CLAUDE.md project documentation

## [Previous Releases]

See git commit history for changes prior to changelog implementation.