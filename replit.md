# AI 학생학습 스타일 예측기

## 프로젝트 개요
사주와 MBTI를 기반으로 학생의 학습 스타일과 성과를 AI가 분석해주는 웹 애플리케이션입니다.

## 기술 스택
- **프론트엔드**: React, TypeScript, Tailwind CSS, Shadcn UI
- **백엔드**: Express.js, Node.js
- **AI**: OpenAI GPT-5-Nano (Responses API)

## 프로젝트 구조
```
├── client/                 # 프론트엔드 (React)
│   ├── src/
│   │   ├── pages/         # 페이지 컴포넌트
│   │   │   └── home.tsx   # 메인 페이지 (입력 폼 + 결과 표시)
│   │   ├── components/    # UI 컴포넌트
│   │   └── lib/           # 유틸리티
│   └── index.html
├── server/                 # 백엔드 (Express)
│   └── routes.ts          # API 엔드포인트 (/api/predict)
└── shared/                 # 공유 스키마
    └── schema.ts          # 데이터 타입 정의
```

## 환경변수 설정

### Replit에서 환경변수 설정하기
Replit 플랫폼에서는 Firebase 대신 Replit의 내장 Secrets 시스템을 사용합니다:

1. Replit 에디터에서 왼쪽 사이드바의 "Secrets" 탭 클릭
2. "New Secret" 버튼 클릭
3. Key: `OPENAI_API_KEY`
4. Value: 본인의 OpenAI API 키 입력
5. "Add Secret" 클릭

이렇게 설정된 환경변수는 백엔드에서 `process.env.OPENAI_API_KEY`로 안전하게 접근됩니다.

### Firebase 환경변수 (참고용)
만약 Firebase Functions를 사용하는 경우:

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 프로젝트 설정
firebase login
firebase init functions

# 환경변수 설정
firebase functions:config:set openai.api_key="YOUR_API_KEY"

# 환경변수 확인
firebase functions:config:get
```

## API 엔드포인트

### POST /api/predict
학생 정보를 받아 AI 학습 스타일 분석 결과를 반환합니다.

**요청 본문:**
```json
{
  "name": "학생 이름",
  "birthYear": "2010",
  "birthMonth": "05",
  "birthDay": "15",
  "birthHour": "09",
  "birthPeriod": "AM",
  "mbti": "INTJ"
}
```

**응답:**
```json
{
  "studentName": "학생 이름",
  "learningStyle": {
    "type": "분석적 학습자",
    "description": "...",
    "strengths": ["...", "...", "..."],
    "weaknesses": ["...", "...", "..."]
  },
  "studyRecommendations": {
    "environment": "...",
    "methods": ["...", "...", "...", "..."],
    "schedule": "..."
  },
  "performancePrediction": {
    "overallScore": 85,
    "subjects": [...]
  },
  "personalizedTips": ["...", "...", "...", "...", "..."],
  "timestamp": "2024-01-16T12:00:00.000Z"
}
```

## 개발 실행
```bash
npm run dev
```

## 최근 변경사항
- 2024-01-16: 사주 기반 분석 강화
  - 과목 적성 분석에 사주 근거 표시 추가
  - 학습 추천에 사주 근거 표시 추가 (환경, 방법, 일정)
  - AI 프롬프트에서 사주 오행 기반 분석 강조
  - 양력/음력 선택 기능 추가
- 2024-01-16: 과목 적성 및 계열 추천 기능 업데이트
  - 과목별 적성 점수 (각 과목 0~150점, 합계 300점)
  - 문과/이과 계열 추천 기능 추가
- 2024-01-16: 상세 분석 기능 업데이트
  - 사주 분석 섹션 추가 (사주팔자, 오행 분석, 학습 영향)
  - MBTI 분석 섹션 추가 (유형 특성, 인지 기능, 학습 특성)
  - 과목 적성을 퍼센티지 기반으로 변경
  - AI 출력량 증가 (max_tokens: 4000)
  - 6개 섹션 사이드바 네비게이션
- 2024-01-16: 초기 버전 구현
  - 학생 정보 입력 폼 (이름, 사주, MBTI)
  - 오전/오후 선택 기능
  - OpenAI gpt-4o-mini 연동
  - 결과 표시 UI (사이드바 네비게이션)
