#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const refDir = process.env.SECUREPAY_WEB_REF_DIR || path.join(root, 'reference/securepaymain');
const reportPath = path.join(root, 'docs/WEB_MOBILE_ALIGNMENT_REPORT.md');
const journeyMapPath = path.join(root, 'src/doctrine/mobileJourneyMap.ts');

const mobileThemePath = path.join(root, 'src/theme/colors.ts');
const mobileDoctrinePath = path.join(root, 'src/doctrine/securepayDoctrine.ts');

const expectedTerms = [
  'SecurePay by Keyman',
  'Money should follow the agreement',
  'Trade freely',
  'SecureLink',
  'Group SecureLink',
  'Provider-confirmed',
  'Payment Ready readiness',
  'Review hold',
  'Settlement readiness',
  'KES 10',
  'KES 20',
];

const forbiddenTerms = [
  'withdraw now',
  'cash out',
  'instant payout',
  'payment completed',
  'guaranteed payout',
  'escrow balance',
];

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'dist', 'build', '.next'].includes(entry)) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|jsx|js|md|css|json)$/.test(entry)) files.push(full);
  }
  return files;
}

function extractHexColors(text) {
  return [...text.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)].map((m) => m[0].toUpperCase());
}

function extractJourneySteps(source) {
  const journeys = [...source.matchAll(/title:\s*'([^']+)'[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,?\s*\}/g)];
  return journeys.flatMap((match) => {
    const title = match[1];
    const block = match[2];
    const labels = [...block.matchAll(/label:\s*'([^']+)'/g)].map((m) => m[1]);
    return labels.map((label) => ({ journey: title, step: label }));
  });
}

if (!fs.existsSync(refDir)) {
  console.error(`Web reference not found at ${refDir}. Run: npm run sync:web-reference`);
  process.exit(1);
}

const webFiles = walk(refDir);
const webCorpus = webFiles.map((f) => readIfExists(f)).join('\n');
const mobileTheme = readIfExists(mobileThemePath);
const mobileDoctrine = readIfExists(mobileDoctrinePath);

const webThemeFiles = webFiles.filter((f) =>
  /tailwind\.config|theme|colors|tokens|globals\.css/i.test(f),
);
const webDocFiles = webFiles.filter((f) =>
  /README|PAGE_DIRECTORY|docs\//i.test(relative(f)),
);

const mobileColors = extractHexColors(mobileTheme);
const webColors = extractHexColors(webCorpus);
const sharedColors = mobileColors.filter((c) => webColors.includes(c));

const termResults = expectedTerms.map((term) => ({
  term,
  web: webCorpus.toLowerCase().includes(term.toLowerCase()),
  mobile: `${mobileDoctrine}\n${readIfExists(path.join(root, 'app/welcome.tsx'))}`
    .toLowerCase()
    .includes(term.toLowerCase()),
}));

const forbiddenHits = forbiddenTerms
  .map((term) => ({
    term,
    web: webCorpus.toLowerCase().includes(term.toLowerCase()),
    mobilePublicUi: walk(path.join(root, 'app'))
      .map((f) => readIfExists(f))
      .join('\n')
      .toLowerCase()
      .includes(term.toLowerCase()),
  }))
  .filter((item) => item.web || item.mobilePublicUi);

const journeyRows = extractJourneySteps(readIfExists(journeyMapPath)).map((row) => ({
  ...row,
  webMention: webCorpus.toLowerCase().includes(row.step.toLowerCase()),
}));

function relative(p) {
  return path.relative(root, p);
}

const gaps = termResults.filter((item) => item.mobile && !item.web);
const webOnly = termResults.filter((item) => item.web && !item.mobile);

const lines = [
  '# Web ↔ Mobile Alignment Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  `Web reference: \`${relative(refDir)}\``,
  '',
  '## Source files inspected',
  '',
  '### Web theme/doc candidates',
  ...webThemeFiles.slice(0, 20).map((f) => `- \`${relative(f)}\``),
  ...(webThemeFiles.length > 20 ? [`- ...and ${webThemeFiles.length - 20} more`] : []),
  '',
  '### Web docs',
  ...webDocFiles.slice(0, 20).map((f) => `- \`${relative(f)}\``),
  ...(webDocFiles.length === 0 ? ['- (none found)'] : []),
  '',
  '## Color overlap',
  '',
  `Mobile theme colors: ${mobileColors.length}`,
  `Web hex colors found: ${webColors.length}`,
  `Shared hex colors: ${sharedColors.length}`,
  '',
  sharedColors.length
    ? sharedColors.map((c) => `- ${c}`).join('\n')
    : '- No exact hex overlap detected yet',
  '',
  '## Doctrine / copy terms',
  '',
  '| Term | Web | Mobile |',
  '| --- | --- | --- |',
  ...termResults.map((item) => `| ${item.term} | ${item.web ? '✅' : '—'} | ${item.mobile ? '✅' : '—'} |`),
  '',
  '## Journey step mentions on web',
  '',
  '| Journey | Step | Web mention |',
  '| --- | --- | --- |',
  ...journeyRows.map((row) => `| ${row.journey} | ${row.step} | ${row.webMention ? '✅' : '—'} |`),
  '',
  '## Gaps to close',
  '',
  gaps.length
    ? gaps.map((g) => `- Mobile has **${g.term}** but web corpus did not match`).join('\n')
    : '- No mobile-only doctrine terms detected in this pass',
  '',
  webOnly.length
    ? webOnly.map((g) => `- Web has **${g.term}** but mobile should verify parity`).join('\n')
    : '- No web-only terms flagged',
  '',
  '## Forbidden phrase scan',
  '',
  forbiddenHits.length
    ? forbiddenHits
        .map(
          (hit) =>
            `- **${hit.term}** — web: ${hit.web ? 'found' : 'ok'}, mobile UI: ${hit.mobilePublicUi ? 'found' : 'ok'}`,
        )
        .join('\n')
    : '- No forbidden phrases detected in web corpus or mobile app screens',
  '',
  '## Recommended next edits',
  '',
  '1. Align unmatched colors in `src/theme/colors.ts` to web tokens',
  '2. Rename any web-only journey labels in `src/doctrine/mobileJourneyMap.ts`',
  '3. Update mobile screens where web mentions exist but mobile does not',
  '4. Re-run `npm run diff:web-mobile` after changes',
  '',
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
console.log(`Wrote ${relative(reportPath)}`);
