import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { MainNavMenu } from '../types/career';
import {
  FileText,
  Sparkles,
  Compass,
  PenTool,
  Briefcase,
  Plus,
  RefreshCw,
  FolderOpen,
  GraduationCap,
  Users
} from 'lucide-react';

interface NavbarProps {
  onOpenNewExperience: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewExperience, onOpenProfile }) => {
  const { activeMenu, setActiveMenu, profile, resetToDefault } = useCareer();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const menuItems: { id: MainNavMenu; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'my_career', label: '나의 커리어', icon: FolderOpen },
    { id: 'analysis', label: 'AI 커리어 분석', icon: Sparkles },
    { id: 'recommendations', label: '맞춤형 추천', icon: Compass },
    { id: 'cover_letter', label: 'AI 자기소개서', icon: PenTool },
    { id: 'job_prep', label: '취업 준비', icon: Briefcase },
    { id: 'community', label: '커뮤니티', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#eaedef] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Zone - Clean & Balanced CareerLog Identity */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setActiveMenu('my_career')}
              className="flex items-center gap-2 text-left focus:outline-hidden group cursor-pointer"
            >
              {/* Custom CareerLog Logomark */}
              <div className="w-8 h-8 rounded-[6px] bg-[#00a1ff] flex items-center justify-center text-white shadow-2xs group-hover:bg-[#0497ef] transition-colors shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <polyline points="9 14 12 11 15 13 18 9" />
                </svg>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[18px] text-[#2f3438] tracking-tight leading-none">
                  Career<span className="text-[#00a1ff]">Log</span>
                </span>
                <span className="text-[10px] font-bold text-[#00a1ff] bg-[#00a1ff]/10 px-1.5 py-0.5 rounded-[3px] leading-none tracking-tight">
                  커리어로그
                </span>
              </div>
            </button>
          </div>

          {/* 5+1 Main Navigation Menus - Responsive Ohouse Tab Style */}
          <nav className="flex items-center gap-0.5 md:gap-1 lg:gap-1.5 h-16 overflow-x-auto no-scrollbar shrink">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`relative h-16 flex items-center gap-1.5 px-2.5 lg:px-3 text-[13px] lg:text-[14px] font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'text-[#00a1ff] font-bold border-b-2 border-[#00a1ff]'
                      : 'text-[#2f3438] hover:text-[#00a1ff]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${isActive ? 'text-[#00a1ff]' : 'text-[#828c94]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Experience Add CTA - Ohouse compact blue action */}
            <button
              onClick={onOpenNewExperience}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-white bg-[#00a1ff] hover:bg-[#0497ef] active:scale-[0.98] rounded-[4px] transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">경험 기록하기</span>
              <span className="sm:hidden">기록</span>
            </button>

            {/* Profile Trigger - Ohouse outlined utility */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-white hover:bg-[#f7f9fa] rounded-[4px] text-left transition-colors cursor-pointer border border-[#e0e0e0]"
              title="사용자 프로필 및 목표 직무 설정"
            >
              <div className="text-right hidden xl:block">
                <div className="text-[12px] font-bold text-[#2f3438] leading-tight">{profile.name}</div>
                <div className="text-[10px] text-[#828c94] leading-tight">{profile.targetJobs[0] || '희망 직무'}</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#00a1ff] text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                {profile.name.slice(0, 1)}
              </div>
            </button>

            {/* Reset button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 text-[#828c94] hover:text-[#2f3438] hover:bg-[#f7f9fa] rounded-[4px] border border-transparent hover:border-[#e0e0e0] transition-colors cursor-pointer"
              title="샘플 데이터 초기화"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] max-w-sm w-full p-6 shadow-xl border border-[#e0e0e0] space-y-4">
            <h3 className="text-base font-bold text-[#2f3438]">샘플 데이터 초기화</h3>
            <p className="text-[13px] text-[#424242] leading-relaxed">
              모든 데이터를 대학생 김민서 님의 기본 샘플 프로필(학업, 캡스톤, 해커톤, 아르바이트, 증빙 자료 등)로 복구하시겠습니까?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-[13px] font-medium text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => {
                  resetToDefault();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-[13px] font-bold text-white bg-[#00a1ff] hover:bg-[#0497ef] rounded-[4px] transition-colors cursor-pointer shadow-xs"
              >
                초기화 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
