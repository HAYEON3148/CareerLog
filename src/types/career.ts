export type ExperienceCategory = 
  | 'campus'       // 교내 활동
  | 'external'     // 교외 활동
  | 'part_time'    // 아르바이트
  | 'project'      // 프로젝트
  | 'certification'; // 자격증 및 어학

export interface CourseItem {
  id: string;
  semester: string; // e.g. "1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1"
  courseName: string;
  credits: number;
  grade: 'A+' | 'A0' | 'B+' | 'B0' | 'C+' | 'C0' | 'D+' | 'D0' | 'F' | 'P';
  type: '전공' | '교양';
}

export interface UserProfile {
  name: string;
  university: string;
  department: string;
  gradeYear: string; // e.g. "4학년 1학기"
  studentId: string;
  targetJobs: string[];
  targetCompanies: string[];
  bio?: string;
}

export interface ExperienceItem {
  id: string;
  category: ExperienceCategory;
  subCategory?: string; // e.g. "캡스톤 디자인", "해커톤", "서포터즈", "카페 바리스타"
  title: string;
  organization: string; // 소속 기관 or 근무처
  startDate: string; // YYYY.MM
  endDate: string; // YYYY.MM or "진행 중"
  current?: boolean;
  role: string; // 본인의 역할
  description: string; // 수행 업무 / 활동 내용
  problem?: string; // 직면했던 문제 상황
  solution?: string; // 해결 과정 및 본인의 조치
  result: string; // 성과 및 결과 (정량/정성)
  learned?: string; // 배운 점 및 습득 역량
  competencies: string[]; // 관련 역량 태그
  evidenceIds: string[]; // 증빙 자료 보관함 ID 목록
  createdAt: string;
}

export interface EvidenceFile {
  id: string;
  title: string;
  category: 'transcript' | 'enrollment' | 'certificate' | 'award' | 'work_proof' | 'portfolio' | 'other';
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  linkedExperienceId?: string;
  fileDataUrl?: string; // For preview or mock download
  downloadUrl?: string;
}

export interface TargetJobPosting {
  id: string;
  company: string;
  title: string;
  role: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string;
  deadline: string;
  url?: string;
}

export interface CoverLetter {
  id: string;
  companyName: string;
  jobTitle: string;
  question: string;
  maxChars: number;
  title: string;
  content: string;
  usedExperienceIds: string[];
  matchingRationale?: string;
  version: number;
  updatedAt: string;
}

export interface PassedCoverLetter {
  id: string;
  company: string;
  role: string;
  year: string;
  question: string;
  title: string;
  content: string;
  verified: boolean;
  viewsCount: number;
  authorRewardCredits: number;
  tags: string[];
  authorName: string;
}

export interface MockInterviewRecord {
  id: string;
  date: string;
  companyName: string;
  jobTitle: string;
  question: string;
  category: string;
  userAnswer: string;
  score: number;
  logicEvaluation: string;
  strengths: string[];
  improvements: string[];
  followUpQuestion?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'contest' | 'exam' | 'internship' | 'document' | 'interview' | 'study';
  dDay: number;
  memo?: string;
}

export interface StrengthAnalysis {
  competency: string;
  evidence: string;
  rating: '탁월' | '우수' | '양호';
}

export interface GapAnalysis {
  competency: string;
  status: '충분' | '보완 필요' | '경험 부족';
  advice: string;
}

export interface RediscoveredValue {
  sourceExperience: string;
  discoveredCompetency: string;
  resumeBullet: string;
}

export interface AICompetencyAnalysis {
  fitScore: number;
  fitSummary: string;
  strengths: StrengthAnalysis[];
  gaps: GapAnalysis[];
  rediscoveredValues: RediscoveredValue[];
  strategicActionPlan: string[];
  isLiveAI?: boolean;
  analyzedAt: string;
}

export type MainNavMenu = 
  | 'my_career'       // 1. 나의 커리어
  | 'analysis'        // 2. AI 커리어 분석
  | 'recommendations' // 3. 맞춤형 추천
  | 'cover_letter'    // 4. AI 자기소개서
  | 'job_prep'        // 5. 취업 준비
  | 'community';      // 6. 커뮤니티 & 멘토링

export interface CommunityComment {
  id: string;
  authorName: string;
  authorRole: string;
  isExpert: boolean;
  content: string;
  createdAt: string;
  likes: number;
}

export interface AttachedSpecSummary {
  gpa: string;
  major: string;
  keyExperiences: string[];
  certs: string[];
}

export interface CommunityPost {
  id: string;
  category: 'study' | 'job_discussion' | 'spec_review' | 'mentor_qa' | 'cover_letter_clinic';
  categoryLabel: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  isAnonymous?: boolean;
  targetCompany?: string;
  tags: string[];
  attachedSpecSummary?: AttachedSpecSummary;
  votes: number;
  hasVoted?: boolean;
  views: number;
  commentsCount: number;
  comments: CommunityComment[];
  createdAt: string;
  isPinned?: boolean;
  hasExpertAnswer?: boolean;
}

export interface MentorProfile {
  id: string;
  name: string;
  company: string;
  role: string;
  experienceYears: string;
  specialties: string[];
  intro: string;
  rating: number;
  reviewsCount: number;
  isOnline: boolean;
  badge: string;
  availableSlot: string;
}

export interface ExpertConsultationRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorCompany: string;
  consultationType: 'cover_letter' | 'spec_review' | 'mock_interview' | 'career_path';
  consultationTypeLabel: string;
  targetCompany: string;
  targetRole: string;
  question: string;
  status: 'pending' | 'in_review' | 'completed';
  createdAt: string;
  answer?: string;
  answeredAt?: string;
}

