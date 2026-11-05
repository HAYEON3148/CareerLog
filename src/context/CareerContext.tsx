import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  CourseItem,
  ExperienceItem,
  EvidenceFile,
  TargetJobPosting,
  CoverLetter,
  PassedCoverLetter,
  CalendarEvent,
  AICompetencyAnalysis,
  MockInterviewRecord,
  MainNavMenu,
  CommunityPost,
  CommunityComment,
  MentorProfile,
  ExpertConsultationRequest,
} from '../types/career';
import {
  initialProfile,
  initialCourses,
  initialExperiences,
  initialEvidenceFiles,
  initialJobPostings,
  initialCoverLetters,
  initialPassedLetters,
  initialCalendarEvents,
  initialAnalysis,
  initialCommunityPosts,
  initialMentors,
  initialConsultationRequests,
} from '../data/mockData';

interface CareerContextType {
  activeMenu: MainNavMenu;
  setActiveMenu: (menu: MainNavMenu) => void;

  // Profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Academics
  courses: CourseItem[];
  addCourse: (course: Omit<CourseItem, 'id'>) => void;
  updateCourse: (id: string, updated: Partial<CourseItem>) => void;
  deleteCourse: (id: string) => void;
  importCoursesFromOCR: (newCourses: Omit<CourseItem, 'id'>[]) => void;
  stats: {
    totalGpa: number;
    majorGpa: number;
    totalCredits: number;
    majorCredits: number;
    totalCourses: number;
  };

  // Experiences
  experiences: ExperienceItem[];
  addExperience: (exp: Omit<ExperienceItem, 'id' | 'createdAt'>) => ExperienceItem;
  updateExperience: (id: string, exp: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;

  // Evidence Vault
  evidenceFiles: EvidenceFile[];
  addEvidenceFile: (file: Omit<EvidenceFile, 'id' | 'uploadDate'>) => EvidenceFile;
  deleteEvidenceFile: (id: string) => void;
  linkEvidenceToExperience: (evidenceId: string, experienceId?: string) => void;

  // Target Job Postings
  jobPostings: TargetJobPosting[];
  addJobPosting: (job: Omit<TargetJobPosting, 'id'>) => void;
  deleteJobPosting: (id: string) => void;

  // AI Cover Letters
  coverLetters: CoverLetter[];
  addCoverLetter: (letter: Omit<CoverLetter, 'id' | 'updatedAt' | 'version'>) => CoverLetter;
  updateCoverLetter: (id: string, letter: Partial<CoverLetter>) => void;
  deleteCoverLetter: (id: string) => void;

  // Passed Letters Archive & Revenue Share
  passedLetters: PassedCoverLetter[];
  userRewardCredits: number;
  registerPassedLetter: (letter: Omit<PassedCoverLetter, 'id' | 'viewsCount' | 'authorRewardCredits' | 'verified'>) => void;
  viewPassedLetter: (id: string) => void;

  // Mock Interview
  interviewRecords: MockInterviewRecord[];
  addInterviewRecord: (rec: Omit<MockInterviewRecord, 'id' | 'date'>) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;

  // AI Analysis
  competencyAnalysis: AICompetencyAnalysis;
  isAnalyzing: boolean;
  runAnalysis: () => Promise<void>;

  // Community & Expert Mentoring
  communityPosts: CommunityPost[];
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'votes' | 'views' | 'commentsCount' | 'comments' | 'createdAt' | 'hasVoted'>) => CommunityPost;
  addCommunityComment: (postId: string, content: string, isExpert?: boolean) => void;
  toggleVotePost: (postId: string) => void;
  mentors: MentorProfile[];
  consultationRequests: ExpertConsultationRequest[];
  requestConsultation: (req: Omit<ExpertConsultationRequest, 'id' | 'status' | 'createdAt'>) => void;

