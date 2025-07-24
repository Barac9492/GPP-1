# 🚀 GPP Agent Setup Guide

## 📁 최종 디렉토리 구조

```
GPP-1/
├── agents/
│   └── gpp-agent.agent.ts              # 메인 에이전트 실행 스크립트
├── modules/
│   ├── claude_product_ideator.ts      # Claude로 트렌디 상품 리스트 생성
│   ├── scraper.ts                     # Puppeteer 기반 크롤러 (Amazon/Coupang)
│   ├── firestore_writer.ts            # Firestore 저장 모듈
│   ├── self_healer.ts                 # 에러 감지 + GPT 분석
│   └── notifier.ts                    # Email 보고서 전송
├── secrets/
│   └── globalpp-1-firebase-adminsdk-fbsvc.json  # Firebase Admin SDK 키
├── logs/                              # 에러 로그 및 AI 진단 결과
└── package.json                       # 모든 의존성 포함
```

## 📦 설치 명령어

```bash
# 1. 의존성 설치
npm install

# 2. Firebase Admin SDK 키 파일 준비
# secrets/globalpp-1-firebase-adminsdk-fbsvc.json 파일을 생성하고 Firebase 콘솔에서 다운로드한 키를 넣어주세요

# 3. 환경 변수 설정 (.env 파일 생성)
```

## 🔐 환경 변수 설정 (.env)

```env
# Claude API 설정
CLAUDE_API_KEY=your_claude_api_key_here

# Gmail 설정 (이메일 알림용)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password

# 수신 이메일
ADMIN_EMAIL=ethancho12@gmail.com
```

## 🚀 실행 방법

### Cursor에서 직접 실행:
```bash
npx tsx agents/gpp-agent.agent.ts
```

### 또는 Cursor 에이전트 인터페이스에서:
- `agents/gpp-agent.agent.ts` 파일을 열고
- Cursor의 "Run" 버튼 클릭

## 📧 Gmail 설정 방법

1. **2단계 인증 활성화**
   - Gmail 계정에서 2단계 인증을 활성화하세요

2. **앱 비밀번호 생성**
   - https://myaccount.google.com/apppasswords 접속
   - "메일" 선택 후 "기타(사용자 정의 이름)"
   - "GPP Agent" 입력
   - 생성된 16자리 비밀번호 복사

3. **환경 변수에 추가**
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-digit-app-password
   ```

## 🔥 Firebase Admin SDK 설정

1. **Firebase 콘솔에서 키 다운로드**
   - https://console.firebase.google.com/project/globalpp-1/settings/serviceaccounts/adminsdk
   - "새 비공개 키 생성" 클릭
   - 다운로드된 JSON 파일을 `secrets/globalpp-1-firebase-adminsdk-fbsvc.json`로 저장

2. **파일 구조 확인**
   ```
   secrets/
   └── globalpp-1-firebase-adminsdk-fbsvc.json
   ```

## 🤖 Claude API 키 설정

1. **Anthropic 콘솔에서 키 생성**
   - https://console.anthropic.com/ 접속
   - 계정 생성 후 API 키 생성
   - 생성된 키를 환경 변수에 추가

## 📊 실행 결과

### 이메일 보고서
- 매 실행 후 `ethancho12@gmail.com`으로 결과 전송
- 형식: `[GPP-Agent] Daily Report - 2024-01-15`
- 내용: 성공/실패 건수 및 상세 내역

### 로그 파일
- `logs/error_log.json`: 모든 에러 로그
- `logs/last_error_diagnosis.txt`: AI 진단 결과

## 🔄 자동화 옵션

### 1. GitHub Actions (추천)
```bash
# GitHub Actions 워크플로우 생성 요청
"GitHub Actions도 생성해줘"
```

### 2. Make.com 연동
- Make.com에서 스케줄러 설정
- 매일 새벽 2시 자동 실행

### 3. 로컬 Cron Job
```bash
# crontab -e
0 2 * * * cd /path/to/GPP-1 && npx tsx agents/gpp-agent.agent.ts
```

## 🛠️ 문제 해결

### 의존성 오류
```bash
npm install
npm install @anthropic-ai/sdk firebase-admin puppeteer nodemailer ai-functions
```

### TypeScript 오류
```bash
npm install @types/nodemailer
```

### Firebase 권한 오류
- Firestore 보안 규칙 확인
- Admin SDK 키 파일 경로 확인

### Gmail 인증 오류
- 2단계 인증 활성화 확인
- 앱 비밀번호 재생성

## 🎯 완료 체크리스트

- [ ] 모든 의존성 설치 완료
- [ ] Firebase Admin SDK 키 파일 준비
- [ ] Gmail 앱 비밀번호 설정
- [ ] Claude API 키 설정
- [ ] 환경 변수 (.env) 설정
- [ ] 첫 실행 테스트 완료
- [ ] 이메일 수신 확인

## 🚀 Ready to Deploy!

모든 설정이 완료되면 에이전트가 자동으로:
1. Claude AI로 트렌디 상품 발견
2. 한국/미국 사이트에서 가격 스크래핑
3. Firestore에 데이터 저장
4. 이메일로 결과 보고서 전송
5. 에러 발생 시 AI 진단 및 로그 저장

**이제 정말 자동화는 네 손을 떠났어! 🎉** 