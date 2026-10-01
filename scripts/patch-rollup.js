import fs from 'fs';
import path from 'path';

// Complete AST safety patch for Rollup JS bundler
const rollupFiles = [
  path.join(process.cwd(), 'node_modules', 'vite', 'node_modules', 'rollup', 'dist', 'es', 'shared', 'node-entry.js'),
  path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'es', 'shared', 'node-entry.js'),
];

for (const file of rollupFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    if (!content.includes('if (!nodes) return false;')) {
      content = content.replace(
        'function checkEffectForNodes(nodes, context) {',
        'function checkEffectForNodes(nodes, context) { if (!nodes) return false;'
      );
      modified = true;
    }

    if (content.includes('else if (value.hasEffects(context))')) {
      content = content.replace(
        'else if (value.hasEffects(context))',
        'else if (value?.hasEffects(context))'
      );
      modified = true;
    }

    if (content.includes('for (const decorator of this.decorators) {')) {
      content = content.replace(
        'for (const decorator of this.decorators) {',
        'for (const decorator of (this.decorators || [])) {'
      );
      modified = true;
    }

    if (content.includes('value.include(context, includeChildrenRecursively);')) {
      content = content.replace(
        'value.include(context, includeChildrenRecursively);',
        'value?.include(context, includeChildrenRecursively);'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('[Rollup Patch] Patched AST safety in:', file);
    }
  }
}
