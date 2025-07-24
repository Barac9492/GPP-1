#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 GPP Agent 테스트 시작...\n');

// 1. 필수 파일 확인
console.log('1️⃣ 필수 파일 확인...');
const requiredFiles = [
  'agents/gpp-agent.agent.ts',
  'modules/claude_product_ideator.ts',
  'modules/scraper.ts',
  'modules/firestore_writer.ts',
  'modules/self_healer.ts',
  'modules/notifier.ts',
  '.github/workflows/gpp-agent.yml'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 파일이 없습니다`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n❌ 일부 필수 파일이 없습니다. 먼저 파일을 생성해주세요.');
  process.exit(1);
}

// 2. 의존성 확인
console.log('\n2️⃣ 의존성 확인...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@anthropic-ai/sdk',
    'firebase-admin',
    'puppeteer',
    'nodemailer',
    'ai-functions'
  ];

  for (const dep of requiredDeps) {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - 의존성이 없습니다`);
      allFilesExist = false;
    }
  }
} catch (error) {
  console.log('❌ package.json을 읽을 수 없습니다');
  allFilesExist = false;
}

// 3. 환경 변수 확인
console.log('\n3️⃣ 환경 변수 확인...');
const requiredEnvVars = [
  'CLAUDE_API_KEY',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'ADMIN_EMAIL'
];

for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`⚠️  ${envVar} - 환경 변수가 설정되지 않았습니다`);
  }
}

// 4. Firebase Admin SDK 확인
console.log('\n4️⃣ Firebase Admin SDK 확인...');
const firebaseKeyPath = 'secrets/globalpp-1-firebase-adminsdk-fbsvc.json';
if (fs.existsSync(firebaseKeyPath)) {
  console.log('✅ Firebase Admin SDK 키 파일');
} else {
  console.log('❌ Firebase Admin SDK 키 파일이 없습니다');
  console.log('   secrets/globalpp-1-firebase-adminsdk-fbsvc.json 파일을 생성해주세요');
}

// 5. TypeScript 컴파일 테스트
console.log('\n5️⃣ TypeScript 컴파일 테스트...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript 컴파일 성공');
} catch (error) {
  console.log('❌ TypeScript 컴파일 실패');
  console.log('   타입 오류를 수정해주세요');
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 테스트 완료! 에이전트가 정상적으로 설정되었습니다.');
  console.log('\n다음 단계:');
  console.log('1. GitHub Secrets 설정');
  console.log('2. 첫 실행 테스트: npx tsx agents/gpp-agent.agent.ts');
  console.log('3. GitHub Actions 활성화');
} else {
  console.log('⚠️  일부 문제가 발견되었습니다. 위의 오류를 수정해주세요.');
}
console.log('='.repeat(50)); 