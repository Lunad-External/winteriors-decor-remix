import fs from 'fs';
import path from 'path';

const fileToPatch = path.join(process.cwd(), 'node_modules', 'nf3', 'dist', '_chunks', 'trace.mjs');

if (fs.existsSync(fileToPatch)) {
  let content = fs.readFileSync(fileToPatch, 'utf8');
  const target = 'import { nodeFileTrace } from "@vercel/nft";';
  const replacement = 'import _vercelNft from "@vercel/nft";\nconst nodeFileTrace = _vercelNft.nodeFileTrace || _vercelNft.default?.nodeFileTrace;';

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(fileToPatch, content, 'utf8');
    console.log('Successfully patched nf3/dist/_chunks/trace.mjs');
  } else {
    console.log('nf3/dist/_chunks/trace.mjs already patched or target not found');
  }
} else {
  console.log('nf3/dist/_chunks/trace.mjs not found');
}
