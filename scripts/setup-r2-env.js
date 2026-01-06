#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const ENV_VARS = {
  R2_ACCOUNT_ID: '0c66d165ae203f776c095077eaa0dde3',
  R2_ACCESS_KEY_ID: 'c3728e5791e06add8c7fd94db150ff6e',
  R2_SECRET_ACCESS_KEY: '7de10462b94afb8b06189851a0b7e625415220d030cc1522ae6d03ba15ac6dce3',
  R2_BUCKET_NAME: 'm-invitation',
};

const ENVIRONMENTS = ['production', 'preview', 'development'];

async function getVercelAuth() {
  const authPath = path.join(process.env.HOME, '.vercel', 'auth.json');
  const auth = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
  return auth.token;
}

async function getProjectId(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: '/v9/projects?search=m-invitation',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    };

    https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const projects = JSON.parse(data).projects;
        const project = projects.find((p) => p.name === 'm-invitation');
        resolve(project?.id);
      });
    }).on('error', reject).end();
  });
}

async function addEnvVar(token, projectId, name, value, target) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ key: name, value, target });
    const options = {
      hostname: 'api.vercel.com',
      path: `/v10/projects/${projectId}/env`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    https
      .request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, name });
          } else {
            reject(new Error(`Failed to add ${name}: ${res.statusCode}`));
          }
        });
      })
      .on('error', reject)
      .end(data);
  });
}

async function main() {
  try {
    console.log('🔐 Vercel 환경 변수 설정 시작...\n');

    const token = await getVercelAuth();
    const projectId = await getProjectId(token);

    if (!projectId) {
      throw new Error('m-invitation 프로젝트를 찾을 수 없습니다');
    }

    console.log(`✓ 프로젝트 ID: ${projectId}\n`);

    let successCount = 0;
    for (const [name, value] of Object.entries(ENV_VARS)) {
      for (const target of ENVIRONMENTS) {
        try {
          await addEnvVar(token, projectId, name, value, target);
          console.log(`✓ ${name} (${target})`);
          successCount++;
        } catch (error) {
          console.log(`✗ ${name} (${target}) - 이미 존재할 수 있습니다`);
        }
      }
    }

    console.log(`\n✅ 완료! ${successCount}개의 환경 변수가 설정되었습니다.`);
  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

main();
