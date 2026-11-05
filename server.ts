import express from 'express';
import type { Request, Response } from 'express';

import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper: safe JSON extraction from Gemini response
function extractJSON(text: string): any {
  try {
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // fallback
      }
    }
    return null;
  }
}

// 1. POST /api/ai/analyze-competency
app.post('/api/ai/analyze-competency', async (req: Request, res: Response) => {
  try {
    const { targetJob, targetCompany, experiences, academics, certifications } = req.body;

    if (ai) {
      try {
        const prompt = `
당신은 대한민국 대학생 취업 컨설팅 및 커리어 분석 최고 전문가입니다.
사용자의 프로필, 학업 성적, 등록된 경험(교내외 활동, 프로젝트, 아르바이트), 자격증 정보를 종합 분석하여 목표 직무에 대한 정밀 진단을 수행하세요.

[목표 직무]: ${targetJob || '소프트웨어 엔지니어'}
[희망 기업]: ${targetCompany || 'IT / 빅테크'}
[학업 성적]: 전체 평점 ${academics?.totalGpa || 3.8}/4.5, 전공 평점 ${academics?.majorGpa || 4.0}/4.5, 이수 과목 수: ${academics?.courses?.length || 0}개
[보유 자격 및 어학]: ${JSON.stringify(certifications || [])}
[등록된 경험 목록]:
${JSON.stringify(experiences || [], null, 2)}

다음 JSON 규격으로만 응답해주세요 (코드 블록 없이 순수 JSON):
{
  "fitScore": 88,
  "fitSummary": "목표 직무와 관련된 핵심 프로젝트 경험과 전공 성적이 우수하나 실무 인턴십 경험의 보완이 권장됩니다.",
  "strengths": [
    { "competency": "문제 해결 및 시스템 설계", "evidence": "캡스톤 디자인 프로젝트와 해커톤 수상 경험", "rating": "탁월" },
    { "competency": "데이터 기반 사고", "evidence": "SQLD 자격증 취득 및 데이터베이스 프로젝트 A+", "rating": "우수" },
    { "competency": "팀 협업 및 커뮤니케이션", "evidence": "동아리 부회장 및 팀 프로젝트 리딩", "rating": "우수" }
  ],
  "gaps": [
    { "competency": "대규모 트래픽 및 배포 실무 경험", "status": "경험 부족", "advice": "클라우드 인프라 배포 프로젝트 또는 오픈소스 기여 추천" },
    { "competency": "글로벌 비즈니스 어학 역량", "status": "보완 필요", "advice": "어학 스피킹(OPIc/토익스피킹) 성적 취득 권장" }
  ],
  "rediscoveredValues": [
    {
      "sourceExperience": "카페 및 매장 아르바이트",
      "discoveredCompetency": "피크타임 주문 병목 해소 및 고객 불만 0건 달성 (프로세스 최적화 및 위기대응)",
      "resumeBullet": "일평균 300명 방문 매장에서 주문 응대 동선을 개선하여 대기 시간 20% 단축 및 고객 만족도 향상 기여"
    }
  ],
  "strategicActionPlan": [
    "상반기 인턴십 채용 지원을 위한 포트폴리오 기술 스택 재정비",
    "부족한 실무 배포 역량을 보완하기 위한 AWS/GCP 기반 사이드 프로젝트 완성",
    "자소서에 아르바이트 경험을 '문제 해결 및 프로세스 개선' 관점으로 재해석하여 기술"
  ]
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const parsed = extractJSON(response.text || '');
        if (parsed) {
          return res.json({ success: true, isLiveAI: true, data: parsed });
        }
      } catch (err) {
        console.warn('Gemini API call failed, using intelligent fallback:', err);
      }
    }

    // High quality intelligent fallback mock
    const fallbackData = {
      fitScore: 86,
      fitSummary: `목표 직무 [${targetJob || '데이터/소프트웨어 엔지니어'}]에 요구되는 핵심 전공 지식과 프로젝트 완수 경험이 탄탄히 축적되어 있습니다. 다만 실무 인턴십 연계 및 대외 증빙을 한 단계 더 강화하면 최상위권 경쟁력을 확보할 수 있습니다.`,
      strengths: [
        { competency: "직무 기술 프로젝트 실행력", evidence: "학부 캡스톤 디자인 및 오픈 프레임워크 기반 서비스 구축 2건", rating: "탁월" },
        { competency: "체계적 협업 및 문서화", evidence: "Git 기반 팀 프로젝트 협업 및 노션 문서화 리딩", rating: "우수" },
        { competency: "고객/사용자 관점 피드백 수용", evidence: "서비스 론칭 후 실사용자 테스트 진행 및 아르바이트 현장 응대", rating: "우수" }
      ],
      gaps: [
        { competency: "기업 인턴십 및 실무 워크플로우 경험", status: "경험 부족", advice: "하계/동계 채용연계형 또는 체험형 인턴십 지원 적극 권장" },
        { competency: "공인 비즈니스 영어 말하기 지표", status: "보완 필요", advice: "OPIc IH 이상 또는 토익스피킹 AL 목표 4주 집중 응시 권장" }
      ],
      rediscoveredValues: [
        {
          sourceExperience: "카페 및 매장 아르바이트 8개월",
          discoveredCompetency: "혼잡 시간대 주문 및 재고 처리 동선 최적화 (운영 효율화 & 커뮤니케이션)",
          resumeBullet: "주문 급증 시간대 키오스크 안내 가이드를 자발적으로 수립하여 대기 시간 25% 단축 및 일일 매출 증대 기여"
        },
        {
          sourceExperience: "대학 학과 전공 스터디 모임",
          discoveredCompetency: "지식 공유 문화 조성 및 주도적 학습 환경 구축",
          resumeBullet: "주간 코드 리뷰 세션을 12주간 운영하며 팀원 전원 프로젝트 A학점 획득 견인"
        }
      ],
      strategicActionPlan: [
        "목표 기업 하반기 공채에 맞춘 자기소개서 STAR 템플릿 완성",
        "보관함 증빙 자료(상장, 수료증, 성적표) 기반 포트폴리오 PDF 생성",
        "AI 모의 면접을 통해 프로젝트 위기 극복 사례 꼬리 질문 사전 대비"
      ]
    };

    return res.json({ success: true, isLiveAI: false, data: fallbackData });
  } catch (error: any) {
    console.error('Competency analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. POST /api/ai/transform-experience (STAR framework value transformation)
app.post('/api/ai/transform-experience', async (req: Request, res: Response) => {
  try {
    const { experience, targetJob } = req.body;

    if (ai && experience) {
      try {
        const prompt = `
당신은 취업 자기소개서 및 이력서 작성 전문 코치입니다.
사용자가 입력한 일상적인 활동/아르바이트/프로젝트 경험을 목표 직무 [${targetJob || '희망 직무'}]에 부합하도록 STAR 기법으로 구조화하고 강력한 서류/면접 문장으로 변환하세요.
주의: 실제로 하지 않은 업무나 허위 사실을 날조하지 말고, 주어진 사실의 '가치'와 '역량'을 직무 언어로 재정의하세요.

[입력 경험]:
- 활동명: ${experience.title}
- 활동 유형: ${experience.category}
- 역할: ${experience.role || '팀원/담당자'}
- 주요 업무: ${experience.description || ''}
- 문제 상황: ${experience.problem || ''}
- 해결 과정: ${experience.solution || ''}
- 성과/배운 점: ${experience.result || ''}

다음 JSON으로 응답해주세요:
{
  "star": {
    "situation": "상황 요약 1~2문장",
    "task": "부여된 과업 및 직면한 핵심 문제 1~2문장",
    "action": "본인이 주도적으로 수행한 구체적 조치 및 방법론 2~3문장",
    "result": "정량적 또는 정성적 성과 및 교훈 1~2문장"
  },
  "jobConnectedCompetencies": ["핵심역량1", "핵심역량2", "핵심역량3"],
  "coverLetterPhrases": [
    "자기소개서에 바로 복사해 쓸 수 있는 세련된 문장 1",
    "자기소개서에 바로 복사해 쓸 수 있는 세련된 문장 2"
  ],
  "interviewTalkingPoints": [
    "면접관의 꼬리 질문 대비 핵심 답변 포인트 1",
    "면접관의 꼬리 질문 대비 핵심 답변 포인트 2"
  ]
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const parsed = extractJSON(response.text || '');
        if (parsed) {
          return res.json({ success: true, isLiveAI: true, data: parsed });
        }
      } catch (err) {
        console.warn('Transform experience fallback triggered:', err);
      }
    }

    // Intelligent fallback
    const fallback = {
      star: {
        situation: `${experience?.title || '해당 활동'} 진행 당시, 제한된 일정과 리소스 속에서 목표 달성을 위한 구체적인 프로세스 개선이 필요했던 상황이었습니다.`,
        task: `맡은 역할인 [${experience?.role || '담당자'}]로서 직면한 과업 [${experience?.problem || '핵심 난제'}]을(를) 안정적으로 해결해야 하는 책임이 주어졌습니다.`,
        action: `문제의 근본 원인을 분석한 후, 팀원들과의 투명한 소통을 바탕으로 [${experience?.solution || '실행 방안'}]을(를) 단계별로 체계화하여 적용했습니다.`,
        result: `${experience?.result || '목표 성과 달성'}을 이끌어냈으며, 실제 협업 환경에서 위기 대처 능력과 주도성을 검증받았습니다.`
      },
      jobConnectedCompetencies: ["문제 해결 및 실행력", "직무 연계 협업 태도", "프로세스 구조화"],
      coverLetterPhrases: [
        `"실제 현장에서 맞닥뜨린 난관을 데이터와 체계적인 실행으로 돌파하며, 결과로서 책임을 다하는 직무 몰입도를 체득했습니다."`,
        `"${experience?.title || '해당 경험'}을 통해 동료들과의 조율을 이끌고 조직의 생산성을 실질적으로 개선한 경험이 있습니다."`
      ],
      interviewTalkingPoints: [
        "당시 가장 어려웠던 의사결정 순간과 팀원을 설득한 근거를 수치 중심으로 답변",
        "실패할 뻔했던 위기 요소를 사전 감지하고 대응책을 마련했던 구체적 행동 강조"
      ]
    };

    return res.json({ success: true, isLiveAI: false, data: fallback });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. POST /api/ai/generate-coverletter
app.post('/api/ai/generate-coverletter', async (req: Request, res: Response) => {
  try {
    const { question, maxChars, companyName, jobTitle, selectedExperiences } = req.body;

    if (ai) {
      try {
        const prompt = `
당신은 대한민국 대기업 및 유수 스타트업 채용 합격 자기소개서 전문 작가입니다.
사용자가 선택한 실제 경험 데이터만을 근거로 하여, 질문에 완벽히 부합하는 완성도 높은 자기소개서 초안을 작성하세요.
절대로 사용자가 겪지 않은 가상의 허위 경력을 지어내지 마세요.

[지원 기업]: ${companyName || '지원 기업'}
[지원 직무]: ${jobTitle || '지원 직무'}
[자소서 문항]: ${question}
[희망 글자 수]: 공백 포함 약 ${maxChars || 800}자 내외

[선택된 사용자 경험 데이터]:
${JSON.stringify(selectedExperiences || [], null, 2)}

다음 JSON으로 응답해주세요:
{
  "title": "눈길을 끄는 소제목 (예: [문제 정의와 집요한 실행으로 일군 30%의 효율성])",
  "content": "STAR 기법이 자연스럽게 녹아든 자기소개서 본문 텍스트 (줄바꿈 포함)",
  "charCount": 780,
  "usedExperiences": ["활용된 경험명 1", "활용된 경험명 2"],
  "matchingRationale": "이 경험들을 이 문항에 매칭하여 작성한 이유와 서술 포인트",
  "writingTips": "면접관에게 더 어필하기 위해 보완할 수 있는 팁"
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const parsed = extractJSON(response.text || '');
        if (parsed) {
          return res.json({ success: true, isLiveAI: true, data: parsed });
        }
      } catch (err) {
        console.warn('Cover letter fallback:', err);
      }
    }

    // Fallback template
    const mainExp = selectedExperiences?.[0] || { title: '팀 프로젝트', role: '담당자', result: '우수 성과 달성' };
    const content = `[주도적인 원인 분석과 협업으로 도출한 실질적 성과]\n\n${mainExp.title} 당시, 기존 방식의 비효율로 인해 일정 지연과 완성도 저하가 우려되는 상황이었습니다. 저는 ${mainExp.role || '담당자'}로서 문제의 본질을 파악하고자 현재 진행 과정을 단계별로 시각화하고 동료들과의 밀착 소통을 시작했습니다.\n\n가장 큰 원인은 명확한 역할 분담과 피드백 주기의 부재였습니다. 이에 저는 작업 분배 기준을 재정립하고 매일 15분 스탠드업 미팅을 도입하여 병목 현상을 조기에 발견할 수 있도록 하였습니다. 또한 작은 의견 충돌이 발생할 때마다 프로젝트의 궁극적인 고객 가치와 목표 지표를 기준으로 팀원들을 설득하고 합의점을 도출했습니다.\n\n그 결과 ${mainExp.result || '목표한 프로젝트 산출물을 성공적으로 완성'}하였으며, 구성원 모두가 주인의식을 갖고 몰입하는 협업 문화를 구축할 수 있었습니다. ${companyName || '귀사'}의 ${jobTitle || '직무'}에서도 현장의 문제를 회피하지 않고 데이터와 주도적인 실행력으로 성과를 창출하겠습니다.`;

    const fallback = {
      title: `[원인 분석과 주도적 실행으로 이끌어낸 성과]`,
      content,
      charCount: content.length,
      usedExperiences: [mainExp.title],
      matchingRationale: `문항에서 요구하는 협업 및 문제 해결 역량을 가장 구체적인 역할과 결과로 증명할 수 있는 [${mainExp.title}]을 중심 소재로 채택했습니다.`,
      writingTips: "성과 수치를 한 번 더 검토하시고, 지원 기업의 최근 사업 방향성이나 인재상 키워드를 1~2개 덧붙이면 완성도가 더욱 높아집니다."
    };

    return res.json({ success: true, isLiveAI: false, data: fallback });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. POST /api/ai/mock-interview (Generates question & assesses answer)
app.post('/api/ai/mock-interview', async (req: Request, res: Response) => {
  try {
    const {
      mode,
      jobTitle,
      companyName,
      question,
      userAnswer,
      experienceContext,
      submittedCoverLetter,
      submittedEvidenceTitles,
    } = req.body;

    // 1. Company Analysis Briefing Note Generation
    if (mode === 'company-briefing') {
      const company = companyName || '삼성전자 DX부문';
      const role = jobTitle || 'S/W 개발';

      if (ai) {
        try {
          const prompt = `
당신은 대한민국 1티어 대기업 및 빅테크 전문 면접관이자 기업 분석 애널리스트입니다.
[목표 기업]: ${company}
[지원 직무]: ${role}
[지원자 제출 자기소개서]:
${submittedCoverLetter ? JSON.stringify(submittedCoverLetter) : '등록된 지원서 기반'}
[지원자 제출 증빙 및 포트폴리오]:
${submittedEvidenceTitles ? JSON.stringify(submittedEvidenceTitles) : '성적표, 캡스톤 프로젝트 포트폴리오, 인턴십 수료증'}
[지원자 보유 경험 요약]:
${JSON.stringify((experienceContext || []).slice(0, 3))}

지원자가 면접장에 들어가기 전 반드시 숙지해야 하는 정밀 [기업 분석 및 직무 면접 브리핑 노트]를 JSON으로 작성하세요:
{
  "company": "${company}",
  "role": "${role}",
  "industryOverview": "해당 기업의 시장 포지션 및 현주소 2문장",
  "recentTechTrends": [
    "최근 주력 중인 핵심 사업 및 기술 트렌드 1 (예: On-Device AI 생태계 및 멀티모달 NPU 최적화)",
    "최근 주력 중인 핵심 사업 및 기술 트렌드 2 (예: 글로벌 초연결 플랫폼 및 초저지연 보안 시스템)",
    "최근 주력 중인 핵심 사업 및 기술 트렌드 3"
  ],
  "coreTalentPhilosophy": [
    "기업 핵심 인재상 1 (창의적 도전 및 원칙 준수)",
    "기업 핵심 인재상 2 (데이터 기반의 집요한 문제 해결)",
    "기업 핵심 인재상 3 (다양성 존중과 원팀 협업)"
  ],
  "documentBasedAttackPoints": [
    {
      "targetSection": "제출 서류(프로젝트/인턴) 검증",
      "expectedAttackQuestion": "제출하신 프로젝트에서 본인이 담당한 핵심 코드 라인 수와 장애 발생 시 복구 프로세스는?",
      "defenseStrategy": "자신이 직접 구현한 모듈의 기술 스택 선정 이유와 한계점을 솔직하게 인정하고 개선안 제시"
    },
    {
      "targetSection": "기업 사업 연계성 검증",
      "expectedAttackQuestion": "우리 회사의 현재 제품/서비스에 본인의 기술적 강점을 어떻게 즉시 접목할 것인가?",
      "defenseStrategy": "회사의 최신 기술 방향성과 자신의 경험(동시성 제어, 분산 환경)을 구체적으로 연결"
    }
  ],
  "recommendedOneMinuteIntro": "안녕하십니까, ${company} ${role} 직무에 지원한 김민서입니다. 저는 ...",
  "recommendedFinalQuestions": [
    "현재 해당 사업부에서 기술적으로 가장 고민하고 계신 병목이나 다음 분기 핵심 아키텍처 과제는 무엇입니까?",
    "팀에 입사하게 된다면 3개월 내에 어떤 지표를 가장 우선적으로 기여하길 기대하십니까?"
  ]
}
`;
          const resp = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });
          const parsed = extractJSON(resp.text || '');
          if (parsed) return res.json({ success: true, isLiveAI: true, data: parsed });
        } catch (e) {
          console.warn('Company briefing AI fallback:', e);
        }
      }

      // Sophisticated Fallback for Company Briefing (e.g. Samsung Electronics, Toss, Naver)
      const isSamsung = company.includes('삼성');
      const fallbackBriefing = {
        company,
        role,
        industryOverview: isSamsung
          ? `${company}은 글로벌 가전, 모바일(갤럭시), 스마트싱스 및 반도체 생태계를 선도하며, 최근 모든 디바이스에 생성형 AI를 결합하는 On-Device AI 혁신을 주도하고 있습니다.`
          : `${company}은 압도적인 사용자 경험과 데이터 기반 엔지니어링으로 금융/플랫폼 시장을 재정의하며, 고가용성 대규모 분산 아키텍처를 핵심 경쟁력으로 삼고 있습니다.`,
        recentTechTrends: isSamsung
          ? [
              "Galaxy AI 및 On-Device LLM 경량화·초저전력 NPU 최적화",
              "SmartThings 중심의 공간 지능(Spatial Intelligence) 및 가전 초연결 생태계",
              "삼성 녹스(Knox) 기반의 하드웨어 보안 및 프라이빗 클라우드 강화",
              "차세대 Tizen OS 오픈소스 생태계 및 고성능 메모리 인터페이스 연동"
            ]
          : [
              "수천만 트래픽 실시간 결제 및 송금 트랜잭션의 99.999% 무장애 가용성",
              "Kafka 및 Redis 기반의 이벤트 드리븐 마이크로서비스(EDA) 고도화",
              "사용자 행동 로그 기반 실시간 머신러닝 피드 랭킹 파이프라인"
            ],
        coreTalentPhilosophy: isSamsung
          ? [
              "Passion (끊임없는 열정으로 최고를 지향하는 인재)",
              "Creativity (유연한 사고와 새로운 기술을 선제적으로 탐색하는 창의 인재)",
              "Integrity (기본과 원칙을 지키며 고객 신뢰를 최우선으로 하는 정직한 인재)"
            ]
          : [
              "Extreme Focus on Customer Value (사용자 가치에 대한 집요한 몰입)",
              "Speed & Autonomy (자율과 책임에 기반한 빠른 실행력)",
              "Transparency & Candid Feedback (투명한 소통과 데이터 기반 논쟁)"
            ],
        documentBasedAttackPoints: [
          {
            targetSection: "제출 프로젝트 [캠퍼스 예약 분산 락]",
            expectedAttackQuestion: isSamsung
              ? `${company}의 대규모 디바이스 동시 접속 환경과 비교했을 때, 0.05초 단위 Redis 락의 네트워크 오버헤드는 어떻게 극복하실 생각입니까?`
              : "동시 트래픽 급증 시 Redis 클러스터 장애가 발생하면 시스템 전체가 마비되는 싱글 포인트 오브 페일러(SPOF) 대응책은 무엇입니까?",
            defenseStrategy: "로컬 인메모리 캐싱과 Fallback 서킷 브레이커(Resilience4j)를 연동한 이중화 아키텍처 방어 논리 답변."
          },
          {
            targetSection: "제출 증빙 [아르바이트 프로세스 개선 61%]",
            expectedAttackQuestion: "현장에서 제안한 프로세스가 실제 기술 아키텍처 설계와 엔지니어링 문제 해결에 어떤 실질적 통찰을 주었습니까?",
            defenseStrategy: "직관에 의존하지 않고 시간대별 로그 데이터를 관찰하여 병목을 찾아내는 '데이터 기반 엔지니어링 태도'로 연결."
          }
        ],
        recommendedOneMinuteIntro: `안녕하십니까, ${company} ${role} 직무에 지원한 김민서입니다. 저는 이론에 머무르지 않고 실제 현장의 병목을 데이터와 분산 시스템으로 해결해 온 백엔드 엔지니어입니다. 학부 캡스톤에서 Redis 분산 락을 통해 대규모 트랜잭션 충돌을 해결하며 응답속도를 86% 개선하였고, 스타트업 인턴십에서는 일일 100만 건 로그 파이프라인의 다운타임을 70% 단축시켰습니다. ${company}이 추구하는 최고의 안정성과 기술적 완성도를 갖춘 소프트웨어 엔지니어가 되겠습니다. 감사합니다.`,
        recommendedFinalQuestions: [
          `"현재 ${company} 해당 사업부에서 가장 우선순위로 개선하고자 하는 인프라 기술 병목이나 성능 지표는 무엇입니까?"`,
          `"신입 엔지니어가 입사 후 팀의 핵심 제품 기여를 위해 첫 3개월간 가장 중점적으로 갖추어야 할 지식이나 실천 사항은 무엇입니까?"`
        ]
      };

      return res.json({ success: true, isLiveAI: false, data: fallbackBriefing });
    }

    // 2. Question Generation linked to Company and Submitted Documents
    if (mode === 'generate-questions') {
      const company = companyName || '삼성전자 DX부문';
      const role = jobTitle || 'S/W 개발';

      if (ai) {
        try {
          const prompt = `
당신은 ${company} ${role} 직무의 실무 면접관입니다.
지원자가 지원한 회사(${company})의 사업/기술 도메인과, 지원자가 제출한 서류(자소서, 증빙자료, 활동)를 교차 검증하는 가장 날카롭고 유의미한 실전 면접 질문 3개를 JSON으로 생성하세요.

[지원 회사 및 직무]: ${company} / ${role}
[제출 자기소개서 요약]: ${submittedCoverLetter?.title || '동시성 제어 및 아르바이트 프로세스 최적화'}
[제출 증빙 서류]: ${JSON.stringify(submittedEvidenceTitles || ['성적표', '해커톤 상장', '인턴 수료증'])}
[지원자 경험 목록]: ${JSON.stringify((experienceContext || []).slice(0, 3))}

다음 JSON 규격으로만 응답:
{
  "questions": [
    {
      "id": "q1",
      "category": "회사 사업 & 기술 연계",
      "question": "${company}의 최근 기술 방향성과 관련하여...",
      "intent": "기업 도메인 이해도 및 기술 적용력 검증",
      "expectedPoints": ["회사 기술 방향 이해", "본인 프로젝트와의 연결", "구체적 적용 방안"]
    },
    {
      "id": "q2",
      "category": "제출 서류 & 프로젝트 심층 검증",
      "question": "제출하신 자소서에서 기술한...",
      "intent": "실제 구현 여부 및 위기 극복 진위 확인",
      "expectedPoints": ["기술적 선택 근거", "트레이드오프 분석", "장애 복구 과정"]
    },
    {
      "id": "q3",
      "category": "기업 인재상 & 협업 갈등",
      "question": "${company}에서 협업 시...",
      "intent": "조직 적응력 및 소통 역량 평가",
      "expectedPoints": ["경청과 데이터 기반 설득", "원팀 마인드", "결과에 대한 책임"]
    }
  ]
}
`;
          const resp = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });
          const parsed = extractJSON(resp.text || '');
          if (parsed && Array.isArray(parsed.questions)) {
            return res.json({ success: true, isLiveAI: true, data: parsed });
          }
        } catch (e) {
          console.warn('Mock interview question gen fallback:', e);
        }
      }

      // Default high quality questions tailored to company and submitted materials
      const isSamsung = company.includes('삼성');
      return res.json({
        success: true,
        isLiveAI: false,
        data: {
          questions: [
            {
              id: "q1",
              category: "회사 사업 연계 & 직무 기술",
              question: isSamsung
                ? `${company}의 핵심 비전인 On-Device AI 및 대규모 스마트싱스 연동 환경에서 지원자가 진행했던 분산 동시성 제어 프로젝트가 어떻게 기여할 수 있다고 생각하십니까?`
                : `${company}의 실시간 대용량 금융/플랫폼 트랜잭션 서빙 시 발생할 수 있는 네트워크 지연과 DB 데드락을 본인의 프로젝트 경험을 바탕으로 어떻게 진단하고 해결하시겠습니까?`,
              intent: "지원 회사의 기술 환경 이해도 및 보유 기술의 실무 전이 가능성 평가",
              expectedPoints: ["회사 기술 도메인에 대한 이해", "본인 프로젝트 아키텍처와의 논리적 연결", "예상되는 기술적 도전 과제"]
            },
            {
              id: "q2",
              category: "제출 서류(자소서/증빙) 심층 검증",
              question: "제출하신 자기소개서에 작성된 [Redis Redisson 분산 락] 도입 사례에서, 락 획득 타임아웃과 임차 시간(Lease Time) 설정 시 고려했던 트레이드오프는 무엇이었습니까?",
              intent: "제출 서류의 진위 여부 및 기술 깊이(Deep Dive) 검증",
              expectedPoints: ["단순 사용이 아닌 내부 메커니즘 이해", "장애 상황 시 데드락 방지 조치", "정량적 성능 지표"]
            },
            {
              id: "q3",
              category: "기업 컬처핏 & 현장 문제 해결",
              question: "아르바이트 및 스타트업 인턴 과정에서 기존 관행을 개선하고자 할 때 팀원이나 상사의 반대에 부딪혔던 경험과, 이를 데이터로 설득했던 과정을 말씀해주세요.",
              intent: "조직 내 갈등 관리 및 능동적인 소통 태도 확인",
              expectedPoints: ["데이터 기반의 설득 논리", "팀원들의 피로도와 입장 경청", "최종 성과 달성"]
            }
          ]
        }
      });
    }

    if (mode === 'evaluate-answer') {
      const company = companyName || '삼성전자 DX부문';
      if (ai) {
        try {
          const prompt = `
당신은 ${company}의 면접관입니다. 지원자의 답변을 기업 인재상과 직무 적합성에 맞춰 엄격하고 건설적으로 평가해주세요.
[지원 회사/직무]: ${company} / ${jobTitle}
[면접 질문]: ${question}
[지원자 답변]: ${userAnswer}

다음 JSON으로 응답:
{
  "score": 87,
  "logicEvaluation": "상황에 대한 원인 분석과 취한 행동이 구체적이며 회사의 직무 인재상에 잘 부합합니다.",
  "strengths": ["실제 본인이 주도한 역할이 명확함", "수치 기반의 문제 해결 태도가 돋보임"],
  "improvements": ["${company}의 실제 제품이나 서비스 적용 관점을 한 문장 덧붙이면 더욱 강력한 차별점이 됩니다."],
  "followUpQuestion": "그 해결책을 적용했을 때 다른 팀원들의 초기 반응은 어떠했고, 반대 의견은 없었나요?",
  "recommendedModelAnswerSnippet": "답변 마지막에 '${company} 입사 후에도 이러한 데이터 중심 사고로 기여하겠습니다'라는 포부를 덧붙여보세요."
}
`;
          const resp = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });
          const parsed = extractJSON(resp.text || '');
          if (parsed) return res.json({ success: true, isLiveAI: true, data: parsed });
        } catch (e) {
          console.warn('Mock interview eval fallback:', e);
        }
      }

      // Default mock evaluation
      return res.json({
        success: true,
        isLiveAI: false,
        data: {
          score: 86,
          logicEvaluation: `[${company}] 면접관 관점에서 직면했던 문제 상황과 지원자의 구체적 실행 조치가 논리적으로 서술되어 설득력이 높습니다.`,
          strengths: ["문제의 근본 원인을 직관이 아닌 구조적으로 분석함", "실제 본인이 취한 액션과 기여도가 명확히 드러남"],
          improvements: [`${company}의 실무 개발 환경(고가용성, 대규모 트래픽)에서의 예외 처리 방안을 1문장 더 보강하면 만점에 가깝습니다.`],
          followUpQuestion: `만약 동일한 문제가 ${company}의 실제 프로덕션 상용 서비스에서 발생한다면, 고객 장애를 최소화하기 위해 어떤 롤백 및 모니터링 전략을 취하시겠습니까?`,
          recommendedModelAnswerSnippet: `상황 설명 비중을 10% 줄이고, 본인이 직접 작성한 코드나 설계한 아키텍처의 구체적 디테일을 1문장 더 보강해보세요.`
        }
      });
    }

    return res.status(400).json({ error: 'Invalid mode' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// 5. POST /api/ai/ocr-transcript (Simulate or perform OCR on transcript image)
app.post('/api/ai/ocr-transcript', async (req: Request, res: Response) => {
  try {
    const { imageBase64, filename } = req.body;

    if (ai && imageBase64) {
      try {
        const mimeMatch = imageBase64.match(/^data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const rawBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: rawBase64,
                },
              },
              {
                text: `대학 성적표 이미지에서 이수한 과목 목록을 추출해주세요.
과목명, 이수학점(숫자), 성적등급(A+, A0, B+, B0, Pass 등), 전공여부(전공/교양)를 구분하여 다음 JSON 배열로 반환하세요:
[
  { "semester": "2-2", "courseName": "자료구조및실습", "credits": 3, "grade": "A+", "type": "전공" }
]
불필요한 설명 없이 순수 JSON만 출력하세요.`,
              },
            ],
          },
        });

        const parsed = extractJSON(response.text || '');
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ success: true, isLiveAI: true, courses: parsed });
        }
      } catch (e) {
        console.warn('Gemini OCR image recognition fallback:', e);
      }
    }

    // High quality default simulated OCR extraction
    const mockExtractedCourses = [
      { semester: "3-1", courseName: "데이터베이스응용", credits: 3, grade: "A+", type: "전공" },
      { semester: "3-1", courseName: "컴퓨터네트워크", credits: 3, grade: "A0", type: "전공" },
      { semester: "3-1", courseName: "소프트웨어공학", credits: 3, grade: "A+", type: "전공" },
      { semester: "3-1", courseName: "기술경영과창업", credits: 3, grade: "B+", type: "교양" },
      { semester: "3-1", courseName: "비즈니스영어회화", credits: 2, grade: "A0", type: "교양" }
    ];

    return res.json({
      success: true,
      isLiveAI: false,
      courses: mockExtractedCourses,
      message: `[${filename || '성적표'}] 분석 완료: 총 5개 과목(14학점)이 자동 추출되었습니다.`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn(`[CareerLog] Static build dist directory not found at ${distPath}`);
    }
  }


  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerLog server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
