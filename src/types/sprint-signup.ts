
export type Step = {
  id: string;
  question: string;
  description?: string;
  type: 'text' | 'email' | 'select' | 'file' | 'textarea' | 'checkbox' | 'conditional';
  options?: { value: string; label: string; }[];
  conditional?: {
    field: string;
    value: string;
    componentType: string;
    componentProps?: Record<string, string>;
  }[];
};

export type Window = {
  id: string;
  title: string;
  questions: Step[];
};

export type SprintSignupAnswers = {
  [key: string]: any;
};

export interface SprintProfile {
  id?: string;
  user_id: string;
  name: string;
  email: string;
  linkedin_url?: string;
  cv_url?: string;
  current_job?: string;
  company_incorporated: boolean;
  received_funding: boolean;
  funding_details?: string;
  has_deck: boolean;
  team_status: string;
  commercializing_invention: boolean;
  university_ip: boolean;
  tto_engaged: boolean;
  problem_defined: boolean;
  customer_engagement: string;
  market_known: boolean;
  market_gap_reason?: string;
  funding_amount?: string;
  has_financial_plan: boolean;
  funding_sources: string[];
  experiment_validated: boolean;
  industry_changing_vision: boolean;
  
  // New fields
  is_scientist_engineer?: boolean;
  job_type?: string;
  ip_concerns?: boolean;
  potential_beneficiaries?: boolean;
  specific_customers?: boolean;
  customer_evidence?: boolean;
  competition_research?: boolean;
  success_vision_1yr?: boolean;
  success_vision_10yr?: boolean;
  impact_scale?: string[];
  prior_accelerators?: boolean;
  prior_accelerators_details?: string;
  planned_accelerators?: boolean;
  planned_accelerators_details?: string;
  lab_space_needed?: boolean;
  lab_space_secured?: boolean;
  lab_space_details?: string;
  deck_feedback?: boolean;
  
  // UTM parameters
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}
