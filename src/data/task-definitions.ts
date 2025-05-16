
import { TaskDefinition } from "@/types/task-definition";

// IP Task Definition
export const ipTaskDefinition: TaskDefinition = {
  id: "ip-task",
  title: "IP & Technology Transfer",
  description: "Manage your intellectual property and technology transfer",
  
  profileKey: "university_ip",
  profileLabel: "Is your company reliant on something you've invented / created at a university?",
  profileType: "boolean",
  
  steps: [
    // University IP path
    {
      id: "tto-conversation",
      type: "question",
      question: "Have you begun conversations with the Tech Transfer Office (TTO)?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ],
      context: "ip",
      profileDependencies: ["university_ip=true"]
    },
    {
      id: "tto-summary",
      type: "question",
      question: "Summarize the conversation with the Tech Transfer Office.",
      content: "Please provide details about your conversations with the Tech Transfer Office.",
      context: "ip",
      profileDependencies: ["university_ip=true"]
    },
    {
      id: "licensing-terms",
      type: "question",
      question: "List the preliminary licensing terms (especially % equity) the TTO expects.",
      content: "Please provide details about any licensing terms that have been discussed.",
      context: "ip",
      profileDependencies: ["university_ip=true"]
    },
    {
      id: "tto-plans",
      type: "question",
      question: "Explain your current plans for engaging with the TTO.",
      content: "Please provide details about how you plan to engage with the Tech Transfer Office.",
      context: "ip",
      profileDependencies: ["university_ip=true"]
    },
    {
      id: "ip-fundamentals-university",
      type: "content",
      content: [
        "IP Fundamentals",
        "• You are the core asset of the company.",
        "• Role of inventions and why protecting them is crucial.",
        "• Why this IP is relevant to the company.",
        "• Raising funding for a science company without foundational IP.",
        "• Defining an IP strategy that matches market validation and strategy."
      ],
      context: "ip",
      profileDependencies: ["university_ip=true"]
    },
    {
      id: "university-ip-deep-dive",
      type: "content",
      content: [
        "University-IP Deep-Dive",
        "• What is a Tech Transfer Office (TTO)?",
        "• How do they think and evaluate inventions?",
        "• Do they actually own your IP?",
        "• When / how should you approach them?",
        "• Switching from employee mindset to founder of an independent company.",
        "• Why nobody else can negotiate on your behalf (lawyers, investors, advisors, etc.).",
        "• Why this is the best opportunity to evolve as a founder.",
        "• The mother of all tricks: do not start negotiations until all the ducks are in a row.",
        "• The nuclear option: can you build without this IP?"
      ],
      context: "ip",
      profileDependencies: ["university_ip=true"]
    },
    
    // Non-university IP path
    {
      id: "ip-ownership",
      type: "question",
      question: "Do you own all the IP?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ],
      context: "ip",
      profileDependencies: ["university_ip=false"]
    },
    {
      id: "patents-filed",
      type: "question",
      question: "Have patents been filed?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ],
      context: "ip",
      profileDependencies: ["university_ip=false"]
    },
    {
      id: "patent-documents",
      type: "upload",
      action: "Upload your patent documents.",
      uploads: ["Patent documentation"],
      context: "ip",
      profileDependencies: ["university_ip=false", "patents_filed=yes"]
    },
    {
      id: "patent-plans",
      type: "question",
      question: "Explain your plans for filing patents.",
      content: "Please provide details about your patent filing strategy.",
      context: "ip",
      profileDependencies: ["university_ip=false", "patents_filed=no"]
    },
    {
      id: "ip-ownership-status",
      type: "question",
      question: "Explain the current status of IP ownership.",
      content: "Please provide details about who owns the IP and any arrangements in place.",
      context: "ip",
      profileDependencies: ["university_ip=false"]
    },
    {
      id: "ip-fundamentals-nonuniversity",
      type: "content",
      content: [
        "IP Fundamentals",
        "• You are the core asset of the company.",
        "• Role of inventions and why protecting them is crucial.",
        "• Why this IP is relevant to the company.",
        "• Raising funding for a science company without foundational IP.",
        "• Defining an IP strategy that matches market validation and strategy."
      ],
      context: "ip",
      profileDependencies: ["university_ip=false"]
    }
  ],
  
  // Define how answers to one question affect which question comes next
  conditionalFlow: {
    0: { // University IP path: TTO conversation question
      "yes": 1, // Go to summarize conversation
      "no": 3   // Go to explain plans
    },
    1: { // Summarize conversation
      "*": 2    // Always go to licensing terms next
    },
    
    6: { // Non-university IP path: IP ownership question
      "yes": 7, // Go to patents filed question
      "no": 10  // Go to explain IP ownership
    },
    7: { // Patents filed question
      "yes": 8, // Go to upload patents
      "no": 9   // Go to explain patent plans
    }
  },
  
  // Map step indices to semantic keys for database storage
  answerMapping: {
    0: "tto_conversation",
    1: "tto_summary",
    2: "licensing_terms",
    3: "tto_plans",
    6: "ip_ownership",
    7: "patents_filed",
    8: "patent_documents",
    9: "patent_plans",
    10: "ip_ownership_status"
  }
};

