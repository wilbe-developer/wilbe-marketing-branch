
import { Badge } from "@/components/ui/badge";
import { PortfolioCompany } from "@/data/portfolioCompanies";

interface PortfolioCardProps {
  company: PortfolioCompany;
}

export default function PortfolioCard({ company }: PortfolioCardProps) {
  return (
    <div className="flex-shrink-0 w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group hover:bg-gray-900">
      <div className="relative h-40">
        <img
          src={company.image}
          alt={company.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-white font-bold text-xl">{company.founder}</h3>
          <p className="text-gray-300 text-sm">{company.title}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <Badge className={`${company.categoryColor} text-white border-0 uppercase tracking-wide text-xs`}>
            {company.category}
          </Badge>
          <span className="text-gray-600 text-sm font-bold group-hover:text-gray-300">{company.funding}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
          {company.description}
        </p>
        <p className="text-gray-600 text-sm italic group-hover:text-gray-300">
          {company.background}
        </p>
      </div>
    </div>
  );
}
