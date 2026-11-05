import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import {
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  GitBranch,
  Copy,
  Check
} from 'lucide-react';

export const AnalysisView: React.FC = () => {
  const {
    profile,
    experiences,
    jobPostings,
    addJobPosting,
    competencyAnalysis,
    isAnalyzing,
    runAnalysis,
  } = useCareer();

  const [activeSection, setActiveSection] = useState<'fit' | 'gap' | 'rediscovery' | 'transform' | 'graph'>('fit');

  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-12-01');

  const [selectedExpId, setSelectedExpId] = useState<string>(experiences[0]?.id || '');
  const [transformResult, setTransformResult] = useState<any>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleAddJobPostingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;
    addJobPosting({
      company: newCompany.trim(),
      title: `${newRole.trim()} 채용 공고`,
      role: newRole.trim(),
      requiredSkills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      preferredSkills: ['유관 프로젝트 경험', '협업 툴 사용 역량'],
      responsibilities: '핵심 서비스 기능 구현 및 데이터베이스 파이프라인 관리',
      deadline: newDeadline,
    });
    setNewCompany('');
    setNewRole('');
    setNewSkills('');
    setShowAddJobModal(false);
  };

  const handleTransformExperience = async () => {
    const exp = experiences.find((e) => e.id === selectedExpId);
    if (!exp) return;
    setIsTransforming(true);
    try {
      const res = await fetch('/api/ai/transform-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience: exp,
          targetJob: profile.targetJobs[0] || '소프트웨어 엔지니어',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTransformResult(data.data);
      }
    } catch (err) {
      console.error('Transform error:', err);
    } finally {
      setIsTransforming(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Re-analyze CTA */}
      <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] font-bold">
              AI CAREER DIAGNOSTIC
            </span>
            <span className="text-[12px] text-[#828c94] font-mono">
              최종 분석: {competencyAnalysis.analyzedAt || '방금 전'}
            </span>
            {competencyAnalysis.isLiveAI && (
              <span className="text-[11px] bg-[#ddf3ff]/60 text-[#00a1ff] px-2 py-0.5 rounded-[3px] font-semibold border border-[#b9e5fe]">
                Gemini 3.8 Flash 연동
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2f3438] tracking-tight">
            목표 직무 역량 분석 및 취업 경쟁력 진단
          </h1>
          <p className="text-[13px] text-[#424242] mt-0.5">
            등록된 학업, 교내외 활동, 아르바이트 데이터를 기반으로 직무 적합도와 역량 공백을 진단합니다.
          </p>
        </div>

        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00a1ff] hover:bg-[#0497ef] disabled:bg-[#d4d8dc] text-white text-[13px] font-bold rounded-[4px] transition-all cursor-pointer shrink-0 shadow-xs active:scale-[0.98]"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'AI 심층 분석 중...' : '최신 데이터로 재분석'}
        </button>
      </div>

      {/* Target Jobs & Postings Ribbon */}
      <div className="bg-white border border-[#e0e0e0] rounded-[4px] p-5 space-y-3.5 text-[13px] shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#00a1ff]" />
            <span className="font-bold text-[#2f3438]">목표 설정 및 관심 채용 공고</span>
          </div>
          <button
            onClick={() => setShowAddJobModal(true)}
            className="text-[13px] text-[#00a1ff] hover:underline font-bold cursor-pointer"
          >
            + 새 채용 공고 등록
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {jobPostings.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef] hover:border-[#00a1ff] transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-bold text-[#2f3438]">{job.company}</span>
                <span className="text-[#00a1ff] font-mono text-[11px] bg-[#ddf3ff]/60 px-2 py-0.5 rounded-[3px] font-semibold">
                  {job.deadline} 마감
                </span>
              </div>
              <div className="font-bold text-[#2f3438] truncate">{job.title}</div>
              <div className="text-[12px] text-[#828c94] line-clamp-1">{job.responsibilities}</div>
              <div className="flex flex-wrap gap-1 pt-1 font-mono text-[11px]">
                {job.requiredSkills.slice(0, 3).map((sk) => (
                  <span key={sk} className="bg-white text-[#424242] border border-[#e0e0e0] px-2 py-0.5 rounded-[3px]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs for Analysis */}
      <div className="flex items-center gap-1.5 border-b border-[#eaedef] pb-3 overflow-x-auto text-[13px] font-medium">
        {[
          { id: 'fit', label: '1. 직무 적합도 분석', icon: CheckCircle2 },
          { id: 'gap', label: '2. 역량 공백 진단', icon: AlertTriangle },
          { id: 'rediscovery', label: '3. 경험 재발견 AI', icon: Lightbulb },
          { id: 'transform', label: '4. 경험 가치 변환 (STAR)', icon: Sparkles },
          { id: 'graph', label: '5. 경험 연결 성장 그래프', icon: GitBranch },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                  : 'text-[#424242] hover:text-[#00a1ff] hover:bg-white border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= SUBSECTION 1: FIT ANALYSIS ================= */}
      {activeSection === 'fit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] flex flex-col items-center justify-center text-center shadow-2xs">
              <div className="text-[12px] text-[#828c94] mb-1 font-medium">목표 직무 종합 적합도</div>
              <div className="text-5xl font-extrabold text-[#00a1ff] font-mono tabular-nums my-2">
                {competencyAnalysis.fitScore}%
              </div>
              <div className="text-[13px] font-bold text-[#2f3438]">
                상위 8% 수준의 높은 직무 일치도
              </div>
              <div className="text-[12px] text-[#828c94] mt-1">
                서류 합격 가능권 (우수)
              </div>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-3.5 text-[13px] shadow-2xs">
              <h3 className="text-base font-bold text-[#2f3438]">AI 종합 분석 총평</h3>
              <p className="text-[#424242] leading-relaxed">
                {competencyAnalysis.fitSummary}
              </p>
              <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef] space-y-1.5">
                <span className="font-bold text-[#2f3438]">전략적 실행 권장사항:</span>
                <ul className="list-disc list-inside text-[#424242] space-y-1 text-[12px]">
                  {competencyAnalysis.strategicActionPlan.map((plan, i) => (
                    <li key={i}>{plan}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-4 text-[13px] shadow-2xs">
            <h3 className="text-base font-bold text-[#2f3438] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00a1ff]" />
              경험으로 증명 가능한 보유 강점 역량
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {competencyAnalysis.strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[4px] border border-[#e0e0e0] bg-[#f7f9fa] hover:border-[#00a1ff] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2f3438] text-[13px]">{str.competency}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-[3px] bg-[#00a1ff] text-white font-mono">
                      {str.rating}
                    </span>
                  </div>
                  <p className="text-[#424242] text-[12px] leading-relaxed">
                    <span className="font-bold text-[#2f3438]">증빙 근거: </span>
                    {str.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBSECTION 2: GAP DIAGNOSIS ================= */}
      {activeSection === 'gap' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-3 text-[13px] shadow-2xs">
            <h3 className="text-base font-bold text-[#2f3438] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              목표 직무 요구 역량 대비 공백 (Gap) 진단
            </h3>
            <p className="text-[#828c94] text-[13px]">
              기업 채용 시 탈락 요인이 될 수 있는 부족 역량을 사전에 파악하고 보완 방향을 제시합니다.
            </p>

            <div className="space-y-3 pt-3">
              {competencyAnalysis.gaps.map((gap, i) => (
                <div
                  key={i}
                  className="p-4 rounded-[4px] border border-[#e0e0e0] bg-white hover:border-[#00a1ff] transition-all space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2f3438] text-[13px]">{gap.competency}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-[3px] bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                      {gap.status}
                    </span>
                  </div>
                  <div className="text-[#424242] text-[12px] leading-relaxed bg-[#f7f9fa] p-3 rounded-[4px] border border-[#eaedef]">
                    <span className="font-bold text-[#00a1ff]">💡 AI 보완 가이드: </span>
                    {gap.advice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBSECTION 3: REDISCOVERY AI ================= */}
      {activeSection === 'rediscovery' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-4 text-[13px] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[4px] bg-[#ddf3ff]/60 text-[#00a1ff] flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2f3438]">경험 재발견 AI (Hidden Value Finder)</h3>
                <p className="text-[#828c94] text-[12px]">
                  단순 아르바이트나 학과 활동 속에 숨어있던 위기 대응, 프로세스 혁신 등 핵심 직무 역량을 AI가 찾아냅니다.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {competencyAnalysis.rediscoveredValues.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef] space-y-2.5 text-[13px]"
                >
                  <div className="text-[12px] font-medium text-[#828c94]">
                    원천 경험: <span className="text-[#2f3438] font-bold">{val.sourceExperience}</span>
                  </div>
                  <div className="font-bold text-[#00a1ff] text-[13px] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#00a1ff]" />
                    재발견된 직무 역량: {val.discoveredCompetency}
                  </div>
                  <div className="bg-white p-3.5 rounded-[4px] border border-[#e0e0e0] text-[#2f3438] leading-relaxed text-[12px]">
                    <span className="font-bold text-[#2f3438]">자기소개서 즉시 활용 예시: </span>
                    "{val.resumeBullet}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBSECTION 4: EXPERIENCE VALUE TRANSFORMATION (STAR) ================= */}
      {activeSection === 'transform' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-4 text-[13px] shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-[#2f3438] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00a1ff]" />
                일상 경험 → 직무 가치 변환기 (STAR 프레임워크)
              </h3>
              <p className="text-[#828c94] text-[12px] mt-0.5">
                등록한 활동을 선택하면 실제 사실만을 근거로 직무 중심 STAR 구조화 및 면접 키워드로 변환합니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={selectedExpId}
                onChange={(e) => setSelectedExpId(e.target.value)}
                className="flex-1 px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] bg-white text-[13px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
              >
                {experiences.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    [{exp.subCategory || exp.category}] {exp.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleTransformExperience}
                disabled={isTransforming}
                className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] disabled:bg-[#d4d8dc] text-white font-bold text-[13px] rounded-[4px] transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isTransforming ? 'STAR 직무 언어로 변환 중...' : '직무 가치 변환 실행'}
              </button>
            </div>

            {transformResult && (
              <div className="space-y-4 pt-3 border-t border-[#eaedef]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef]">
                    <span className="font-bold text-[#00a1ff] text-[12px] font-mono">Situation (상황)</span>
                    <p className="text-[#424242] mt-1 text-[12px] leading-relaxed">
                      {transformResult.star.situation}
                    </p>
                  </div>
                  <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef]">
                    <span className="font-bold text-[#00a1ff] text-[12px] font-mono">Task (과업 및 문제)</span>
                    <p className="text-[#424242] mt-1 text-[12px] leading-relaxed">
                      {transformResult.star.task}
                    </p>
                  </div>
                  <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef]">
                    <span className="font-bold text-[#00a1ff] text-[12px] font-mono">Action (주도적 조치)</span>
                    <p className="text-[#424242] mt-1 text-[12px] leading-relaxed">
                      {transformResult.star.action}
                    </p>
                  </div>
                  <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef]">
                    <span className="font-bold text-[#00a1ff] text-[12px] font-mono">Result (성과 및 배운점)</span>
                    <p className="text-[#424242] mt-1 text-[12px] leading-relaxed">
                      {transformResult.star.result}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-[#2f3438] text-[13px]">✍️ 자기소개서 추천 활용 문장</div>
                  {transformResult.coverLetterPhrases.map((phrase: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-[#f7f9fa] rounded-[4px] border border-[#eaedef] text-[#2f3438] text-[12px]"
                    >
                      <span className="italic pr-2 leading-relaxed">{phrase}</span>
                      <button
                        onClick={() => copyToClipboard(phrase, `phrase-${idx}`)}
                        className="p-1.5 text-[#828c94] hover:text-[#00a1ff] cursor-pointer shrink-0 transition-colors"
                        title="복사"
                      >
                        {copiedKey === `phrase-${idx}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-[#2f3438] text-[13px]">🎙️ 면접관 꼬리 질문 대비 키포인트</div>
                  {transformResult.interviewTalkingPoints.map((point: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#f7f9fa] rounded-[4px] border border-[#eaedef] text-[#424242] text-[12px]"
                    >
                      • {point}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SUBSECTION 5: EXPERIENCE CONNECTION GRAPH ================= */}
      {activeSection === 'graph' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-4 text-[13px] shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-[#2f3438] flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#00a1ff]" />
                경험 연결 및 성장 스토리라인 그래프
              </h3>
              <p className="text-[#828c94] text-[12px] mt-0.5">
                학부 전공 수업에서 시작하여 팀 프로젝트, 해커톤, 스타트업 인턴십으로 이어진 성장의 궤적을 확인하세요.
              </p>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#ddf3ff]">
              {[
                {
                  step: '01. 전공 학업 기본기 확립 (2023~2024)',
                  title: '자료구조, 알고리즘, 데이터베이스 A+ 이수',
                  desc: '컴퓨터공학 핵심 기초 전공을 고학점으로 이수하며 CS 이론 및 SQL 모델링 기본기 완성.',
                  skills: ['자료구조', '알고리즘', 'DB응용', 'GPA 4.18'],
                  type: '학업',
                },
                {
                  step: '02. 실전 동시성 제어 캡스톤 프로젝트 (2025.03~2025.06)',
                  title: '캠퍼스 실시간 좌석 예약 시스템 구축',
                  desc: '수강신청 트랜잭션 병목 문제를 해결하기 위해 Redis 분산 락(Redisson)을 도입하여 응답 속도 86% 개선.',
                  skills: ['Spring Boot', 'Redis', '분산 락', '동시성 제어'],
                  type: '교내 프로젝트',
                },
                {
                  step: '03. 생성형 AI 금융 해커톤 우수상 수상 (2025.07)',
                  title: '전국 대학생 핀테크 해커톤 2위 입상',
                  desc: '36시간 제한 조건 속에서 비동기 데이터 파이프라인과 RAG 파이프라인을 구축하여 소상공인 현금 흐름 예측 어시스턴트 개발.',
                  skills: ['FastAPI', 'RAG', '데이터 파이프라인', '해커톤 수상'],
                  type: '교외 대회',
                },
                {
                  step: '04. 프로덕션 환경 스타트업 하계 인턴 (2025.07~2025.08)',
                  title: '페이밸류 데이터 플랫폼팀 2개월 풀타임',
                  desc: '실제 일일 100만 건 결제 로그 ETL 파이프라인 모니터링 및 결측치 감지 자동화로 장애 다운타임 70% 감축.',
                  skills: ['Python', 'ETL 파이프라인', '로그 모니터링', '스타트업 실무'],
                  type: '실무 인턴십',
                },
                {
                  step: '05. 현장 최적화 아르바이트 역량 전이 (2024.03~2024.11)',
                  title: '대형 카페 피크타임 동선 1-Way 분업화',
                  desc: '현장 주문 병목 데이터를 관찰하여 출고 대기시간 18분 -> 7분 단축 및 컴플레인 0건 달성.',
                  skills: ['프로세스 최적화', '데이터 기반 사고', '고객 소통'],
                  type: '아르바이트',
                },
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-[#00a1ff] border-2 border-white shadow-xs" />
                  <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef] group-hover:border-[#00a1ff] transition-all space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#00a1ff] font-mono">{item.step}</span>
                      <span className="text-[#828c94] font-medium">{item.type}</span>
                    </div>
                    <div className="text-[14px] font-bold text-[#2f3438]">{item.title}</div>
                    <p className="text-[#424242] text-[12px] leading-relaxed">{item.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                      {item.skills.map((s) => (
                        <span key={s} className="bg-white border border-[#e0e0e0] text-[#424242] px-2 py-0.5 rounded-[3px] text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Job Posting Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] max-w-md w-full p-6 shadow-xl border border-[#e0e0e0] text-[13px] space-y-4">
            <h3 className="font-bold text-base text-[#2f3438]">새 목표 채용 공고 등록</h3>
            <form onSubmit={handleAddJobPostingSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[#828c94] font-medium mb-1">기업명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 삼성전자, 현대자동차, 카카오"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[#828c94] font-medium mb-1">모집 직무</label>
                <input
                  type="text"
                  required
                  placeholder="예: S/W 개발, 서버 개발자"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[#828c94] font-medium mb-1">필수 요구 기술 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="예: C/C++, Java, Spring Boot, MySQL"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[#828c94] font-medium mb-1">서류 마감일</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] font-mono focus:border-[#00a1ff] focus:outline-hidden"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-3.5 py-2 text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold rounded-[4px] cursor-pointer shadow-xs"
                >
                  공고 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
