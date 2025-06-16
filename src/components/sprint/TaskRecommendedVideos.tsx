
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import VideoCard from '@/components/VideoCard';
import { Video } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskRecommendedVideosProps {
  videoIds: string[];
}

const TaskRecommendedVideos: React.FC<TaskRecommendedVideosProps> = ({ videoIds }) => {
  const isMobile = useIsMobile();

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['recommended-videos', videoIds],
    queryFn: async () => {
      if (!videoIds || videoIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .in('id', videoIds)
        .eq('status', 'published');
      
      if (error) {
        console.error('Error fetching recommended videos:', error);
        throw error;
      }
      
      // Transform to match Video type
      return data.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description || '',
        thumbnailUrl: video.thumbnail_url || '/placeholder.svg',
        duration: video.duration || '',
        presenter: video.presenter || '',
        youtubeId: video.youtube_id || '',
        completed: false, // We don't track completion for recommended videos
        moduleId: '', // Not associated with a module
        isDeckBuilderVideo: false
      })) as Video[];
    },
    enabled: videoIds && videoIds.length > 0
  });

  if (!videoIds || videoIds.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-50 rounded-lg ${isMobile ? 'p-3' : 'p-6'}`}>
        <h3 className="text-lg font-medium mb-4">Recommended Videos</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !videos || videos.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 rounded-lg ${isMobile ? 'p-3' : 'p-6'}`}>
      <h3 className="text-lg font-medium mb-4">Recommended Videos</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {videos.map((video) => (
          <div key={video.id} className="flex-shrink-0 w-64">
            <VideoCard
              video={video}
              showModule={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskRecommendedVideos;
