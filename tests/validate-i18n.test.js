#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Import the functions under test by re-implementing them here since the
// script uses main() directly. We test via child_process to keep it simple.
const { execFileSync } = require('child_process');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'validate-i18n.js');
const NODE = process.execPath;

function run(args = []) {
  try {
    const output = execFileSync(NODE, [SCRIPT, ...args], { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return { stdout: output, stderr: '', code: 0 };
  } catch (err) {
    return { stdout: err.stdout || '', stderr: err.stderr || '', code: err.status };
  }
}

function writeTempFile(content) {
  const tmpPath = path.join(os.tmpdir(), `validate-test-${Date.now()}.md`);
  fs.writeFileSync(tmpPath, content, 'utf-8');
  return tmpPath;
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ ${name}: ${err.message}`);
    failed++;
  }
}

// --- Valid frontmatter ---
test('valid file exits 0 and shows checkmark', () => {
  const file = writeTempFile('---\ntitle: Test\ndate: 2024-04-16T00:00:00Z\ndescription: Test article\n---\nContent\n');
  const result = run([file]);
  fs.unlinkSync(file);
  assert.strictEqual(result.code, 0, `Expected exit 0, got ${result.code}`);
  assert.ok(result.stdout.includes('✅'), 'Expected ✅ in output');
});

// --- Missing frontmatter ---
test('missing frontmatter exits 1 with error message', () => {
  const file = writeTempFile('Just plain content without frontmatter\n');
  const result = run([file]);
  fs.unlinkSync(file);
  assert.strictEqual(result.code, 1, `Expected exit 1, got ${result.code}`);
  assert.ok(result.stderr.includes('❌'), 'Expected ❌ in stderr');
  assert.ok(result.stderr.includes('Missing frontmatter'), 'Expected missing frontmatter message');
});

// --- Missing required field: date ---
test('missing date field exits 1', () => {
  const file = writeTempFile('---\ntitle: Test\ndescription: Desc\n---\nContent\n');
  const result = run([file]);
  fs.unlinkSync(file);
  assert.strictEqual(result.code, 1, `Expected exit 1, got ${result.code}`);
  assert.ok(result.stderr.includes('Missing required field "date"'), 'Expected missing date message');
});

// --- Missing required field: description ---
test('missing description field exits 1', () => {
  const file = writeTempFile('---\ntitle: Test\ndate: 2024-04-16T00:00:00Z\n---\nContent\n');
  const result = run([file]);
  fs.unlinkSync(file);
  assert.strictEqual(result.code, 1, `Expected exit 1, got ${result.code}`);
  assert.ok(result.stderr.includes('Missing required field "description"'), 'Expected missing description message');
});

// --- Missing required field: title ---
test('missing title field exits 1', () => {
  const file = writeTempFile('---\ndate: 2024-04-16T00:00:00Z\ndescription: Desc\n---\nContent\n');
  const result = run([file]);
  fs.unlinkSync(file);
  assert.strictEqual(result.code, 1, `Expected exit 1, got ${result.code}`);
  assert.ok(result.stderr.includes('Missing required field "title"'), 'Expected missing title message');
});

// --- Invalid YAML ---
test('invalid YAML exits 1 with YAML error', () => {
  const file = writeTempFile('---\ntitle: [unclosed bracket\ndate: 2024-04-16\ndescription: Desc\n---\nContent\n');
  const result = run([file]);
  fs.unlinkSync(file);
  assert.strictEqual(result.code, 1, `Expected exit 1, got ${result.code}`);
  assert.ok(result.stderr.includes('Invalid YAML'), 'Expected YAML error message');
});

// --- Real posts integration ---
test('real posts in content/posts/ all pass', () => {
  const result = run();
  assert.strictEqual(result.code, 0, `Expected exit 0, got ${result.code}\nSTDERR: ${result.stderr}`);
  assert.ok(result.stdout.includes('passed'), 'Expected summary in output');
  assert.ok(!result.stderr.includes('❌'), 'Expected no errors in real posts');
});

// --- Summary output ---
test('summary line goes to stdout on success and not to stderr', () => {
  const file = writeTempFile('---\ntitle: Test\ndate: 2024-04-16T00:00:00Z\ndescription: Desc\n---\nContent\n');
  const result = run([file]);
  fs.unlinkSync(file);
  assert.ok(result.stdout.includes('Summary:'), 'Expected Summary in stdout');
  assert.ok(!result.stderr.includes('Summary:'), 'Expected Summary NOT in stderr on success');
});

// --- Non-.md file passed directly ---
test('non-.md file exits 1 with error', () => {
  const tmpPath = path.join(os.tmpdir(), `validate-test-${Date.now()}.txt`);
  fs.writeFileSync(tmpPath, 'not markdown', 'utf-8');
  const result = run([tmpPath]);
  fs.unlinkSync(tmpPath);
  assert.strictEqual(result.code, 1, `Expected exit 1, got ${result.code}`);
  assert.ok(result.stderr.includes('Not a markdown file'), 'Expected error about non-markdown file');
});

console.log(`\nTest results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
