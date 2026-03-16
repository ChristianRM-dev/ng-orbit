import { spawn } from 'node:child_process';

const [projectName, port, hostArg] = process.argv.slice(2);

if (!projectName || !port) {
  process.stderr.write('Usage: node scripts/serve-demo.mjs <project-name> <port> [host]\n');
  process.exit(1);
}

const host = hostArg ?? process.env.NG_ORBIT_HOST ?? '127.0.0.1';
const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const child = spawn(command, ['exec', 'ng', 'serve', projectName, '--host', host, '--port', port], {
  stdio: 'inherit',
  env: process.env
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
