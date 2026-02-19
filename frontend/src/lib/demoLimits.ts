export interface DemoLimits {
  resumeAnalysis: number;
  mockInterviews: number;
  jobApplications: number;
}

export const DEMO_LIMITS: DemoLimits = {
  resumeAnalysis: 1,
  mockInterviews: 1,
  jobApplications: 3,
};

export function getDemoUsage(): DemoLimits {
  if (typeof window === 'undefined')
    return { resumeAnalysis: 0, mockInterviews: 0, jobApplications: 0 };

  return {
    resumeAnalysis: parseInt(localStorage.getItem('demo_resume_count') || '0'),
    mockInterviews: parseInt(
      localStorage.getItem('demo_interview_count') || '0'
    ),
    jobApplications: parseInt(localStorage.getItem('demo_job_count') || '0'),
  };
}

export function incrementDemoUsage(type: keyof DemoLimits): boolean {
  if (typeof window === 'undefined') return false;

  const current = getDemoUsage();
  const key = `demo_${type === 'resumeAnalysis' ? 'resume' : type === 'mockInterviews' ? 'interview' : 'job'}_count`;

  if (current[type] >= DEMO_LIMITS[type]) {
    return false;
  }

  localStorage.setItem(key, (current[type] + 1).toString());
  return true;
}

export function canUseDemoFeature(type: keyof DemoLimits): boolean {
  const current = getDemoUsage();
  return current[type] < DEMO_LIMITS[type];
}

export function resetDemoUsage(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('demo_resume_count');
  localStorage.removeItem('demo_interview_count');
  localStorage.removeItem('demo_job_count');
}
