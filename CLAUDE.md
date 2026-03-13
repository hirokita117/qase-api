# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A wrapper CLI for Qase REST API v1. Provides test management (suite/case/run/result) and bulk import of Gherkin `.feature` files.

## Architecture

- Three-layer structure: CLI → Command → API
- One command = one file
- API client is a thin HTTP wrapper
- Gherkin parser uses no external libraries

## Conventions

- ESM project (`.js` extension required in imports)
- Direct execution via `tsx` (no build step)
- Environment variable: `QASE_API_TOKEN` in `.env`
- No CLI framework (manual argument parsing)

## Language

- Thinking/reasoning: English
- Chat responses: Japanese
- Files, code, documentation: English
