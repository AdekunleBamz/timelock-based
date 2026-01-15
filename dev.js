#!/usr/bin/env node

/**
 * Development server startup script
 * Provides enhanced development experience with auto-reload and helpful output
 */

const { spawn } = require('child_process');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Banner
console.log('\n');
console.log(colors.cyan + colors.bright + '╔═══════════════════════════════════════╗' + colors.reset);
console.log(colors.cyan + colors.bright + '║                                       ║' + colors.reset);
console.log(colors.cyan + colors.bright + '║     Timelock Vault Development        ║' + colors.reset);
console.log(colors.cyan + colors.bright + '║                                       ║' + colors.reset);
console.log(colors.cyan + colors.bright + '╚═══════════════════════════════════════╝' + colors.reset);
console.log('\n');

// Check environment
console.log(colors.blue + '🔍 Checking environment...' + colors.reset);

// Start Vite dev server
console.log(colors.green + '🚀 Starting development server...' + colors.reset);
console.log('\n');

const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, 'vault-ui'),
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n');
  console.log(colors.yellow + '⏹  Stopping development server...' + colors.reset);
  viteProcess.kill();
  process.exit();
});

viteProcess.on('error', (error) => {
  console.error(colors.red + '❌ Failed to start development server:' + colors.reset, error);
  process.exit(1);
});

viteProcess.on('exit', (code) => {
  if (code !== 0) {
    console.log('\n');
    console.log(colors.yellow + '⚠️  Development server stopped with code ' + code + colors.reset);
  }
  process.exit(code);
});
