
export const IS_DEV = process.env.NODE_ENV === "development";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULT_AVATAR_URL = "/avatars/default.png";

export const LOCAL_STORAGE_KEYS = {
  onboardingCompleted: "onboardingCompleted",
  sprintProfile: "sprintProfile",
  sprintCountdownStarted: "sprintCountdownStarted",
  sprintEndDate: "sprintEndDate",
  sprintStartDate: "sprintStartDate",
} as const;

export const COOKIE_KEYS = {
  session: "sb-lovalink-auth-token",
};

export const COMMUNITY_CATEGORIES = [
  "All",
  "General",
  "Feedback",
  "Q&A",
  "Resources",
] as const;

export const TASK_WORKLOAD_OPTIONS = [
  { label: "Very Low", value: 1 },
  { label: "Low", value: 2 },
  { label: "Medium", value: 3 },
  { label: "High", value: 5 },
  { label: "Very High", value: 8 },
] as const;

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  SPRINT_DASHBOARD: "/sprint/dashboard",
  PASSWORD_RESET: "/reset-password",
  ACCEPT_INVITATION: "/accept-invitation",
  LANDING_PAGE: "/landing",
  BSF_PAGE: "/bsf",
  QUIZ: "/quiz",
  SPRINT_WAITING: "/sprint-waiting",
  SPRINT: "/sprint",
} as const;
