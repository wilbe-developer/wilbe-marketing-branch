
export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN_LOGIN: '/admin-login',
  PASSWORD_RESET: '/password-reset',
  REGISTER: '/register',
  ADMIN: '/admin',
  KNOWLEDGE_CENTER: '/knowledge-center',
  MEMBER_DIRECTORY: '/member-directory',
  VIDEO: '/video',
  EVENTS: '/events',
  LAB_SEARCH: '/lab-search',
  PENDING: '/pending-approval',
  PROFILE: '/profile',
  ASK: '/ask',
  BUILD_YOUR_DECK: '/build-your-deck',
  LANDING_PAGE: '/landing',
  BSF_PAGE: '/bsf',
  SPRINT: '/sprint',
  SPRINT_DASHBOARD: '/sprint/dashboard',
  SPRINT_TASK: '/sprint/task',
  SPRINT_SIGNUP: '/sprint-signup',
  SPRINT_PROFILE: '/sprint/profile',
  SPRINT_WAITING: '/sprint-waiting',
  LEAD_GENERATOR: '/lead-generator',
  QUIZ: '/quiz',
  API: {
    FIND_EMAILS: '/api/find-emails'
  }
} as const;

export const NAV_ITEMS = [
  { name: "Home", path: PATHS.HOME },
  { name: "Knowledge Center", path: PATHS.KNOWLEDGE_CENTER },
  { name: "Member Directory", path: PATHS.MEMBER_DIRECTORY },
  { name: "Build Your Deck", path: PATHS.BUILD_YOUR_DECK },
  { name: "Lab Search", path: PATHS.LAB_SEARCH },
  { name: "Events", path: PATHS.EVENTS },
  { name: "Ask & Invite", path: PATHS.ASK },
];
