
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

export const LinkPreview = ({ url, title, description, siteName }: LinkPreviewProps) => {
  return (
    <div className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
              {siteName && (
                <span className="text-sm text-gray-600 font-medium">{siteName}</span>
              )}
            </div>
            {title && (
              <h4 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">
                {title}
              </h4>
            )}
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {description}
              </p>
            )}
            <p className="text-xs text-gray-500 truncate">
              {url}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
};
