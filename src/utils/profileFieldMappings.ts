
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
  customer_engagement: {
    label: "Have you engaged with potential customers?",
    type: "select",
    options: [
      { value: "none", label: "Not yet" },
      { value: "some", label: "Some initial conversations" },
      { value: "extensive", label: "Extensive customer discovery" }
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
