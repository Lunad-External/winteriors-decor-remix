// Test the exact URL format used in the app + multiple size variants
const fileId = '1VkJpqd967kdTKdi1kgRiELtK0owtwJf_';

const tests = [
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,  // current code
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
  `https://drive.usercontent.google.com/download?id=${fileId}&export=view`,  // direct URL
];

for (const url of tests) {
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' }
    });
    const ct = r.headers.get('content-type') || '?';
    const size = r.headers.get('content-length') || '?';
    console.log(`${r.status} | ${ct.split(';')[0]} | ${size}b | ${url.split('?')[1]}`);
    console.log(`  Final: ${r.url}`);
  } catch (e) {
    console.log(`FAIL | ${url}`);
    console.log(`  Error: ${e.message}`);
  }
}
