import { writeFile } from 'node:fs/promises';

const sha = process.env.GITHUB_SHA || process.env.CF_PAGES_COMMIT_SHA || 'LOCAL_BUILD';
const shortSha = sha.slice(0, 7);
const info = {
  git_sha: sha,
  short_sha: shortSha,
  build_time: new Date().toISOString(),
  environment: process.env.ENVIRONMENT || 'production',
  schema_version: process.env.SCHEMA_VERSION || '2026.8.20',
  api_version: process.env.API_VERSION || 'v1',
  status: 'BUILD_ARTIFACT',
};
await writeFile('build-info.json', `${JSON.stringify(info, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(info));
