import { execSync } from 'node:child_process';

const ports = [4200, 4201, 4202];

for (const port of ports) {
  let stdout = '';

  try {
    stdout = execSync(`lsof -tiTCP:${port} -sTCP:LISTEN`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    continue;
  }

  const pids = [...new Set(stdout.split(/\s+/).filter(Boolean))];
  if (pids.length === 0) {
    continue;
  }

  process.stdout.write(
    `Stopping process${pids.length > 1 ? 'es' : ''} on port ${port}: ${pids.join(', ')}\n`
  );

  try {
    execSync(`kill ${pids.join(' ')}`, { stdio: 'ignore' });
  } catch {
    execSync(`kill -9 ${pids.join(' ')}`, { stdio: 'ignore' });
  }
}
