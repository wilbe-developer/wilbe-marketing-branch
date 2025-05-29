
export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  field: string;
}

export const jobOpportunities: JobOpportunity[] = [
  {
    id: "1",
    title: "Senior Biotech Research Scientist",
    company: "Genentech",
    location: "San Francisco, CA",
    type: "full-time",
    field: "Biotechnology"
  },
  {
    id: "2",
    title: "AI Research Engineer",
    company: "DeepMind",
    location: "London, UK",
    type: "full-time",
    field: "Artificial Intelligence"
  },
  {
    id: "3",
    title: "Quantum Computing Researcher",
    company: "IBM Research",
    location: "New York, NY",
    type: "full-time",
    field: "Quantum Physics"
  },
  {
    id: "4",
    title: "Clinical Data Scientist",
    company: "Moderna",
    location: "Cambridge, MA",
    type: "full-time",
    field: "Data Science"
  },
  {
    id: "5",
    title: "Materials Science Engineer",
    company: "Tesla",
    location: "Austin, TX",
    type: "full-time",
    field: "Materials Science"
  },
  {
    id: "6",
    title: "Computational Biology Intern",
    company: "Illumina",
    location: "San Diego, CA",
    type: "internship",
    field: "Computational Biology"
  },
  {
    id: "7",
    title: "Pharmaceutical Research Associate",
    company: "Pfizer",
    location: "New York, NY",
    type: "contract",
    field: "Pharmaceutical Sciences"
  },
  {
    id: "8",
    title: "Environmental Data Analyst",
    company: "NASA",
    location: "Houston, TX",
    type: "full-time",
    field: "Environmental Science"
  }
];
