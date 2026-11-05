import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { ExperienceItem, ExperienceCategory } from '../../types/career';
import { X, Paperclip, Check } from 'lucide-react';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ExperienceItem | null;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addExperience, updateExperience, evidenceFiles } = useCareer();

  const [category, setCategory] = useState<ExperienceCategory>('campus');
  const [subCategory, setSubCategory] = useState('');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState('');
  const [learned, setLearned] = useState('');
  const [competencyInput, setCompetencyInput] = useState('');
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setSubCategory(initialData.subCategory || '');
      setTitle(initialData.title);
      setOrganization(initialData.organization);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setCurrent(initialData.current || false);
      setRole(initialData.role);
      setDescription(initialData.description);
      setProblem(initialData.problem || '');
      setSolution(initialData.solution || '');
      setResult(initialData.result);
      setLearned(initialData.learned || '');
      setCompetencies(initialData.competencies || []);
      setSelectedEvidenceIds(initialData.evidenceIds || []);
    } else {
      setCategory('campus');
      setSubCategory('');
      setTitle('');
      setOrganization('');
      setStartDate('2025.01');
      setEndDate('2025.06');
      setCurrent(false);
      setRole('');
      setDescription('');
      setProblem('');
      setSolution('');
      setResult('');
      setLearned('');
      setCompetencies(['문제 해결력', '팀 협업']);
      setSelectedEvidenceIds([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddCompetency = () => {
    if (competencyInput.trim() && !competencies.includes(competencyInput.trim())) {
      setCompetencies([...competencies, competencyInput.trim()]);
      setCompetencyInput('');
    }
  };

  const handleRemoveCompetency = (tag: string) => {
    setCompetencies(competencies.filter((t) => t !== tag));
  };

  const toggleEvidence = (id: string) => {
    setSelectedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    const data = {
      category,
      subCategory: subCategory.trim(),
      title: title.trim(),
      organization: organization.trim(),
      startDate: startDate.trim(),
      endDate: current ? '진행 중' : endDate.trim(),
      current,
      role: role.trim(),
      description: description.trim(),
      problem: problem.trim(),
      solution: solution.trim(),
      result: result.trim(),
      learned: learned.trim(),
      competencies,
      evidenceIds: selectedEvidenceIds,
    };

    if (initialData) {
      updateExperience(initialData.id, data);
    } else {
      addExperience(data);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[4px] max-w-2xl w-full my-8 p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#eaedef]">
          <div>
            <h2 className="text-lg font-bold text-[#2f3438] tracking-tight">
              {initialData ? '경험 기록 수정' : '새로운 경험 등록'}
            </h2>
            <p className="text-[12px] text-[#828c94]">
              대학 생활의 모든 활동과 아르바이트를 직무 역량 데이터로 축적합니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#828c94] hover:text-[#2f3438] hover:bg-[#f7f9fa] rounded-[4px] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          {/* Category Selector */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1.5">활동 대분류</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'campus', label: '교내 활동' },
                { id: 'external', label: '교외 활동' },
                { id: 'part_time', label: '아르바이트' },
                { id: 'project', label: '프로젝트' },
                { id: 'certification', label: '자격/어학' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id as ExperienceCategory)}
                  className={`py-2 px-1 text-center text-[12px] font-bold rounded-[4px] border transition-all cursor-pointer ${
                    category === cat.id
                      ? 'border-[#00a1ff] bg-[#00a1ff] text-white shadow-xs'
                      : 'border-[#e0e0e0] text-[#424242] hover:bg-[#f7f9fa]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">세부 유형</label>
              <input
                type="text"
                placeholder="예: 캡스톤, 해커톤, 카페 바리스타"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#2f3438] mb-1">
                활동명 / 프로젝트명 <span className="text-[#00a1ff]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 실시간 캠퍼스 빈 강의실 예약 시스템 개발"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
          </div>

          {/* Organization & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">
                소속 기관 / 근무처 <span className="text-[#00a1ff]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 컴퓨터공학과 캡스톤팀, 투썸플레이스 강남점"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">본인의 역할</label>
              <input
                type="text"
                placeholder="예: 백엔드 리드 개발자, 오픈 바리스타"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
          </div>

          {/* Period */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">시작일 (YYYY.MM)</label>
              <input
                type="text"
                placeholder="2025.03"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438] font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">종료일 (YYYY.MM)</label>
              <input
                type="text"
                disabled={current}
                placeholder="2025.06"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438] font-mono disabled:bg-[#f7f9fa] disabled:text-[#828c94]"
              />
            </div>
            <div className="pb-2">
              <label className="flex items-center gap-2 cursor-pointer text-[#424242]">
                <input
                  type="checkbox"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="rounded accent-[#00a1ff]"
                />
                <span>현재 진행 중</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1">
              수행 업무 및 활동 상세 <span className="text-[#00a1ff]">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="구체적으로 담당한 과업, 기술 스택, 사용한 도구를 작성해주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438] resize-none"
            />
          </div>

          {/* Problem & Solution (STAR basis) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">
                직면했던 문제 상황 (Problem)
              </label>
              <textarea
                rows={2}
                placeholder="일정 지연, 동시성 오류, 고객 대기시간 지연 등"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438] resize-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">
                해결 과정 및 조치 (Solution)
              </label>
              <textarea
                rows={2}
                placeholder="동선 분업화 매뉴얼 수립, Redis 분산 락 도입 등"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438] resize-none"
              />
            </div>
          </div>

          {/* Result & Learned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">
                성과 및 결과 (Result) <span className="text-[#00a1ff]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 응답시간 86% 단축, 대기시간 18분->7분 단축"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">배운 점 (Learned)</label>
              <input
                type="text"
                placeholder="예: 트레이드오프 분석력, 고객 중심 데이터 사고"
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
          </div>

          {/* Competency Tags */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1">관련 역량 태그</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="예: Spring Boot, 데이터 분석, 고객 응대"
                value={competencyInput}
                onChange={(e) => setCompetencyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCompetency();
                  }
                }}
                className="flex-1 px-3 py-1.5 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
              <button
                type="button"
                onClick={handleAddCompetency}
                className="px-3.5 py-1.5 bg-[#f7f9fa] border border-[#e0e0e0] hover:bg-[#eaedef] text-[#2f3438] font-bold rounded-[4px] transition-colors cursor-pointer text-[12px]"
              >
                태그 추가
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {competencies.map((comp) => (
                <span
                  key={comp}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f0f9ff] text-[#00a1ff] border border-[#b9e5fe] rounded-[3px] text-[11px] font-medium"
                >
                  #{comp}
                  <button
                    type="button"
                    onClick={() => handleRemoveCompetency(comp)}
                    className="text-[#828c94] hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Evidence Linking */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-[#00a1ff]" />
                보관함 증빙 자료 연결 ({selectedEvidenceIds.length}개 선택됨)
              </span>
              <span className="text-[#828c94] font-normal text-[11px]">상장, 확인서, 성적표 등</span>
            </label>
            {evidenceFiles.length === 0 ? (
              <p className="text-[#828c94] text-[12px] py-2">보관함에 등록된 증빙 자료가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1.5 border border-[#e0e0e0] rounded-[4px] bg-[#f7f9fa]">
                {evidenceFiles.map((ev) => {
                  const isSelected = selectedEvidenceIds.includes(ev.id);
                  return (
                    <button
                      type="button"
                      key={ev.id}
                      onClick={() => toggleEvidence(ev.id)}
                      className={`flex items-center justify-between p-2 rounded-[3px] border text-left transition-colors cursor-pointer text-[11px] ${
                        isSelected
                          ? 'border-[#00a1ff] bg-white text-[#00a1ff] font-bold shadow-2xs'
                          : 'border-[#e0e0e0] bg-white text-[#424242] hover:bg-[#f7f9fa]'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-bold truncate">{ev.title}</div>
                        <div className={`text-[10px] truncate text-[#828c94]`}>
                          {ev.fileName}
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#00a1ff] text-white' : 'border border-[#e0e0e0]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#eaedef]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#00a1ff] hover:bg-[#0497ef] active:scale-[0.98] rounded-[4px] shadow-xs transition-all cursor-pointer"
            >
              {initialData ? '수정 완료' : '경험 저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
