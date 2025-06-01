
import { useParams, Navigate } from "react-router-dom";
import { useVideos } from "@/hooks/useVideos";
import VideoEmbed from "@/components/video-player/VideoEmbed";
import { getYoutubeEmbedId } from "@/utils/videoPlayerUtils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const { getVideoById, loading } = useVideos();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading video...</div>
      </div>
    );
  }

  const video = getVideoById(id);

  if (!video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">Video not found</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const youtubeEmbedId = video.youtubeId ? getYoutubeEmbedId(video.youtubeId) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-white hover:text-gray-300"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          {youtubeEmbedId ? (
            <VideoEmbed youtubeEmbedId={youtubeEmbedId} title={video.title} />
          ) : (
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl mb-2">Video not available</h3>
                <p className="text-gray-400">This video doesn't have a valid YouTube link.</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
            {video.description && (
              <p className="text-gray-300 mb-4">{video.description}</p>
            )}
            {video.presenter && (
              <p className="text-gray-400">Presented by {video.presenter}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
