import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { PassedCoverLetter, CalendarEvent } from '../../types/career';
import {
  DollarSign,
  Mic,
  Calendar as CalendarIcon,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Building2,
  FileText,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';

export const JobPrepView: React.FC = () => {
  const {
    passedLetters,
    userRewardCredits,
    registerPassedLetter,
    viewPassedLetter,
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    jobPostings,
    coverLetters,
    evidenceFiles,
    experiences,
    profile,
  } = useCareer();

  // Sub-tabs: 'interview' | 'calendar' | 'archive' | 'revenue'
  const [activeTab, setActiveTab] = useState<'interview' | 'calendar' | 'archive' | 'revenue'>('interview');

  // Archive search & view
  const [archiveSearch, setArchiveSearch] = useState('');
  const [readingLetter, setReadingLetter] = useState<PassedCoverLetter | null>(null);

  // Revenue share register modal
  const [showRegisterPassModal, setShowRegisterPassModal] = useState(false);
  const [regCompany, setRegCompany] = useState('삼성전자 (DX부문)');
  const [regRole, setRegRole] = useState('S/W 개발');
  const [regYear, setRegYear] = useState('2025 상반기 최종 합격');
  const [regQuestion, setRegQuestion] = useState('가장 몰입했던 기술적 난관과 해결 과정');
  const [regTitle, setRegTitle] = useState('[On-Device AI 경량화와 동시성 제어]');
  const [regContent, setRegContent] = useState('');

  const filteredArchive = passedLetters.filter(
    (l: PassedCoverLetter) =>
      archiveSearch.trim() === '' ||
      l.company.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      l.title.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      l.tags.some((t) => t.toLowerCase().includes(archiveSearch.toLowerCase()))
  );

  const handleRegisterPassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regCompany.trim() || !regTitle.trim() || !regContent.trim()) return;
    registerPassedLetter({
      company: regCompany.trim(),
      role: regRole.trim(),
      year: regYear.trim(),
      question: regQuestion.trim(),
      title: regTitle.trim(),
      content: regContent.trim(),
      tags: [regRole.trim(), regCompany.trim(), '합격자소서'],
      authorName: `${profile.name}_합격자`,
    });
    setShowRegisterPassModal(false);
    setRegContent('');
  };

  // ================= AI MOCK INTERVIEW & COMPANY ANALYSIS STATE =================
  const [selectedJobId, setSelectedJobId] = useState<string>(
    jobPostings.find((j) => j.company.includes('삼성'))?.id || jobPostings[0]?.id || ''
  );
  const selectedJob = jobPostings.find((j) => j.id === selectedJobId) || jobPostings[0];

  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<string>(coverLetters[0]?.id || '');
  const selectedCoverLetter = coverLetters.find((c) => c.id === selectedCoverLetterId) || coverLetters[0];

  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    evidenceFiles.slice(0, 3).map((f) => f.id)
  );

  const [companyBriefing, setCompanyBriefing] = useState<any>(null);
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);
  const [copiedIntro, setCopiedIntro] = useState(false);

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([
    {
      id: 'q1',
      category: '삼성전자 사업 연계 & 직무 기술',
      question: '삼성전자 DX부문의 핵심 비전인 On-Device AI 및 대규모 SmartThings 연동 환경에서 지원자가 진행했던 분산 동시성 제어 캡스톤 프로젝트가 어떻게 기여할 수 있다고 생각하십니까?',
      intent: '삼성전자 기술 도메인 이해도 및 보유 기술의 실무 전이 가능성 평가',
      expectedPoints: ['Galaxy AI / SmartThings 도메인 이해', '본인 분산 락 프로젝트와의 기술적 연결', '대용량 디바이스 환경 대응 방안'],
    },
    {
      id: 'q2',
      category: '제출 서류(자소서/증빙) 심층 검증',
      question: '제출하신 자기소개서에 작성된 [Redis Redisson 분산 락] 도입 사례에서, 락 획득 타임아웃과 임차 시간(Lease Time) 설정 시 고려했던 트레이드오프는 무엇이었습니까?',
      intent: '제출 서류의 진위 여부 및 기술 깊이(Deep Dive) 검증',
      expectedPoints: ['단순 라이브러리 사용을 넘어선 내부 동작 이해', '장애 상황 시 데드락 방지 조치', '정량적 성능 지표 제시'],
    },
    {
      id: 'q3',
      category: '기업 인재상 & 현장 문제 해결',
      question: '아르바이트 및 스타트업 인턴 과정에서 기존 관행을 개선하고자 할 때 팀원의 반대에 부딪혔던 경험과, 이를 데이터로 설득했던 과정을 말씀해주세요.',
      intent: '조직 내 갈등 관리 및 능동적인 소통 태도 확인',
      expectedPoints: ['데이터 기반의 설득 논리', '동료들의 피로도와 입장 경청', '최종 성과 달성'],
    },
  ]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  // ================= REAL MONTHLY CALENDAR STATE =================
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // November 2026
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-11-25');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(selectedCalendarDate);
  const [eventCat, setEventCat] = useState<CalendarEvent['category']>('internship');

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleTodayMonth = () => {
    setCurrentYear(2026);
    setCurrentMonth(10);
    setSelectedCalendarDate('2026-11-25');
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const getEventsForDate = (dateStr: string) => calendarEvents.filter((ev) => ev.date === dateStr);
  const selectedDateEvents = calendarEvents.filter((ev) => ev.date === selectedCalendarDate);

  const toggleEvidenceSelect = (id: string) => {
    setSelectedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1. Fetch Company Briefing
  const handleFetchCompanyBriefing = async () => {
    setIsLoadingBriefing(true);
    const chosenEvidenceTitles = evidenceFiles
      .filter((f) => selectedEvidenceIds.includes(f.id))
      .map((f) => f.title);

    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'company-briefing',
          companyName: selectedJob?.company || '삼성전자 (DX부문)',
          jobTitle: selectedJob?.title || 'S/W 개발',
          submittedCoverLetter: selectedCoverLetter ? {
            title: selectedCoverLetter.title,
            content: selectedCoverLetter.content.slice(0, 500),
          } : null,
          submittedEvidenceTitles: chosenEvidenceTitles,
          experienceContext: experiences,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCompanyBriefing(data.data);
      }
    } catch (err) {
      console.error('Company briefing error:', err);
    } finally {
      setIsLoadingBriefing(false);
    }
  };

  // 2. Generate Tailored Questions
  const handleGenerateQuestions = async () => {
    setIsGeneratingQuestions(true);
    const chosenEvidenceTitles = evidenceFiles
      .filter((f) => selectedEvidenceIds.includes(f.id))
      .map((f) => f.title);

    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'generate-questions',
          companyName: selectedJob?.company || '삼성전자 (DX부문)',
          jobTitle: selectedJob?.title || 'S/W 개발',
          submittedCoverLetter: selectedCoverLetter,
          submittedEvidenceTitles: chosenEvidenceTitles,
          experienceContext: experiences,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.questions) {
        setInterviewQuestions(data.data.questions);
        setActiveQuestionIdx(0);
        setEvalResult(null);
      }
    } catch (err) {
      console.error('Questions generation error:', err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // 3. Download Company Analysis Briefing Note as PDF / Printable Document
  const handleDownloadBriefingPdf = () => {
    if (!companyBriefing) return;
    const company = companyBriefing.company || selectedJob?.company;
    const role = companyBriefing.role || selectedJob?.title;

    const reportContent = `================================================================================
[CareerLog 공식 면접 전 필수 열람 리포트]
${company} ${role} 기업 분석 & 직무 면접 브리핑 노트
수험자: ${profile.name} (${profile.university} ${profile.department})
생성일자: ${new Date().toISOString().split('T')[0]}
================================================================================

1. 기업 개요 및 시장 포지션
${companyBriefing.industryOverview}

2. 최신 주력 기술 트렌드 및 핵심 사업
${companyBriefing.recentTechTrends?.map((t: string, i: number) => `  [${i + 1}] ${t}`).join('\n')}

3. 핵심 인재상 & 컬처핏 키워드
${companyBriefing.coreTalentPhilosophy?.map((p: string, i: number) => `  • ${p}`).join('\n')}

4. 제출 서류(자소서/증빙자료) 기반 예상 공격 질문 & 방어 전략
${companyBriefing.documentBasedAttackPoints?.map((pt: any, i: number) => 
  `  [공격 포인트 0${i + 1} - ${pt.targetSection}]\n   - 예상 질문: ${pt.expectedAttackQuestion}\n   - 모범 방어 전략: ${pt.defenseStrategy}\n`
).join('\n')}

5. 맞춤형 1분 자기소개 스크립트
${companyBriefing.recommendedOneMinuteIntro}

6. 면접 마지막 추천 역질문 리스트
${companyBriefing.recommendedFinalQuestions?.map((q: string, i: number) => `  (${i + 1}) ${q}`).join('\n')}

================================================================================
CareerLog AI 커리어 플랫폼에 의해 생성된 공식 보안 문서입니다.
================================================================================
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${company.replace(/\s+/g, '_')}_기업분석_및_직무면접_브리핑노트.txt`;
    a.click();
    URL.revokeObjectURL(url);
    alert(`[${company}] 면접 전 필수 열람 기업 분석 브리핑 파일이 다운로드되었습니다.`);
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswerText.trim()) return;
    setIsEvaluating(true);
    const currQ = interviewQuestions[activeQuestionIdx];
    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'evaluate-answer',
          companyName: selectedJob?.company,
          jobTitle: selectedJob?.title,
          question: currQ.question,
          userAnswer: userAnswerText,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEvalResult(data.data);
      }
    } catch (err) {
      console.error('Interview evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCreateCalendarEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    const today = new Date('2026-11-04');
    const target = new Date(eventDate);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    addCalendarEvent({
      title: eventTitle.trim(),
      date: eventDate,
      category: eventCat,
      dDay: Math.max(0, diffDays),
    });
    setEventTitle('');
    setShowAddEvent(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header - Ohouse White Canvas */}
      <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] font-bold">
              JOB PREPARATION & AI INTERVIEW
            </span>
            <span className="text-[12px] text-[#828c94]">공고 선택 · 제출 서류 연계 · 기업 분석 PDF · AI 모의 면접</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2f3438] tracking-tight">
            AI 실전 모의 면접 & 기업 분석 브리핑
          </h1>
          <p className="text-[13px] text-[#424242] mt-0.5">
            지원할 공고와 제출한 자소서/증빙자료를 직접 연동하여, 기업별 맞춤 질문과 면접 전 필수 브리핑 노트를 제공합니다.
          </p>
        </div>

        {/* Revenue Points Box */}
        <div className="bg-[#f7f9fa] border border-[#e0e0e0] p-3.5 rounded-[4px] flex items-center gap-3.5 shrink-0">
          <div className="w-9 h-9 rounded-[4px] bg-[#00a1ff] text-white flex items-center justify-center font-bold shadow-xs">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#828c94]">기여 수익 정산 포인트</div>
            <div className="text-base font-bold text-[#00a1ff] tabular-nums font-mono">
              {userRewardCredits.toLocaleString()} P
            </div>
          </div>
          <button
            onClick={() => setActiveTab('revenue')}
            className="px-3 py-1.5 text-[12px] bg-white hover:bg-[#eaedef] text-[#2f3438] border border-[#e0e0e0] rounded-[4px] font-bold cursor-pointer ml-1 transition-colors"
          >
            정산 관리
          </button>
        </div>
      </div>

      {/* Sub Menu Tabs - Ohouse segment control */}
      <div className="flex items-center gap-1.5 border-b border-[#eaedef] pb-3 overflow-x-auto text-[13px] font-medium">
        {[
          { id: 'interview', label: '1. AI 모의 면접 & 기업 분석', icon: Mic },
          { id: 'calendar', label: `2. 취업 일정 캘린더 (${calendarEvents.length})`, icon: CalendarIcon },
          { id: 'archive', label: '3. 합격 사례 아카이브', icon: ShieldCheck },
          { id: 'revenue', label: '4. 합격자 수익 배분 정산', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* ================= 1. AI MOCK INTERVIEW WITH COMPANY SELECTION & SUBMITTED DOCUMENTS ================= */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          
          {/* STEP 1: TARGET JOB & SUBMITTED MATERIALS DUAL CONTEXT PANEL */}
          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-4 text-[13px] shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eaedef] pb-3.5">
              <div>
                <span className="text-[11px] font-mono font-bold bg-[#ddf3ff]/60 text-[#00a1ff] px-2 py-0.5 rounded-[3px] border border-[#b9e5fe]">
                  INTERVIEW CONTEXT SETUP
                </span>
                <h3 className="font-bold text-base text-[#2f3438] mt-1">
                  면접 대상 공고 및 제출 서류(자소서·증빙) 선택
                </h3>
              </div>
              <p className="text-[12px] text-[#828c94]">
                선택한 회사 도메인과 제출 서류 내용을 AI 면접관이 함께 검증합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left: Job Posting Selector */}
              <div className="space-y-2">
                <label className="block font-bold text-[#2f3438] flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#00a1ff]" />
                    지원 공고 선택 (회사/직무)
                  </span>
                  <span className="text-[11px] text-[#828c94] font-mono">
                    마감: {selectedJob?.deadline}
                  </span>
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-[4px] bg-white text-[13px] font-bold text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                >
                  {jobPostings.map((job) => (
                    <option key={job.id} value={job.id}>
                      [{job.company}] {job.title}
                    </option>
                  ))}
                </select>

                {selectedJob && (
                  <div className="p-3.5 bg-[#f7f9fa] rounded-[4px] border border-[#eaedef] space-y-1.5 text-[12px]">
                    <div className="font-bold text-[#2f3438]">{selectedJob.company} - {selectedJob.role}</div>
                    <div className="text-[#424242] line-clamp-2 leading-relaxed">{selectedJob.responsibilities}</div>
                    <div className="flex flex-wrap gap-1 pt-1 font-mono text-[11px]">
                      {selectedJob.requiredSkills.map((sk) => (
                        <span key={sk} className="bg-white border border-[#e0e0e0] px-2 py-0.5 rounded-[3px] text-[#424242]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Submitted Cover Letter & Evidence Vault Context */}
              <div className="space-y-2">
                <label className="block font-bold text-[#2f3438] flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#00a1ff]" />
                    제출한 자기소개서 선택
                  </span>
                  <span className="text-[11px] text-[#00a1ff] font-medium">보관함 자소서 연계</span>
                </label>
                <select
                  value={selectedCoverLetterId}
                  onChange={(e) => setSelectedCoverLetterId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-[4px] bg-white text-[13px] font-medium text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                >
                  {coverLetters.map((cl) => (
                    <option key={cl.id} value={cl.id}>
                      [{cl.companyName}] {cl.title}
                    </option>
                  ))}
                </select>

                {/* Submitted Evidence Selector */}
                <div className="pt-1">
                  <div className="text-[12px] font-bold text-[#2f3438] mb-1.5 flex items-center justify-between">
                    <span>함께 제출한 증빙 및 포트폴리오 ({selectedEvidenceIds.length}개 선택)</span>
                    <span className="text-[11px] text-[#828c94]">상장, 성적표 등</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-[#f7f9fa] border border-[#eaedef] rounded-[4px]">
                    {evidenceFiles.map((ev) => {
                      const isChecked = selectedEvidenceIds.includes(ev.id);
                      return (
                        <button
                          type="button"
                          key={ev.id}
                          onClick={() => toggleEvidenceSelect(ev.id)}
                          className={`px-2.5 py-1 rounded-[3px] text-[11px] transition-colors cursor-pointer border ${
                            isChecked
                              ? 'bg-[#00a1ff] text-white border-[#00a1ff] font-bold'
                              : 'bg-white text-[#424242] border-[#e0e0e0] hover:bg-[#f7f9fa]'
                          }`}
                        >
                          {isChecked ? '✓ ' : '+ '}{ev.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Context Action Bar */}
            <div className="pt-3.5 border-t border-[#eaedef] flex flex-wrap items-center justify-between gap-2">
              <div className="text-[12px] text-[#828c94]">
                💡 <span className="font-bold text-[#00a1ff]">[{selectedJob?.company}]</span>에 맞춘 기업 분석 및 서류 검증 면접을 생성합니다.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFetchCompanyBriefing}
                  disabled={isLoadingBriefing}
                  className="px-3.5 py-2 border border-[#e0e0e0] hover:bg-[#f7f9fa] text-[#2f3438] font-bold text-[13px] rounded-[4px] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#00a1ff]" />
                  {isLoadingBriefing ? '회사 정보 분석 중...' : '회사 분석 브리핑 생성'}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateQuestions}
                  disabled={isGeneratingQuestions}
                  className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold text-[13px] rounded-[4px] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isGeneratingQuestions ? '맞춤 질문 도출 중...' : '공고 & 서류 맞춤 면접 질문 생성'}
                </button>
              </div>
            </div>
          </div>

          {/* STEP 2: COMPANY ANALYSIS & BRIEFING NOTE (PDF DOWNLOAD FEATURE) */}
          {companyBriefing && (
            <div className="bg-white p-6 rounded-[4px] border border-[#00a1ff] space-y-4 text-[13px] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eaedef] pb-3.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px]">
                      OFFICIAL BRIEFING NOTE
                    </span>
                    <span className="text-[12px] text-[#00a1ff] font-mono font-bold">면접 전 필수 열람</span>
                  </div>
                  <h3 className="font-bold text-lg text-[#2f3438]">
                    [{companyBriefing.company}] 기업 심층 분석 & 직무 면접 브리핑 리포트
                  </h3>
                </div>

                {/* PDF Download Button */}
                <button
                  onClick={handleDownloadBriefingPdf}
                  className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold text-[13px] rounded-[4px] transition-all cursor-pointer flex items-center gap-2 shadow-xs shrink-0 active:scale-[0.98]"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>브리핑 리포트 PDF 다운로드</span>
                </button>
              </div>

              {/* 1. Industry & Company Overview */}
              <div className="p-4 bg-[#f7f9fa] rounded-[4px] border border-[#eaedef] space-y-1">
                <span className="font-bold text-[#2f3438] text-[13px]">1. 기업 개요 및 최신 시장 포지션</span>
                <p className="text-[#424242] leading-relaxed text-[12px]">{companyBriefing.industryOverview}</p>
              </div>

              {/* 2. Recent Tech Trends & Core Talent Philosophy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[12px]">
                <div className="p-4 bg-[#f7f9fa] rounded-[4px] border border-[#eaedef] space-y-2">
                  <span className="font-bold text-[#2f3438] text-[13px]">2. 최근 핵심 사업 및 기술 트렌드</span>
                  <ul className="space-y-1.5 text-[#424242]">
                    {companyBriefing.recentTechTrends?.map((trend: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-mono text-[#00a1ff] font-bold">0{i + 1}.</span>
                        <span className="leading-snug">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#f7f9fa] rounded-[4px] border border-[#eaedef] space-y-2">
                  <span className="font-bold text-[#2f3438] text-[13px]">3. 기업 인재상 & 컬처핏 키워드</span>
                  <ul className="space-y-1.5 text-[#424242]">
                    {companyBriefing.coreTalentPhilosophy?.map((phil: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#00a1ff] font-bold">•</span>
                        <span className="leading-snug">{phil}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3. Document Based Attack Points */}
              <div className="p-4 bg-[#f7f9fa] rounded-[4px] border border-[#eaedef] space-y-2.5 text-[12px]">
                <span className="font-bold text-[#2f3438] text-[13px] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#00a1ff]" />
                  4. 제출 서류 기반 면접관 예상 공격 질문 & 모범 방어 전략
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {companyBriefing.documentBasedAttackPoints?.map((pt: any, idx: number) => (
                    <div key={idx} className="bg-white p-3.5 rounded-[4px] border border-[#e0e0e0] space-y-2 shadow-2xs">
                      <div className="font-bold text-[#00a1ff] text-[11px] font-mono">
                        [타깃 검증: {pt.targetSection}]
                      </div>
                      <div className="font-bold text-[#2f3438] text-[13px] leading-snug">
                        Q: "{pt.expectedAttackQuestion}"
                      </div>
                      <div className="text-[#424242] bg-[#f7f9fa] p-2.5 rounded-[3px] text-[12px] leading-relaxed border border-[#eaedef]">
                        <span className="font-bold text-[#2f3438]">🛡️ 방어 전략: </span>
                        {pt.defenseStrategy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. One Minute Intro & Recommended Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[12px]">
                <div className="p-4 bg-[#f7f9fa] rounded-[4px] border border-[#eaedef] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2f3438] text-[13px]">5. 맞춤형 1분 자기소개 스크립트</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(companyBriefing.recommendedOneMinuteIntro);
                        setCopiedIntro(true);
                        setTimeout(() => setCopiedIntro(false), 2000);
                      }}
                      className="text-[#828c94] hover:text-[#00a1ff] flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copiedIntro ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIntro ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                  <p className="text-[#424242] italic leading-relaxed bg-white p-3 rounded-[4px] border border-[#e0e0e0]">
                    "{companyBriefing.recommendedOneMinuteIntro}"
                  </p>
                </div>

                <div className="p-4 bg-[#f7f9fa] rounded-[4px] border border-[#eaedef] space-y-2">
                  <span className="font-bold text-[#2f3438] text-[13px]">6. 면접관에게 던질 추천 역질문</span>
                  <div className="space-y-1.5 text-[#424242] bg-white p-3 rounded-[4px] border border-[#e0e0e0]">
                    {companyBriefing.recommendedFinalQuestions?.map((q: string, i: number) => (
                      <div key={i} className="flex items-start gap-1 leading-snug">
                        <span className="font-bold text-[#00a1ff]">({i + 1})</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: MOCK INTERVIEW QUESTION ROOM */}
          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-4 text-[13px] shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#2f3438] flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#00a1ff]" />
                  실전 AI 모의 면접 질의응답
                </h3>
                <p className="text-[#828c94] text-[12px] mt-0.5">
                  [{selectedJob?.company}] 실무 면접관 관점에서 질문이 생성되었습니다.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#ddf3ff]/60 text-[#00a1ff] border border-[#b9e5fe] rounded-[3px] font-bold text-[12px] font-mono">
                  {selectedJob?.company} · {selectedJob?.role}
                </span>
              </div>
            </div>

            {/* Questions Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {interviewQuestions.map((q, idx) => {
                const isActive = activeQuestionIdx === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setEvalResult(null);
                    }}
                    className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer text-[12px] ${
                      isActive
                        ? 'border-[#00a1ff] bg-[#f0f9ff] text-[#2f3438] font-bold shadow-2xs'
                        : 'border-[#e0e0e0] hover:bg-[#f7f9fa] text-[#424242]'
                    }`}
                  >
                    <div className={`text-[11px] mb-0.5 font-mono ${isActive ? 'text-[#00a1ff] font-bold' : 'text-[#828c94]'}`}>
                      질문 0{idx + 1}
                    </div>
                    <div className="line-clamp-2 text-[12px] leading-snug">{q.question}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Question Box */}
            <div className="bg-[#f0f9ff] border border-[#b9e5fe] text-[#2f3438] p-5 rounded-[4px] space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#00a1ff] font-mono font-bold">
                  [{interviewQuestions[activeQuestionIdx]?.category || '직무 질문'}]
                </span>
                <span className="text-[#828c94] text-[11px]">
                  의도: {interviewQuestions[activeQuestionIdx]?.intent}
                </span>
              </div>
              <p className="text-base font-bold leading-relaxed font-sans text-[#2f3438]">
                "{interviewQuestions[activeQuestionIdx]?.question}"
              </p>
              {interviewQuestions[activeQuestionIdx]?.expectedPoints && (
                <div className="pt-1 text-[11px] text-[#424242] flex flex-wrap gap-2">
                  <span className="font-bold text-[#00a1ff]">핵심 평가 기준:</span>
                  {interviewQuestions[activeQuestionIdx].expectedPoints.map((pt: string, i: number) => (
                    <span key={i} className="text-[#424242]">• {pt}</span>
                  ))}
                </div>
              )}
            </div>

            {/* User Answer Textarea */}
            <div className="space-y-2">
              <label className="block text-[#2f3438] font-bold text-[13px]">
                나의 답변 입력 (STAR 구조 및 {selectedJob?.company} 사업 연관성을 고려하여 작성하세요)
              </label>
              <textarea
                rows={5}
                value={userAnswerText}
                onChange={(e) => setUserAnswerText(e.target.value)}
                placeholder="예: 지원 회사인 삼성전자의 대규모 On-Device AI 및 스마트싱스 환경에서는... 당시 발생했던 동시성 문제는 Redis Redisson 분산 락을 통해 요청을 직렬화하여 해결했습니다..."
                className="w-full p-4 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:outline-hidden focus:border-[#00a1ff] leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating || !userAnswerText.trim()}
                  className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] disabled:bg-[#d4d8dc] text-white font-bold text-[13px] rounded-[4px] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isEvaluating ? '답변 분석 및 채점 중...' : '답변 제출 및 AI 심층 평가 받기'}
                </button>
              </div>
            </div>

            {/* Evaluation Result View */}
            {evalResult && (
              <div className="bg-[#f7f9fa] p-5 rounded-[4px] border border-[#eaedef] space-y-3.5 text-[13px] pt-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#eaedef]">
                  <span className="font-bold text-[#2f3438] text-base">AI 면접관 종합 피드백</span>
                  <div className="flex items-center gap-1 text-[#00a1ff] font-extrabold text-lg tabular-nums font-mono">
                    <span>답변 점수: {evalResult.score}점</span>
                    <span className="text-[12px] text-[#828c94] font-normal">/ 100점</span>
                  </div>
                </div>

                <p className="text-[#424242] leading-relaxed text-[12px]">
                  {evalResult.logicEvaluation}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                  <div className="bg-white p-3.5 rounded-[4px] border border-[#e0e0e0] space-y-1">
                    <span className="font-bold text-[#00a1ff]">👏 잘한 점:</span>
                    <ul className="list-disc list-inside text-[#424242] space-y-0.5">
                      {evalResult.strengths?.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3.5 rounded-[4px] border border-[#e0e0e0] space-y-1">
                    <span className="font-bold text-amber-600">⚡ 개선 방향:</span>
                    <ul className="list-disc list-inside text-[#424242] space-y-0.5">
                      {evalResult.improvements?.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {evalResult.followUpQuestion && (
                  <div className="bg-[#f0f9ff] border border-[#b9e5fe] text-[#2f3438] p-4 rounded-[4px] space-y-1 text-[12px]">
                    <div className="font-bold text-[#00a1ff]">🔥 날카로운 꼬리 질문 (Follow-up):</div>
                    <div className="leading-relaxed font-sans font-medium">"{evalResult.followUpQuestion}"</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 2. REAL MONTHLY CALENDAR ================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-[4px] border border-[#e0e0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 border border-[#e0e0e0] rounded-[4px] hover:bg-[#f7f9fa] text-[#424242] cursor-pointer"
                  title="이전 달"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-base text-[#2f3438] px-2 min-w-32 text-center font-mono">
                  {currentYear}년 {monthNames[currentMonth]}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 border border-[#e0e0e0] rounded-[4px] hover:bg-[#f7f9fa] text-[#424242] cursor-pointer"
                  title="다음 달"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleTodayMonth}
                className="px-3 py-1 text-[12px] border border-[#e0e0e0] rounded-[4px] hover:bg-[#f7f9fa] text-[#424242] cursor-pointer font-bold"
              >
                이번 달 (2026.11)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#828c94] text-[12px] hidden sm:inline">
                날짜를 클릭하면 해당 일자의 일정 등록 및 상세 내역을 확인할 수 있습니다.
              </span>
              <button
                onClick={() => {
                  setEventDate(selectedCalendarDate);
                  setShowAddEvent(true);
                }}
                className="px-3.5 py-1.5 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold text-[13px] rounded-[4px] cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                선택일에 새 일정 등록
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 bg-white rounded-[4px] border border-[#e0e0e0] overflow-hidden shadow-2xs">
              <div className="grid grid-cols-7 border-b border-[#eaedef] bg-[#f7f9fa] text-center text-[12px] font-bold text-[#828c94] py-3">
                <span className="text-red-500">일</span>
                <span>월</span>
                <span>화</span>
                <span>수</span>
                <span>목</span>
                <span>금</span>
                <span className="text-[#00a1ff]">토</span>
              </div>

              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#eaedef] bg-white">
                {Array.from({ length: firstDayWeekday }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-24 p-1.5 bg-[#f7f9fa]/40 text-[#828c94]" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const monthStr = String(currentMonth + 1).padStart(2, '0');
                  const dayStr = String(dayNum).padStart(2, '0');
                  const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
                  const dayEvents = getEventsForDate(dateStr);
                  const isSelected = selectedCalendarDate === dateStr;
                  const isToday = dateStr === '2026-11-04';
                  const weekday = (firstDayWeekday + idx) % 7;
                  const isSunday = weekday === 0;
                  const isSaturday = weekday === 6;

                  return (
                    <div
                      key={dateStr}
                      onClick={() => setSelectedCalendarDate(dateStr)}
                      className={`h-24 p-1.5 transition-colors cursor-pointer flex flex-col justify-between overflow-hidden relative ${
                        isSelected ? 'bg-[#f0f9ff] ring-2 ring-[#00a1ff] z-10' : 'hover:bg-[#f7f9fa]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                            isToday
                              ? 'bg-[#00a1ff] text-white'
                              : isSunday
                              ? 'text-red-500'
                              : isSaturday
                              ? 'text-[#00a1ff]'
                              : 'text-[#2f3438]'
                          }`}
                        >
                          {dayNum}
                        </span>

                        {dayEvents.length > 0 && (
                          <span className="text-[10px] bg-[#00a1ff] text-white px-1.5 py-0.2 rounded-full font-bold tabular-nums">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 overflow-hidden my-0.5 flex-1">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <div
                            key={ev.id}
                            className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold truncate ${
                              ev.category === 'internship'
                                ? 'bg-[#00a1ff] text-white'
                                : ev.category === 'exam'
                                ? 'bg-[#ddf3ff] text-[#00a1ff] border border-[#b9e5fe]'
                                : 'bg-[#f7f9fa] text-[#424242] border border-[#e0e0e0]'
                            }`}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-[#828c94] pl-1 font-mono">
                            +{dayEvents.length - 2}개 더보기
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] space-y-3.5 text-[13px] shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#eaedef] pb-2">
                  <div>
                    <span className="text-[11px] text-[#828c94] font-mono">선택된 일자</span>
                    <h3 className="font-bold text-base text-[#2f3438] font-mono">
                      {selectedCalendarDate}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setEventDate(selectedCalendarDate);
                      setShowAddEvent(!showAddEvent);
                    }}
                    className="text-[12px] text-[#00a1ff] hover:underline font-bold cursor-pointer"
                  >
                    {showAddEvent ? '입력 닫기' : '+ 일정 추가'}
                  </button>
                </div>

                {showAddEvent && (
                  <form onSubmit={handleCreateCalendarEvent} className="bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef] space-y-2.5">
                    <div className="font-bold text-[#2f3438] text-[12px]">새 마감 일정 등록</div>
                    <input
                      type="text"
                      required
                      placeholder="예: 삼성전자 DX부문 서류 마감"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#e0e0e0] rounded-[4px] text-[12px] bg-white text-[#2f3438] focus:border-[#00a1ff]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#e0e0e0] rounded-[4px] text-[12px] bg-white font-mono text-[#2f3438]"
                      />
                      <select
                        value={eventCat}
                        onChange={(e) => setEventCat(e.target.value as any)}
                        className="w-full px-2 py-1.5 border border-[#e0e0e0] rounded-[4px] text-[12px] bg-white text-[#2f3438]"
                      >
                        <option value="internship">인턴/채용 서류</option>
                        <option value="exam">자격/어학 시험</option>
                        <option value="contest">공모전/해커톤</option>
                        <option value="interview">면접 전형</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddEvent(false)}
                        className="px-3 py-1 text-[12px] text-[#828c94] hover:bg-[#eaedef] rounded-[4px]"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 text-[12px] bg-[#00a1ff] hover:bg-[#0497ef] text-white rounded-[4px] font-bold shadow-xs"
                      >
                        저장
                      </button>
                    </div>
                  </form>
                )}

                {selectedDateEvents.length === 0 ? (
                  <div className="py-8 text-center text-[#828c94] space-y-1">
                    <CalendarIcon className="w-8 h-8 mx-auto text-[#d4d8dc]" />
                    <p className="text-[12px]">이 날짜에 등록된 일정이 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedDateEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3.5 rounded-[4px] border border-[#e0e0e0] bg-[#f7f9fa] flex items-start justify-between gap-2 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-bold bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] font-mono">
                              D-{ev.dDay}
                            </span>
                            <span className="text-[#828c94]">
                              {ev.category === 'internship'
                                ? '인턴/채용'
                                : ev.category === 'exam'
                                ? '시험'
                                : ev.category === 'contest'
                                ? '공모전'
                                : '서류 마감'}
                            </span>
                          </div>
                          <div className="font-bold text-[#2f3438] text-[13px] leading-snug">{ev.title}</div>
                          {ev.memo && (
                            <p className="text-[12px] text-[#828c94] leading-tight">{ev.memo}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteCalendarEvent(ev.id)}
                          className="p-1 text-[#828c94] hover:text-red-600 rounded-[4px] cursor-pointer"
                          title="일정 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] space-y-3.5 text-[13px] shadow-2xs">
                <span className="font-bold text-[#2f3438] block text-base">다가오는 전체 마감 D-Day</span>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {calendarEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedCalendarDate(ev.date)}
                      className={`p-2.5 rounded-[4px] border flex items-center justify-between text-left cursor-pointer transition-colors ${
                        selectedCalendarDate === ev.date
                          ? 'border-[#00a1ff] bg-[#f0f9ff] font-bold'
                          : 'border-[#e0e0e0] hover:bg-[#f7f9fa]'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="text-[13px] truncate text-[#2f3438]">{ev.title}</div>
                        <div className="text-[11px] text-[#828c94] font-mono">{ev.date}</div>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-[3px] font-bold font-mono text-[11px] bg-[#00a1ff] text-white">
                        D-{ev.dDay}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. PASSED COVER LETTER ARCHIVE ================= */}
      {activeTab === 'archive' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#828c94]" />
              <input
                type="text"
                placeholder="기업명, 직무, 기술 태그로 합격 자소서 검색..."
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] bg-white text-[#2f3438]"
              />
            </div>
            <button
              onClick={() => setShowRegisterPassModal(true)}
              className="px-4 py-2 text-[13px] font-bold bg-[#00a1ff] hover:bg-[#0497ef] text-white rounded-[4px] cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              내 합격 자소서 등록하고 수익 받기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredArchive.map((letter) => (
              <div
                key={letter.id}
                onClick={() => {
                  viewPassedLetter(letter.id);
                  setReadingLetter(letter);
                }}
                className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all cursor-pointer text-[13px] space-y-3 flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#00a1ff] bg-[#ddf3ff]/60 px-2 py-0.5 rounded-[3px] border border-[#b9e5fe]">{letter.company}</span>
                    <span className="text-[#828c94] font-mono text-[11px]">{letter.year}</span>
                  </div>
                  <h3 className="font-bold text-[#2f3438] text-base line-clamp-2 hover:text-[#00a1ff] transition-colors">{letter.title}</h3>
                  <div className="text-[12px] text-[#424242] bg-[#f7f9fa] p-2.5 rounded-[3px] line-clamp-2 border border-[#eaedef]">
                    Q: {letter.question}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#eaedef] flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-1.5 text-[#828c94]">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="tabular-nums font-mono">{letter.viewsCount}회 열람</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#00a1ff] font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#00a1ff]" />
                    <span>합격 인증</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {readingLetter && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-[4px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-4 text-[13px]">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#eaedef]">
                  <div>
                    <div className="flex items-center gap-2 text-[12px] text-[#828c94] mb-1">
                      <span className="font-bold text-[#00a1ff]">{readingLetter.company}</span>
                      <span>·</span>
                      <span>{readingLetter.role}</span>
                      <span>·</span>
                      <span className="font-mono">{readingLetter.year}</span>
                    </div>
                    <h2 className="text-lg font-bold text-[#2f3438]">{readingLetter.title}</h2>
                  </div>
                  <button
                    onClick={() => setReadingLetter(null)}
                    className="p-1.5 text-[#828c94] hover:text-[#2f3438] cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef] text-[12px] space-y-1">
                  <div className="font-bold text-[#2f3438]">자기소개서 문항:</div>
                  <div className="text-[#424242]">{readingLetter.question}</div>
                </div>

                <div className="bg-white p-4 rounded-[4px] border border-[#e0e0e0] text-[#2f3438] leading-relaxed space-y-2 whitespace-pre-wrap">
                  {readingLetter.content}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#eaedef]">
                  <div className="text-[#828c94] text-[12px]">
                    작성자: {readingLetter.authorName} · 누적 보상: {readingLetter.authorRewardCredits.toLocaleString()}P
                  </div>
                  <button
                    onClick={() => setReadingLetter(null)}
                    className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold rounded-[4px] cursor-pointer shadow-xs"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 4. REVENUE SHARING ================= */}
      {activeTab === 'revenue' && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-4 text-[13px] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[4px] bg-[#00a1ff] text-white flex items-center justify-center font-bold shadow-xs">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2f3438]">합격자 자기소개서 수익 배분 시스템</h3>
                <p className="text-[#828c94] text-[12px]">
                  나의 취업 성공 경험을 후배들과 공유하고, 열람 실적에 따라 지속적인 현금성 리워드를 정산받습니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef]">
                <div className="text-[12px] text-[#828c94]">현재 보유 적립 포인트</div>
                <div className="text-2xl font-bold text-[#00a1ff] tabular-nums my-1 font-mono">
                  {userRewardCredits.toLocaleString()} P
                </div>
                <div className="text-[11px] text-[#828c94]">1P = 1원 현금 출금 가능</div>
              </div>

              <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef]">
                <div className="text-[12px] text-[#828c94]">내 등록 합격 자소서</div>
                <div className="text-2xl font-bold text-[#2f3438] tabular-nums my-1">
                  1편 (심사 승인 완료)
                </div>
                <div className="text-[11px] text-[#00a1ff] font-bold">열람당 200P 자동 배분</div>
              </div>

              <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef] flex flex-col justify-between">
                <div>
                  <div className="text-[12px] text-[#828c94]">수익금 출금 신청</div>
                  <div className="text-[13px] text-[#2f3438] font-bold mt-1">은행 계좌로 즉시 이체</div>
                </div>
                <button
                  onClick={() => alert(`${userRewardCredits.toLocaleString()}원의 정산 신청이 정상 접수되었습니다. (영업일 기준 2일 내 입금)`)}
                  className="w-full py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold text-[13px] rounded-[4px] transition-colors cursor-pointer shadow-xs mt-3"
                >
                  전액 계좌 입금 신청
                </button>
              </div>
            </div>

            <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef] space-y-2 text-[12px] text-[#424242]">
              <div className="font-bold text-[#2f3438] text-[13px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00a1ff]" />
                안전한 저작권 및 개인정보 보호 원칙
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>모든 합격 자소서는 본인 동의 및 합격 확인서(사원증/합격통지서) 인증 후 등록됩니다.</li>
                <li>전화번호, 주민등록번호, 학교명 등 민감 개인정보는 시스템에 의해 자동 마스킹 처리됩니다.</li>
                <li>작성자는 언제든지 자신의 자소서 공개 여부를 비공개로 전환하거나 삭제할 수 있습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register Passed Letter */}
      {showRegisterPassModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] max-w-lg w-full p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-4 text-[13px]">
            <h3 className="font-bold text-base text-[#2f3438]">내 합격 자기소개서 등록 및 수익 배분 신청</h3>
            <p className="text-[12px] text-[#828c94]">
              등록 즉시 5,000P가 지급되며, 다른 이용자의 열람 시 1회당 200P가 지속적으로 누적됩니다.
            </p>

            <form onSubmit={handleRegisterPassSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[#828c94] font-medium mb-1">합격 기업</label>
                <input
                  type="text"
                  required
                  value={regCompany}
                  onChange={(e) => setRegCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#828c94] font-medium mb-1">합격 직무 & 채용 연도</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                  />
                  <input
                    type="text"
                    required
                    value={regYear}
                    onChange={(e) => setRegYear(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#828c94] font-medium mb-1">문항 및 소제목</label>
                <input
                  type="text"
                  required
                  value={regQuestion}
                  onChange={(e) => setRegQuestion(e.target.value)}
                  placeholder="자기소개서 문항"
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] mb-2 focus:border-[#00a1ff] focus:outline-hidden"
                />
                <input
                  type="text"
                  required
                  value={regTitle}
                  onChange={(e) => setRegTitle(e.target.value)}
                  placeholder="소제목"
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#828c94] font-medium mb-1">합격 자소서 본문</label>
                <textarea
                  rows={6}
                  required
                  value={regContent}
                  onChange={(e) => setRegContent(e.target.value)}
                  placeholder="개인정보는 마스킹 처리되어 안전하게 게시됩니다."
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] leading-relaxed focus:border-[#00a1ff] focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterPassModal(false)}
                  className="px-3.5 py-2 text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold rounded-[4px] shadow-xs"
                >
                  합격 인증 및 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
