
export interface NewsItem {
  id: string;
  title: string;
  timestamp: string;
  category: string;
}

export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Breakthrough in quantum computing achieved by MIT researchers",
    timestamp: "2 min ago",
    category: "Technology"
  },
  {
    id: "2",
    title: "New gene therapy shows promising results in clinical trials",
    timestamp: "15 min ago",
    category: "Healthcare"
  },
  {
    id: "3",
    title: "AI startup raises $50M Series A for drug discovery platform",
    timestamp: "32 min ago",
    category: "Funding"
  },
  {
    id: "4",
    title: "Climate tech company develops carbon capture breakthrough",
    timestamp: "1 hr ago",
    category: "Climate"
  },
  {
    id: "5",
    title: "Biotech firm announces partnership with major pharmaceutical company",
    timestamp: "2 hr ago",
    category: "Partnerships"
  },
  {
    id: "6",
    title: "Revolutionary battery technology extends EV range by 40%",
    timestamp: "3 hr ago",
    category: "Energy"
  },
  {
    id: "7",
    title: "Scientists develop new method for early cancer detection",
    timestamp: "4 hr ago",
    category: "Research"
  },
  {
    id: "8",
    title: "Fusion energy startup achieves net energy gain milestone",
    timestamp: "5 hr ago",
    category: "Energy"
  }
];
