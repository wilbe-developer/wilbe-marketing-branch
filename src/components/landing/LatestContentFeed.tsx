
import { Clock, Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

const featuredVideos: Video[] = [
  {
    id: "26d42e3b-7484-49a4-88bc-a6bdf2f509a8",
    title: "Two Ways of Doing Ventures",
    description: "There are two distinct ways of doing ventures, and we think you'll like one most.",
    thumbnail_url: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/thumbnails//2ways.webp",
    duration: "9:06",
    presenter: null,
    created_at: "2024-05-15T15:00:39+00:00"
  },
  {
    id: "featured-comparing-startups",
    title: "Comparing Startups and Large Companies",
    description: "Understanding the key differences between startup and corporate environments.",
    thumbnail_url: "/placeholder.svg",
    duration: "8:30",
    presenter: "Ale",
    created_at: "2024-03-01T12:00:00+00:00"
  },
  {
    id: "featured-one-liner",
    title: "Writing your one-liner",
    description: "Craft a compelling one-line description of your business that captures attention.",
    thumbnail_url: "/placeholder.svg",
    duration: "6:45",
    presenter: "Ale",
    created_at: "2024-03-02T12:00:00+00:00"
  },
  {
    id: "featured-customer-identification",
    title: "Buyers, Users and Titles: Identifying your customer",
    description: "Learn to distinguish between different customer types and how to reach them.",
    thumbnail_url: "/placeholder.svg",
    duration: "12:20",
    presenter: "Josh McKenty",
    created_at: "2024-03-03T12:00:00+00:00"
  },
  {
    id: "6b8d3ca3-9159-4f8a-acf9-3ecae38e2caf",
    title: "About the TTO",
    description: "Before you can start your company you will likely need to negotiate a licensing deal with your institution. Legendary ex-MIT TTO guru Lita Nelsen will tell you all you need to know to understand how tech transfer offices work.",
    thumbnail_url: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/thumbnails//_Wilbe%20BSF10%202023%20%20Kickoff%20(9).webp",
    duration: "6:25",
    presenter: "Lita Nelsen",
    created_at: "2024-03-06T12:00:00+00:00"
  },
  {
    id: "1d20ab92-9c3b-4635-921c-c874ccc5304f",
    title: "The Basics of Shares",
    description: "Before we talk about getting the team together, you need to know some basics around how shares work.",
    thumbnail_url: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/thumbnails//basicsofshares.webp",
    duration: "6:23",
    presenter: "Ale",
    created_at: "2024-03-04T12:11:03+00:00"
  }
];

export default function LatestContentFeed() {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Latest Content</h4>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {featuredVideos.map((video) => (
          <div
            key={video.id}
            className="flex space-x-3 p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow cursor-pointer group"
            onClick={() => window.open(`/video/${video.id}`, '_blank')}
          >
            <div className="relative w-20 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="h-4 w-4 text-gray-400" />
                </div>
              )}
              {video.duration && (
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 rounded-tl">
                  {video.duration}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                {video.title}
              </h5>
              {video.presenter && (
                <p className="text-xs text-gray-600 mt-1">by {video.presenter}</p>
              )}
              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Featured Content</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
