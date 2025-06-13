
import { useState } from 'react';
import { SprintSignupAnswers } from '@/types/sprint-signup';

export const useSprintAnswers = () => {
  const [answers, setAnswers] = useState<SprintSignupAnswers>({
    // Basic Info
    name: '',
    email: '',
    linkedin: '',
    founder_profile: null,
    job: '',
    
    // Window 2
    institution: '',
    is_scientist_engineer: '',
    job_type: '',
    company_role: '',
    team: '',
    
    // Window 3
    incorporated: '',
    
    // Window 4
    invention: '',
    ip: '',
    ip_concerns: '',
    
    // Window 5
    potential_beneficiaries: '',
    
    // Window 6
    customers: '',
    specific_customers: '',
    customer_evidence: '',
    
    // Window 7
    market_known: '',
    competition_research: '',
    market_gap_reason: '',
    
    // Window 8
    experiment: '',
    
    // Window 9
    success_vision_1yr: '',
    success_vision_10yr: '',
    impact_scale: [],
    vision: '',
    
    // Window 10
    prior_accelerators: '',
    prior_accelerators_details: '',
    planned_accelerators: '',
    planned_accelerators_details: '',
    
    // Window 11
    funding_received: '',
    funding_details: '',
    funding_amount_text: '',
    funding_plan: '',
    funding_sources: [],
    
    // Window 12
    deck: '',
    deck_feedback: '',
    
    // Window 13
    lab_space_needed: '',
    lab_space_secured: '',
    lab_space_details: '',
  });

  const handleChange = (field: string, value: any) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [field]: value
    }));
    
    // When a field that has conditional follow-up questions changes,
    // reset the conditional fields if the condition is no longer met
    if (field === 'prior_accelerators' && value !== 'yes') {
      setAnswers(prev => ({ ...prev, prior_accelerators_details: '' }));
    }
    
    if (field === 'planned_accelerators' && value !== 'yes') {
      setAnswers(prev => ({ ...prev, planned_accelerators_details: '' }));
    }
    
    if (field === 'funding_received' && value !== 'yes') {
      setAnswers(prev => ({ ...prev, funding_details: '' }));
    }
    
    if (field === 'deck' && value !== 'yes') {
      setAnswers(prev => ({ ...prev, deck_feedback: '' }));
    }
    
    if (field === 'lab_space_needed' && value !== 'yes') {
      setAnswers(prev => ({ 
        ...prev, 
        lab_space_secured: '',
        lab_space_details: ''
      }));
    }
    
    if (field === 'lab_space_secured' && value !== 'yes') {
      setAnswers(prev => ({ ...prev, lab_space_details: '' }));
    }
  };

  const toggleMultiSelect = (field: string, value: string) => {
    setAnswers(prevAnswers => {
      const currentValues = Array.isArray(prevAnswers[field]) ? [...prevAnswers[field]] : [];
      
      // Check if the value already exists
      const valueIndex = currentValues.indexOf(value);
      
      if (valueIndex === -1) {
        // Add the value if it doesn't exist
        return {
          ...prevAnswers,
          [field]: [...currentValues, value]
        };
      } else {
        // Remove the value if it exists
        currentValues.splice(valueIndex, 1);
        return {
          ...prevAnswers,
          [field]: currentValues
        };
      }
    });
  };

  return {
    answers,
    setAnswers,
    handleChange,
    toggleMultiSelect
  };
};