  // Reset
  resetToDefault: () => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.5,
  'A0': 4.0,
  'B+': 3.5,
  'B0': 3.0,
  'C+': 2.5,
  'C0': 2.0,
  'D+': 1.5,
  'D0': 1.0,
  'F': 0.0,
};

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState<MainNavMenu>('my_career');

  // Load from LocalStorage or Fallback to initial seed
  const [profile, setProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('careerlog_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [courses, setCoursesState] = useState<CourseItem[]>(() => {
    const saved = localStorage.getItem('careerlog_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [experiences, setExperiencesState] = useState<ExperienceItem[]>(() => {
    const saved = localStorage.getItem('careerlog_experiences');
    return saved ? JSON.parse(saved) : initialExperiences;
  });

  const [evidenceFiles, setEvidenceFilesState] = useState<EvidenceFile[]>(() => {
    const saved = localStorage.getItem('careerlog_evidence');
    return saved ? JSON.parse(saved) : initialEvidenceFiles;
  });

  const [jobPostings, setJobPostingsState] = useState<TargetJobPosting[]>(() => {
    const saved = localStorage.getItem('careerlog_jobpostings');
    return saved ? JSON.parse(saved) : initialJobPostings;
  });

  const [coverLetters, setCoverLettersState] = useState<CoverLetter[]>(() => {
    const saved = localStorage.getItem('careerlog_coverletters');
    return saved ? JSON.parse(saved) : initialCoverLetters;
  });

  const [passedLetters, setPassedLettersState] = useState<PassedCoverLetter[]>(() => {
    const saved = localStorage.getItem('careerlog_passedletters');
    return saved ? JSON.parse(saved) : initialPassedLetters;
  });

  const [userRewardCredits, setUserRewardCredits] = useState<number>(() => {
    const saved = localStorage.getItem('careerlog_rewardcredits');
    return saved ? parseInt(saved, 10) : 142000;
  });

  const [interviewRecords, setInterviewRecordsState] = useState<MockInterviewRecord[]>(() => {
    const saved = localStorage.getItem('careerlog_interviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [calendarEvents, setCalendarEventsState] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('careerlog_calendar');
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [competencyAnalysis, setCompetencyAnalysis] = useState<AICompetencyAnalysis>(() => {
    const saved = localStorage.getItem('careerlog_analysis');
    return saved ? JSON.parse(saved) : initialAnalysis;
  });

  const [communityPosts, setCommunityPostsState] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('careerlog_community_posts');
    return saved ? JSON.parse(saved) : initialCommunityPosts;
  });

  const [mentors] = useState<MentorProfile[]>(initialMentors);

  const [consultationRequests, setConsultationRequestsState] = useState<ExpertConsultationRequest[]>(() => {
    const saved = localStorage.getItem('careerlog_consultations');
    return saved ? JSON.parse(saved) : initialConsultationRequests;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('careerlog_profile', JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem('careerlog_courses', JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem('careerlog_experiences', JSON.stringify(experiences));
  }, [experiences]);
  useEffect(() => {
    localStorage.setItem('careerlog_evidence', JSON.stringify(evidenceFiles));
  }, [evidenceFiles]);
  useEffect(() => {
    localStorage.setItem('careerlog_jobpostings', JSON.stringify(jobPostings));
  }, [jobPostings]);
  useEffect(() => {
    localStorage.setItem('careerlog_coverletters', JSON.stringify(coverLetters));
  }, [coverLetters]);
  useEffect(() => {
    localStorage.setItem('careerlog_passedletters', JSON.stringify(passedLetters));
  }, [passedLetters]);
  useEffect(() => {
    localStorage.setItem('careerlog_rewardcredits', userRewardCredits.toString());
  }, [userRewardCredits]);
  useEffect(() => {
    localStorage.setItem('careerlog_interviews', JSON.stringify(interviewRecords));
  }, [interviewRecords]);
  useEffect(() => {
    localStorage.setItem('careerlog_calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents]);
  useEffect(() => {
    localStorage.setItem('careerlog_analysis', JSON.stringify(competencyAnalysis));
  }, [competencyAnalysis]);
  useEffect(() => {
    localStorage.setItem('careerlog_community_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);
  useEffect(() => {
    localStorage.setItem('careerlog_consultations', JSON.stringify(consultationRequests));
  }, [consultationRequests]);

  // Dynamic Grade & GPA Calculations
  const calculateStats = () => {
    let totalPoints = 0;
    let totalCreds = 0;
    let majorPoints = 0;
    let majorCreds = 0;

    courses.forEach((c) => {
      if (c.grade === 'P') {
        totalCreds += c.credits;
        if (c.type === '전공') majorCreds += c.credits;
        return;
      }
      const pt = GRADE_POINTS[c.grade];
      if (pt !== undefined) {
        totalPoints += pt * c.credits;
        totalCreds += c.credits;
        if (c.type === '전공') {
          majorPoints += pt * c.credits;
          majorCreds += c.credits;
        }
      }
    });

    const totalGpa = totalCreds > 0 ? parseFloat((totalPoints / totalCreds).toFixed(2)) : 0;
    const majorGpa = majorCreds > 0 ? parseFloat((majorPoints / majorCreds).toFixed(2)) : 0;

    return {
      totalGpa,
      majorGpa,
      totalCredits: totalCreds,
      majorCredits: majorCreds,
      totalCourses: courses.length,
    };
  };

  const stats = calculateStats();

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfileState((prev) => ({ ...prev, ...updated }));
  };

  const addCourse = (course: Omit<CourseItem, 'id'>) => {
    const newItem: CourseItem = { ...course, id: `course-${Date.now()}` };
    setCoursesState((prev) => [...prev, newItem]);
  };

  const updateCourse = (id: string, updated: Partial<CourseItem>) => {
    setCoursesState((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCourse = (id: string) => {
    setCoursesState((prev) => prev.filter((c) => c.id !== id));
  };

  const importCoursesFromOCR = (newCourses: Omit<CourseItem, 'id'>[]) => {
    const items: CourseItem[] = newCourses.map((c, i) => ({
      ...c,
      id: `course-ocr-${Date.now()}-${i}`,
    }));
    setCoursesState((prev) => [...prev, ...items]);
  };

  const addExperience = (exp: Omit<ExperienceItem, 'id' | 'createdAt'>): ExperienceItem => {
    const newItem: ExperienceItem = {
      ...exp,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setExperiencesState((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateExperience = (id: string, exp: Partial<ExperienceItem>) => {
    setExperiencesState((prev) => prev.map((e) => (e.id === id ? { ...e, ...exp } : e)));
  };

  const deleteExperience = (id: string) => {
    setExperiencesState((prev) => prev.filter((e) => e.id !== id));
    // unlink in evidence
    setEvidenceFilesState((prev) =>
      prev.map((ev) => (ev.linkedExperienceId === id ? { ...ev, linkedExperienceId: undefined } : ev))
    );
  };

  const addEvidenceFile = (file: Omit<EvidenceFile, 'id' | 'uploadDate'>): EvidenceFile => {
    const newFile: EvidenceFile = {
      ...file,
      id: `ev-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setEvidenceFilesState((prev) => [newFile, ...prev]);
    return newFile;
  };

  const deleteEvidenceFile = (id: string) => {
    setEvidenceFilesState((prev) => prev.filter((f) => f.id !== id));
    // unlink from experiences
    setExperiencesState((prev) =>
      prev.map((e) => ({
        ...e,
        evidenceIds: e.evidenceIds.filter((evId) => evId !== id),
      }))
    );
  };

  const linkEvidenceToExperience = (evidenceId: string, experienceId?: string) => {
    setEvidenceFilesState((prev) =>
      prev.map((f) => (f.id === evidenceId ? { ...f, linkedExperienceId: experienceId } : f))
    );
    if (experienceId) {
      setExperiencesState((prev) =>
        prev.map((e) =>
          e.id === experienceId && !e.evidenceIds.includes(evidenceId)
            ? { ...e, evidenceIds: [...e.evidenceIds, evidenceId] }
            : e
        )
      );
    }
  };

  const addJobPosting = (job: Omit<TargetJobPosting, 'id'>) => {
    const newJob: TargetJobPosting = { ...job, id: `job-${Date.now()}` };
    setJobPostingsState((prev) => [...prev, newJob]);
  };

  const deleteJobPosting = (id: string) => {
    setJobPostingsState((prev) => prev.filter((j) => j.id !== id));
  };

  const addCoverLetter = (letter: Omit<CoverLetter, 'id' | 'updatedAt' | 'version'>): CoverLetter => {
    const newLetter: CoverLetter = {
      ...letter,
      id: `cl-${Date.now()}`,
      version: 1,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setCoverLettersState((prev) => [newLetter, ...prev]);
    return newLetter;
  };

  const updateCoverLetter = (id: string, letter: Partial<CoverLetter>) => {
    setCoverLettersState((prev) =>
      prev.map((cl) =>
        cl.id === id
          ? {
              ...cl,
              ...letter,
              version: cl.version + 1,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : cl
      )
    );
  };

  const deleteCoverLetter = (id: string) => {
    setCoverLettersState((prev) => prev.filter((c) => c.id !== id));
  };

  const registerPassedLetter = (
    letter: Omit<PassedCoverLetter, 'id' | 'viewsCount' | 'authorRewardCredits' | 'verified'>
  ) => {
    const newPass: PassedCoverLetter = {
      ...letter,
      id: `pass-${Date.now()}`,
      verified: true,
      viewsCount: 1,
      authorRewardCredits: 5000,
    };
    setPassedLettersState((prev) => [newPass, ...prev]);
    // Award 5,000 points bonus for contributing
    setUserRewardCredits((prev) => prev + 5000);
  };

  const viewPassedLetter = (id: string) => {
    setPassedLettersState((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              viewsCount: p.viewsCount + 1,
              authorRewardCredits: p.authorRewardCredits + 200,
            }
          : p
      )
    );
  };

  const addInterviewRecord = (rec: Omit<MockInterviewRecord, 'id' | 'date'>) => {
    const newRec: MockInterviewRecord = {
      ...rec,
      id: `interview-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setInterviewRecordsState((prev) => [newRec, ...prev]);
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...event, id: `cal-${Date.now()}` };
    setCalendarEventsState((prev) => [...prev, newEvent]);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEventsState((prev) => prev.filter((e) => e.id !== id));
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-competency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetJob: profile.targetJobs[0] || '소프트웨어 엔지니어',
          targetCompany: profile.targetCompanies[0] || 'IT 기업',
          experiences,
          academics: {
            totalGpa: stats.totalGpa,
            majorGpa: stats.majorGpa,
            courses,
          },
          certifications: experiences.filter((e) => e.category === 'certification'),
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCompetencyAnalysis({
          ...data.data,
          isLiveAI: data.isLiveAI,
          analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } catch (err) {
      console.warn('Run analysis API error, keeping current analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addCommunityPost = (
    post: Omit<CommunityPost, 'id' | 'votes' | 'views' | 'commentsCount' | 'comments' | 'createdAt' | 'hasVoted'>
  ): CommunityPost => {
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      votes: 1,
      hasVoted: true,
      views: 1,
      commentsCount: 0,
      comments: [],
      createdAt: '방금 전',
    };
    setCommunityPostsState((prev) => [newPost, ...prev]);
    return newPost;
  };

  const addCommunityComment = (postId: string, content: string, isExpert = false) => {
    const newComment: CommunityComment = {
      id: `comm-${Date.now()}`,
      authorName: isExpert ? '홍정우 멘토' : profile.name,
      authorRole: isExpert ? '전 삼성전자 DX 수석 / 실무면접관' : `${profile.department} ${profile.gradeYear}`,
      isExpert,
      content: content.trim(),
      createdAt: '방금 전',
      likes: 0,
    };
    setCommunityPostsState((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [...p.comments, newComment],
              hasExpertAnswer: isExpert ? true : p.hasExpertAnswer,
            }
          : p
      )
    );
  };

  const toggleVotePost = (postId: string) => {
    setCommunityPostsState((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const hasVoted = p.hasVoted;
        return {
          ...p,
          hasVoted: !hasVoted,
          votes: hasVoted ? p.votes - 1 : p.votes + 1,
        };
      })
    );
  };

  const requestConsultation = (
    req: Omit<ExpertConsultationRequest, 'id' | 'status' | 'createdAt'>
  ) => {
    const newReq: ExpertConsultationRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setConsultationRequestsState((prev) => [newReq, ...prev]);
  };

  const resetToDefault = () => {
    setProfileState(initialProfile);
    setCoursesState(initialCourses);
    setExperiencesState(initialExperiences);
    setEvidenceFilesState(initialEvidenceFiles);
    setJobPostingsState(initialJobPostings);
    setCoverLettersState(initialCoverLetters);
    setPassedLettersState(initialPassedLetters);
    setUserRewardCredits(142000);
    setCalendarEventsState(initialCalendarEvents);
    setCompetencyAnalysis(initialAnalysis);
    setCommunityPostsState(initialCommunityPosts);
    setConsultationRequestsState(initialConsultationRequests);
    localStorage.clear();
  };

  return (
    <CareerContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        profile,
        updateProfile,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        importCoursesFromOCR,
        stats,
        experiences,
        addExperience,
        updateExperience,
        deleteExperience,
        evidenceFiles,
        addEvidenceFile,
        deleteEvidenceFile,
        linkEvidenceToExperience,
        jobPostings,
        addJobPosting,
        deleteJobPosting,
        coverLetters,
        addCoverLetter,
        updateCoverLetter,
        deleteCoverLetter,
        passedLetters,
        userRewardCredits,
        registerPassedLetter,
        viewPassedLetter,
        interviewRecords,
        addInterviewRecord,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        competencyAnalysis,
        isAnalyzing,
        runAnalysis,
        communityPosts,
        addCommunityPost,
        addCommunityComment,
        toggleVotePost,
        mentors,
        consultationRequests,
        requestConsultation,
        resetToDefault,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
