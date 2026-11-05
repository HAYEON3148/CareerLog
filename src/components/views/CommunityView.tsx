import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { CommunityPost, MentorProfile, ExpertConsultationRequest } from '../../types/career';
import {
  MessageSquare,
  Sparkles,
  ThumbsUp,
  Plus,
  Send,
  Award,
  UserCheck,
  Search,
  X,
  Pin,
  Building2,
  GraduationCap
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const {
    profile,
    stats,
    experiences,
    communityPosts,
    addCommunityPost,
    addCommunityComment,
    toggleVotePost,
    mentors,
    consultationRequests,
    requestConsultation,
  } = useCareer();

  // Navigation sub-tabs within Community
  const [activeSubTab, setActiveSubTab] = useState<'board' | 'mentors' | 'my_consultations'>('board');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');

  // Active Post Expansion for reading & commenting
  const [activePostId, setActivePostId] = useState<string | null>(communityPosts[0]?.id || null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAsExpert, setCommentAsExpert] = useState(false);

  // Modals
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [selectedMentorForConsult, setSelectedMentorForConsult] = useState<MentorProfile | null>(null);

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('spec_review');
  const [newTargetCompany, setNewTargetCompany] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTagsInput, setNewTagsInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachMySpec, setAttachMySpec] = useState(true);

  // Consultation Form State
  const [consultType, setConsultType] = useState<ExpertConsultationRequest['consultationType']>('spec_review');
  const [consultTargetCompany, setConsultTargetCompany] = useState('삼성전자 (DX부문)');
  const [consultTargetRole, setConsultTargetRole] = useState(profile.targetJobs[0] || 'S/W 개발 엔지니어');
  const [consultQuestion, setConsultQuestion] = useState('');

  // Category labels mapping
  const categoryLabels: Record<CommunityPost['category'], string> = {
    study: '공부법 & 스터디',
    job_discussion: '공고별 준비 토론',
    spec_review: '스펙 분석 & 상호 피드백',
    mentor_qa: '취업 전문가 Q&A',
    cover_letter_clinic: '자소서 첨삭 요청',
  };

  // Filter posts
  const filteredPosts = communityPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesCompany =
      selectedCompanyFilter === 'all' ||
      (post.targetCompany && post.targetCompany.includes(selectedCompanyFilter));
    const matchesSearch =
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesCompany && matchesSearch;
  });

  const activePost = communityPosts.find((p) => p.id === activePostId) || filteredPosts[0] || null;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tags = newTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const attachedSpec = attachMySpec
      ? {
          gpa: `전체 ${stats.totalGpa} / 전공 ${stats.majorGpa} (${profile.university})`,
          major: profile.department,
          keyExperiences: experiences.slice(0, 3).map((e) => `[${e.subCategory || e.category}] ${e.title}`),
          certs: experiences
            .filter((e) => e.category === 'certification')
            .map((e) => e.title),
        }
      : undefined;

    const created = addCommunityPost({
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      title: newTitle.trim(),
      content: newContent.trim(),
      authorName: isAnonymous ? '익명 학생' : `${profile.name}`,
      authorRole: isAnonymous ? '대학생' : `${profile.department} ${profile.gradeYear}`,
      isAnonymous,
      targetCompany: newTargetCompany.trim() || undefined,
      tags: tags.length > 0 ? tags : ['취업고민', '스펙피드백'],
      attachedSpecSummary: attachedSpec,
    });

    setIsNewPostModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTargetCompany('');
    setNewTagsInput('');
    setActivePostId(created.id);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addCommunityComment(postId, text, commentAsExpert);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleOpenConsultModal = (mentor: MentorProfile) => {
    setSelectedMentorForConsult(mentor);
    setConsultTargetCompany(mentor.company.includes('삼성') ? '삼성전자 (DX부문)' : mentor.company.includes('토스') ? '비바리퍼블리카 (토스)' : '네이버');
    setIsConsultModalOpen(true);
  };

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentorForConsult || !consultQuestion.trim()) return;

    const typeLabels = {
      cover_letter: '자기소개서 1:1 정밀 첨삭',
      spec_review: '직무 스펙 정밀 진단',
      mock_interview: '기술/인성 면접 방어 전략',
      career_path: '직무 로드맵 및 커리어 패스 상담',
    };

    requestConsultation({
      mentorId: selectedMentorForConsult.id,
      mentorName: selectedMentorForConsult.name,
      mentorCompany: selectedMentorForConsult.company,
      consultationType: consultType,
      consultationTypeLabel: typeLabels[consultType],
      targetCompany: consultTargetCompany,
      targetRole: consultTargetRole,
      question: consultQuestion.trim(),
    });

    setIsConsultModalOpen(false);
    setConsultQuestion('');
    setActiveSubTab('my_consultations');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Ohouse White Canvas */}
      <div className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] bg-[#00a1ff] text-white px-2 py-0.5 rounded-[3px] font-bold">
              CAREER COMMUNITY & MENTORING
            </span>
            <span className="text-[12px] text-[#828c94]">
              취준생 동료와 현직 멘토가 함께 만드는 합격 광장
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2f3438] tracking-tight">
            커리어 커뮤니티 & 취업 전문가 멘토링
          </h1>
          <p className="text-[13px] text-[#424242] mt-0.5">
            공부법 고민, 삼성·토스 공고 대비 스터디, 스펙 상호 피드백부터 대기업·빅테크 현직자/취업 전문가와의 1:1 자소서 첨삭까지 자유롭게 나누세요.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsNewPostModalOpen(true)}
            className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white text-[13px] font-bold rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>새 고민 / 질문 글쓰기</span>
          </button>
        </div>
      </div>

      {/* Main Top Navigation Sub-Tabs - Ohouse Segment Style */}
      <div className="flex items-center justify-between border-b border-[#eaedef] pb-3 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('board')}
            className={`px-3.5 py-1.5 rounded-[4px] text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'board'
                ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                : 'text-[#424242] hover:text-[#00a1ff] hover:bg-white border border-transparent'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>커뮤니티 광장 (질문 & 토론)</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-[3px] ${activeSubTab === 'board' ? 'bg-[#0497ef] text-white' : 'bg-[#eaedef] text-[#424242]'}`}>
              {communityPosts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('mentors')}
            className={`px-3.5 py-1.5 rounded-[4px] text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'mentors'
                ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                : 'text-[#424242] hover:text-[#00a1ff] hover:bg-white border border-transparent'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>취업 전문가 & 현직자 멘토단</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-[3px] ${activeSubTab === 'mentors' ? 'bg-[#0497ef] text-white' : 'bg-[#eaedef] text-[#424242]'}`}>
              {mentors.length}명 대기
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('my_consultations')}
            className={`px-3.5 py-1.5 rounded-[4px] text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'my_consultations'
                ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                : 'text-[#424242] hover:text-[#00a1ff] hover:bg-white border border-transparent'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>나의 1:1 전문가 상담 / 첨삭</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-[3px] ${activeSubTab === 'my_consultations' ? 'bg-[#0497ef] text-white' : 'bg-[#eaedef] text-[#424242]'}`}>
              {consultationRequests.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#828c94]" />
          <input
            type="text"
            placeholder="키워드, 기업명, 태그 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:outline-hidden focus:border-[#00a1ff]"
          />
        </div>
      </div>

      {/* ================= VIEW 1: COMMUNITY BOARD ================= */}
      {activeSubTab === 'board' && (
        <div className="space-y-4">
          {/* Category & Company Filter Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[4px] border border-[#e0e0e0] text-[13px] shadow-2xs">
            {/* Category Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: '전체' },
                { id: 'study', label: '공부법 & 스터디' },
                { id: 'job_discussion', label: '공고별 대비 토론' },
                { id: 'spec_review', label: '스펙 분석 & 피드백' },
                { id: 'mentor_qa', label: '전문가 Q&A' },
                { id: 'cover_letter_clinic', label: '자소서 첨삭' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-[4px] transition-all whitespace-nowrap cursor-pointer text-[12px] ${
                    selectedCategory === cat.id
                      ? 'bg-[#00a1ff] text-white font-bold shadow-xs'
                      : 'bg-[#f7f9fa] border border-[#e0e0e0] hover:border-[#00a1ff] text-[#424242]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Target Company Fast Filters */}
            <div className="flex items-center gap-1 text-[12px] font-mono shrink-0">
              <span className="text-[#828c94]">목표기업:</span>
              {['all', '삼성전자', '토스', '당근', '네이버'].map((comp) => (
                <button
                  key={comp}
                  onClick={() => setSelectedCompanyFilter(comp)}
                  className={`px-2 py-0.5 rounded-[3px] transition-colors cursor-pointer ${
                    selectedCompanyFilter === comp
                      ? 'bg-[#00a1ff] text-white font-bold'
                      : 'text-[#424242] hover:bg-[#f7f9fa]'
                  }`}
                >
                  {comp === 'all' ? '전체' : comp}
                </button>
              ))}
            </div>
          </div>

          {/* Master-Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Post List (5 Cols on LG) */}
            <div className="lg:col-span-5 space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="bg-white p-8 rounded-[4px] border border-[#e0e0e0] text-center space-y-2">
                  <p className="text-[13px] text-[#828c94]">해당 조건에 맞는 게시글이 없습니다.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedCompanyFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-[13px] text-[#00a1ff] font-bold underline cursor-pointer"
                  >
                    필터 초기화
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isSelected = activePost?.id === post.id;
                  return (
                    <div
                      key={post.id}
                      onClick={() => setActivePostId(post.id)}
                      className={`p-4 rounded-[4px] border transition-all cursor-pointer text-[13px] space-y-2.5 shadow-2xs ${
                        isSelected
                          ? 'bg-[#f0f9ff] border-[#00a1ff] ring-1 ring-[#00a1ff]'
                          : 'bg-white border-[#e0e0e0] hover:border-[#00a1ff]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {post.isPinned && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-[#00a1ff] text-white text-[10px] font-bold rounded-[3px]">
                              <Pin className="w-2.5 h-2.5" /> 고정
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-[#ddf3ff]/60 text-[#00a1ff] text-[11px] font-semibold rounded-[3px] border border-[#b9e5fe]">
                            {post.categoryLabel}
                          </span>
                          {post.targetCompany && (
                            <span className="px-2 py-0.5 bg-[#f7f9fa] text-[#424242] border border-[#e0e0e0] text-[11px] font-mono rounded-[3px]">
                              {post.targetCompany}
                            </span>
                          )}
                        </div>

                        {post.hasExpertAnswer && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00a1ff] bg-white px-2 py-0.5 rounded-[3px] border border-[#00a1ff]">
                            <Sparkles className="w-2.5 h-2.5" /> 멘토 답변
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-[#2f3438] line-clamp-2 leading-snug hover:text-[#00a1ff] transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-[#424242] line-clamp-2 text-[12px] leading-relaxed">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-[#828c94] pt-2 border-t border-[#eaedef] font-mono">
                        <div className="flex items-center gap-1.5 text-[#424242]">
                          <span>{post.authorName}</span>
                          <span>·</span>
                          <span>{post.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3.5 h-3.5 text-[#828c94]" />
                            <span>{post.votes}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-[#828c94]" />
                            <span>{post.commentsCount}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Active Post Detail & Commenting (7 Cols on LG) */}
            <div className="lg:col-span-7">
              {activePost ? (
                <div className="bg-white rounded-[4px] border border-[#e0e0e0] p-6 space-y-5 text-[13px] shadow-2xs">
                  {/* Post Header */}
                  <div className="space-y-2.5 border-b border-[#eaedef] pb-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#00a1ff] text-white text-[12px] font-bold rounded-[3px]">
                          {activePost.categoryLabel}
                        </span>
                        {activePost.targetCompany && (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#f7f9fa] text-[#2f3438] text-[12px] font-medium rounded-[3px] border border-[#e0e0e0]">
                            <Building2 className="w-3.5 h-3.5 text-[#00a1ff]" />
                            {activePost.targetCompany}
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[#828c94] font-mono">
                        {activePost.createdAt} · 조회 {activePost.views}
                      </div>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-[#2f3438] tracking-tight leading-snug">
                      {activePost.title}
                    </h2>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#00a1ff] text-white flex items-center justify-center font-bold text-xs">
                          {activePost.authorName.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-bold text-[#2f3438] text-[13px]">{activePost.authorName}</div>
                          <div className="text-[11px] text-[#828c94]">{activePost.authorRole}</div>
                        </div>
                      </div>

                      {/* Vote Button */}
                      <button
                        type="button"
                        onClick={() => toggleVotePost(activePost.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] border text-[13px] font-bold transition-all cursor-pointer ${
                          activePost.hasVoted
                            ? 'bg-[#00a1ff] text-white border-[#00a1ff] shadow-xs'
                            : 'bg-white hover:bg-[#f7f9fa] text-[#2f3438] border-[#e0e0e0]'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>추천 {activePost.votes}</span>
                      </button>
                    </div>
                  </div>

                  {/* Attached Spec Card if present */}
                  {activePost.attachedSpecSummary && (
                    <div className="bg-[#f7f9fa] border border-[#e0e0e0] rounded-[4px] p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2f3438] flex items-center gap-1.5 text-[13px]">
                          <GraduationCap className="w-4 h-4 text-[#00a1ff]" />
                          작성자 커리어로그 스펙 요약 카드
                        </span>
                        <span className="text-[11px] font-mono text-[#00a1ff] font-bold bg-[#ddf3ff]/60 px-2 py-0.5 rounded-[3px] border border-[#b9e5fe]">
                          실시간 연동 인증됨
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                        <div>
                          <span className="text-[#828c94] font-mono">학점/대학: </span>
                          <strong className="text-[#2f3438]">{activePost.attachedSpecSummary.gpa}</strong>
                        </div>
                        <div>
                          <span className="text-[#828c94] font-mono">전공: </span>
                          <strong className="text-[#2f3438]">{activePost.attachedSpecSummary.major}</strong>
                        </div>
                      </div>

                      {activePost.attachedSpecSummary.keyExperiences && (
                        <div>
                          <div className="text-[11px] text-[#828c94] font-mono mb-1">핵심 활동 이력:</div>
                          <ul className="space-y-1">
                            {activePost.attachedSpecSummary.keyExperiences.map((exp, i) => (
                              <li key={i} className="text-[#424242] flex items-start gap-1.5 text-[12px]">
                                <span className="text-[#00a1ff]">•</span>
                                <span>{exp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activePost.attachedSpecSummary.certs && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#eaedef]">
                          <span className="text-[11px] text-[#828c94] font-mono">보유 자격/어학:</span>
                          {activePost.attachedSpecSummary.certs.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white text-[#2f3438] text-[11px] rounded-[3px] border border-[#e0e0e0]">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="text-[#2f3438] text-[14px] leading-relaxed whitespace-pre-line py-2">
                    {activePost.content}
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    {activePost.tags.map((tag, i) => (
                      <span key={i} className="text-[12px] text-[#00a1ff] bg-[#f0f9ff] px-2 py-0.5 rounded-[3px] border border-[#b9e5fe] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-[#eaedef] pt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#2f3438] flex items-center gap-1.5 text-base">
                        <MessageSquare className="w-4 h-4 text-[#00a1ff]" />
                        답변 및 피드백 ({activePost.comments.length})
                      </h4>
                      <span className="text-[12px] text-[#828c94]">
                        현직자/취업전문가 공인 뱃지 피드백 포함
                      </span>
                    </div>

                    {/* Existing Comments List */}
                    <div className="space-y-3">
                      {activePost.comments.map((comm) => (
                        <div
                          key={comm.id}
                          className={`p-4 rounded-[4px] border text-[13px] space-y-2 shadow-2xs ${
                            comm.isExpert
                              ? 'bg-[#f0f9ff] border-[#00a1ff]'
                              : 'bg-white border-[#e0e0e0]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${
                                comm.isExpert ? 'bg-[#00a1ff] text-white' : 'bg-[#e0e0e0] text-[#2f3438]'
                              }`}>
                                {comm.authorName.slice(0, 1)}
                              </div>
                              <div>
                                <div className="font-bold text-[#2f3438] flex items-center gap-1.5">
                                  <span>{comm.authorName}</span>
                                  {comm.isExpert && (
                                    <span className="inline-flex items-center gap-0.5 bg-[#00a1ff] text-white text-[10px] px-2 py-0.2 rounded-[3px] font-mono font-bold">
                                      <Sparkles className="w-2.5 h-2.5" /> 공인 멘토
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#828c94]">{comm.authorRole}</div>
                              </div>
                            </div>
                            <span className="text-[11px] text-[#828c94] font-mono">{comm.createdAt}</span>
                          </div>

                          <p className="text-[#424242] text-[12px] leading-relaxed whitespace-pre-line pl-9">
                            {comm.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Comment Input Box */}
                    <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef] space-y-2.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-bold text-[#2f3438]">답변 / 피드백 남기기</span>
                        <label className="flex items-center gap-1.5 text-[#424242] cursor-pointer text-[11px]">
                          <input
                            type="checkbox"
                            checked={commentAsExpert}
                            onChange={(e) => setCommentAsExpert(e.target.checked)}
                            className="rounded accent-[#00a1ff]"
                          />
                          <span>멘토 시뮬레이션 모드로 답변 달기</span>
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          placeholder={
                            commentAsExpert
                              ? "홍정우 멘토(전 삼성 DX 수석) 명의로 전문적인 피드백을 작성합니다..."
                              : "따뜻한 조언이나 스터디 참여 의사, 솔직한 스펙 피드백을 남겨주세요."
                          }
                          value={commentInputs[activePost.id] || ''}
                          onChange={(e) =>
                            setCommentInputs({ ...commentInputs, [activePost.id]: e.target.value })
                          }
                          className="flex-1 px-3.5 py-2 bg-white border border-[#e0e0e0] rounded-[4px] text-[13px] text-[#2f3438] focus:outline-hidden focus:border-[#00a1ff] resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(activePost.id)}
                          className="px-4 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold rounded-[4px] text-[13px] transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-xs active:scale-[0.98]"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[4px] border border-[#e0e0e0] p-8 text-center text-[#828c94] text-[13px]">
                  게시글을 선택해주세요.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: MENTORS LINEUP & CONSULTATION ================= */}
      {activeSubTab === 'mentors' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-[4px] border border-[#e0e0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] shadow-2xs">
            <div>
              <h3 className="font-bold text-[#2f3438] text-base">CareerLog 인증 현직자 & 취업 컨설턴트</h3>
              <p className="text-[#828c94] text-[12px] mt-0.5">
                삼성전자, 토스, 네이버 전/현직 테크 리드 및 채용 전문가가 1:1로 자소서 첨삭과 기술 면접 방어 전략을 상담해드립니다.
              </p>
            </div>
            <div className="text-[12px] font-mono text-[#00a1ff] bg-[#ddf3ff]/60 px-3.5 py-1.5 rounded-[4px] border border-[#b9e5fe] font-bold">
              ⚡ 실시간 온라인 상담 가능 <strong>3명</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white p-6 rounded-[4px] border border-[#e0e0e0] hover:border-[#00a1ff] transition-all text-[13px] space-y-4 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-[4px] bg-[#00a1ff] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                      {mentor.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-base text-[#2f3438]">{mentor.name}</span>
                        <span className="bg-[#ddf3ff]/60 text-[#00a1ff] text-[11px] font-bold px-2 py-0.5 rounded-[3px] border border-[#b9e5fe]">
                          {mentor.badge}
                        </span>
                        {mentor.isOnline && (
                          <span className="text-emerald-600 font-mono text-[11px] font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            상담 가능
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] font-bold text-[#424242] mt-0.5">
                        {mentor.company} · {mentor.role}
                      </div>
                      <div className="text-[11px] text-[#828c94] font-mono">
                        경력 {mentor.experienceYears} · 평점 ★ {mentor.rating} ({mentor.reviewsCount}건 완료)
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[#424242] text-[12px] leading-relaxed bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef]">
                  "{mentor.intro}"
                </p>

                {/* Specialties */}
                <div>
                  <div className="text-[11px] text-[#828c94] font-mono mb-1.5">전문 지도 영역:</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {mentor.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-[#f7f9fa] border border-[#e0e0e0] text-[#424242] text-[11px] rounded-[3px] font-mono"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="flex items-center justify-between pt-3.5 border-t border-[#eaedef]">
                  <span className="text-[11px] text-[#828c94] font-mono">{mentor.availableSlot}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenConsultModal(mentor)}
                    className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white font-bold rounded-[4px] text-[13px] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-[0.98]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>1:1 상담 / 자소서 첨삭 신청</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= VIEW 3: MY CONSULTATION REQUESTS ================= */}
      {activeSubTab === 'my_consultations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-5 rounded-[4px] border border-[#e0e0e0] text-[13px] shadow-2xs">
            <div>
              <h3 className="font-bold text-[#2f3438] text-base">나의 1:1 전문가 상담 & 첨삭 이력</h3>
              <p className="text-[#828c94] text-[12px] mt-0.5">
                신청하신 자소서 첨삭 및 스펙 상담 질문에 대해 전문가가 작성한 공식 답변을 확인합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('mentors')}
              className="px-4 py-2 bg-[#00a1ff] hover:bg-[#0497ef] text-white rounded-[4px] text-[13px] font-bold cursor-pointer shadow-xs"
            >
              + 새 전문가 상담 신청하기
            </button>
          </div>

          <div className="space-y-3.5">
            {consultationRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 sm:p-6 rounded-[4px] border border-[#e0e0e0] text-[13px] space-y-4 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#eaedef] pb-3.5">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[12px] mb-1">
                      <span className="px-2.5 py-0.5 bg-[#00a1ff] text-white font-bold rounded-[3px]">
                        {req.consultationTypeLabel}
                      </span>
                      <span className="text-[#828c94]">·</span>
                      <span className="font-bold text-[#2f3438]">멘토: {req.mentorName} ({req.mentorCompany})</span>
                      <span className="text-[#828c94]">·</span>
                      <span className="text-[#424242]">목표: {req.targetCompany} ({req.targetRole})</span>
                    </div>
                    <div className="text-[11px] text-[#828c94] font-mono">신청일자: {req.createdAt}</div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold font-mono ${
                    req.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {req.status === 'completed' ? '✓ 답변 완료' : '대기 중'}
                  </span>
                </div>

                {/* Question */}
                <div className="bg-[#f7f9fa] p-4 rounded-[4px] border border-[#eaedef] space-y-1">
                  <div className="font-bold text-[#2f3438] text-[12px] flex items-center gap-1">
                    <span>Q. 나의 상담 질문</span>
                  </div>
                  <p className="text-[#424242] leading-relaxed text-[12px]">{req.question}</p>
                </div>

                {/* Expert Answer */}
                {req.answer ? (
                  <div className="bg-[#f0f9ff] border border-[#b9e5fe] text-[#2f3438] p-5 rounded-[4px] space-y-2">
                    <div className="flex items-center justify-between border-b border-[#b9e5fe]/60 pb-2">
                      <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#00a1ff]">
                        <Sparkles className="w-4 h-4" />
                        <span>{req.mentorName} 전문가 피드백 & 코칭 답변</span>
                      </div>
                      <span className="text-[11px] text-[#828c94] font-mono">{req.answeredAt}</span>
                    </div>
                    <p className="text-[#2f3438] text-[13px] leading-relaxed whitespace-pre-line">
                      {req.answer}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-[#f7f9fa] rounded-[4px] text-center text-[#828c94] text-[12px]">
                    전문가가 질문을 검토하고 있습니다. 보통 24시간 이내에 상세 피드백이 등록됩니다.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE NEW POST ================= */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[4px] max-w-xl w-full my-8 p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-4 text-[13px]">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#eaedef]">
              <div>
                <h3 className="font-bold text-lg text-[#2f3438]">커뮤니티 새 글 쓰기</h3>
                <p className="text-[#828c94] text-[12px]">
                  공부법 고민, 공고별 준비, 스펙 피드백, 자소서 첨삭 질문을 자유롭게 등록하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 text-[#828c94] hover:text-[#2f3438] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              {/* Category */}
              <div>
                <label className="block font-bold text-[#2f3438] mb-1">게시판 카테고리</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CommunityPost['category'])}
                  className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] bg-white text-[#2f3438]"
                >
                  <option value="spec_review">스펙 분석 & 상호 피드백</option>
                  <option value="job_discussion">공고별 준비 토론 (삼성, 토스 등)</option>
                  <option value="study">공부법 & 스터디원 모집</option>
                  <option value="cover_letter_clinic">자소서 첨삭 요청</option>
                  <option value="mentor_qa">취업 전문가 Q&A</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-[#2f3438] mb-1">
                  제목 <span className="text-[#00a1ff]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: [삼성전자 DX] SW개발 직무 기술면접 대비 스터디원 모집합니다"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
                />
              </div>

              {/* Target Company (Optional) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2f3438] mb-1">목표 기업 (선택)</label>
                  <input
                    type="text"
                    placeholder="예: 삼성전자 DX부문, 토스"
                    value={newTargetCompany}
                    onChange={(e) => setNewTargetCompany(e.target.value)}
                    className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2f3438] mb-1">태그 (쉼표 구분)</label>
                  <input
                    type="text"
                    placeholder="예: 코딩테스트, Redis, 캡스톤"
                    value={newTagsInput}
                    onChange={(e) => setNewTagsInput(e.target.value)}
                    className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
                  />
                </div>
              </div>

              {/* Attach My CareerLog Spec Card Checkbox */}
              <div className="bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef]">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#2f3438]">
                  <input
                    type="checkbox"
                    checked={attachMySpec}
                    onChange={(e) => setAttachMySpec(e.target.checked)}
                    className="rounded accent-[#00a1ff]"
                  />
                  <span>내 커리어로그 스펙 요약 카드 함께 첨부하기 (추천)</span>
                </label>
                <p className="text-[12px] text-[#828c94] mt-1 pl-6">
                  현재 등록된 학점({stats.totalGpa}), 캡스톤/해커톤 활동, 자격증 요약이 글 상단에 카드 형태로 첨부되어 동료와 멘토로부터 훨씬 정확한 피드백을 받을 수 있습니다.
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block font-bold text-[#2f3438] mb-1">
                  내용 <span className="text-[#00a1ff]">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="구체적인 고민이나 피드백 받고 싶은 포인트, 스터디 진행 방식 등을 상세히 적어주세요."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438] resize-none"
                />
              </div>

              {/* Anonymous toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#424242]">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded accent-[#00a1ff]"
                  />
                  <span>익명으로 게시하기</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#eaedef]">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#00a1ff] hover:bg-[#0497ef] rounded-[4px] shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  게시글 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EXPERT CONSULTATION REQUEST ================= */}
      {isConsultModalOpen && selectedMentorForConsult && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[4px] max-w-lg w-full my-8 p-6 shadow-2xl border border-[#e0e0e0] text-[#2f3438] space-y-4 text-[13px]">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#eaedef]">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00a1ff] font-bold mb-0.5">
                  <span>1:1 EXPERT CONSULTING</span>
                </div>
                <h3 className="font-bold text-lg text-[#2f3438]">
                  {selectedMentorForConsult.name} 멘토 1:1 상담 신청
                </h3>
                <p className="text-[#828c94] text-[12px]">
                  {selectedMentorForConsult.company} · {selectedMentorForConsult.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsConsultModalOpen(false)}
                className="p-1.5 text-[#828c94] hover:text-[#2f3438] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitConsultation} className="space-y-3.5">
              <div>
                <label className="block font-bold text-[#2f3438] mb-1">상담 희망 유형</label>
                <select
                  value={consultType}
                  onChange={(e) => setConsultType(e.target.value as ExpertConsultationRequest['consultationType'])}
                  className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] bg-white text-[#2f3438]"
                >
                  <option value="cover_letter">자기소개서 1:1 정밀 첨삭</option>
                  <option value="spec_review">직무 스펙 정밀 진단 & 합격선 평가</option>
                  <option value="mock_interview">기술 / 인성 면접 꼬리질문 방어 전략</option>
                  <option value="career_path">직무 로드맵 및 스펙 보완 가이드</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2f3438] mb-1">지원 목표 기업</label>
                  <input
                    type="text"
                    required
                    value={consultTargetCompany}
                    onChange={(e) => setConsultTargetCompany(e.target.value)}
                    className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2f3438] mb-1">지원 목표 직무</label>
                  <input
                    type="text"
                    required
                    value={consultTargetRole}
                    onChange={(e) => setConsultTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2f3438] mb-1">
                  질문 내용 및 첨삭 요청 사항 <span className="text-[#00a1ff]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="예: 캡스톤 Redis 분산 락 프로젝트에서 어떤 점을 더 보완해야 삼성전자 직무 면접에서 좋은 평가를 받을 수 있을까요?"
                  value={consultQuestion}
                  onChange={(e) => setConsultQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-[4px] focus:outline-hidden focus:border-[#00a1ff] text-[#2f3438] resize-none"
                />
              </div>

              <div className="bg-[#f7f9fa] p-3.5 rounded-[4px] border border-[#eaedef] text-[12px] text-[#424242]">
                💡 <strong>안내:</strong> 신청 시 {profile.name} 님의 CareerLog 프로필(학업, 캡스톤, 자격증) 데이터가 멘토에게 함께 전달되어 맞춤형 조언이 제공됩니다.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eaedef]">
                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(false)}
                  className="px-4 py-2 text-[#424242] hover:bg-[#f7f9fa] rounded-[4px] border border-[#e0e0e0] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#00a1ff] hover:bg-[#0497ef] rounded-[4px] shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  상담 신청 완료하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
