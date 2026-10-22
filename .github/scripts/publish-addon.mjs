import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseVersion, compareVersions } from './version.mjs';

export function validateVersion(version) {
  parseVersion(version);
  return version;
}
function inspectImage(image) {
  execFileSync('docker', ['manifest', 'inspect', image], { stdio: 'inherit' });
}
export function publish(version, { source = process.env.SOURCE_SHA || null, verifyImage = inspectImage } = {}) {
  validateVersion(version);
  if (source !== null && !/^[a-f0-9]{40}$/.test(source)) throw new Error('Ogiltig källrevision.');
  let current;
  if (existsSync('familjehub/config.yaml')) {
    current = readFileSync('familjehub/config.yaml', 'utf8').match(/^version:\s*["']?([^"'\s]+)/m)?.[1];
    if (!current) throw new Error('Kan inte läsa publicerad version.');
    if (compareVersions(version, current) < 0) throw new Error('En äldre version får inte ersätta den publicerade versionen.');
  }
  const previous = existsSync('familjehub/release.json') ? JSON.parse(readFileSync('familjehub/release.json', 'utf8')) : null;
  if (current === version && previous?.version === version && previous.source) {
    if (source && source !== previous.source) throw new Error('Samma versionsnummer får inte publiceras med annan kod.');
    source ??= previous.source;
  }
  const template = readFileSync('templates/familjehub.yaml', 'utf8');
  if (!template.includes('__VERSION__')) throw new Error('Versionsmarkören saknas i mallen.');
  // Never log in to GHCR: Home Assistant must be able to pull anonymously too.
  for (const image of ['familjehub', 'familjehub-amd64', 'familjehub-aarch64']) {
    verifyImage('ghcr.io/mc-attack/' + image + ':' + version);
  }
  mkdirSync('familjehub', { recursive: true });
  writeFileSync('familjehub/config.yaml', template.replaceAll('__VERSION__', version));
  writeFileSync('familjehub/DOCS.md', '# Familjehub\n\nÖppna webbgränssnittet och följ inställningsguiden.\n\nSchoolSoft: välj Skola → Annan skolplattform (kalenderlänk), med en länk per barn.\n');
  writeFileSync('familjehub/release.json', JSON.stringify({ version, source }, null, 2) + '\n');
  console.log('Installationspost för Familjehub ' + version + ' förberedd.');
}
if (process.env.PUBLISH_ADDON === '1') publish(process.env.ADDON_VERSION ?? '');
