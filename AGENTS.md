# Repository Guidelines

## Project Structure & Module Organization

The repository is currently empty apart from this guide. No application code, tests, assets, or dependency manifests are present. When adding the initial implementation, group source code in `src/`, automated tests in `tests/`, and static assets in `assets/` where appropriate. Add a `README.md` describing the project purpose, setup, and actual directory layout. Keep generated output and installed dependencies out of version control.

## Build, Test, and Development Commands

No build, test, or development commands are configured yet. Do not assume that `npm test`, `npm run build`, or equivalent commands exist. When selecting a toolchain, define reproducible install, development, build, and test commands in its manifest and document them in the README. Run commands from the repository root unless documented otherwise.

For now, `Get-ChildItem -Force` lists root contents in PowerShell, including hidden configuration files.

## Coding Style & Naming Conventions

No language, formatter, or linter has been established. Adopt standard conventions for the chosen language and commit formatter and linter configuration alongside the first implementation. Use consistent indentation, descriptive names, and small modules with clear responsibilities. Follow existing file naming patterns once established; avoid mixing conventions within a module.

## Testing Guidelines

No testing framework or coverage threshold is configured. Introduce tests with the first functional code and document how to run them. Use descriptive test names that explain the behavior and expected outcome. Cover normal behavior, invalid input, and relevant failure cases; add regression tests for bug fixes.

## Commit & Pull Request Guidelines

There is no Git history available to establish commit conventions. Use short, imperative commit subjects, such as `Add initial project setup`. Keep commits focused. Pull requests should explain the change, reference related issues when available, and describe validation performed. Include screenshots for visible interface changes and identify any setup or configuration changes.

## Security & Configuration

Never commit credentials or secrets. Document required environment variables using placeholder values and ignore local configuration files containing sensitive data.
