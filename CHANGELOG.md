# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2025-05-04

- Changed readme

## [1.1.0] - 2025-05-04

### Added

- Added `options` parameter with type `HoverSlopOptions` to `useHoverSlop` hook
- Moved `debugMode` from standalone parameter into the options object
- Added support for event options that control behavior of mouse events:
  - `eventOptions.onMouseEnter.once`: When true, onMouseEnter fires only once
  - `eventOptions.onMouseLeave.once`: When true, onMouseLeave fires only once

## [1.0.0] - 2025-05-02

### Initial Release

- First stable release of useHoverSlop hook
- Basic hover detection with customizable slop areas
- Support for onMouseEnter, onMouseLeave, and onMouseOver events
- Debug visualization mode
