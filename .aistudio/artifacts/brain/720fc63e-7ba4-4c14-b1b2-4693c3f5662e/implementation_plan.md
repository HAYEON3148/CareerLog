# CareerLog (커리어로그) 구현 계획서

대학생의 모든 학업, 활동, 아르바이트, 프로젝트, 자격증 경험을 하나의 데이터베이스로 통합 기록하고, AI를 통해 역량 진단부터 맞춤형 추천, 자기소개서 작성, 모의 면접까지 연결하는 올인원 커리어 플랫폼입니다.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> 1단계 사전 질문에서 확인된 사용자의 핵심 설정 방향입니다:
> - **AI 연동 방식**: 실시간 Gemini AI (`gemini-3.8-flash`) 서버 프록시와 지능형 스마트 Mock 폴백을 결합하여, API 키 유무와 네트워크 상태에 관계없이 항상 즉각적이고 완성도 높은 분석 및 초안 생성 제공.
> - **초기 데이터 구성**: 접속 즉시 5개 메뉴 간의 유기적 데이터 연결을 체감할 수 있도록, 컴퓨터공학/경영 융합 전공 대학생의 성적표, 학과 캡스톤, 해커톤, 스타트업 인턴, 카페 아르바이트, SQLD/TOEIC 자격증, 증빙 자료 보관함 파일들이 사전 탑재된 풍부한 샘플 프로필 제공.
> - **내비게이션 구조**: 상단 고정 현대적 SaaS 내비게이션 바(5대 메뉴: 나의 커리어, AI 커리어 분석, 맞춤형 추천, AI 자기소개서, 취업 준비)와 풀와이드 반응형 대시보드 레이아웃.

---

### 1. Overview & Core Concept

- **서비스명**: CareerLog (커리어로그)
- **슬로건**: 모든 경험을 기록하고, 나만의 경쟁력으로.
- **핵심 가치**: "기록 → 보관 → 분석 → 추천 → 취업 활용"의 단일 파이프라인.
- **동일 데이터베이스 공유 원칙**: "나의 커리어"에서 추가/수정/삭제된 모든 경험과 증빙 자료는 즉시 대시보드 통계, 역량 분석, 추천 알고리즘, 자기소개서 경험 자동 매칭, 모의 면접 질문 생성에 실시간 반영됩니다.

---

### 2. User Experience & Visual Design

#### A. 디자인 철학 및 UI 시스템 (Toss / Notion / Linear 감성)
- **메인 컬러**: 신뢰감 있는 코발트 블루 (`#2563EB`, Blue-600), 인디고/슬레이트 보조톤.
- **배경 및 카드 표면**: 깨끗한 캔버스 화이트 (`#FFFFFF`) 및 연한 미색 배경 (`#F8FAFC`), 단일 레벨 표면 대비 (`border border-slate-200/80`).
- **타이포그래피**: 국문 본문 가독성을 극대화한 가독성 높은 시스템 폰트와 수치 전용 고정폭 숫자(`font-mono tabular-nums`). 불필요한 장식과 과도한 배지/필 캡슐을 배제하고 단정한 인라인 메타데이터(`·` 구분자) 유지.
- **Top Bar Contract**:
  - 좌측: `CareerLog` 단일 워드마크 및 슬로건 태그라인 없는 정갈한 로고
  - 중앙: 5대 핵심 메뉴 단일 행 텍스트 링크 (`나의 커리어`, `AI 커리어 분석`, `맞춤형 추천`, `AI 자기소개서`, `취업 준비`)
  - 우측: 목표 직무 인디케이터 + 새 경험 빠른 등록 버튼 (`+ 경험 추가`)

#### B. 5대 핵심 메뉴 및 서브 기능 맵

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CareerLog Top Navigation                        │
│  [CareerLog]     나의 커리어  · AI 커리어 분석 · 맞춤형 추천 · AI 자소서 · 취업 준비    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼──────────────────────────────┐
    ▼                               ▼                              ▼
[1. 나의 커리어]             [2. AI 커리어 분석]             [3. 맞춤형 추천]
 ├─ 대시보드 홈 (KPI/최근내역)    ├─ 목표 직무 및 공고 등록      ├─ 맞춤형 기회 추천
 ├─ 학업 & 성적 (OCR 시뮬레이션)   ├─ 직무 적합도 진단 (매칭률)    │   (공모전/인턴/부트캠프/자격증)
 ├─ 교내 활동 (연구/캡스톤/동아리) ├─ 역량 공백 진단 (충분/보완)  ├─ 추천 이유 & 보완 역량 명시
 ├─ 교외 활동 (공모전/서포터즈)   ├─ 경험 재발견 AI (소재 발굴)   └─ 커리어 시뮬레이터 (가상 경험 추가)
 ├─ 아르바이트 (업무성과/역량)    ├─ 경험 가치 변환 (STAR 구조화)
 ├─ 자격증 & 어학               └─ 경험 연결 성장 그래프
 └─ 증빙 자료 보관함 (다운로드/미리보기)
                                    │
    ┌───────────────────────────────┴──────────────────────────────┐
    ▼                                                              ▼
