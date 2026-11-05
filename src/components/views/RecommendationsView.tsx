import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import {
  Sparkles,
  ArrowRight,
  Building2,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  FileText,
  X,
  ChevronRight,
  Award,
  TrendingUp
} from 'lucide-react';

export interface RecommendationItem {
  id: string;
  category: 'regular_job' | 'contract_job' | 'internship' | 'contest' | 'bootcamp' | 'certification';
  categoryLabel: string;
  employmentType?: '정규직' | '계약직' | '인턴' | '기타';
  contractDuration?: string;
  compensation?: string;
  workLocation?: string;
  title: string;
  organization: string;
  deadline: string;
  dDay: number;
  targetRole: string;
  requirements?: string[];
  benefits?: string[];
  recommendationReason: string;
  targetGapSolved: string;
  link?: string;
  simulatedFitDelta: number;
  matchScore: number;
}

export const RecommendationsView: React.FC = () => {
  const { profile, competencyAnalysis, setActiveMenu } = useCareer();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSimulations, setActiveSimulations] = useState<string[]>(['rec-reg-1', 'rec-1']);
  const [selectedJobDetail, setSelectedJobDetail] = useState<RecommendationItem | null>(null);

  const recommendationsList: RecommendationItem[] = [
    // 1. 신입 정규직
    {
      id: 'rec-reg-1',
      category: 'regular_job',
      categoryLabel: '신입 정규직',
      employmentType: '정규직',
      contractDuration: '정규직 (수습 3개월 후 100% 본채용)',
      compensation: '초봉 5,400만원 + 성과급(최대 연봉 50%) + 복지카드 연 300만원',
      workLocation: '삼성전자 수원 디지털시티 / 서울 우면 R&D 캠퍼스',
      title: '2026 하반기 삼성전자 DX부문 3급(대졸) 신입 공채 (S/W 개발)',
      organization: '삼성전자 DX부문 (Samsung Electronics)',
      deadline: '2026-11-28',
      dDay: 24,
      targetRole: '클라우드 & 온디바이스 AI 백엔드 플랫폼 개발',
      requirements: [
        '컴퓨터/SW 관련 전공자 또는 유관 소프트웨어 엔지니어링 역량 보유자',
        'Java/Kotlin 또는 C/C++, Python 중 1개 이상 프로그래밍 언어 숙련자',
        '자료구조, 알고리즘, 네트워크, 데이터베이스 등 CS 핵심 기본기 보유자',
        '대규모 트래픽 분산 처리 및 클라우드 환경 개발 경험 우대'
      ],
      benefits: [
        '자율출퇴근제 (주 40시간 범위 내 자율 근무)',
        '사내 피트니스, 수영장, 사우나 & 하루 3식 무료 식당 제공',
        '삼성 임직원 패밀리몰(패밀리넷) 할인 및 의료비 지원',
        '국내외 석박사 파견 및 기술 컨퍼런스 참가 전액 지원'
      ],
      recommendationReason: '김민서 님의 컴퓨터공학 주전공 평점 4.18 및 Redis 분산 락/동시성 제어 캡스톤 프로젝트가 삼성전자 DX부문 플랫폼 사업부 핵심 요구사항과 96% 일치합니다.',
      targetGapSolved: '대규모 분산 트래픽 아키텍처 경험 보유. 알고리즘 코딩테스트 집중 대비 시 서류/직무면접 통과 가능성이 매우 높습니다.',
      simulatedFitDelta: 6,
      matchScore: 96,
    },
    {
      id: 'rec-reg-2',
      category: 'regular_job',
      categoryLabel: '신입 정규직',
      employmentType: '정규직',
      contractDuration: '정규직 (시용기간 3개월)',
      compensation: '신입 초봉 6,000만원선 + 스톡옵션 부여 + 식대 무제한 지원',
      workLocation: '서울 강남구 테헤란로 (토스 아크)',
      title: '비바리퍼블리카(토스) Server Developer 신입/경력 수시 채용',
      organization: '비바리퍼블리카 (Toss)',
      deadline: '2026-12-05',
      dDay: 31,
      targetRole: '코어 뱅킹 & 결제 트랜잭션 서버 엔지니어',
      requirements: [
        'Spring Boot / Kotlin 기반의 웹 서버 애플리케이션 개발 경험',
        'RDBMS / NoSQL 데이터 모델링 및 쿼리 최적화 경험',
        '트랜잭션 ACID 격리수준 및 동시성 이슈 제어 역량',
        '금융 핀테크 도메인 혁신에 대한 강한 오너십'
      ],
      benefits: [
        '연차 무제한 자율 승인제 (사유 불문)',
        '최고 사양 M3 Max 맥북 프로 + 듀얼 모니터 풀세팅 지원',
        '주택자금 1억원 무이자 대출 제도 운영',
        '토스 사내 편의점 및 카페테리아 전액 무료'
      ],
      recommendationReason: '핀테크 해커톤 우수상 및 결제 트랜잭션 격리수준 제어 경험이 토스의 고성능 분산 금융 시스템 개발 문화와 직결됩니다.',
      targetGapSolved: '실전 트랜잭션 동시성 격리수준 제어 능력을 포트폴리오로 증빙 완료한 상태입니다.',
      simulatedFitDelta: 5,
      matchScore: 94,
    },
    {
      id: 'rec-reg-3',
      category: 'regular_job',
      categoryLabel: '신입 정규직',
      employmentType: '정규직',
      contractDuration: '정규직 (수습 3개월)',
      compensation: '초봉 5,300만원 + 연간 복지포인트 360만원 + RSU(양도제한조건부주식)',
      workLocation: '경기도 성남시 분당구 NAVER 1784 사옥 (하이브리드 근무)',
      title: '2026 네이버 테크 신입 공채 (S/W Engineer)',
      organization: '네이버 (NAVER Corp)',
      deadline: '2026-12-15',
      dDay: 41,
      targetRole: '검색 & 플랫폼 백엔드 개발자',
      requirements: [
        '컴퓨터공학 학사 이상 (졸업예정자 포함)',
        '운영체제, 네트워크, 자료구조, 데이터베이스 등 CS 기초 역량이 탄탄한 분',
        '오픈소스 코드 분석 및 라이브러리 활용/기여 역량 보유자 우대'
      ],
      benefits: [
        'Connected Work (전면 원격근무 또는 주 3일 출근 선택제)',
        '1784 로봇 친화형 스마트 오피스 및 전문 의료진 상주 헬스케어센터',
        '네이버페이 포인트 연간 360만원 지급 및 사내 스타트업 육성 지원'
      ],
      recommendationReason: '알고리즘 랩스 학회 활동 및 알고리즘/자료구조 전과목 A+ 성적이 네이버의 기술 인터뷰 검증 기준에 완벽히 부합합니다.',
      targetGapSolved: '이론과 실무 프로젝트의 탄탄한 연계가 증명되어 코딩테스트 및 시스템 면접에서 유리합니다.',
      simulatedFitDelta: 5,
      matchScore: 92,
    },

    // 2. 계약직 채용
    {
      id: 'rec-con-1',
      category: 'contract_job',
      categoryLabel: '전문 계약직',
      employmentType: '계약직',
      contractDuration: '1년 계약 (근무 평가 후 정규직 전환 심사 대상)',
      compensation: '월 430만원 (연 5,160만원 상당) + R&D 인센티브 + 복지포인트',
      workLocation: '서울 서초구 양재동 현대자동차 R&D 본사',
      title: '현대자동차 로보틱스랩 자율주행 데이터 파이프라인 전문 연구원 채용',
      organization: '현대자동차 로보틱스랩 (Hyundai Motor)',
      deadline: '2026-11-30',
      dDay: 26,
      targetRole: '로봇 텔레메트리 대용량 시계열 데이터 파이프라인 개발',
      requirements: [
        'Python, Java 기반 데이터 파이프라인(ETL) 구축 경험',
        'Kafka, Redis, PostgreSQL 등 분산 시스템 도구 활용 경험',
        '학사 학위 소지자 (2027년 2월 이내 졸업예정자 지원 가능)'
      ],
      benefits: [
        '현대자동차 전 차종 구매 임직원 할인 혜택 동일 적용',
        '사내 어학원 및 해외 논문/컨퍼런스 게재 전액 지원',
        '시차출퇴근제 및 유연근무제 운영'
      ],
      recommendationReason: '학부 연구실 실적 및 대용량 트래픽 락 처리 기술이 로보틱스 관제 텔레메트리 파이프라인과 높은 정합도를 보입니다.',
      targetGapSolved: '대기업 R&D 현업 프로젝트를 직접 수행하여 실전 레퍼런스를 구축하고 정규직 전환 기회를 확보합니다.',
      simulatedFitDelta: 4,
      matchScore: 90,
    },
    {
      id: 'rec-con-2',
      category: 'contract_job',
      categoryLabel: '프로젝트 계약직',
      employmentType: '계약직',
      contractDuration: '6개월 프로젝트 계약 (우수 근무자 계약 연장 또는 신입 전형 서류 면제)',
      compensation: '월 380만원 + 카카오 정규직 동일 복지포인트 지급',
      workLocation: '경기도 성남시 판교 카카오 판교아지트',
      title: '카카오페이 결제/정산 시스템 QA 및 백엔드 운영 엔지니어 채용',
      organization: '카카오페이 (Kakao Pay)',
      deadline: '2026-12-08',
      dDay: 34,
      targetRole: '정산 배치 시스템 유지보수 & 단위/통합 테스트 자동화',
      requirements: [
        'Spring Boot 및 RDBMS 기본 쿼리 작성 역량 보유자',
        'JUnit / Mockito 활용한 단위 테스트 및 통합 테스트 작성 경험',
        '금융/결제 도메인에 대한 높은 관심과 꼼꼼한 코드 리뷰 역량'
      ],
      benefits: [
        '매월 마지막 주 금요일 전사 휴무 (놀금 제도)',
        '판교아지트 내 피트니스, 사내 카페테리아 무료 이용권',
        '최신 M3 Pro 맥북 노트북 지급'
      ],
      recommendationReason: '핀테크 해커톤 우수상 및 캡스톤 프로젝트에서 작성한 Mockito 테스트 케이스 역량이 정산 배치 검증에 즉시 투입 가능합니다.',
      targetGapSolved: '대규모 금융 핀테크 정산 도메인 실무 레퍼런스를 확보하여 차후 정규직 취업 시 차별화된 경쟁력을 갖춥니다.',
      simulatedFitDelta: 4,
      matchScore: 88,
    },
    {
      id: 'rec-con-3',
      category: 'contract_job',
      categoryLabel: '체험형 계약직',
      employmentType: '계약직',
      contractDuration: '4개월 단기 계약',
      compensation: '월 330만원 + 점심/저녁 식대 전액 실비 지원',
      workLocation: '서울 서초구 강남역 부근 (당근 사옥)',
      title: '당근 지역 커머스 운영 데이터 분석 보조 (체험형 계약직)',
      organization: '당근 (Danggeun)',
      deadline: '2026-11-22',
      dDay: 18,
      targetRole: '지역 커머스 로그 집계 및 AB 테스트 대시보드 운영 보조',
      requirements: [
        'SQL 쿼리 작성 및 Python 데이터 분석(Pandas) 기초 역량',
        '비즈니스 지표 해석 및 데이터 기반 커뮤니케이션 능력',
        '스타트업 조직 문화 및 빠른 피드백 루프에 적극적인 분'
      ],
      benefits: [
        '자율출퇴근제 및 점심/저녁 식대 무제한 법인카드 지원',
        '직무 관련 도서 구매비 및 온라인 강의비 전액 지원',
        '팀별 간식비 및 문화의 날 지원'
      ],
      recommendationReason: '경영학 복수전공을 통해 습득한 비즈니스 지표 분석력과 스타트업 인턴십 경험이 결합되어 실서비스에 빠르게 기여할 수 있습니다.',
      targetGapSolved: '실제 유저 트래픽 기반 AB 테스트 분석 경험을 보강하여 데이터 중심 개발자로서의 이력을 완성합니다.',
      simulatedFitDelta: 3,
      matchScore: 85,
    },

    // 3. 인턴십
    {
      id: 'rec-1',
      category: 'internship',
      categoryLabel: '인턴십 채용',
      employmentType: '인턴',
      contractDuration: '8주 동계 인턴십 (우수 수료자 신입 최종 면접 직행)',
      compensation: '월 280만원 + 숙식 실비 지원',
      workLocation: '삼성전자 수원 디지털시티',
      title: '2026 동계 삼성전자 DX부문 대학생 S/W 테크 인턴십',
      organization: '삼성전자 (Samsung Electronics)',
      deadline: '2026-11-25',
      dDay: 21,
      targetRole: 'S/W 개발 엔지니어 (인턴)',
      requirements: [
        '국내외 4년제 대학교 3~4학년 재학생/휴학생',
        '알고리즘 및 자료구조 지식 보유자',
        'SW 역량테스트 응시 가능자'
      ],
      benefits: ['현업 멘토 1:1 밀착 코칭', '삼성전자 명의 수료증 발급', '신입 공채 지원 시 우대'],
      recommendationReason: '김민서 님이 보유한 Redis 동시성 락 및 데이터 파이프라인과 높은 실무 정합성 보유',
      targetGapSolved: '대규모 온디바이스 플랫폼 및 클라우드 실무 인턴십 경험 공백 완벽 해소',
      simulatedFitDelta: 5,
      matchScore: 93,
    },

    // 4. 자격증 & 어학
    {
      id: 'rec-2',
      category: 'certification',
      categoryLabel: '클라우드 자격증',
      title: 'AWS Certified Solutions Architect - Associate (SAA)',
      organization: 'Amazon Web Services (AWS)',
      deadline: '상시 응시 가능',
      dDay: 30,
      targetRole: '클라우드 / 백엔드 엔지니어',
      recommendationReason: '삼성전자, 토스 및 당근 우대사항인 클라우드 인프라(AWS) 설계 지식 검증',
      targetGapSolved: 'AI 분석에서 도출된 [클라우드 인프라 배포 실무] 공백 보완',
      simulatedFitDelta: 4,
      matchScore: 89,
    },
    {
      id: 'rec-5',
      category: 'certification',
      categoryLabel: '어학시험',
      title: 'OPIc (영어 말하기) AL 등급 취득',
      organization: 'ACTFL',
      deadline: '상시 응시',
      dDay: 20,
      targetRole: '글로벌 IT 엔지니어',
      recommendationReason: '현재 IH(중상급)에서 최고 등급 AL 확보 시 외국계 및 대기업 해외 사업부 지원 자격 충족',
      targetGapSolved: '글로벌 엔지니어링 미팅 및 영문 문서 커뮤니케이션 극대화',
      simulatedFitDelta: 2,
      matchScore: 84,
    },

    // 5. 공모전
    {
      id: 'rec-3',
      category: 'contest',
      categoryLabel: '공모전 & 대회',
      title: '제12회 K-오픈소스 소프트웨어 기여 공모전',
      organization: '과학기술정보통신부 / 정보통신산업진흥원',
      deadline: '2026-12-10',
      dDay: 36,
      targetRole: '소프트웨어 엔지니어',
      recommendationReason: 'Redis / Spring 오픈소스 이슈 해결을 통해 상위 1% 기술 깊이 증명 가능',
      targetGapSolved: 'AI 분석에서 지적된 [오픈소스 라이브러리 기여 실적] 공백 해소',
      simulatedFitDelta: 3,
      matchScore: 87,
    },

    // 6. 교육 & 부트캠프
    {
      id: 'rec-4',
      category: 'bootcamp',
      categoryLabel: '실무 부트캠프',
      title: '우아한테크코스 백엔드 7기 선발',
      organization: '우아한형제들 (배달의민족)',
      deadline: '2026-12-05',
      dDay: 31,
      targetRole: '백엔드 엔지니어',
      recommendationReason: '객체지향 설계와 TDD(테스트 주도 개발) 실전 심화 체득',
      targetGapSolved: '엔터프라이즈급 테스트 코드 작성 및 코드 리뷰 문화 체화',
      simulatedFitDelta: 3,
      matchScore: 86,
    },
  ];

  const filtered = selectedCategory === 'all'
    ? recommendationsList
    : recommendationsList.filter((r) => r.category === selectedCategory);

  const toggleSimulation = (id: string) => {
    setActiveSimulations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const baseScore = competencyAnalysis.fitScore;
  const addedPoints = activeSimulations.reduce((acc, simId) => {
    const item = recommendationsList.find((r) => r.id === simId);
    return acc + (item?.simulatedFitDelta || 0);
  }, 0);
  const simulatedScore = Math.min(100, baseScore + addedPoints);

  const handleApplyToCoverLetter = (_item: RecommendationItem) => {
    setActiveMenu('cover_letter');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Ohouse Clean White Canvas */}
      <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] font-bold">
              OPPORTUNITY RADAR
            </span>
            <span className="text-[12px] text-[#828c94]">
              {profile.name} 님 포트폴리오 기반 역량 맞춤 기회
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2f3438] tracking-tight">
            AI 맞춤형 채용 공고 & 활동 추천
          </h1>
          <p className="text-[13px] text-[#424242] mt-0.5">
            신입 정규직, 전환형/전문 계약직부터 인턴십, 공모전, 자격증까지 목표 직무[{profile.targetJobs[0] || '백엔드'}] 합격에 최적화된 기회만을 선별했습니다.
          </p>
        </div>

        {/* Quick Recruitment Counter */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-[#f7f9fa] border border-[#e0e0e0] px-3.5 py-2 rounded-[4px] text-center">
            <div className="text-[11px] text-[#828c94]">신입 정규직</div>
            <div className="text-base font-bold text-[#00a1ff] font-mono">
              {recommendationsList.filter((r) => r.category === 'regular_job').length}건
            </div>
          </div>
          <div className="bg-[#f7f9fa] border border-[#e0e0e0] px-3.5 py-2 rounded-[4px] text-center">
            <div className="text-[11px] text-[#828c94]">계약직 채용</div>
            <div className="text-base font-bold text-[#2f3438] font-mono">
              {recommendationsList.filter((r) => r.category === 'contract_job').length}건
            </div>
          </div>
          <div className="bg-[#f7f9fa] border border-[#e0e0e0] px-3.5 py-2 rounded-[4px] text-center">
            <div className="text-[11px] text-[#828c94]">인턴/활동</div>
            <div className="text-base font-bold text-[#2f3438] font-mono">
              {recommendationsList.filter((r) => !['regular_job', 'contract_job'].includes(r.category)).length}건
            </div>
          </div>
        </div>
      </div>

      {/* ================= INTERACTIVE CAREER SIMULATOR (Ohouse Clean Blue Style) ================= */}
      <div className="bg-white rounded-[4px] border border-[#b9e5fe] p-6 space-y-4 shadow-sm bg-gradient-to-r from-white via-white to-[#f0f9ff]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eaedef] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00a1ff]" />
              <span className="font-bold text-base text-[#2f3438]">취업 적합도 가상 시뮬레이터 (Career Simulator)</span>
            </div>
            <p className="text-[13px] text-[#424242]">
              관심 채용 공고나 활동을 가상으로 등록하면 나의 직무 매칭 점수와 합격 경쟁력이 어떻게 상승하는지 예측합니다.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#f7f9fa] px-4 py-2.5 rounded-[4px] border border-[#e0e0e0]">
            <div className="text-right">
              <div className="text-[11px] text-[#828c94]">현재 기본 적합도</div>
              <div className="text-lg font-bold tabular-nums text-[#424242] font-mono">{baseScore}%</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#00a1ff]" />
            <div className="text-left">
              <div className="text-[11px] text-[#00a1ff] font-bold">시뮬레이션 적합도</div>
              <div className="text-2xl font-extrabold tabular-nums text-[#00a1ff] font-mono">
                {simulatedScore}% <span className="text-[12px] text-[#00a1ff] font-mono">(+{addedPoints}%p)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Quick Simulation Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {recommendationsList.slice(0, 3).map((rec) => {
            const isSimActive = activeSimulations.includes(rec.id);
            return (
              <button
                type="button"
                key={rec.id}
                onClick={() => toggleSimulation(rec.id)}
                className={`p-4 rounded-[4px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSimActive
                    ? 'bg-[#f0f9ff] border-[#00a1ff] text-[#2f3438] shadow-xs'
                    : 'bg-white border-[#e0e0e0] hover:border-[#00a1ff] text-[#424242]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[12px] mb-1.5 font-mono">
                    <span className="font-bold text-[#00a1ff]">+{rec.simulatedFitDelta}%p 가산점</span>
                    <span className={`w-4 h-4 rounded-[2px] flex items-center justify-center text-xs ${
                      isSimActive ? 'bg-[#00a1ff] text-white font-bold' : 'border border-[#e0e0e0]'
                    }`}>
                      {isSimActive && '✓'}
                    </span>
                  </div>
                  <div className="font-bold text-[13px] text-[#2f3438] line-clamp-1">{rec.title}</div>
                  <div className="text-[12px] text-[#828c94] line-clamp-1 mt-0.5">{rec.targetGapSolved}</div>
                </div>
                <div className="text-[11px] text-[#828c94] mt-3 font-mono flex items-center justify-between border-t border-[#eaedef] pt-2">
                  <span className={isSimActive ? 'text-[#00a1ff] font-bold' : ''}>
                    {isSimActive ? '● 시뮬레이션 적용 중' : '+ 가상 추가하기'}
                  </span>
                  <span>매칭률 {rec.matchScore}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tabs: 정규직, 계약직, 인턴, 공모전 등 */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto text-[13px] pb-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: '전체 기회' },
            { id: 'regular_job', label: '신입 정규직 채용' },
            { id: 'contract_job', label: '계약직 채용' },
            { id: 'internship', label: '인턴십 채용' },
            { id: 'contest', label: '공모전 & 대회' },
            { id: 'certification', label: '자격증 & 어학' },
            { id: 'bootcamp', label: '교육 & 부트캠프' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-[4px] transition-all cursor-pointer whitespace-nowrap font-medium text-[13px] ${
                  isActive
                    ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                    : 'bg-white border border-[#e0e0e0] text-[#424242] hover:text-[#00a1ff] hover:bg-[#f7f9fa]'
                }`}
              >
                {cat.label}
                {cat.id !== 'all' && (
                  <span className={`ml-1.5 text-[11px] font-mono ${isActive ? 'text-white' : 'text-[#828c94]'}`}>
                    {recommendationsList.filter((r) => r.category === cat.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <span className="text-[12px] text-[#828c94] hidden md:inline font-mono shrink-0">
          총 {filtered.length}건 선별
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isRecruitment = item.category === 'regular_job' || item.category === 'contract_job' || item.category === 'internship';
          const isSimulated = activeSimulations.includes(item.id);

          return (
            <div
              key={item.id}
              className="bg-white p-5 sm:p-6 rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all text-[13px] space-y-4 shadow-2xs"
            >
              {/* Header row: Category / Company / Title / D-day */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[12px] font-mono flex-wrap">
                    <span className="font-bold text-[#00a1ff] bg-[#ddf3ff]/60 px-2 py-0.5 rounded-[3px] border border-[#b9e5fe]">
                      {item.categoryLabel}
                    </span>
                    {item.employmentType && (
                      <span className={`px-2 py-0.5 rounded-[3px] text-[11px] font-bold ${
                        item.employmentType === '정규직'
                          ? 'bg-[#00a1ff] text-white'
                          : item.employmentType === '계약직'
                          ? 'bg-[#2f3438] text-white'
                          : 'bg-[#f7f9fa] text-[#2f3438] border border-[#e0e0e0]'
                      }`}>
                        {item.employmentType}
                      </span>
                    )}
                    <span className="text-[#828c94]">·</span>
                    <span className="font-semibold text-[#2f3438] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#828c94]" />
                      {item.organization}
                    </span>
                    <span className="text-[#828c94]">·</span>
                    <span className="text-[#424242]">직무: <strong className="text-[#2f3438]">{item.targetRole}</strong></span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#2f3438] tracking-tight pt-0.5 hover:text-[#00a1ff] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-3 py-1 bg-[#00a1ff] text-white font-bold font-mono text-[13px] rounded-[3px] tabular-nums shadow-xs">
                    D-{item.dDay}
                  </span>
                  <div className="text-[11px] text-[#828c94] mt-1 font-mono">{item.deadline} 마감</div>
                </div>
              </div>

              {/* Extra Recruitment Metadata (If regular or contract job) */}
              {isRecruitment && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef] text-[12px]">
                  {item.contractDuration && (
                    <div className="flex items-start gap-1.5">
                      <Clock className="w-4 h-4 text-[#828c94] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] text-[#828c94] font-medium">고용 조건 & 기간</div>
                        <div className="font-bold text-[#2f3438]">{item.contractDuration}</div>
                      </div>
                    </div>
                  )}
                  {item.compensation && (
                    <div className="flex items-start gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#828c94] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] text-[#828c94] font-medium">급여 & 보상 처우</div>
                        <div className="font-bold text-[#2f3438]">{item.compensation}</div>
                      </div>
                    </div>
                  )}
                  {item.workLocation && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-[#828c94] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] text-[#828c94] font-medium">근무지 & 근무 형태</div>
                        <div className="font-bold text-[#2f3438]">{item.workLocation}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Match & Gap Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                <div className="bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef]">
                  <div className="font-bold text-[#2f3438] flex items-center justify-between mb-1">
                    <span className="text-[#00a1ff]">🎯 AI 직무 추천 및 매칭 사유</span>
                    <span className="font-mono text-[11px] text-[#00a1ff] bg-[#ddf3ff]/60 px-2 py-0.5 rounded-[3px] font-bold border border-[#b9e5fe]">
                      매칭률 {item.matchScore}%
                    </span>
                  </div>
                  <p className="text-[#424242] leading-relaxed">{item.recommendationReason}</p>
                </div>

                <div className="bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef]">
                  <div className="font-bold text-[#2f3438] mb-1">
                    🛡️ 취업 경쟁력 보완 & 집중 준비 포인트
                  </div>
                  <p className="text-[#424242] leading-relaxed">{item.targetGapSolved}</p>
                </div>
              </div>

              {/* Key Requirements tags if available */}
              {item.requirements && item.requirements.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[11px] text-[#828c94] font-mono">주요 자격요건:</span>
                  {item.requirements.slice(0, 3).map((req, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#f7f9fa] border border-[#e0e0e0] text-[#424242] rounded-[3px] text-[11px]"
                    >
                      ✓ {req}
                    </span>
                  ))}
                  {item.requirements.length > 3 && (
                    <span className="text-[11px] text-[#828c94]">외 {item.requirements.length - 3}개</span>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-[#eaedef]">
                <div className="text-[12px] text-[#828c94] font-mono">
                  커리어 시뮬레이션 가산점 <strong className="text-[#00a1ff]">+{item.simulatedFitDelta}%p</strong>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Details Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => setSelectedJobDetail(item)}
                    className="px-3.5 py-2 bg-white border border-[#e0e0e0] hover:bg-[#f7f9fa] text-[#2f3438] font-medium rounded-[4px] transition-colors cursor-pointer flex items-center gap-1 text-[13px]"
                  >
                    <span>공고 상세 요강</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Career Simulator Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleSimulation(item.id)}
                    className={`px-3.5 py-2 font-medium rounded-[4px] transition-colors cursor-pointer flex items-center gap-1 text-[13px] ${
                      isSimulated
                        ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                        : 'bg-[#f7f9fa] hover:bg-[#eaedef] text-[#424242] border border-[#e0e0e0]'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{isSimulated ? '시뮬레이터 적용됨' : '시뮬레이터 적용'}</span>
                  </button>

                  {/* Direct Cover Letter Creation */}
                  {isRecruitment && (
                    <button
                      type="button"
                      onClick={() => handleApplyToCoverLetter(item)}
                      className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-[0.98] text-[13px]"
                    >
                      <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>AI 자소서 즉시 작성</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= JOB POSTING DETAIL MODAL ================= */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[4px] max-w-2xl w-full my-8 p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-5 text-[13px]">
            <div className="flex items-start justify-between pb-3.5 border-b border-[#eaedef]">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-mono mb-1">
                  <span className="font-bold text-[#00a1ff] bg-[#ddf3ff]/60 px-2 py-0.5 rounded-[3px] border border-[#b9e5fe]">
                    {selectedJobDetail.categoryLabel}
                  </span>
                  {selectedJobDetail.employmentType && (
                    <span className="bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] text-[11px] font-bold">
                      {selectedJobDetail.employmentType}
                    </span>
                  )}
                  <span>·</span>
                  <span className="font-semibold text-[#2f3438]">{selectedJobDetail.organization}</span>
                </div>
                <h2 className="text-lg font-bold text-[#2f3438] tracking-tight">
                  {selectedJobDetail.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="p-1.5 text-[#828c94] hover:text-[#2f3438] hover:bg-[#f7f9fa] rounded-[4px] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Key Value Grid */}
            <div className="grid grid-cols-2 gap-3 bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef]">
              <div>
                <div className="text-[11px] text-[#828c94] font-mono">채용 직무</div>
                <div className="font-bold text-[#2f3438] text-[13px] mt-0.5">{selectedJobDetail.targetRole}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#828c94] font-mono">접수 마감일</div>
                <div className="font-bold text-[#00a1ff] text-[13px] mt-0.5 font-mono">
                  {selectedJobDetail.deadline} (D-{selectedJobDetail.dDay})
                </div>
              </div>
              {selectedJobDetail.contractDuration && (
                <div>
                  <div className="text-[11px] text-[#828c94] font-mono">근무 형태 및 기간</div>
                  <div className="font-medium text-[#2f3438] text-[13px] mt-0.5">{selectedJobDetail.contractDuration}</div>
                </div>
              )}
              {selectedJobDetail.compensation && (
                <div>
                  <div className="text-[11px] text-[#828c94] font-mono">급여 및 보상</div>
                  <div className="font-medium text-[#2f3438] text-[13px] mt-0.5">{selectedJobDetail.compensation}</div>
                </div>
              )}
              {selectedJobDetail.workLocation && (
                <div className="col-span-2">
                  <div className="text-[11px] text-[#828c94] font-mono">근무 위치</div>
                  <div className="font-medium text-[#2f3438] text-[13px] mt-0.5">{selectedJobDetail.workLocation}</div>
                </div>
              )}
            </div>

            {/* Requirements & Benefits */}
            {selectedJobDetail.requirements && (
              <div>
                <h4 className="font-bold text-[#2f3438] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00a1ff]" />
                  지원 자격 및 필요 역량
                </h4>
                <ul className="space-y-1.5 bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef] text-[#424242]">
                  {selectedJobDetail.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#00a1ff]">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedJobDetail.benefits && (
              <div>
                <h4 className="font-bold text-[#2f3438] mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#00a1ff]" />
                  주요 복리후생 및 혜택
                </h4>
                <ul className="space-y-1.5 bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef] text-[#424242]">
                  {selectedJobDetail.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#00a1ff]">•</span>
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Custom Analysis for this user */}
            <div className="bg-[#f0f9ff] border border-[#b9e5fe] p-4 rounded-[4px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13px] text-[#00a1ff] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  김민서 님 맞춤 합격 전략 가이드
                </span>
                <span className="font-mono text-[11px] bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] font-bold">
                  매칭 점수 {selectedJobDetail.matchScore}%
                </span>
              </div>
              <p className="text-[#2f3438] text-[12px] leading-relaxed">
                {selectedJobDetail.recommendationReason}
              </p>
              <div className="text-[12px] text-[#00a1ff] pt-1 border-t border-[#b9e5fe]/60 font-medium">
                💡 {selectedJobDetail.targetGapSolved}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3.5 border-t border-[#eaedef]">
              <button
                type="button"
                onClick={() => setSelectedJobDetail(null)}
                className="px-4 py-2 text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] cursor-pointer"
              >
                닫기
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleSimulation(selectedJobDetail.id);
                    setSelectedJobDetail(null);
                  }}
                  className="px-3.5 py-2 bg-[#f7f9fa] hover:bg-[#eaedef] text-[#2f3438] border border-[#e0e0e0] font-medium rounded-[4px] cursor-pointer"
                >
                  시뮬레이터에 담기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJobDetail(null);
                    handleApplyToCoverLetter(selectedJobDetail);
                  }}
                  className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold rounded-[4px] cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>AI 자기소개서 작성으로 이동</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
