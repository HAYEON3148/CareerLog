import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { X, User } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, runAnalysis } = useCareer();

  const [name, setName] = useState(profile.name);
  const [university, setUniversity] = useState(profile.university);
  const [department, setDepartment] = useState(profile.department);
  const [gradeYear, setGradeYear] = useState(profile.gradeYear);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [bio, setBio] = useState(profile.bio || '');

  const [targetJobs, setTargetJobs] = useState<string[]>(profile.targetJobs);
  const [newJob, setNewJob] = useState('');

  const [targetCompanies, setTargetCompanies] = useState<string[]>(profile.targetCompanies);
  const [newCompany, setNewCompany] = useState('');

  if (!isOpen) return null;

  const handleAddJob = () => {
    if (newJob.trim() && !targetJobs.includes(newJob.trim())) {
      setTargetJobs([...targetJobs, newJob.trim()]);
      setNewJob('');
    }
  };

  const handleRemoveJob = (job: string) => {
    setTargetJobs(targetJobs.filter((j) => j !== job));
  };

  const handleAddCompany = () => {
    if (newCompany.trim() && !targetCompanies.includes(newCompany.trim())) {
      setTargetCompanies([...targetCompanies, newCompany.trim()]);
      setNewCompany('');
    }
  };

  const handleRemoveCompany = (company: string) => {
    setTargetCompanies(targetCompanies.filter((c) => c !== company));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      university: university.trim(),
      department: department.trim(),
      gradeYear: gradeYear.trim(),
      studentId: studentId.trim(),
      bio: bio.trim(),
      targetJobs,
      targetCompanies,
    });
    runAnalysis();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[4px] max-w-xl w-full my-8 p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-4 text-[13px]">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#eaedef]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#00a1ff] text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2f3438]">사용자 프로필 & 목표 설정</h2>
              <p className="text-[12px] text-[#828c94]">기본 정보와 희망 직무/기업을 설정하면 AI 분석이 이에 맞춰 정밀화됩니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#828c94] hover:text-[#2f3438] hover:bg-[#f7f9fa] rounded-[4px] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">이름</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">학년/학기</label>
              <input
                type="text"
                value={gradeYear}
                onChange={(e) => setGradeYear(e.target.value)}
                placeholder="예: 4학년 1학기"
                className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">소속 대학교</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2f3438] mb-1">학과 / 전공</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
            </div>
          </div>

          {/* Target Jobs */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1">목표 희망 직무 (복수 등록 가능)</label>
            <div className="flex gap-2 mb-1.5">
              <input
                type="text"
                placeholder="예: 백엔드 엔지니어, 데이터 엔지니어"
                value={newJob}
                onChange={(e) => setNewJob(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddJob();
                  }
                }}
                className="flex-1 px-3.5 py-1.5 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
              <button
                type="button"
                onClick={handleAddJob}
                className="px-3.5 py-1.5 bg-[#f7f9fa] border border-[#e0e0e0] hover:bg-[#eaedef] text-[#2f3438] font-bold rounded-[4px] transition-colors cursor-pointer text-[12px]"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {targetJobs.map((job) => (
                <span
                  key={job}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f0f9ff] text-[#00a1ff] border border-[#b9e5fe] rounded-[3px] text-[11px] font-bold"
                >
                  {job}
                  <button
                    type="button"
                    onClick={() => handleRemoveJob(job)}
                    className="text-[#828c94] hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Target Companies */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1">목표 희망 기업</label>
            <div className="flex gap-2 mb-1.5">
              <input
                type="text"
                placeholder="예: 삼성전자, 토스, 당근, 네이버"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCompany();
                  }
                }}
                className="flex-1 px-3.5 py-1.5 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
              />
              <button
                type="button"
                onClick={handleAddCompany}
                className="px-3.5 py-1.5 bg-[#f7f9fa] border border-[#e0e0e0] hover:bg-[#eaedef] text-[#2f3438] font-bold rounded-[4px] transition-colors cursor-pointer text-[12px]"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {targetCompanies.map((comp) => (
                <span
                  key={comp}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f0f9ff] text-[#00a1ff] border border-[#b9e5fe] rounded-[3px] text-[11px] font-bold"
                >
                  {comp}
                  <button
                    type="button"
                    onClick={() => handleRemoveCompany(comp)}
                    className="text-[#828c94] hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1">한 줄 소개 및 커리어 비전</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="예: 기술로 일상의 비효율을 해결하는 것에 가치를 두는 개발자입니다."
              className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3.5 border-t border-[#eaedef]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#00a1ff] hover:bg-[#0497ef] rounded-[4px] shadow-xs transition-colors cursor-pointer active:scale-[0.98]"
            >
              설정 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
