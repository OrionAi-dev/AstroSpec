#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const repoRoot = process.cwd();
const packagesDir = path.join(repoRoot, 'packages');
const integrationsDir = path.join(packagesDir, 'integrations');
const token = process.env.NPM_TOKEN?.trim();

function request(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'GET', headers }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode ?? 0,
          body: Buffer.concat(chunks).toString('utf8'),
        });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function readPublicPackageManifests() {
  const rootPackageManifests = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && (entry.name.startsWith('openspec-') || entry.name.startsWith('mcp-secure-context-')))
    .map((entry) => path.join(packagesDir, entry.name, 'package.json'));

  const integrationPackageManifests = fs.existsSync(integrationsDir)
    ? fs
        .readdirSync(integrationsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(integrationsDir, entry.name, 'package.json'))
    : [];

  return [...rootPackageManifests, ...integrationPackageManifests]
    .map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))
    .filter((pkg) => pkg.private !== true)
    .map((pkg) => ({
      name: pkg.name,
      version: pkg.version,
      access: pkg.publishConfig?.access ?? null,
    }));
}

const publicPackages = readPublicPackageManifests();

for (const pkg of publicPackages) {
  if (!pkg.name?.startsWith('@openspec/') && !pkg.name?.startsWith('@mcp-secure-context/')) {
    console.error(`[release] package ${pkg.name ?? '<unknown>'} is outside the allowed public scopes`);
    process.exit(1);
  }
  if (pkg.access !== 'public') {
    console.error(`[release] package ${pkg.name} must declare publishConfig.access=public`);
    process.exit(1);
  }
}

if (!token) {
  console.error('[release] NPM_TOKEN is missing. Configure it before attempting a public release.');
  process.exit(1);
}

const authResponse = await request('https://registry.npmjs.org/-/npm/v1/user', {
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
});

if (authResponse.status !== 200) {
  console.error(`[release] NPM_TOKEN is present but not valid for npm publish auth (status ${authResponse.status}).`);
  process.exit(1);
}

const authUser = JSON.parse(authResponse.body);
console.log(`[release] npm auth ok for ${authUser.name}`);

for (const pkg of publicPackages) {
  const pkgUrl = `https://registry.npmjs.org/${pkg.name.replace('/', '%2F')}`;
  const res = await request(pkgUrl, { Accept: 'application/json' });
  if (res.status === 404) {
    console.log(`[release] ${pkg.name}@${pkg.version} is unpublished and eligible for first release`);
    continue;
  }
  if (res.status !== 200) {
    console.error(`[release] failed to inspect ${pkg.name} publish state (status ${res.status})`);
    process.exit(1);
  }
  const metadata = JSON.parse(res.body);
  if (metadata.versions?.[pkg.version]) {
    console.log(`[release] ${pkg.name}@${pkg.version} already exists on npm`);
  } else {
    console.log(`[release] ${pkg.name} is published, but ${pkg.version} is not`);
  }
}
