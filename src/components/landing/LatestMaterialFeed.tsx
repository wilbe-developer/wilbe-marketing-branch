
import { Clock, FileText, Video, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MaterialItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'presentation';
  uploadedBy: string;
  uploadedAt: string;
  description: string;
}

const mockMaterials: MaterialItem[] = [
  {
    id: '1',
    title: 'Biotech Funding Landscape 2024',
    type: 'presentation',
    uploadedBy: 'Dr. Sarah Chen',
    uploadedAt: '2 hours ago',
    description: 'Comprehensive overview of current funding trends in biotech'
  },
  {
    id: '2',
    title: 'IP Strategy Workshop Recording',
    type: 'video',
    uploadedBy: 'Prof. Michael Torres',
    uploadedAt: '1 day ago',
    description: 'Deep dive into intellectual property strategies for scientists'
  },
  {
    id: '3',
    title: 'Market Research Template',
    type: 'document',
    uploadedBy: 'Dr. Lisa Park',
    uploadedAt: '2 days ago',
    description: 'Template for conducting effective market research'
  },
  {
    id: '4',
    title: 'Regulatory Pathways Guide',
    type: 'document',
    uploadedBy: 'Dr. James Wilson',
    uploadedAt: '3 days ago',
    description: 'Navigate FDA and EMA regulatory requirements'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4 text-blue-500" />;
    case 'document':
      return <FileText className="h-4 w-4 text-green-500" />;
    case 'presentation':
      return <Download className="h-4 w-4 text-purple-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

export default function LatestMaterialFeed() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2 text-blue-600" />
        Latest Material
      </h3>
      
      <div className="space-y-3">
        {mockMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(material.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm leading-tight">
                    {material.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {material.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      by {material.uploadedBy}
                    </span>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {material.uploadedAt}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
