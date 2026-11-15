import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const testFiles = [
  'security-headers.test.mjs',
  'rate-limit.test.mjs',
  'turnstile.test.mjs',
  'validation.test.mjs',
  'health.test.mjs',
];

console.log('====================================================');
console.log('  MOON SANCTUM LABS — AUTOMATED SECURITY TEST SUITE ');
console.log('====================================================\n');

async function runTest(file) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, file);
    const proc = spawn(process.execPath, [fullPath], { stdio: 'inherit' });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Test file ${file} exited with code ${code}`));
      }
    });
  });
}

async function runAll() {
  let passed = 0;
  for (const file of testFiles) {
    try {
      await runTest(file);
      passed++;
      console.log('');
    } catch (err) {
      console.error(`\n❌ FAILED: ${file}`);
      console.error(err.message);
      process.exit(1);
    }
  }

  console.log('====================================================');
  console.log(`  ALL ${passed} SECURITY SUITES PASSED CLEANLY (100%) `);
  console.log('====================================================');
}

runAll();
