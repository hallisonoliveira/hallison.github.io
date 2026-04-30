#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const REQUIRED_FIELDS = ['title', 'date', 'description'];
const DEFAULT_POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  return match[1];
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rawFrontmatter = extractFrontmatter(content);

  if (!rawFrontmatter) {
    return { valid: false, reason: 'Missing frontmatter (no --- delimiters found)' };
  }

  let frontmatter;
  try {
    frontmatter = yaml.load(rawFrontmatter);
  } catch (err) {
    return { valid: false, reason: `Invalid YAML: ${err.message}` };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter || frontmatter[field] === undefined || frontmatter[field] === null || frontmatter[field] === '') {
      return { valid: false, reason: `Missing required field "${field}"` };
    }
  }

  return { valid: true };
}

function collectMarkdownFiles(target) {
  const stat = fs.statSync(target);

  if (stat.isFile()) {
    return target.endsWith('.md') ? [target] : [];
  }

  const entries = fs.readdirSync(target, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && /^(?!_index(\.[a-z]{2})?\.md$).+\.md$/.test(entry.name)) {
      // _index.md and _index.{lang}.md are Hugo section indices, not content posts — skip validation
      files.push(fullPath);
    }
  }

  return files;
}

function main() {
  const target = process.argv[2] || DEFAULT_POSTS_DIR;
  const absoluteTarget = path.resolve(target);

  if (!fs.existsSync(absoluteTarget)) {
    console.error(`❌ Path not found: ${absoluteTarget}`);
    process.exit(1);
  }

  const stat = fs.statSync(absoluteTarget);
  if (stat.isFile() && !absoluteTarget.endsWith('.md')) {
    console.error(`❌ Not a markdown file: ${absoluteTarget}`);
    process.exit(1);
  }

  const files = collectMarkdownFiles(absoluteTarget);

  if (files.length === 0) {
    console.log('No markdown files found.');
    process.exit(0);
  }

  let passed = 0;
  let failed = 0;

  for (const filePath of files) {
    const displayName = path.relative(path.resolve(__dirname, '..'), filePath);
    const result = validateFile(filePath);

    if (result.valid) {
      console.log(`✅ ${displayName}`);
      passed++;
    } else {
      console.error(`❌ ${displayName}: ${result.reason}`);
      failed++;
    }
  }

  const summary = `\nSummary: ${passed} passed, ${failed} failed`;
  if (failed > 0) {
    console.error(summary);
    process.exit(1);
  } else {
    console.log(summary);
    process.exit(0);
  }
}

main();
