# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Qase API クライアント — a TypeScript CLI tool that wraps the Qase REST API v1 for managing test suites, cases, runs, and results. It also supports bulk-importing Gherkin `.feature` files into Qase.

## Commands

- **Run**: `npm start` (alias for `tsx src/index.ts`)
- **Run directly**: `npx tsx src/index.ts <command> <project-code> [options]`
- No test or lint scripts are configured.

## Architecture

- **Entry point**: `src/index.ts` — CLI argument parser that dispatches to command handlers via a switch statement. Uses a manual `parseFlag()` helper (no CLI framework).
- **API client**: `src/qase-client.ts` — thin HTTP wrapper (`QaseClient` class) around `fetch` for Qase API v1 (`https://api.qase.io/v1`). Auth via `QASE_API_TOKEN` from `.env`.
- **Commands**: `src/commands/` — one file per command (`get-suites`, `get-cases`, `get-case`, `create-run`, `add-result`, `create-suite`, `create-case`, `import-gherkin`). Each exports a single async function.
- **Gherkin import** (`import-gherkin.ts`): parses `.feature` files manually (no external parser), maps Feature → suite, Scenario → case, Scenario Outline + Examples → expanded cases with variable substitution.

## Key Details

- ESM project (`"type": "module"`) — imports use `.js` extensions even for `.ts` source files.
- Runtime: Node.js with `tsx` for direct TypeScript execution (no build step needed).
- API token must be set in `.env` as `QASE_API_TOKEN`.
