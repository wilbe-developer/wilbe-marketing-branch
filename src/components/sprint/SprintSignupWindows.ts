import { Window } from "@/types/sprint-signup";

export const windows: Window[] = [
  {
    id: "contact_info",
    title: "Contact Information",
    questions: [
      {
        id: "name",
        question: "Full Name",
        type: "text"
      },
      {
        id: "email", 
        question: "Email",
        type: "email"
      },
      {
        id: "linkedin",
        question: "LinkedIn Profile (optional)",
        type: "text"
      },
      {
        id: "job",
        question: "Current Job Title",
        type: "text"
      }
    ]
  },
  {
    id: "background",
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
        question: "What best describes your current role?",
        type: "conditional",
        conditional: [
          {
            field: "is_scientist_engineer",
            value: "yes",
            componentType: "select",
            componentProps: {
              options: JSON.stringify([
                { value: "phd_student", label: "PhD Student" },
                { value: "postdoc", label: "Postdoc" },
                { value: "research_scientist", label: "Research Scientist" },
                { value: "professor", label: "Professor" },
                { value: "industry_scientist", label: "Industry Scientist/Engineer" },
                { value: "other", label: "Other" }
              ])
            }
          }
        ]
      },
      {
        id: "team",
        question: "What best describes your team status?",
        type: "select",
        options: [
          { value: "solo", label: "I'm working solo" },
          { value: "team", label: "I have a team" },
          { value: "looking", label: "I'm looking for co-founders" }
        ]
      }
    ]
  },
  {
    id: "incorporation",
    title: "Company Formation",
    questions: [
      {
        id: "incorporated",
        question: "Have you incorporated your company?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "invention_ip",
    title: "Invention & IP",
    questions: [
      {
        id: "invention",
        question: "Is your company reliant on a university invention?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "ip_concerns",
        question: "Do you have any IP concerns or questions?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "beneficiaries",
    title: "Target Beneficiaries",
    questions: [
      {
        id: "potential_beneficiaries",
        question: "Have you identified who would benefit from your solution?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "customers",
    title: "Customer Discovery",
    questions: [
      {
        id: "customers",
        question: "What best describes your customer engagement so far?",
        type: "select",
        options: [
          { value: "none", label: "Haven't started yet" },
          { value: "some", label: "Talked to a few people" },
          { value: "active", label: "Actively interviewing customers" },
          { value: "paying", label: "Have paying customers" }
        ]
      },
      {
        id: "specific_customers",
        question: "Do you have specific customers in mind for your solution?",
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
    id: "market",
    title: "Market Understanding",
    questions: [
      {
        id: "market_known",
        question: "Do you know your market well?",
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
      }
    ]
  },
  {
    id: "validation",
    title: "Validation",
    questions: [
      {
        id: "experiment",
        question: "Have you run experiments to validate your solution?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "vision",
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
          { value: "industry", label: "Industry-changing" },
          { value: "societal", label: "Societal transformation" }
        ]
      }
    ]
  },
  {
    id: "accelerators",
    title: "Accelerator Experience",
    questions: [
      {
        id: "prior_accelerators",
        question: "Have you participated in accelerators before?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        id: "prior_accelerators_details",
        question: "Please provide details about your previous accelerator experience:",
        type: "conditional",
        conditional: [
          {
            field: "prior_accelerators",
            value: "yes",
            componentType: "textarea"
          }
        ]
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
        question: "Which accelerators are you considering?",
        type: "conditional",
        conditional: [
          {
            field: "planned_accelerators",
            value: "yes",
            componentType: "textarea"
          }
        ]
      }
    ]
  },
  {
    id: "funding",
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
        question: "Please provide details about your funding:",
        type: "conditional",
        conditional: [
          {
            field: "funding_received",
            value: "yes",
            componentType: "textarea"
          }
        ]
      }
    ]
  },
  {
    id: "pitch_deck",
    title: "Pitch Materials",
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
        question: "Would you like feedback on your pitch deck?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    id: "lab_space",
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
        question: "Do you have lab space secured?",
        type: "conditional",
        conditional: [
          {
            field: "lab_space_needed",
            value: "yes",
            componentType: "select",
            componentProps: {
              options: JSON.stringify([
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" }
              ])
            }
          }
        ]
      },
      {
        id: "lab_space_details",
        question: "Please describe your lab space needs:",
        type: "conditional",
        conditional: [
          {
            field: "lab_space_needed",
            value: "yes",
            componentType: "textarea"
          }
        ]
      }
    ]
  },
  {
    id: "final_questions",
    title: "Final Questions",
    questions: [
      {
        id: "ambitious_version",
        question: "What is the most ambitious version of your company look like? Describe it in your own words.",
        type: "textarea"
      },
      {
        id: "minimal_success_version",
        question: "What would a minimal version of success look like for your startup?",
        type: "textarea"
      },
      {
        id: "founder_profile",
        question: "Upload your CV/Resume (optional)",
        type: "file"
      }
    ]
  }
];
