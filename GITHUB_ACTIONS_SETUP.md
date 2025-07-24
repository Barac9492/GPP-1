# 🚀 GitHub Actions 설정 가이드

## 📋 GitHub Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets를 추가하세요:

### 🔐 필수 Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `CLAUDE_API_KEY` | Claude API 키 | `sk-ant-api03-...` |
| `FIREBASE_ADMIN_SDK_JSON` | Firebase Admin SDK JSON 전체 내용 | `{"type": "service_account", ...}` |
| `GMAIL_USER` | Gmail 계정 | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail 앱 비밀번호 | `abcd efgh ijkl mnop` |
| `ADMIN_EMAIL` | 수신 이메일 | `ethancho12@gmail.com` |

### 🔔 선택적 Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SLACK_WEBHOOK_URL` | Slack 웹훅 URL (실패 알림용) | `https://hooks.slack.com/...` |

## 🔧 설정 방법

### 1. Claude API 키 설정
```bash
# 1. https://console.anthropic.com/ 접속
# 2. 계정 생성 후 API 키 생성
# 3. GitHub Secrets에 추가
```

### 2. Firebase Admin SDK 설정
```bash
# 1. Firebase 콘솔에서 서비스 계정 키 다운로드
# 2. JSON 파일 전체 내용을 복사
# 3. GitHub Secrets에 FIREBASE_ADMIN_SDK_JSON으로 추가
```

### 3. Gmail 설정
```bash
# 1. Gmail 2단계 인증 활성화
# 2. 앱 비밀번호 생성: https://myaccount.google.com/apppasswords
# 3. GitHub Secrets에 추가
```

## ⏰ 실행 스케줄

- **자동 실행**: 매일 새벽 2시 (UTC, 한국 시간 오전 11시)
- **수동 실행**: GitHub Actions 탭에서 "Run workflow" 클릭

## 📊 모니터링

### GitHub Actions 탭에서 확인 가능:
- 실행 상태 (성공/실패)
- 실행 로그
- 아티팩트 다운로드 (로그 파일)

### 이메일 알림:
- 매 실행 후 `ethancho12@gmail.com`으로 결과 전송
- 실패 시 Slack 알림 (설정된 경우)

## 🛠️ 문제 해결

### 1. Secrets 설정 확인
```bash
# GitHub 저장소 > Settings > Secrets and variables > Actions
# 모든 필수 secrets가 설정되어 있는지 확인
```

### 2. 로그 확인
```bash
# GitHub Actions 탭 > 최근 실행 > 로그 확인
# 실패 원인 파악 가능
```

### 3. 로컬 테스트
```bash
# GitHub Actions 실행 전 로컬에서 테스트
npx tsx agents/gpp-agent.agent.ts
```

## 🔄 워크플로우 수정

### 실행 시간 변경
```yaml
# .github/workflows/gpp-agent.yml
schedule:
  - cron: '0 2 * * *'  # 매일 새벽 2시
  # - cron: '0 14 * * *'  # 매일 오후 2시 (한국 시간)
```

### 추가 알림 설정
```yaml
# Slack 알림 추가
- name: Notify on success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#gpp-agent'
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 🎯 완료 체크리스트

- [ ] GitHub Secrets 설정 완료
- [ ] Firebase Admin SDK JSON 추가
- [ ] Claude API 키 추가
- [ ] Gmail 설정 완료
- [ ] 첫 GitHub Actions 실행 테스트
- [ ] 이메일 수신 확인
- [ ] 로그 아티팩트 확인

## 🚀 자동화 완료!

이제 GitHub Actions가 매일 자동으로:
1. ✅ Claude AI로 트렌디 상품 발견
2. ✅ 한국/미국 사이트에서 가격 스크래핑
3. ✅ Firestore에 데이터 저장
4. ✅ 이메일로 결과 보고서 전송
5. ✅ 실패 시 Slack 알림 (선택사항)
6. ✅ 로그 파일 아티팩트 저장

**완전 자동화 완료! 🎉** 