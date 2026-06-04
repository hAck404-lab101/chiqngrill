import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const targets = ['.next'];

for (const target of targets) {
  const fullPath = join(root, target);
  if (existsSync(fullPath)) {
    rmSync(fullPath, { recursive: true, force: true });
    console.log(`Removed ${target}`);
  } else {
    console.log(`${target} not found, skipping`);
  }
}

console.log('Development cache cleaned.');
