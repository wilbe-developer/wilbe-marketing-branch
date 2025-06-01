
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertTriangle, Users } from "lucide-react";
import { AdvocacyCard as AdvocacyCardType } from "@/data/advocacyCards";
import IssueReportForm from "@/components/forms/IssueReportForm";

interface AdvocacyCardProps {
  card: AdvocacyCardType;
}

const iconMap = {
  FileText,
  AlertTriangle,
  Users,
};

export default function AdvocacyCard({ card }: AdvocacyCardProps) {
  const Icon = iconMap[card.icon as keyof typeof iconMap];

  return (
    <Card className="bg-white border border-gray-200 hover:border-gray-400 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Icon className="h-8 w-8 text-gray-900 mr-3" />
          <Badge className="bg-gray-900 text-white text-xs">{card.badge}</Badge>
        </div>
        <h3 className="text-xl font-bold mb-3">{card.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{card.description}</p>
        
        {card.stats && (
          <div className="space-y-2 mb-4">
            {card.stats.map((stat, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-600">{stat.label}</span>
                <span className="font-bold text-gray-900">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {card.id === 2 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-bold text-sm">247 REPORTS FILED</span>
            <IssueReportForm>
              <Button size="sm" className="bg-gray-900 hover:bg-black text-white">
                {card.buttonText}
              </Button>
            </IssueReportForm>
          </div>
        )}

        {card.id === 3 && (
          <div className="mb-4">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Wilbe ambassadors team"
              className="w-full h-24 object-cover"
            />
          </div>
        )}

        {(card.id === 1 || card.id === 3) && (
          <Button 
            size="sm" 
            variant={card.buttonVariant || "default"}
            className={card.buttonVariant === "outline" 
              ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white w-full"
              : "bg-gray-900 hover:bg-black text-white w-full"
            }
          >
            {card.buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
