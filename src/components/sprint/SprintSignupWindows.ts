
import { Window } from "@/types/sprint-signup";

export const windows: Window[] = [
  {
    id: "window1",
    title: "Contact Information",
    questions: [
      {
        id: "name",
        question: "What is your name?",
        type: "text"
      },
      {
        id: "email",
        question: "What is your email address?",
        type: "email"
      },
      {
        id: "linkedin",
        question: "What is your LinkedIn profile URL?",
        type: "text"
      },
      {
        id: "job",
        question: "What is your current job title/position?",
        type: "text"
      }
    ]
  },
  {
    id: "window2",
    title: "Background",
    questions: [
      {
        id: "is_scientist_engineer",
        question: "Are you a scientist or engineer?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "job_type",
        question: "Which best describes your current employment status?",
        type: "select",
        options: [
          { value: "faculty", label: "Faculty" },
          { value: "postdoc", label: "Postdoc" },
          { value: "phd_student", label: "PhD Student" },
          { value: "industry", label: "Industry Professional" },
          { value: "entrepreneur", label: "Entrepreneur" },
          { value: "other", label: "Other" }
        ]
      },
      {
        id: "team",
        question: "Do you have a team or are you a solo founder?",
        type: "select",
        options: [
          { value: "solo", label: "Solo founder" },
          { value: "team", label: "I have a team" },
          { value: "looking", label: "Looking for co-founders" }
        ]
      }
    ]
  },
  {
    id: "window3",
    title: "Company Status",
    questions: [
      {
        id: "incorporated",
        question: "Have you incorporated your company?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "planning", label: "Planning to incorporate soon" }
        ]
      }
    ]
  },
  {
    id: "window4",
    title: "Invention & IP",
    questions: [
      {
        id: "invention",
        question: "Are you commercializing a specific invention or technology?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "ip",
        question: "Who owns the intellectual property?",
        type: "select",
        options: [
          { value: "own", label: "I own it" },
          { value: "tto_yes", label: "University owns it (TTO engaged)" },
          { value: "tto_no", label: "University owns it (TTO not engaged)" }
        ]
      },
      {
        id: "ip_concerns",
        question: "Do you have any concerns about IP ownership or licensing?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "window5",
    title: "Problem & Beneficiaries",
    questions: [
      {
        id: "potential_beneficiaries",
        question: "Can you clearly identify who would benefit from your solution?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "window6",
    title: "Customer Engagement",
    questions: [
      {
        id: "customers",
        question: "How would you describe your current customer engagement?",
        type: "select",
        options: [
          { value: "none", label: "No customer engagement yet" },
          { value: "some", label: "Some informal conversations" },
          { value: "active", label: "Actively engaging with potential customers" },
          { value: "paying", label: "Have paying customers or pilots" }
        ]
      },
      {
        id: "specific_customers",
        question: "Do you have specific customers or partners in mind?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "customer_evidence",
        question: "Do you have evidence that customers want your solution?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "window7",
    title: "Market Understanding",
    questions: [
      {
        id: "market_known",
        question: "Do you know your target market well?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "competition_research",
        question: "Have you researched your competition?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "market_gap_reason",
        question: "Why do you think there's a gap in the market for your solution?",
        type: "textarea"
      }
    ]
  },
  {
    id: "window8",
    title: "Validation",
    questions: [
      {
        id: "experiment",
        question: "Have you validated your solution through experiments or tests?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "window9",
    title: "Vision & Impact",
    questions: [
      {
        id: "success_vision_1yr",
        question: "Do you have a clear vision of what success looks like in 1 year?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "success_vision_10yr",
        question: "Do you have a clear vision of what success looks like in 10 years?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "impact_scale",
        question: "What scale of impact are you aiming for?",
        type: "checkbox",
        options: [
          { value: "local", label: "Local/Regional" },
          { value: "national", label: "National" },
          { value: "global", label: "Global" },
          { value: "industry", label: "Industry-changing" }
        ]
      },
      {
        id: "vision",
        question: "Do you believe your solution could change an entire industry?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "window10",
    title: "Accelerator Experience",
    questions: [
      {
        id: "prior_accelerators",
        question: "Have you participated in accelerators or incubators before?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "prior_accelerators_details",
        question: "If yes, please provide details about your accelerator experience:",
        type: "textarea"
      },
      {
        id: "planned_accelerators",
        question: "Are you planning to apply to other accelerators?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "planned_accelerators_details",
        question: "If yes, which accelerators are you considering?",
        type: "textarea"
      }
    ]
  },
  {
    id: "window11",
    title: "Funding",
    questions: [
      {
        id: "funding_received",
        question: "Have you received any funding?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "funding_details",
        question: "If yes, please provide details about your funding:",
        type: "textarea"
      },
      {
        id: "funding_amount_text",
        question: "What is the approximate amount of funding you've received?",
        type: "text"
      },
      {
        id: "funding_plan",
        question: "Do you have a financial plan for your business?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "funding_sources",
        question: "What funding sources are you considering?",
        type: "checkbox",
        options: [
          { value: "bootstrapping", label: "Bootstrapping" },
          { value: "friends_family", label: "Friends & Family" },
          { value: "angel", label: "Angel Investors" },
          { value: "vc", label: "Venture Capital" },
          { value: "grants", label: "Grants" },
          { value: "crowdfunding", label: "Crowdfunding" }
        ]
      }
    ]
  },
  {
    id: "window12",
    title: "Pitch Deck",
    questions: [
      {
        id: "deck",
        question: "Do you have a pitch deck?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "deck_feedback",
        question: "Have you received feedback on your pitch deck?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "window13",
    title: "Lab Space & Resources",
    questions: [
      {
        id: "lab_space_needed",
        question: "Do you need lab space or specialized equipment?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "lab_space_secured",
        question: "Have you secured lab space or equipment access?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "lab_space_details",
        question: "Please provide details about your lab space needs or current setup:",
        type: "textarea"
      }
    ]
  },
  {
    id: "window14",
    title: "Minimal Success Vision",
    questions: [
      {
        id: "minimal_success_version",
        question: "What is the most minimal version of the company that you would consider successful? Describe in your own words.",
        type: "textarea"
      }
    ]
  },
  {
    id: "window15",
    title: "Upload Your Profile",
    questions: [
      {
        id: "founder_profile",
        question: "Upload your CV/Resume or Founder Profile",
        description: "Please upload your CV, resume, or a brief founder profile document",
        type: "file"
      }
    ]
  }
];
