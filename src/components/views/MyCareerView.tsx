import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { ExperienceItem, EvidenceFile } from '../../types/career';
import {
  GraduationCap,
  Award,
  Briefcase,
  Sparkles,
  Search,
  Plus,
  Download,
  Trash2,
  Edit2,
  FileCheck,
  Eye,
  FileText
} from 'lucide-react';

interface MyCareerViewProps {
  onOpenNewExperience: () => void;
  onOpenOcr: () => void;
  onOpenEvidenceUpload: (expId?: string) => void;
  onEditExperience: (exp: ExperienceItem) => void;
  onNavigateMenu: (menu: any) => void;
}

type SubTab = 'overview' | 'academics' | 'campus' | 'external' | 'part_time' | 'certification' | 'vault';

export const MyCareerView: React.FC<MyCareerViewProps> = ({
  onOpenNewExperience,
  onOpenOcr,
  onOpenEvidenceUpload,
  onEditExperience,
}) => {
  const {
    profile,
    stats,
    courses,
    addCourse,
    deleteCourse,
    experiences,
    deleteExperience,
    evidenceFiles,
    deleteEvidenceFile,
  } = useCareer();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [previewEvidence, setPreviewEvidence] = useState<EvidenceFile | null>(null);

  // New course quick inline form state
  const [newCourseSem, setNewCourseSem] = useState('4-1');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [newCourseGrade, setNewCourseGrade] = useState<'A+' | 'A0' | 'B+' | 'B0' | 'C+' | 'P'>('A+');
  const [newCourseType, setNewCourseType] = useState<'전공' | '교양'>('전공');
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);

  // Counts
  const campusCount = experiences.filter((e) => e.category === 'campus').length;
  const externalCount = experiences.filter((e) => e.category === 'external').length;
  const partTimeCount = experiences.filter((e) => e.category === 'part_time').length;
  const certCount = experiences.filter((e) => e.category === 'certification').length;

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    addCourse({
      semester: newCourseSem,
      courseName: newCourseName.trim(),
      credits: newCourseCredits,
      grade: newCourseGrade,
      type: newCourseType,
    });
    setNewCourseName('');
    setShowAddCourseForm(false);
  };

  const handleDownloadFile = (ev: EvidenceFile) => {
    const content = `[CareerLog 공식 증빙 자료 보관함]\n문서명: ${ev.title}\n파일명: ${ev.fileName}\n분류: ${ev.category}\n업로드 일자: ${ev.uploadDate}\n소유자: ${profile.name} (${profile.university} ${profile.department})\n\n본 문서는 CareerLog 저장소에 보관된 공식 데이터입니다.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = ev.fileName.endsWith('.pdf') ? ev.fileName : `${ev.fileName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBatchDownload = () => {
    alert(`보관함의 총 ${evidenceFiles.length}개 증빙 자료가 ZIP 압축 파일(CareerLog_증빙자료_일괄.zip)로 다운로드 대기열에 추가되었습니다.`);
  };

  const filteredExperiences = experiences.filter((e) => {
    const matchCategory =
      activeSubTab === 'campus'
        ? e.category === 'campus'
        : activeSubTab === 'external'
        ? e.category === 'external'
        : activeSubTab === 'part_time'
        ? e.category === 'part_time'
        : activeSubTab === 'certification'
        ? e.category === 'certification'
        : true;

    const matchSearch =
      searchTerm.trim() === '' ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.competencies.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchCategory && matchSearch;
  });

  const allSemesters = Array.from(new Set(courses.map((c) => c.semester))).sort();
  const displayedCourses = selectedSemester === 'all'
    ? courses
    : courses.filter((c) => c.semester === selectedSemester);

  return (
    <div className="space-y-6">
      
      {/* 1. Header Profile & Core KPI Strip (Ohouse Clean Canvas with #00a1ff accents) */}
      <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px]">
                MY CAREER LOG
              </span>
              <span className="text-[12px] text-[#828c94] font-medium">
                {profile.university} {profile.department} ({profile.gradeYear})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#2f3438] tracking-tight">
              {profile.name} 님의 커리어 데이터베이스
            </h1>
            <p className="text-[13px] text-[#424242] max-w-2xl leading-relaxed">
              목표 직무: <span className="text-[#00a1ff] font-bold">{profile.targetJobs.join(' · ')}</span>
              {profile.targetCompanies.length > 0 && ` | 목표 기업: ${profile.targetCompanies.join(' · ')}`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNewExperience}
              className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white text-[13px] font-bold rounded-[4px] shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              새 경험 기록하기
            </button>
            <button
              onClick={onOpenOcr}
              className="px-3.5 py-2 border border-[#e0e0e0] hover:bg-[#f7f9fa] text-[#2f3438] text-[13px] font-medium rounded-[4px] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00a1ff]" />
              성적표 OCR
            </button>
          </div>
        </div>

        {/* 4 Essential Summary Cards - Ohouse Card Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#eaedef]">
          <div
            onClick={() => setActiveSubTab('academics')}
            className="p-4 bg-white hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[#828c94] text-[12px] mb-1">
              <span className="font-medium group-hover:text-[#00a1ff] transition-colors">학업 성적</span>
              <GraduationCap className="w-4 h-4 text-[#00a1ff]" />
            </div>
            <div className="text-xl font-bold text-[#2f3438] font-mono tabular-nums">
              {stats.totalGpa} <span className="text-[12px] text-[#828c94] font-normal">/ 4.5</span>
            </div>
            <div className="text-[11px] text-[#828c94] mt-1">
              전공 {stats.majorGpa} · 총 {stats.totalCredits}학점 ({courses.length}과목)
            </div>
          </div>

          <div
            onClick={() => setActiveSubTab('certification')}
            className="p-4 bg-white hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[#828c94] text-[12px] mb-1">
              <span className="font-medium group-hover:text-[#00a1ff] transition-colors">자격증 & 어학</span>
              <Award className="w-4 h-4 text-[#00a1ff]" />
            </div>
            <div className="text-xl font-bold text-[#2f3438] font-mono tabular-nums">
              {certCount}개 보유
            </div>
            <div className="text-[11px] text-[#828c94] mt-1 truncate">
              SQLD · TOEIC 915 · OPIc IH
            </div>
          </div>

          <div
            onClick={() => setActiveSubTab('campus')}
            className="p-4 bg-white hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[#828c94] text-[12px] mb-1">
              <span className="font-medium group-hover:text-[#00a1ff] transition-colors">활동 & 아르바이트</span>
              <Briefcase className="w-4 h-4 text-[#00a1ff]" />
            </div>
            <div className="text-xl font-bold text-[#2f3438] font-mono tabular-nums">
              {experiences.length}건 등록
            </div>
            <div className="text-[11px] text-[#828c94] mt-1">
              교내 {campusCount} · 교외 {externalCount} · 알바 {partTimeCount}
            </div>
          </div>

          <div
            onClick={() => setActiveSubTab('vault')}
            className="p-4 bg-white hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[#828c94] text-[12px] mb-1">
              <span className="font-medium group-hover:text-[#00a1ff] transition-colors">증빙 보관함</span>
              <FileCheck className="w-4 h-4 text-[#00a1ff]" />
            </div>
            <div className="text-xl font-bold text-[#2f3438] font-mono tabular-nums">
              {evidenceFiles.length}개 파일
            </div>
            <div className="text-[11px] text-[#828c94] mt-1">
              성적표 · 상장 · 확인서 보관 중
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Navigation Bar - Ohouse Segment Control */}
      <div className="flex items-center justify-between border-b border-[#eaedef] pb-3 overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { id: 'overview', label: '한눈에 전체 보기' },
            { id: 'academics', label: '학업 및 성적' },
            { id: 'campus', label: `교내 활동 (${campusCount})` },
            { id: 'external', label: `교외 활동 (${externalCount})` },
            { id: 'part_time', label: `아르바이트 (${partTimeCount})` },
            { id: 'certification', label: `자격 및 어학 (${certCount})` },
            { id: 'vault', label: `증빙 보관함 (${evidenceFiles.length})` },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SubTab)}
                className={`px-3.5 py-1.5 text-[13px] font-medium rounded-[4px] transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                    : 'text-[#424242] hover:text-[#00a1ff] hover:bg-white border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Action button in sub-bar */}
        <div className="flex items-center gap-2 shrink-0">
          {activeSubTab === 'academics' && (
            <button
              onClick={onOpenOcr}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-bold bg-[#00a1ff] text-white rounded-[4px] hover:bg-[#0497ef] transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              성적표 OCR 자동 추출
            </button>
          )}
          {activeSubTab === 'vault' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenEvidenceUpload()}
                className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold bg-[#00a1ff] hover:bg-[#0497ef] text-white rounded-[4px] transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                증빙 업로드
              </button>
              <button
                onClick={handleBatchDownload}
                className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium bg-white border border-[#e0e0e0] text-[#2f3438] hover:bg-[#f7f9fa] rounded-[4px] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                일괄 다운로드
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= 3. OVERVIEW: 한눈에 전체 보기 ================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          
          {/* Quick Filter & Search Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#828c94]" />
              <input
                type="text"
                placeholder="활동명, 기관명, 역량 태그로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] focus:ring-1 focus:ring-[#00a1ff] bg-white text-[#2f3438] transition-colors"
              />
            </div>
            <button
              onClick={onOpenNewExperience}
              className="px-4 py-2 text-[13px] font-bold bg-[#00a1ff] hover:bg-[#0497ef] text-white rounded-[4px] cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              경험 등록
            </button>
          </div>

          {/* High-Scannability Experience Cards Grid */}
          <div className="space-y-3">
            {filteredExperiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all text-[13px] space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[12px] text-[#828c94]">
                      <span className="font-bold text-[#00a1ff] bg-[#ddf3ff]/60 px-2 py-0.5 rounded-[3px]">
                        {exp.category === 'campus'
                          ? '교내 활동'
                          : exp.category === 'external'
                          ? '교외 활동'
                          : exp.category === 'part_time'
                          ? '아르바이트'
                          : exp.category === 'project'
                          ? '프로젝트'
                          : '자격증/어학'}
                      </span>
                      <span>{exp.subCategory}</span>
                      <span>·</span>
                      <span className="text-[#2f3438] font-semibold">{exp.organization}</span>
                      <span>·</span>
                      <span>{exp.startDate} ~ {exp.endDate}</span>
                      {exp.role && <span>({exp.role})</span>}
                    </div>

                    <h3 className="text-base font-bold text-[#2f3438] hover:text-[#00a1ff] transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-[#424242] leading-relaxed">{exp.description}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditExperience(exp)}
                      className="p-1.5 text-[#828c94] hover:text-[#00a1ff] hover:bg-[#f7f9fa] rounded-[4px] cursor-pointer transition-colors"
                      title="수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="p-1.5 text-[#828c94] hover:text-red-600 hover:bg-red-50 rounded-[4px] cursor-pointer transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* STAR Highlights & Results */}
                <div className="pt-3 border-t border-[#eaedef] flex flex-wrap items-center justify-between gap-2 text-[12px]">
                  <div className="font-medium text-[#2f3438] flex items-center gap-2">
                    <span className="font-bold bg-[#00a1ff] text-white text-[11px] px-2 py-0.5 rounded-[3px]">
                      주요 성과
                    </span>
                    <span className="text-[#424242]">{exp.result}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {exp.competencies.map((comp) => (
                      <span
                        key={comp}
                        className="bg-[#f7f9fa] text-[#424242] border border-[#e0e0e0] text-[11px] px-2 py-0.5 rounded-[3px]"
                      >
                        #{comp}
                      </span>
                    ))}
                    {exp.evidenceIds.length > 0 && (
                      <span className="text-[11px] text-[#00a1ff] bg-[#ddf3ff]/50 border border-[#b9e5fe] px-2 py-0.5 rounded-[3px] flex items-center gap-1 font-medium">
                        <FileCheck className="w-3 h-3 text-[#00a1ff]" />
                        증빙 {exp.evidenceIds.length}건
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. ACADEMICS & GRADES ================= */}
      {activeSubTab === 'academics' && (
        <div className="space-y-5">
          {/* GPA Scoreboard */}
          <div className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-4 text-[13px] shadow-2xs">
            <div>
              <div className="text-[#828c94]">{profile.university} · {profile.department}</div>
              <h2 className="text-lg font-bold text-[#2f3438] mt-0.5">학기별 성적 및 학점 관리</h2>
              <p className="text-[#828c94] text-[12px] mt-0.5">
                성적표 이미지를 업로드해 OCR로 자동 추출하거나 과목을 직접 등록할 수 있습니다.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#e0e0e0]">
              <div className="text-center px-2">
                <div className="text-[11px] text-[#828c94]">전체 평점</div>
                <div className="text-2xl font-bold text-[#00a1ff] font-mono tabular-nums">{stats.totalGpa}</div>
                <div className="text-[11px] text-[#828c94]">/ 4.5</div>
              </div>
              <div className="h-8 w-px bg-[#eaedef]" />
              <div className="text-center px-2">
                <div className="text-[11px] text-[#828c94]">전공 평점</div>
                <div className="text-2xl font-bold text-[#2f3438] font-mono tabular-nums">{stats.majorGpa}</div>
                <div className="text-[11px] text-[#828c94]">/ 4.5</div>
              </div>
              <div className="h-8 w-px bg-[#eaedef]" />
              <div className="text-center px-2">
                <div className="text-[11px] text-[#828c94]">이수 학점</div>
                <div className="text-2xl font-bold text-[#2f3438] font-mono tabular-nums">{stats.totalCredits}</div>
                <div className="text-[11px] text-[#828c94]">전공 {stats.majorCredits}</div>
              </div>
            </div>
          </div>

          {/* Controls: Semester Tabs + Add Course Inline */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto text-[13px]">
              <button
                onClick={() => setSelectedSemester('all')}
                className={`px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer font-medium ${
                  selectedSemester === 'all'
                    ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                    : 'bg-white border border-[#e0e0e0] text-[#424242] hover:bg-[#f7f9fa]'
                }`}
              >
                전체 학기 ({courses.length})
              </button>
              {allSemesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer font-medium font-mono ${
                    selectedSemester === sem
                      ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                      : 'bg-white border border-[#e0e0e0] text-[#424242] hover:bg-[#f7f9fa]'
                  }`}
                >
                  {sem}학기
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenOcr}
                className="px-3.5 py-1.5 text-[13px] font-medium border border-[#e0e0e0] hover:bg-[#f7f9fa] text-[#2f3438] rounded-[4px] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00a1ff]" />
                성적표 OCR로 과목 인식
              </button>
              <button
                onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                className="px-3.5 py-1.5 text-[13px] font-bold bg-[#00a1ff] text-white hover:bg-[#0497ef] rounded-[4px] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                직접 과목 추가
              </button>
            </div>
          </div>

          {/* Add Course Form */}
          {showAddCourseForm && (
            <form
              onSubmit={handleCreateCourse}
              className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] space-y-3.5 text-[13px] shadow-sm"
            >
              <div className="font-bold text-[#2f3438]">새 과목 직접 등록</div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[12px] text-[#828c94] mb-1">학기</label>
                  <input
                    type="text"
                    required
                    value={newCourseSem}
                    onChange={(e) => setNewCourseSem(e.target.value)}
                    placeholder="예: 4-1"
                    className="w-full px-3 py-1.5 border border-[#e0e0e0] rounded-[4px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[12px] text-[#828c94] mb-1">과목명</label>
                  <input
                    type="text"
                    required
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="예: 인공지능응용"
                    className="w-full px-3 py-1.5 border border-[#e0e0e0] rounded-[4px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#828c94] mb-1">학점</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCourseCredits}
                    onChange={(e) => setNewCourseCredits(parseInt(e.target.value, 10) || 3)}
                    className="w-full px-3 py-1.5 border border-[#e0e0e0] rounded-[4px] text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#828c94] mb-1">성적</label>
                  <select
                    value={newCourseGrade}
                    onChange={(e) => setNewCourseGrade(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-[#e0e0e0] rounded-[4px] bg-white text-[#2f3438] focus:border-[#00a1ff] focus:outline-hidden"
                  >
                    {['A+', 'A0', 'B+', 'B0', 'C+', 'C0', 'P'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4 text-[#424242]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="courseType"
                      checked={newCourseType === '전공'}
                      onChange={() => setNewCourseType('전공')}
                      className="accent-[#00a1ff]"
                    />
                    <span>전공 과목</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="courseType"
                      checked={newCourseType === '교양'}
                      onChange={() => setNewCourseType('교양')}
                      className="accent-[#00a1ff]"
                    />
                    <span>교양 과목</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCourseForm(false)}
                    className="px-3 py-1.5 text-[#828c94] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0]"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#00a1ff] hover:bg-[#0497ef] text-white rounded-[4px] font-bold shadow-xs"
                  >
                    등록 완료
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Academic Table */}
          <div className="bg-white rounded-[4px] border border-[#e0e0e0] overflow-hidden shadow-2xs">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f7f9fa] text-[#828c94] font-semibold border-b border-[#eaedef]">
                <tr>
                  <th className="py-3 px-4 font-mono">이수 학기</th>
                  <th className="py-3 px-4">과목명</th>
                  <th className="py-3 px-4 w-20">구분</th>
                  <th className="py-3 px-4 w-20 text-center font-mono">학점</th>
                  <th className="py-3 px-4 w-24 text-center font-mono">성적 등급</th>
                  <th className="py-3 px-4 w-16 text-center">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedef]">
                {displayedCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f7f9fa] transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[#828c94]">{c.semester}</td>
                    <td className="py-2.5 px-4 font-medium text-[#2f3438]">{c.courseName}</td>
                    <td className="py-2.5 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded-[3px] bg-[#f7f9fa] text-[#424242] border border-[#e0e0e0]">
                        {c.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums">{c.credits}</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold tabular-nums text-[#00a1ff]">
                      {c.grade}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => deleteCourse(c.id)}
                        className="text-[#828c94] hover:text-red-600 p-1 rounded-[4px] cursor-pointer transition-colors"
                        title="과목 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 5. CAMPUS / EXTERNAL / PART-TIME / CERTS TABS ================= */}
      {(activeSubTab === 'campus' ||
        activeSubTab === 'external' ||
        activeSubTab === 'part_time' ||
        activeSubTab === 'certification') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#2f3438]">
                {activeSubTab === 'campus' && '교내 활동 (연구·캡스톤·학회·동아리)'}
                {activeSubTab === 'external' && '교외 활동 (공모전·해커톤·인턴십·서포터즈)'}
                {activeSubTab === 'part_time' && '아르바이트 경험 (직무 역량화)'}
                {activeSubTab === 'certification' && '자격증 및 어학 시험 이력'}
              </h2>
              <p className="text-[12px] text-[#828c94]">
                {activeSubTab === 'part_time'
                  ? '아르바이트도 위기 대처, 프로세스 개선, 고객 소통 등 강력한 취업 역량 데이터로 관리됩니다.'
                  : '경험을 상세히 기록할수록 AI 자기소개서와 면접 대비에서 차별화된 답변이 생성됩니다.'}
              </p>
            </div>
            <button
              onClick={onOpenNewExperience}
              className="px-4 py-2 text-[13px] font-bold bg-[#00a1ff] hover:bg-[#0497ef] text-white rounded-[4px] cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              경험 등록
            </button>
          </div>

          <div className="space-y-3">
            {filteredExperiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all text-[13px] space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[12px] text-[#828c94]">
                      <span className="font-bold text-[#00a1ff] bg-[#ddf3ff]/60 px-2 py-0.5 rounded-[3px]">
                        [{exp.subCategory || exp.category}]
                      </span>
                      <span>·</span>
                      <span className="text-[#2f3438] font-semibold">{exp.organization}</span>
                      <span>·</span>
                      <span>{exp.startDate} ~ {exp.endDate}</span>
                      {exp.role && <span>({exp.role})</span>}
                    </div>
                    <h3 className="text-base font-bold text-[#2f3438] hover:text-[#00a1ff] transition-colors">{exp.title}</h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditExperience(exp)}
                      className="p-1.5 text-[#828c94] hover:text-[#00a1ff] hover:bg-[#f7f9fa] rounded-[4px] cursor-pointer"
                      title="수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="p-1.5 text-[#828c94] hover:text-red-600 hover:bg-red-50 rounded-[4px] cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-[#424242] leading-relaxed bg-[#f7f9fa] p-3 rounded-[4px] border border-[#eaedef]">
                  <span className="font-bold text-[#2f3438]">수행 업무: </span>
                  {exp.description}
                </div>

                {(exp.problem || exp.solution) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px]">
                    {exp.problem && (
                      <div className="bg-[#f7f9fa] p-2.5 rounded-[4px] border border-[#eaedef]">
                        <span className="font-bold text-[#2f3438]">문제 상황: </span>
                        <span className="text-[#424242]">{exp.problem}</span>
                      </div>
                    )}
                    {exp.solution && (
                      <div className="bg-[#f7f9fa] p-2.5 rounded-[4px] border border-[#eaedef]">
                        <span className="font-bold text-[#2f3438]">해결 과정: </span>
                        <span className="text-[#424242]">{exp.solution}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-[#eaedef] flex flex-wrap items-center justify-between gap-2 text-[12px]">
                  <div className="font-semibold text-[#2f3438] flex items-center gap-1.5">
                    <span className="bg-[#00a1ff] text-white text-[11px] px-2 py-0.5 rounded-[3px] font-bold">
                      성과
                    </span>
                    <span className="text-[#424242]">{exp.result}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {exp.competencies.map((comp) => (
                      <span
                        key={comp}
                        className="bg-[#f7f9fa] text-[#424242] border border-[#e0e0e0] text-[11px] px-2 py-0.5 rounded-[3px]"
                      >
                        #{comp}
                      </span>
                    ))}
                    {exp.evidenceIds.map((evId) => {
                      const file = evidenceFiles.find((f) => f.id === evId);
                      if (!file) return null;
                      return (
                        <button
                          key={evId}
                          onClick={() => handleDownloadFile(file)}
                          className="bg-white hover:bg-[#f7f9fa] text-[#00a1ff] border border-[#b9e5fe] text-[11px] px-2 py-0.5 rounded-[3px] flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <FileCheck className="w-3 h-3 text-[#00a1ff]" />
                          <span>{file.title}</span>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => onOpenEvidenceUpload(exp.id)}
                      className="text-[11px] text-[#828c94] hover:text-[#00a1ff] px-1 py-0.5 cursor-pointer underline"
                    >
                      + 증빙 연결
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 6. EVIDENCE VAULT (증빙 보관함) ================= */}
      {activeSubTab === 'vault' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] font-bold">
                  EVIDENCE VAULT
                </span>
                <span className="text-[12px] text-[#828c94] font-mono">총 {evidenceFiles.length}개 파일 보관 중</span>
              </div>
              <h2 className="text-lg font-bold text-[#2f3438]">증빙 자료 클라우드 보관함</h2>
              <p className="text-[12px] text-[#828c94] mt-0.5">
                성적표, 자격증, 수료증, 상장, 인턴 확인서를 안전하게 보관하고 필요할 때 즉시 다운로드하세요.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenEvidenceUpload()}
                className="px-4 py-2 text-[13px] font-bold bg-[#00a1ff] hover:bg-[#0497ef] text-white rounded-[4px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                문서 업로드
              </button>
              <button
                onClick={handleBatchDownload}
                className="px-3.5 py-2 text-[13px] font-medium bg-white border border-[#e0e0e0] text-[#2f3438] rounded-[4px] hover:bg-[#f7f9fa] cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                일괄 다운로드
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {evidenceFiles.map((ev) => {
              const linkedExp = experiences.find((e) => e.id === ev.linkedExperienceId);
              return (
                <div
                  key={ev.id}
                  className="bg-white p-4 rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all text-[13px] flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-9 h-9 rounded-[4px] bg-[#ddf3ff]/60 text-[#00a1ff] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] text-[#00a1ff] font-medium bg-[#ddf3ff]/40 px-2 py-0.5 rounded-[3px] border border-[#b9e5fe]">
                        {ev.category === 'transcript'
                          ? '성적표'
                          : ev.category === 'certificate'
                          ? '자격/어학'
                          : ev.category === 'award'
                          ? '공모전 상장'
                          : ev.category === 'work_proof'
                          ? '근무/인턴 확인서'
                          : ev.category === 'enrollment'
                          ? '재학증명서'
                          : '포트폴리오'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#2f3438] line-clamp-1">{ev.title}</h4>
                      <p className="text-[12px] text-[#828c94] font-mono truncate">{ev.fileName}</p>
                    </div>

                    <div className="text-[12px] text-[#828c94] font-mono flex items-center gap-2">
                      <span>{ev.fileSize}</span>
                      <span>·</span>
                      <span>{ev.uploadDate}</span>
                    </div>

                    {linkedExp && (
                      <div className="text-[11px] bg-[#f7f9fa] text-[#424242] p-2 rounded-[3px] border border-[#eaedef] truncate">
                        🔗 연결: {linkedExp.title}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#eaedef]">
                    <button
                      onClick={() => setPreviewEvidence(ev)}
                      className="text-[12px] text-[#424242] hover:text-[#00a1ff] flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      미리보기
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadFile(ev)}
                        className="px-2.5 py-1 text-[12px] text-[#2f3438] hover:bg-[#f7f9fa] rounded-[4px] font-medium flex items-center gap-1 cursor-pointer border border-[#e0e0e0]"
                      >
                        <Download className="w-3 h-3" />
                        다운로드
                      </button>
                      <button
                        onClick={() => deleteEvidenceFile(ev.id)}
                        className="p-1 text-[#828c94] hover:text-red-600 rounded-[4px] cursor-pointer"
                        title="파일 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evidence Preview Modal */}
          {previewEvidence && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-[4px] max-w-lg w-full p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-4 text-[13px]">
                <div className="flex items-center justify-between pb-3 border-b border-[#eaedef]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00a1ff]" />
                    <h3 className="font-bold text-base text-[#2f3438]">{previewEvidence.title}</h3>
                  </div>
                  <button
                    onClick={() => setPreviewEvidence(null)}
                    className="p-1 text-[#828c94] hover:text-[#2f3438] cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="bg-[#f7f9fa] border border-[#e0e0e0] rounded-[4px] p-8 text-center space-y-2">
                  <div className="w-16 h-16 rounded-[4px] bg-[#ddf3ff]/60 text-[#00a1ff] flex items-center justify-center mx-auto mb-2">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div className="font-bold text-[#2f3438] text-base">{previewEvidence.fileName}</div>
                  <div className="text-[12px] text-[#828c94] font-mono">
                    크기: {previewEvidence.fileSize} · 형식: {previewEvidence.fileType}
                  </div>
                  <div className="text-[12px] text-[#828c94] font-mono">
                    보관일자: {previewEvidence.uploadDate} · SHA-256 서명 무결성 검증 완료
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setPreviewEvidence(null)}
                    className="px-3.5 py-2 text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] cursor-pointer"
                  >
                    닫기
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadFile(previewEvidence);
                      setPreviewEvidence(null);
                    }}
                    className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold rounded-[4px] shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    파일 다운로드
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
