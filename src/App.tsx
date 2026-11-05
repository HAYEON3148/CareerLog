import React, { useState } from 'react';
import { CareerProvider, useCareer } from './context/CareerContext';
import { Navbar } from './components/Navbar';
import { MyCareerView } from './components/views/MyCareerView';
import { AnalysisView } from './components/views/AnalysisView';
import { RecommendationsView } from './components/views/RecommendationsView';
import { CoverLetterView } from './components/views/CoverLetterView';
import { JobPrepView } from './components/views/JobPrepView';
import { CommunityView } from './components/views/CommunityView';
import { ExperienceModal } from './components/modals/ExperienceModal';
import { OcrModal } from './components/modals/OcrModal';
import { EvidenceUploadModal } from './components/modals/EvidenceUploadModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { ExperienceItem } from './types/career';

const MainLayout: React.FC = () => {
  const { activeMenu, setActiveMenu } = useCareer();

  // Modal states
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceLinkedExpId, setEvidenceLinkedExpId] = useState<string | undefined>(undefined);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleOpenNewExperience = () => {
    setEditingExperience(null);
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (exp: ExperienceItem) => {
    setEditingExperience(exp);
    setIsExperienceModalOpen(true);
  };

  const handleOpenEvidenceUpload = (expId?: string) => {
    setEvidenceLinkedExpId(expId);
    setIsEvidenceModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] flex flex-col font-sans text-[#2f3438]">
      {/* Top Fixed SaaS Header */}
      <Navbar
        onOpenNewExperience={handleOpenNewExperience}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeMenu === 'my_career' && (
          <MyCareerView
            onOpenNewExperience={handleOpenNewExperience}
            onOpenOcr={() => setIsOcrModalOpen(true)}
            onOpenEvidenceUpload={handleOpenEvidenceUpload}
            onEditExperience={handleEditExperience}
            onNavigateMenu={(menu) => setActiveMenu(menu)}
          />
        )}

        {activeMenu === 'analysis' && <AnalysisView />}

        {activeMenu === 'recommendations' && <RecommendationsView />}

        {activeMenu === 'cover_letter' && <CoverLetterView />}

        {activeMenu === 'job_prep' && <JobPrepView />}

        {activeMenu === 'community' && <CommunityView />}
      </main>

      {/* Clean Ohouse Footer */}
      <footer className="border-t border-[#eaedef] bg-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#828c94]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#2f3438]">Career<span className="text-[#00a1ff]">Log</span></span>
            <span className="text-[#828c94] text-xs font-semibold">커리어로그</span>
            <span>·</span>
            <span>모든 경험을 기록하고, 나만의 경쟁력으로.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="hover:text-[#2f3438] cursor-pointer">개인정보보호정책</span>
            <span className="hover:text-[#2f3438] cursor-pointer">서비스이용약관</span>
            <span className="hover:text-[#2f3438] cursor-pointer">증빙문서 무결성 암호화</span>
            <span className="text-[#828c94]">© 2026 CareerLog. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        initialData={editingExperience}
      />

      <OcrModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
      />

      <EvidenceUploadModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        defaultExperienceId={evidenceLinkedExpId}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CareerProvider>
      <MainLayout />
    </CareerProvider>
  );
}
