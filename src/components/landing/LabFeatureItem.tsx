
import { LucideIcon } from "lucide-react";

interface LabFeatureItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function LabFeatureItem({ icon: Icon, title, description }: LabFeatureItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-gray-900" />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-800 text-sm">{description}</p>
      </div>
    </div>
  );
}
