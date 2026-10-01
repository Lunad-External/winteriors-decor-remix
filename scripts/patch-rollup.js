import fs from 'fs';
import path from 'path';

const nativeFiles = [
  path.join(process.cwd(), 'node_modules', 'vite', 'node_modules', 'rollup', 'dist', 'native.js'),
  path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js'),
];

for (const nativeFile of nativeFiles) {
  if (fs.existsSync(nativeFile)) {
    let content = fs.readFileSync(nativeFile, 'utf8');
    if (!content.includes('@rollup/wasm-node')) {
      content = content.replace(
        'return require(id);',
        `try { return require(id); } catch (e) { console.log('[Rollup] Native binary blocked, falling back to @rollup/wasm-node'); return require('@rollup/wasm-node'); }`
      );
      fs.writeFileSync(nativeFile, content, 'utf8');
      console.log('Successfully patched:', nativeFile);
    }
  }
}
