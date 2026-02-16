import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const copyUpdatesDirPlugin = (): Plugin => ({
  name: 'copy-updates-dir',
  closeBundle() {
    const sourceDir = resolve(__dirname, 'src/updates');
    const targetDir = resolve(__dirname, 'dist/src/updates');

    if (!existsSync(sourceDir)) {
      return;
    }

    mkdirSync(targetDir, { recursive: true });
    cpSync(sourceDir, targetDir, { recursive: true });
  }
});

export default defineConfig({
  plugins: [copyUpdatesDirPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
});