[4. AI 자기소개서]                                            [5. 취업 준비]
 ├─ 채용 공고 분석 (역량/우대사항 추출)                           ├─ 합격 사례 아카이브 (기업/직무별)
 ├─ 문항별 최적 경험 자동 매칭                                   ├─ 합격자 수익 배분 및 인증 시스템
 ├─ STAR 기반 AI 초안 생성 & 글자수 조절                         ├─ AI 모의 면접 (실시간 피드백/꼬리질문)
 └─ 기업/직무별 자소서 버전 관리                                  └─ 취업 일정 캘린더 (D-Day 알림)
```

---

### 3. Key Product Decisions & Trade-Offs

1. **상태 관리 및 데이터 영속성 (Reactive Client-State Store)**:
   - *선택*: 브라우저 `localStorage`와 React 상태를 연동한 단일 `CareerStore` 구현.
   - *이유*: 페이지를 새로고침하거나 브라우저를 다시 열어도 등록한 성적, 활동, 아르바이트, 증빙자료, 자소서, 일정이 영구 유지되며, 즉시 초기화(Reset to Demo) 버튼으로 언제든 초기 상태를 복구할 수 있음.

2. **성적표 OCR 처리 전략**:
   - *선택*: Gemini 비전 멀티모달 분석 엔드포인트 지원 + 클라이언트 드래그앤드롭 스마트 파서.
   - *이유*: 실제 대학 성적표 이미지나 샘플 성적표를 업로드하면 과목명, 학점(3학점 등), 등급(A+, A0 등), 전공/교양 구분을 자동 구조화하여 표에 띄워주고, 사용자가 직접 확인 및 수정한 뒤 저장할 수 있도록 구현.

3. **증빙 자료 보관함 (Evidence Vault)**:
   - *선택*: 인메모리 Blob URL 및 로컬 스토리지 메타데이터 기반 클라우드 드라이브 인터페이스.
   - *이유*: 사용자가 성적표, 수료증, 상장, 포트폴리오를 업로드하면 미리보기(Preview), 활동 연결(Link to Experience), 단일 다운로드 및 ZIP 일괄 다운로드 에뮬레이션을 안전하게 지원.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Frontend Viewport                             │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Navigation Header: Brand · 5 Tab Triggers · Quick Action         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                       │
│  ┌─────────────────────────────┴─────────────────────────────────────┐  │
│  │ Active View Router (Controlled Tab State)                         │  │
│  │ ├─ Dashboard / My Career View (Grades, Activities, Vault)         │  │
│  │ ├─ AI Analysis View (Radar/Gap Diagnosis, Graph, STAR Transform)  │  │
│  │ ├─ Recommendations View (Opportunity Finder & Simulator)          │  │
│  │ ├─ Cover Letter Studio View (Job Posting, Matcher, Editor)        │  │
│  │ └─ Job Prep View (Pass Archive, Revenue Share, Interview, Cal)    │  │
│  └─────────────────────────────┬─────────────────────────────────────┘  │
│                                │                                       │
│  ┌─────────────────────────────┴─────────────────────────────────────┐  │
│  │ Career Data Store (React Context / Custom Hook with LocalStorage) │  │
│  │  - User Profile & Target Roles                                    │  │
│  │  - Academic Records & Semesters (GPA Calculator)                  │  │
│  │  - Experiences List (Campus, External, Part-time, Project, Cert)  │  │
│  │  - Evidence Vault Documents & Attachments                         │  │
│  │  - Cover Letters & Job Postings                                   │  │
│  │  - Application Calendar Events                                    │  │
│  └─────────────────────────────┬─────────────────────────────────────┘  │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │ HTTP / JSON
┌────────────────────────────────┴───────────────────────────────────────┐
│                        Full-Stack Server Proxy                         │
│  server.ts (Express, port 3000)                                        │
│  ├─ POST /api/ai/analyze-competency     (Gemini 3.8 Flash / Mock fallback) │
│  ├─ POST /api/ai/transform-experience   (STAR formatting & interview cues)│
│  ├─ POST /api/ai/generate-coverletter   (Posting match & drafting)     │
│  ├─ POST /api/ai/mock-interview-eval    (Answer critique & follow-up)  │
│  └─ POST /api/ai/ocr-transcript         (Multimodal transcript parser) │
└────────────────────────────────────────────────────────────────────────┘
```

#### Verification & Quality Gates
- **기능 검증**: 성적 추가 시 전체/전공 GPA 실시간 재계산, 경험 등록 시 증빙자료 연결, AI 분석 탭 진입 시 역량 공백 즉각 도출, 자소서 문항별 경험 매칭 확인, 캘린더 D-Day 계산 확인.
- **빌드 검증**: `compile_applet`을 통한 TypeScript 타입 체킹 및 Vite 프로덕션 빌드 성공 확인.
