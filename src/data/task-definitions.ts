
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
      profileDependencies: ["university_ip=false"]
    },
    {
      id: "patent-plans",
      type: "question",
      question: "Explain your plans for filing patents.",
      content: "Please provide details about your patent filing strategy.",
      context: "ip",
      profileDependencies: ["university_ip=false"]
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

// Team Task Definition (simplified example)
export const teamTaskDefinition: TaskDefinition = {
  id: "team-task",
  title: "Team Profile",
  description: "Build your team and define team roles",
  
  // Define steps, conditional flow and answer mapping as needed
  steps: [
    // This would contain all the team task steps
    // For brevity, only showing a placeholder
    {
      id: "team-status",
      type: "question",
      question: "What is your current team status?",
      options: [
        { label: "Solo founder", value: "solo" },
        { label: "Co-founders", value: "co-founders" },
        { label: "Team with employees", value: "team" }
      ],
      context: "team"
    }
  ]
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
