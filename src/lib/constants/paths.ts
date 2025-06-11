
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
  KNOWLEDGE_CENTER: "/knowledge-center",
  MEMBER_DIRECTORY: "/member-directory",
  VIDEO: "/video",
  EVENTS: "/events",
  BUILD_YOUR_DECK: "/build-your-deck",
  PROFILE: "/profile",
  LAB_SEARCH: "/lab-search",
  ASK: "/ask",
  ADMIN: "/admin",
  SPRINT_SIGNUP: "/sprint-signup",
} as const;

export const NAV_ITEMS = [
  { name: "Home", path: PATHS.HOME },
  { name: "Knowledge Center", path: PATHS.KNOWLEDGE_CENTER },
  { name: "Member Directory", path: PATHS.MEMBER_DIRECTORY },
  { name: "Build Your Deck", path: PATHS.BUILD_YOUR_DECK },
  { name: "Lab Search", path: PATHS.LAB_SEARCH },
  { name: "Events", path: PATHS.EVENTS },
  { name: "Ask & Invite", path: PATHS.ASK },
] as const;
