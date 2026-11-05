import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { CoverLetter, ExperienceItem } from '../../types/career';
import {
  PenTool,
  Sparkles,
  Briefcase,
  Copy,
  Check,
  Download,
  Trash2,
  BookOpen
} from 'lucide-react';

export const CoverLetterView: React.FC = () => {
  const {
    jobPostings,
    experiences,
    coverLetters,
    addCoverLetter,
    deleteCoverLetter,
    profile,
  } = useCareer();

  const [selectedLetterId, setSelectedLetterId] = useState<string>(coverLetters[0]?.id || '');
  const [activeJobId, setActiveJobId] = useState<string>(jobPostings[0]?.id || '');

  const [inputQuestion, setInputQuestion] = useState(
    '지원자가 겪은 기술적/조직적 난관과 이를 해결하기 위해 취했던 구체적인 조치를 서술해주세요.'
  );
  const [maxChars, setMaxChars] = useState<number>(800);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>([
    experiences[0]?.id || '',
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [matchingRationale, setMatchingRationale] = useState('');
  const [writingTips, setWritingTips] = useState('');
  const [copied, setCopied] = useState(false);

  const getExperienceMatchScore = (exp: ExperienceItem, query: string) => {
    let score = 0;
    const lowerQ = query.toLowerCase();
    if (lowerQ.includes('문제') || lowerQ.includes('난관') || lowerQ.includes('장애')) {
      if (exp.problem) score += 4;
      if (exp.solution) score += 4;
    }
    if (lowerQ.includes('협업') || lowerQ.includes('갈등') || lowerQ.includes('동료')) {
      if (exp.competencies.some((c) => c.includes('협업') || c.includes('소통') || c.includes('리더십'))) score += 5;
    }
    if (lowerQ.includes('기술') || lowerQ.includes('프로젝트') || lowerQ.includes('개발')) {
      if (exp.category === 'campus' || exp.category === 'project' || exp.category === 'external') score += 4;
    }
    if (lowerQ.includes('고객') || lowerQ.includes('프로세스') || lowerQ.includes('책임')) {
      if (exp.category === 'part_time') score += 5;
    }
    return score;
  };

  const selectedJob = jobPostings.find((j) => j.id === activeJobId) || jobPostings[0];

  const toggleSelectExp = (id: string) => {
    setSelectedExperienceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerateDraft = async () => {
    if (!inputQuestion.trim() || selectedExperienceIds.length === 0) return;
    setIsGenerating(true);

    const chosenExps = experiences.filter((e) => selectedExperienceIds.includes(e.id));

    try {
      const res = await fetch('/api/ai/generate-coverletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: inputQuestion,
          maxChars,
          companyName: selectedJob?.company || profile.targetCompanies[0] || '지원 기업',
          jobTitle: selectedJob?.title || profile.targetJobs[0] || '소프트웨어 엔지니어',
          selectedExperiences: chosenExps,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEditableTitle(data.data.title || '[문제 해결과 성과 창출]');
        setEditableContent(data.data.content || '');
        setMatchingRationale(data.data.matchingRationale || '');
        setWritingTips(data.data.writingTips || '');
      }
    } catch (err) {
      console.error('Draft generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToRepository = () => {
    if (!editableContent.trim()) return;
    const newLetter = addCoverLetter({
      companyName: selectedJob?.company || '지원 기업',
      jobTitle: selectedJob?.title || '지원 직무',
      question: inputQuestion,
      maxChars,
      title: editableTitle || '[제목 미정]',
      content: editableContent,
      usedExperienceIds: selectedExperienceIds,
      matchingRationale,
    });
    setSelectedLetterId(newLetter.id);
    alert('새 자기소개서 초안이 기업별 보관함에 저장되었습니다.');
  };

  const handleCopy = () => {
    const textToCopy = `${editableTitle}\n\n${editableContent}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const content = `[자기소개서]\n기업: ${selectedJob?.company}\n직무: ${selectedJob?.title}\n문항: ${inputQuestion}\n\n${editableTitle}\n\n${editableContent}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedJob?.company}_자기소개서_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectFromLibrary = (cl: CoverLetter) => {
    setSelectedLetterId(cl.id);
    setInputQuestion(cl.question);
    setMaxChars(cl.maxChars);
    setEditableTitle(cl.title);
    setEditableContent(cl.content);
    setSelectedExperienceIds(cl.usedExperienceIds || []);
    setMatchingRationale(cl.matchingRationale || '');
  };

  return (
    <div className="space-y-6">
      {/* Top Header - Ohouse White Canvas */}
      <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] font-bold">
              AI COVER LETTER STUDIO
            </span>
            <span className="text-[12px] text-[#828c94]">STAR 프레임워크 기반 사실적 초안 생성</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2f3438] tracking-tight">
            채용 공고 & 경험 자동 매칭 AI 자기소개서
          </h1>
          <p className="text-[13px] text-[#424242] mt-0.5">
            등록된 실제 경험 데이터에서 문항에 최적화된 소재를 찾아내고, 기업별 STAR 맞춤 문장으로 구조화합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Job Posting Selector */}
          <div className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] space-y-3.5 text-[13px] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2f3438] flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#00a1ff]" />
                목표 채용 공고 선택
              </span>
              <span className="text-[11px] text-[#828c94]">기업별 인재상 자동 반영</span>
            </div>
            <select
              value={activeJobId}
              onChange={(e) => setActiveJobId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-[4px] bg-white text-[13px] font-bold text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
            >
              {jobPostings.map((job) => (
                <option key={job.id} value={job.id}>
                  [{job.company}] {job.title}
                </option>
              ))}
            </select>

            {selectedJob && (
              <div className="bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef] text-[12px] space-y-1.5">
                <div className="font-bold text-[#2f3438]">{selectedJob.company} 핵심 요구사항</div>
                <div className="text-[#424242] leading-relaxed">{selectedJob.responsibilities}</div>
                <div className="flex flex-wrap gap-1 pt-1 font-mono text-[11px]">
                  {selectedJob.requiredSkills.map((sk) => (
                    <span key={sk} className="bg-white text-[#424242] px-2 py-0.5 rounded-[3px] border border-[#e0e0e0]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Question & Word Count Input */}
          <div className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] space-y-3.5 text-[13px] shadow-2xs">
            <span className="font-bold text-[#2f3438] block">자기소개서 문항 입력</span>
            <textarea
              rows={3}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="지원서 문항을 입력하세요"
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] focus:ring-1 focus:ring-[#00a1ff] text-[13px] text-[#2f3438] resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="font-medium text-[#828c94] text-[12px]">희망 분량 (공백 포함):</span>
              <div className="flex items-center gap-1 font-mono">
                {[500, 700, 800, 1000].map((chars) => (
                  <button
                    key={chars}
                    type="button"
                    onClick={() => setMaxChars(chars)}
                    className={`px-3 py-1 rounded-[4px] text-[12px] transition-colors cursor-pointer ${
                      maxChars === chars
                        ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                        : 'bg-[#f7f9fa] text-[#424242] hover:bg-[#eaedef] border border-[#e0e0e0]'
                    }`}
                  >
                    {chars}자
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Automated Experience Matching Box */}
          <div className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] space-y-3.5 text-[13px] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2f3438] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#00a1ff]" />
                문항 연계 경험 자동 추천 ({selectedExperienceIds.length}개 선택)
              </span>
              <span className="text-[11px] text-[#00a1ff] font-bold font-mono">DB 연동</span>
            </div>
            <p className="text-[12px] text-[#828c94]">
              AI가 문항 키워드를 분석하여 가장 설득력 높은 경험을 우선 추천합니다.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {experiences.map((exp) => {
                const matchScore = getExperienceMatchScore(exp, inputQuestion);
                const isSelected = selectedExperienceIds.includes(exp.id);
                return (
                  <button
                    type="button"
                    key={exp.id}
                    onClick={() => toggleSelectExp(exp.id)}
                    className={`w-full p-3 rounded-[4px] border text-left transition-all cursor-pointer text-[12px] ${
                      isSelected
                        ? 'border-[#00a1ff] bg-[#f0f9ff] text-[#2f3438] font-bold shadow-2xs'
                        : 'border-[#e0e0e0] bg-white text-[#424242] hover:bg-[#f7f9fa]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold truncate pr-2">
                        [{exp.subCategory || exp.category}] {exp.title}
                      </span>
                      {matchScore > 0 && (
                        <span className="text-[10px] bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] font-bold shrink-0">
                          적합
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#828c94] truncate">{exp.result}</div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleGenerateDraft}
              disabled={isGenerating || selectedExperienceIds.length === 0}
              className="w-full py-2.5 bg-[#00a1ff] hover:bg-[#0497ef] disabled:bg-[#d4d8dc] text-white font-bold text-[13px] rounded-[4px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? '선택된 경험 기반 STAR 초안 생성 중...' : 'AI 자기소개서 초안 생성'}
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): Draft Editor & Saved Library */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-4 text-[13px] shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedef]">
              <span className="font-bold text-[#2f3438] flex items-center gap-1.5 text-base">
                <PenTool className="w-4 h-4 text-[#00a1ff]" />
                자기소개서 에디터 & 글자수 계산
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-[#828c94] text-[12px]">
                  공백 포함 <strong className="text-[#00a1ff] font-bold">{editableContent.length}</strong> / {maxChars}자
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-[#424242] hover:text-[#00a1ff] hover:bg-[#f7f9fa] rounded-[4px] font-medium flex items-center gap-1 cursor-pointer transition-colors border border-[#e0e0e0]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#00a1ff]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사됨' : '복사'}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="px-2.5 py-1 text-[#424242] hover:text-[#00a1ff] hover:bg-[#f7f9fa] rounded-[4px] font-medium flex items-center gap-1 cursor-pointer transition-colors border border-[#e0e0e0]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>다운로드</span>
                </button>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-[12px] font-bold text-[#2f3438] mb-1">
                소제목 (AI 제안 또는 직접 수정)
              </label>
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                placeholder="[소제목을 입력하세요]"
                className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] font-bold text-[#2f3438] text-[13px] focus:outline-hidden focus:border-[#00a1ff]"
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-[12px] font-bold text-[#2f3438] mb-1">
                본문 텍스트 (STAR 구조화 작성본)
              </label>
              <textarea
                rows={12}
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                placeholder="AI 초안 생성 버튼을 누르거나 직접 자기소개서를 작성하세요."
                className="w-full p-4 border border-[#e0e0e0] rounded-[4px] leading-relaxed text-[#2f3438] text-[13px] focus:outline-hidden focus:border-[#00a1ff] resize-y"
              />
            </div>

            {/* Matching Rationale & Writing Tips */}
            {(matchingRationale || writingTips) && (
              <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef] space-y-2 text-[12px]">
                {matchingRationale && (
                  <div>
                    <span className="font-bold text-[#00a1ff]">💡 경험 채택 근거: </span>
                    <span className="text-[#424242]">{matchingRationale}</span>
                  </div>
                )}
                {writingTips && (
                  <div>
                    <span className="font-bold text-[#2f3438]">✍️ 면접관 어필 팁: </span>
                    <span className="text-[#424242]">{writingTips}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#eaedef]">
              <button
                type="button"
                onClick={handleSaveToRepository}
                className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold text-[13px] rounded-[4px] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
              >
                기업별 자소서 보관함에 저장하기
              </button>
            </div>
          </div>

          {/* Saved Cover Letters Library */}
          <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] space-y-3.5 text-[13px] shadow-2xs">
            <h3 className="font-bold text-[#2f3438] flex items-center gap-1.5 text-base">
              <BookOpen className="w-4 h-4 text-[#00a1ff]" />
              저장된 기업별 자기소개서 보관함 ({coverLetters.length})
            </h3>
            <div className="space-y-2">
              {coverLetters.map((cl) => (
                <div
                  key={cl.id}
                  onClick={() => handleSelectFromLibrary(cl)}
                  className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedLetterId === cl.id
                      ? 'border-[#00a1ff] bg-[#f0f9ff] font-bold shadow-2xs'
                      : 'border-[#e0e0e0] bg-white hover:bg-[#f7f9fa]'
                  }`}
                >
                  <div className="truncate pr-3 space-y-0.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#828c94] font-mono">
                      <span className="font-bold text-[#2f3438]">{cl.companyName}</span>
                      <span>·</span>
                      <span>{cl.jobTitle}</span>
                      <span>·</span>
                      <span>v{cl.version}</span>
                      <span>·</span>
                      <span>{cl.updatedAt}</span>
                    </div>
                    <div className="font-bold text-[#2f3438] text-[13px] truncate">{cl.title}</div>
                    <div className="text-[12px] text-[#828c94] truncate">{cl.question}</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCoverLetter(cl.id);
                    }}
                    className="p-1.5 text-[#828c94] hover:text-red-600 transition-colors cursor-pointer shrink-0"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
