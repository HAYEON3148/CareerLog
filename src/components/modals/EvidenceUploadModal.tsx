import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { EvidenceFile } from '../../types/career';
import { X, UploadCloud } from 'lucide-react';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultExperienceId?: string;
}

export const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({
  isOpen,
  onClose,
  defaultExperienceId,
}) => {
  const { addEvidenceFile, experiences, linkEvidenceToExperience } = useCareer();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EvidenceFile['category']>('award');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('500 KB');
  const [fileType, setFileType] = useState('application/pdf');
  const [linkedExperienceId, setLinkedExperienceId] = useState<string>(defaultExperienceId || '');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type || 'application/pdf');
      setFileSize(`${(file.size / 1024).toFixed(0)} KB`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUsePreset = (presetName: string, cat: EvidenceFile['category'], ext: string) => {
    setTitle(presetName);
    setCategory(cat);
    setFileName(`${presetName.replace(/\s+/g, '_')}.${ext}`);
    setFileSize(ext === 'png' ? '1.4 MB' : '380 KB');
    setFileType(ext === 'png' ? 'image/png' : 'application/pdf');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvidence = addEvidenceFile({
      title: title.trim(),
      category,
      fileName: fileName || `${title.trim()}.pdf`,
      fileSize,
      fileType,
      linkedExperienceId: linkedExperienceId || undefined,
    });

    if (linkedExperienceId) {
      linkEvidenceToExperience(newEvidence.id, linkedExperienceId);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[4px] max-w-lg w-full my-8 p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-4 text-[13px]">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#eaedef]">
          <div>
            <h2 className="text-base font-bold text-[#2f3438]">증빙 자료 보관함 업로드</h2>
            <p className="text-[12px] text-[#828c94]">
              상장, 수료증, 성적표 등 취업 증빙 문서를 안전하게 보관하고 경험에 연결합니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#828c94] hover:text-[#2f3438] hover:bg-[#f7f9fa] rounded-[4px] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <label className="block font-bold text-[#2f3438] mb-1.5 text-[12px]">자주 등록하는 문서 프리셋</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { name: '공모전 우수상 상장', cat: 'award' as const, ext: 'png' },
              { name: '인턴십 수료증명서', cat: 'work_proof' as const, ext: 'pdf' },
              { name: '아르바이트 경력증명서', cat: 'work_proof' as const, ext: 'pdf' },
              { name: '자격증 취득확인서', cat: 'certificate' as const, ext: 'pdf' },
              { name: '대학 공식 재학증명서', cat: 'enrollment' as const, ext: 'pdf' },
            ].map((preset, i) => (
              <button
                type="button"
                key={i}
                onClick={() => handleUsePreset(preset.name, preset.cat, preset.ext)}
                className="px-2.5 py-1 bg-[#f7f9fa] hover:border-[#00a1ff] hover:text-[#00a1ff] text-[#424242] rounded-[4px] border border-[#e0e0e0] transition-colors cursor-pointer text-[11px] font-medium"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* File Upload Box */}
          <div className="border border-dashed border-[#e0e0e0] hover:border-[#00a1ff] rounded-[4px] p-5 text-center transition-colors bg-[#f7f9fa]">
            <UploadCloud className="w-8 h-8 text-[#00a1ff] mx-auto mb-1" />
            <div className="text-[#2f3438] font-bold mb-1 text-[13px]">
              {fileName ? fileName : '증빙 파일(PDF, PNG, JPG)을 선택하세요'}
            </div>
            <label className="inline-block px-3.5 py-1.5 bg-white border border-[#e0e0e0] hover:bg-[#f7f9fa] text-[#2f3438] font-medium rounded-[4px] cursor-pointer transition-colors text-[12px]">
              내 컴퓨터에서 파일 선택
              <input
                type="file"
                accept=".pdf,image/*,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1">
              문서 제목 <span className="text-[#00a1ff]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: 2025 해커톤 우수상 상장 스캔본"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
            />
          </div>

          {/* Document Category */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1">문서 분류</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EvidenceFile['category'])}
              className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] bg-white text-[#2f3438]"
            >
              <option value="transcript">성적표</option>
              <option value="enrollment">재학/졸업증명서</option>
              <option value="certificate">자격증 및 어학성적표</option>
              <option value="award">공모전 상장</option>
              <option value="work_proof">인턴 및 근무/경력 확인서</option>
              <option value="portfolio">프로젝트 결과물 및 포트폴리오</option>
              <option value="other">기타 증빙 문서</option>
            </select>
          </div>

          {/* Link to Experience */}
          <div>
            <label className="block font-bold text-[#2f3438] mb-1">
              연결할 경험 활동 (선택)
            </label>
            <select
              value={linkedExperienceId}
              onChange={(e) => setLinkedExperienceId(e.target.value)}
              className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] bg-white text-[#2f3438]"
            >
              <option value="">-- 연결하지 않음 (일반 보관) --</option>
              {experiences.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  [{exp.subCategory || exp.category}] {exp.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#828c94] mt-1">
              경험과 연결해 두면 자기소개서 작성 및 증빙 제출 시 원클릭으로 함께 관리됩니다.
            </p>
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
              보관함에 저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
