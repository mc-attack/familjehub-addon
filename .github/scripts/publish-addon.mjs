import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export function validateVersion(version) {
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?$/.test(version)) {
    throw new Error('Ange ett versionsnummer, exempelvis 0.9.2.');
  }
  return version;
}

export function publish(version) {
  validateVersion(version);
  // This job never logs in to GHCR: Home Assistant must be able to pull anonymously too.
  for (const image of ['familjehub', 'familjehub-amd64', 'familjehub-aarch64']) {
    execFileSync('docker', ['manifest', 'inspect', `ghcr.io/mc-attack/${image}:${version}`], { stdio: 'inherit' });
  }
  const template = readFileSync('templates/familjehub.yaml', 'utf8');
  if (!template.includes('__VERSION__')) throw new Error('Versionsmarkören saknas i mallen.');
  mkdirSync('familjehub', { recursive: true });
  writeFileSync('familjehub/config.yaml', template.replaceAll('__VERSION__', version));
  writeFileSync('familjehub/DOCS.md', '# Familjehub\n\nÖppna webbgränssnittet och följ inställningsguiden.\n\nSchoolSoft: välj Skola → Annan skolplattform (kalenderlänk), med en länk per barn.\n');
  console.log(`Installationspost för Familjehub ${version} förberedd.`);
}

if (process.env.PUBLISH_ADDON === '1') publish(process.env.ADDON_VERSION ?? '');
