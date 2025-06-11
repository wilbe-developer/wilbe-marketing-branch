export type ProfileFieldMapping = {
  label: string;
  type: "string" | "boolean" | "select" | "multi-select";
  options?: { value: string; label: string }[];
};

// Map profile keys to their display labels and field types
export const profileFieldMappings: Record<string, ProfileFieldMapping> = {
  team_status: {
    label: "Is this a solo project or do you have a team?",
    type: "select",
    options: [
      { value: "solo", label: "I'm solo and I plan to continue this way" },
      { value: "looking", label: "I'm solo and looking for co-founders" },
      { value: "cofounders", label: "I have co-founders" },
      { value: "employees", label: "I have a team but they're employees" }
    ]
  },
  company_incorporated: {
    label: "Is your company incorporated?",
    type: "boolean"
  },
  received_funding: {
    label: "Have you received any funding?",
    type: "boolean"
  },
  has_deck: {
    label: "Do you have a pitch deck?",
    type: "boolean"
  },
  problem_defined: {
    label: "Have you clearly defined the problem you're solving?",
    type: "boolean"
  },
  market_known: {
    label: "Do you know your target market?",
    type: "boolean"
  },
  commercializing_invention: {
    label: "Are you commercializing a scientific invention?",
    type: "boolean"
  },
  university_ip: {
    label: "Does your technology involve university IP?",
    type: "boolean"
  },
  tto_engaged: {
    label: "Have you engaged with the technology transfer office?",
    type: "boolean"
  },
  experiment_validated: {
    label: "Have you recently tested out the idea of this venture in some way?",
    type: "select",
    options: [
      { value: "prototype_data", label: "Yes, we have a prototype and/or data from a key experiment" },
      { value: "validated_customers", label: "Yes, we have validated the idea with key customers and experts in the field" },
      { value: "conceptual", label: "No, not as yet, it is purely conceptual" },
      { value: "working_on_it", label: "No, not as yet, we are working on it" }
    ]
  },
  customer_engagement: {
    label: "Have you spoken with potential customers / key decision makers yet?",
    type: "select",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unknown", label: "Do not know who they are / not applicable" }
    ]
  }
};

/**
 * Gets profile field mapping information or returns defaults
 */
export const getProfileFieldMapping = (profileKey: string): ProfileFieldMapping => {
  return profileFieldMappings[profileKey] || {
    label: profileKey,
    type: "boolean"
  };
};
