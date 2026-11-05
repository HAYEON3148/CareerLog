import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { CourseItem } from '../../types/career';
import { X, UploadCloud, CheckCircle2, Sparkles, Plus, Trash2 } from 'lucide-react';

interface OcrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OcrModal: React.FC<OcrModalProps> = ({ isOpen, onClose }) => {
  const { importCoursesFromOCR, addEvidenceFile } = useCareer();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedCourses, setExtractedCourses] = useState<Omit<CourseItem, 'id'>[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSample = () => {
    setSelectedFile(new File(['sample'], '2025_공식성적표_사본.jpg', { type: 'image/jpeg' }));
    setPreviewUrl('sample_loaded');
    runOcr('sample_loaded', '2025학년도 1학기 공식 성적증명서.pdf');
  };

  const runOcr = async (imgData: string, fileName: string) => {
    setLoading(true);
    setSuccessMessage(null);
    try {
      const res = await fetch('/api/ai/ocr-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgData === 'sample_loaded' ? null : imgData,
          filename: fileName,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        setExtractedCourses(data.courses);
        setSuccessMessage(data.message || '성적표에서 과목 및 학점이 성공적으로 인식되었습니다.');
      }
    } catch (err) {
      console.error('OCR Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteOcr = () => {
    if (!previewUrl && !selectedFile) return;
    runOcr(previewUrl || '', selectedFile?.name || '성적표.jpg');
  };

  const handleUpdateExtracted = (idx: number, field: keyof Omit<CourseItem, 'id'>, val: any) => {
    setExtractedCourses((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c))
    );
  };

  const handleAddCourseRow = () => {
    setExtractedCourses((prev) => [
      ...prev,
      { semester: '3-1', courseName: '새 이수 과목', credits: 3, grade: 'A+', type: '전공' },
    ]);
  };

  const handleRemoveRow = (idx: number) => {
    setExtractedCourses((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveToAcademics = () => {
    if (extractedCourses.length === 0) return;
    importCoursesFromOCR(extractedCourses);
    addEvidenceFile({
      title: `${selectedFile?.name || '공식 대학 성적표'} (OCR 등록)`,
      category: 'transcript',
      fileName: selectedFile?.name || '대학성적증명서.pdf',
      fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : '420 KB',
      fileType: selectedFile?.type || 'application/pdf',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[4px] max-w-2xl w-full my-8 p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#eaedef]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#00a1ff] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2f3438]">성적표 AI 스마트 OCR 자동 등록</h2>
              <p className="text-[12px] text-[#828c94]">
                성적표 이미지를 업로드하면 과목명, 학점, 성적, 전공/교양을 자동으로 추출합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#828c94] hover:text-[#2f3438] hover:bg-[#f7f9fa] rounded-[4px] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {!extractedCourses.length && (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-[#e0e0e0] hover:border-[#00a1ff] rounded-[4px] p-6 text-center transition-colors bg-[#f7f9fa]">
              <UploadCloud className="w-10 h-10 text-[#00a1ff] mx-auto mb-2" />
              <p className="text-[13px] font-bold text-[#2f3438] mb-1">
                성적표 스캔본 또는 캡처 이미지를 첨부하세요
              </p>
              <p className="text-[12px] text-[#828c94] mb-4">PNG, JPG, PDF 지원 (최대 10MB)</p>
              <div className="flex items-center justify-center gap-2">
                <label className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white text-[13px] font-bold rounded-[4px] cursor-pointer transition-colors shadow-xs active:scale-[0.98]">
                  파일 찾기
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="px-3.5 py-2 bg-white hover:bg-[#f7f9fa] text-[#2f3438] border border-[#e0e0e0] text-[13px] font-medium rounded-[4px] cursor-pointer transition-colors"
                >
                  대학 성적표 예시로 테스트
                </button>
              </div>
              {selectedFile && (
                <div className="mt-3 text-[12px] text-[#00a1ff] font-bold font-mono">
                  선택된 파일: {selectedFile.name}
                </div>
              )}
            </div>

            {selectedFile && !loading && (
              <button
                type="button"
                onClick={handleExecuteOcr}
                className="w-full py-2.5 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold text-[13px] rounded-[4px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                AI 성적표 과목 추출 시작
              </button>
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#00a1ff] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[13px] font-bold text-[#2f3438]">
              AI 비전 모델이 성적표의 과목명, 취득 학점, 성적을 분석하고 있습니다...
            </p>
            <p className="text-[12px] text-[#828c94]">전공 및 교양 과목 자동 분류 진행 중</p>
          </div>
        )}

        {/* Extracted Courses Verification Table */}
        {extractedCourses.length > 0 && !loading && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[12px] text-[#00a1ff] font-bold bg-[#ddf3ff]/60 px-3 py-1 rounded-[3px] border border-[#b9e5fe]">
                <CheckCircle2 className="w-4 h-4 text-[#00a1ff]" />
                <span>{successMessage || '총 5개 과목 인식 완료'}</span>
              </div>
              <button
                type="button"
                onClick={handleAddCourseRow}
                className="text-[12px] text-[#00a1ff] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                직접 과목 추가
              </button>
            </div>

            <p className="text-[12px] text-[#828c94]">
              인식된 과목 정보는 필요 시 직접 수정할 수 있으며, 하단의 저장 버튼을 누르면 학업 관리에 즉시 반영됩니다.
            </p>

            <div className="border border-[#e0e0e0] rounded-[4px] overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#f7f9fa] text-[#828c94] font-semibold border-b border-[#eaedef] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">학기</th>
                    <th className="py-2.5 px-3">과목명</th>
                    <th className="py-2.5 px-3 w-16">학점</th>
                    <th className="py-2.5 px-3 w-20">성적</th>
                    <th className="py-2.5 px-3 w-24">구분</th>
                    <th className="py-2.5 px-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedef]">
                  {extractedCourses.map((c, idx) => (
                    <tr key={idx} className="hover:bg-[#f7f9fa]">
                      <td className="py-1.5 px-3">
                        <input
                          type="text"
                          value={c.semester}
                          onChange={(e) => handleUpdateExtracted(idx, 'semester', e.target.value)}
                          className="w-14 px-1.5 py-1 border border-[#e0e0e0] rounded-[3px] text-center text-[12px] font-mono text-[#2f3438]"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <input
                          type="text"
                          value={c.courseName}
                          onChange={(e) => handleUpdateExtracted(idx, 'courseName', e.target.value)}
                          className="w-full px-2 py-1 border border-[#e0e0e0] rounded-[3px] text-[12px] text-[#2f3438]"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={c.credits}
                          onChange={(e) =>
                            handleUpdateExtracted(idx, 'credits', parseInt(e.target.value, 10) || 3)
                          }
                          className="w-12 px-1.5 py-1 border border-[#e0e0e0] rounded-[3px] text-center text-[12px] font-mono text-[#2f3438]"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <select
                          value={c.grade}
                          onChange={(e) => handleUpdateExtracted(idx, 'grade', e.target.value)}
                          className="px-1.5 py-1 border border-[#e0e0e0] rounded-[3px] text-[12px] bg-white font-bold text-[#00a1ff]"
                        >
                          {['A+', 'A0', 'B+', 'B0', 'C+', 'C0', 'D+', 'P'].map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-1.5 px-3">
                        <select
                          value={c.type}
                          onChange={(e) => handleUpdateExtracted(idx, 'type', e.target.value)}
                          className="px-1.5 py-1 border border-[#e0e0e0] rounded-[3px] text-[12px] bg-white text-[#424242]"
                        >
                          <option value="전공">전공</option>
                          <option value="교양">교양</option>
                        </select>
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="text-[#828c94] hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-[#eaedef]">
              <button
                type="button"
                onClick={() => {
                  setExtractedCourses([]);
                  setSelectedFile(null);
                }}
                className="text-[12px] text-[#828c94] hover:text-[#00a1ff] cursor-pointer"
              >
                다시 업로드하기
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-[13px] text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveToAcademics}
                  className="px-4 py-2 text-[13px] font-bold text-white bg-[#00a1ff] hover:bg-[#0497ef] rounded-[4px] transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  나의 학업 기록에 일괄 등록
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
