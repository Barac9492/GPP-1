# 🚀 GitHub 배포 가이드

## 📋 단계별 배포 과정

### 1️⃣ GitHub 저장소 생성

1. **GitHub.com 접속**
   - https://github.com 접속 후 로그인

2. **새 저장소 생성**
   - 우측 상단 "+" 버튼 클릭 → "New repository"
   - Repository name: `GPP-1`
   - Description: `Global Price Pulse - AI-driven cross-border price comparison app`
   - Public/Private 선택
   - "Create repository" 클릭

3. **저장소 URL 복사**
   - 생성된 저장소의 URL 복사 (예: `https://github.com/your-username/GPP-1.git`)

### 2️⃣ 로컬 저장소 연결

```bash
# 현재 디렉토리에서 실행
git remote add origin https://github.com/your-username/GPP-1.git
git push -u origin main
```

### 3️⃣ GitHub Secrets 설정

GitHub 저장소에서 Settings > Secrets and variables > Actions로 이동하여 다음 secrets 추가:

#### 🔐 필수 Secrets

| Secret Name | Value |
|-------------|-------|
| `CLAUDE_API_KEY` | `sk-ant-api03-your-claude-api-key` |
| `FIREBASE_ADMIN_SDK_JSON` | `{"type": "service_account", ...}` (전체 JSON) |
| `GMAIL_USER` | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | `abcd efgh ijkl mnop` (16자리) |
| `ADMIN_EMAIL` | `ethancho12@gmail.com` |

### 4️⃣ GitHub Actions 활성화

1. **Actions 탭 클릭**
   - GitHub 저장소에서 "Actions" 탭 클릭

2. **워크플로우 확인**
   - "GPP Agent Daily Run" 워크플로우가 보이는지 확인

3. **첫 실행 테스트**
   - "Run workflow" 버튼 클릭
   - "Run workflow" 클릭하여 수동 실행

### 5️⃣ 모니터링 설정

#### 📧 이메일 알림
- 매일 실행 후 `ethancho12@gmail.com`으로 결과 전송
- 실패 시 즉시 알림

#### 📊 GitHub Actions 대시보드
- Actions 탭에서 실행 상태 확인
- 로그 및 아티팩트 다운로드 가능

#### 🔔 Slack 알림 (선택사항)
- 실패 시 Slack 채널로 알림
- Secret 추가: `SLACK_WEBHOOK_URL`

## 🛠️ 문제 해결

### Git 연결 오류
```bash
# GitHub 인증 설정
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Personal Access Token 사용 (GitHub에서 생성)
git remote set-url origin https://your-token@github.com/your-username/GPP-1.git
```

### GitHub Actions 실행 안됨
```bash
# 1. Actions 탭에서 "Enable Actions" 클릭
# 2. 워크플로우 파일 경로 확인: .github/workflows/gpp-agent.yml
# 3. Secrets 설정 확인
```

### Secrets 설정 오류
```bash
# 1. GitHub 저장소 Settings > Secrets 확인
# 2. 모든 필수 Secrets가 추가되었는지 확인
# 3. Secret 값이 올바른지 확인
```

## ✅ 완료 체크리스트

- [ ] GitHub 저장소 생성
- [ ] 로컬 코드 푸시 완료
- [ ] GitHub Secrets 설정 완료
- [ ] GitHub Actions 활성화
- [ ] 첫 수동 실행 테스트
- [ ] 이메일 수신 확인
- [ ] 자동 실행 스케줄 확인 (매일 새벽 2시)

## 🎯 실행 스케줄

- **자동 실행**: 매일 새벽 2시 (UTC, 한국 시간 오전 11시)
- **수동 실행**: 언제든지 Actions 탭에서 "Run workflow" 클릭

## 📊 예상 결과

매일 실행 시:
1. ✅ Claude AI로 트렌디 상품 10개 발견
2. ✅ 한국/미국 사이트에서 가격 스크래핑
3. ✅ Firestore에 데이터 저장
4. ✅ 이메일로 결과 보고서 전송
5. ✅ 실패 시 AI 진단 및 로그 저장

## 🚀 완전 자동화 완료!

**이제 GitHub Actions가 매일 자동으로 실행됩니다! 🎉**

모든 설정이 완료되면 더 이상 수동 작업이 필요 없습니다. 