// Team Task Definition (comprehensive implementation)
export const teamTaskDefinition: TaskDefinition = {
  id: "team-task",
  title: "Team Profile",
  description: "Build your team and define team roles",
  
  profileKey: "team_status",
  profileLabel: "What is your current team status?",
  profileType: "select",
  profileOptions: [
    { label: "Solo founder", value: "solo" },
    { label: "Co-founders", value: "co-founders" },
    { label: "Team with employees", value: "team" }
  ],
  
  steps: [
    // Company reason - applies to all team types
    {
      id: "company-reasons",
      type: "question",
      question: "Why are you starting a company? (Select all that apply)",
      options: [
        { label: "I/we find the problem interesting", value: "interesting_problem" },
        { label: "I/we have been doing research in this field professionally", value: "professional_research" },
        { label: "I/we have a personal connection", value: "personal_connection" },
        { label: "I/we think it is a great commercial opportunity", value: "commercial_opportunity" },
        { label: "I/we already own the IP", value: "own_ip" },
        { label: "Just curious", value: "curious" }
      ],
      context: "company_reason"
    },
    
    // Incorporation path - Yes
    {
      id: "company-formation-details",
      type: "question",
      question: "Where and when was your company formed / incorporated?",
      content: "Please provide details about your company's formation.",
      context: "incorporation",
      profileDependencies: ["company_incorporated=true"]
    },
    {
      id: "equity-split-details",
      type: "question",
      question: "List equity split among all stakeholders including founders",
      content: "Please provide the percentage breakdown of equity for all stakeholders.",
      context: "incorporation",
      profileDependencies: ["company_incorporated=true"]
    },
    
    // Incorporation path - No
    {
      id: "planned-formation-details",
      type: "question",
      question: "When and where do you plan to form / incorporate the company?",
      content: "Please specify your plans for company formation.",
      context: "incorporation",
      profileDependencies: ["company_incorporated=false"]
    },
    {
      id: "formation-location-reason",
      type: "question",
      question: "Why did you pick this location?",
      content: "Please explain the rationale for your chosen incorporation location.",
      context: "incorporation",
      profileDependencies: ["company_incorporated=false"]
    },
    {
      id: "equity-agreed",
      type: "question",
      question: "Have you agreed on the equity split among the team?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ],
      context: "incorporation",
      profileDependencies: ["company_incorporated=false"]
    },
    {
      id: "equity-split-planned",
      type: "question",
      question: "Please describe the agreed equity split:",
      content: "List the percentage breakdown for each team member.",
      context: "incorporation",
      profileDependencies: ["company_incorporated=false"]
    },
    {
      id: "equity-concerns",
      type: "question",
      question: "Do you have any concerns about equity distribution?",
      content: "Please describe any concerns or issues regarding equity distribution that you'd like advice on.",
      context: "incorporation",
      profileDependencies: ["company_incorporated=false"]
    },
    
    // Solo founder path
    {
      id: "team-video",
      type: "content",
      content: [
        "As a solo founder, it's crucial to understand the importance of team culture and future team building.",
        "Watch this video for important insights on building your team:"
      ],
      context: "team",
      profileDependencies: ["team_status=solo"]
    },
    {
      id: "skills-list",
      type: "question",
      question: "What professional skills do you currently possess that will help you build this company?",
      content: "List all relevant skills, experience, and expertise you bring to the company.",
      context: "team",
      profileDependencies: ["team_status=solo"]
    },
    {
      id: "missing-skills",
      type: "question",
      question: "What critical skills are you missing that you'll need to build this company?",
      content: "Identify the key skills or expertise gaps that need to be filled.",
      context: "team",
      profileDependencies: ["team_status=solo"]
    },
    {
      id: "skills-justification",
      type: "question",
      question: "Why do you believe these missing skills are critical to your success?",
      content: "Make the case for why these skills are essential and how the company might fail without them.",
      context: "team",
      profileDependencies: ["team_status=solo"]
    },
    {
      id: "first-hire-profile",
      type: "question",
      question: "What would the profile of your ideal first hire or co-founder look like?",
      content: "Describe the background, experience, skills, and qualities you're looking for. Include how you plan to find this person and what the job description would include.",
      context: "team",
      profileDependencies: ["team_status=solo"]
    },
    {
      id: "full-time-trigger",
      type: "question",
      question: "What key milestone or trigger point would signal it's time to bring them on full-time?",
      content: "If they are not starting full-time, what specific milestones would trigger conversion to full-time?",
      context: "team",
      profileDependencies: ["team_status=solo"]
    },
    {
      id: "hiring-plan-template",
      type: "upload",
      action: "Upload your hiring plan document",
      content: "You can download our template, fill it out, and upload it here.",
      context: "team",
      profileDependencies: ["team_status=solo"]
    },
    
    // Co-founder path
    {
      id: "collaboration-invite",
      type: "question",
      question: "Would you like to invite your team to collaborate on the sprint?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ],
      context: "team",
      profileDependencies: ["team_status=co-founders", "team_status=team"]
    },
    {
      id: "no-collaboration-reason",
      type: "question",
      question: "Why not invite your team to collaborate?",
      content: "It's okay if you prefer not to involve them, but please share your reasons.",
      context: "team",
      profileDependencies: ["team_status=co-founders", "team_status=team"]
    },
    {
      id: "team-members-profile",
      type: "question",
      question: "Provide a detailed profile of each team member:",
      content: "For each co-founder or key team member, please describe:\n- How you know them\n- What job they have or will have in the company\n- Why they are the best person for this job\n- If they are not full-time, what will trigger them being full-time and why?",
      context: "team",
      profileDependencies: ["team_status=co-founders", "team_status=team"]
    }
  ],
  
  // Define conditional flow
  conditionalFlow: {
    0: { // After company reasons
      "*": 1 // Always go to next question based on company_incorporated value
    },
    2: { // After equity split for incorporated companies
      "*": 8 // Go to team-specific questions based on team_status
    },
    4: { // After formation location reason
      "*": 5 // Go to equity agreed question
    },
    5: { // Equity agreed question
      "yes": 6, // Go to describe equity
      "no": 7  // Go to equity concerns
    },
    7: { // After equity concerns
      "*": 8 // Go to team-specific questions based on team_status
    },
    16: { // Collaboration invite question
      "yes": 18, // Skip reason and go to team profiles
      "no": 17   // Ask for reason why not collaborating
    }
  },
  
  // Map step indices to semantic keys for database storage
  answerMapping: {
    0: "company_reasons",
    1: "company_formation_details",
    2: "equity_split_details",
    3: "planned_formation_details",
    4: "formation_location_reason",
    5: "equity_agreed",
    6: "equity_split_planned",
    7: "equity_concerns",
    8: "team_video_watched",
    9: "skills_list",
    10: "missing_skills",
    11: "skills_justification",
    12: "first_hire_profile",
    13: "full_time_trigger",
    14: "hiring_plan",
    15: "collaboration_invite",
    16: "no_collaboration_reason",
    17: "team_members_profile"
  }
};

// Task Registry - maps task titles to their definitions
export const taskDefinitions: Record<string, TaskDefinition> = {
  "IP & Technology Transfer": ipTaskDefinition,
  "Team Profile": teamTaskDefinition,
  "Develop Team Building Plan": teamTaskDefinition
};

// Function to get task definition by title
export const getTaskDefinition = (taskTitle: string): TaskDefinition | undefined => {
  console.log('Looking up task definition for:', taskTitle);
  return taskDefinitions[taskTitle];
};
