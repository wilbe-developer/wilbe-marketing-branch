
export interface AdvocacyCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  badge: string;
  stats?: { label: string; value: string }[];
  buttonText: string;
  buttonVariant?: 'default' | 'outline';
}

export const advocacyCards: AdvocacyCard[] = [
  {
    id: 1,
    title: "TTO Negotiation",
    description: "Securing unprecedented licensing terms and helping the whole ecosystem progress away from legacy mindsets.",
    icon: "FileText",
    badge: "TTO NEGOTIATION",
    stats: [
      { label: "Stanford Reform", value: "25% → 2.5% equity" },
      { label: "MIT Policy Change", value: "$50K → $10K fees" },
      { label: "UC System Update", value: "2-year → 5-month terms" },
    ],
    buttonText: "Learn More",
  },
  {
    id: 2,
    title: "WilbeLeaks",
    description: "A platform to report in confidence behaviour within academia that hinders the development of scientists and from there research and plan community action.",
    icon: "AlertTriangle",
    badge: "WHISTLEBLOWING",
    buttonText: "Report Issue",
  },
  {
    id: 3,
    title: "Become an Ambassador",
    description: "Join our volunteer team and become a Wilbe ambassador in your region (US and Europe).",
    icon: "Users",
    badge: "COMMUNITY",
    buttonText: "Join Team",
    buttonVariant: "outline" as const,
  },
];
