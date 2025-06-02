import { Window } from "@/types/sprint-signup";

export const windows: Window[] = [
  {
    id: "window1",
    title: "Contact Information",
    questions: [
      {
        id: 'name',
        question: 'What is your name?',
        type: 'text'
      },
      {
        id: 'email',
        question: 'What is your email address?',
        type: 'email'
      },
      {
        id: 'linkedin',
        question: 'What is your LinkedIn URL?',
        description: 'This helps us understand your background and experience.',
        type: 'text'
      },
      {
        id: 'cv',
        question: 'Please upload your CV',
        description: 'If all information is on LinkedIn, you can skip this step.',
        type: 'file'
      }
    ]
  },
  {
    id: "window2",
    title: "Your Background",
    questions: [
      {
        id: 'is_scientist_engineer',
        question: 'Are you a scientist / Engineer?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'job',
        question: 'Where do you currently work?',
        type: 'textarea'
      },
      {
        id: 'job_type',
        question: 'What do you do there?',
        type: 'select',
        options: [
          { value: 'scientist', label: 'Scientist / Researcher / Postdoc' },
          { value: 'pi', label: 'Principal Investigator / Group leader' },
          { value: 'student', label: 'Student (incl. PhDs)' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'team',
        question: 'Is this a solo project or do you have a team?',
        type: 'select',
        options: [
          { value: 'solo', label: 'I\'m solo and I plan to continue this way' },
          { value: 'looking', label: 'I\'m solo and looking for co-founders' },
          { value: 'cofounders', label: 'I have co-founders' },
          { value: 'employees', label: 'I have a team but they\'re employees' }
        ]
      }
    ]
  },
  {
    id: "window3",
    title: "Company Status",
    questions: [
      {
        id: 'incorporated',
        question: 'Is your company already formed / incorporated?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: "window4",
    title: "Intellectual Property",
    questions: [
      {
        id: 'invention',
        question: 'Is your company reliant on something you\'ve invented / created at a university?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'ip_concerns',
        question: 'Do you have concerns regarding IP and conversations with your employer / university?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: "window5",
    title: "Target Audience",
    questions: [
      {
        id: 'potential_beneficiaries',
        question: 'Do you have a group of people in mind that would benefit from the solution you\'re creating?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: "window6",
    title: "Customer Research",
    questions: [
      {
        id: 'customers',
        question: 'Have you spoken with potential customers / key decision makers yet?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unknown', label: 'Do not know who they are / not applicable' }
        ]
      },
      {
        id: 'specific_customers',
        question: 'Can you name specific people / institutions that have the problem you are trying to solve?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'customer_evidence',
        question: 'Do you have evidence that these people / institutions will pay you to solve this problem?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: "window7",
    title: "Market Research",
    questions: [
      {
        id: 'market_known',
        question: 'In its ultimate form, do you know what market you expect to capture?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'competition_research',
        question: 'Have you looked at who else is trying to solve this problem in the market?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: "window8",
    title: "Testing & Experimentation",
    questions: [
      {
        id: 'experiment',
        question: 'Have you recently tested out the idea of this venture in some way?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: "window9",
    title: "Vision & Impact",
    questions: [
      {
        id: 'success_vision_1yr',
        question: 'Do you have a clear idea of what explosive success looks like 1 year from now?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'success_vision_10yr',
        question: 'What about 10 years from now?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'impact_scale',
        question: 'If your company\'s ultimate form is wildly successful what is the scale of impact?',
        description: 'Select all that apply',
        type: 'checkbox',
        options: [
          { value: 'money', label: 'We end up making money' },
          { value: 'sector_change', label: 'A sector changes in a small way' },
          { value: 'industry_improve', label: 'The industry improves in a big way' },
          { value: 'world_change', label: 'The world changes fundamentally' }
        ]
      }
    ]
  },
  {
    id: "window10",
    title: "Accelerator Programs",
    questions: [
      {
        id: 'prior_accelerators',
        question: 'Have you been part of any other accelerator / program before?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'prior_accelerators_details',
        question: 'List them and their dates',
        type: 'conditional',
        conditional: [
          {
            field: 'prior_accelerators',
            value: 'yes',
            componentType: 'textarea',
            componentProps: {
              placeholder: "Please list the accelerators/programs and dates."
            }
          }
        ]
      },
      {
        id: 'planned_accelerators',
        question: 'Are you planning to be part of any other programs in the next 12 months?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'planned_accelerators_details',
        question: 'List them',
        type: 'conditional',
        conditional: [
          {
            field: 'planned_accelerators',
            value: 'yes',
            componentType: 'textarea',
            componentProps: {
              placeholder: "Please list the planned programs and dates."
            }
          }
        ]
      }
    ]
  },
  {
    id: "window11",
    title: "Funding",
    questions: [
      {
        id: 'funding_received',
        question: 'Have you received funding previously for your company/project?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
    ]
  },
  {
    id: "window12",
    title: "Presentation",
    questions: [
      {
        id: 'deck',
        question: 'Do you have a slide deck for your planned venture?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'deck_feedback',
        question: 'Have you received feedback on this deck before?',
        type: 'conditional',
        conditional: [
          {
            field: 'deck',
            value: 'yes',
            componentType: 'select',
            componentProps: {
              options: '[{"value":"yes","label":"Yes"},{"value":"no","label":"No"}]'
            }
          }
        ]
      }
    ]
  },
  {
    id: "window13",
    title: "Lab Space",
    questions: [
      {
        id: 'lab_space_needed',
        question: 'Do you need lab space?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'lab_space_secured',
        question: 'Have you secured it?',
        type: 'conditional',
        conditional: [
          {
            field: 'lab_space_needed',
            value: 'yes',
            componentType: 'select',
            componentProps: {
              options: '[{"value":"yes","label":"Yes"},{"value":"no","label":"No"}]'
            }
          }
        ]
      },
      {
        id: 'lab_space_details',
        question: 'Provide details about your lab space needs',
        type: 'conditional',
        conditional: [
          {
            field: 'lab_space_secured',
            value: 'no',
            componentType: 'textarea',
            componentProps: {
              placeholder: "Please describe what kind of lab space you need and your plans to secure it."
            }
          }
        ]
      }
    ]
  },
  {
    id: "window14",
    title: "Minimal Success Vision",
    questions: [
      {
        id: 'minimal_success_version',
        question: 'What is the most minimal version of the company look like that you would consider successful? Describe in your own words.',
        type: 'textarea'
      }
    ]
  }
];
