import { useParams, useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVideos } from "@/hooks/useVideos";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { getYoutubeEmbedId, getModuleTitle, DECK_BUILDER_TEMPLATE_URL } from "@/utils/videoPlayerUtils";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

import ProfileCompletionDialog from "@/components/ProfileCompletionDialog";
import ApplicationPendingDialog from "@/components/ApplicationPendingDialog";

// Component imports from main:
import VideoHeader from "@/components/video-player/VideoHeader";
import DeckBuilderBanner from "@/components/video-player/DeckBuilderBanner";
import VideoEmbed from "@/components/video-player/VideoEmbed";
import VideoInfo from "@/components/video-player/VideoInfo";
import VideoRelatedList from "@/components/video-player/VideoRelatedList";
import VideoMobileTabs from "@/components/video-player/VideoMobileTabs";
import { ArrowLeft } from "lucide-react"; // added from marketing

export default function VideoPlayerPage() {
  // ── Marketing’s simple “redirect if no id” logic ──
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <Navigate to="/" replace />;
  }

  // ── Main’s access-control hooks and state ──
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isMember, user } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showPendingDialog, setShowPendingDialog] = useState(false);

  const { getVideoById, getModule, markVideoAsCompleted, loading, modules, videos } = useVideos();

  const [video, setVideo] = useState(id ? getVideoById(id) : null);
  const [module, setModule] = useState(video ? getModule(video.moduleId) : null);
  const [isCompleted, setIsCompleted] = useState(video?.completed || false);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);

  const isDeckBuilderVideo =
    location.search.includes("deckBuilder=true") || video?.isDeckBuilderVideo;
  const deckBuilderSlide =
    new URLSearchParams(location.search).get("slide") || video?.deckBuilderSlide;

  // ── If the user isn’t a member, show “members-only” lock screen ──
  const handleNonMemberClick = () => {
    if (user?.membershipApplicationStatus === "under_review") {
      setShowPendingDialog(true);
    } else {
      setShowProfileDialog(true);
    }
  };

  const handleShowPendingDialog = () => {
    setShowPendingDialog(true);
  };

  if (!isMember) {
    return (
      <>
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <Lock className="h-16 w-16 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Members-Only Content</h1>
            <p className="text-lg text-gray-600 mb-6">
              This video is part of our exclusive member content library.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                {user?.membershipApplicationStatus === "under_review"
                  ? "Application Under Review"
                  : "Join Wilbe to Access"}
              </h3>
              <p className="text-blue-700 mb-4">
                {user?.membershipApplicationStatus === "under_review"
                  ? "We’re reviewing your application and will notify you via email when approved."
                  : "Become a member to unlock our full video library featuring:"}
              </p>
              {user?.membershipApplicationStatus !== "under_review" && (
                <ul className="text-left text-blue-700 mb-4 space-y-1">
                  <li>• Expert insights from successful scientist-entrepreneurs</li>
                  <li>• Career transition stories and advice</li>
                  <li>• Industry-specific guidance and resources</li>
                  <li>• Exclusive member-only content</li>
                </ul>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              {user?.membershipApplicationStatus === "under_review" ? (
                <Button size="lg" onClick={() => setShowPendingDialog(true)}>
                  View Application Status
                </Button>
              ) : (
                <Button size="lg" onClick={() => setShowProfileDialog(true)}>
                  Complete Profile to Join
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={() => navigate(PATHS.HOME)}>
                Back to Knowledge Center
              </Button>
            </div>
          </div>
        </div>

        <ProfileCompletionDialog
          open={showProfileDialog}
          onOpenChange={setShowProfileDialog}
          onShowPendingDialog={handleShowPendingDialog}
        />

        <ApplicationPendingDialog
          open={showPendingDialog}
          onOpenChange={setShowPendingDialog}
        />
      </>
    );
  }

  // ── Marketing’s simple “loading” logic replaced by main’s loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading video...</div>
      </div>
    );
  }

  // ── Main’s version: look up the video by ID ──
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

  // ── Main’s “deck builder” / module logic ──
  const youtubeEmbedId = video.youtubeId
    ? getYoutubeEmbedId(video.youtubeId)
    : null;
  const moduleTitle = getModuleTitle(module);
  const deckBuilderUrl = new URL(DECK_BUILDER_TEMPLATE_URL).href;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Marketing’s “back” button with ArrowLeft ── */}
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-gray-300"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* ── Main’s richer header and deck banner ── */}
        <VideoHeader title={video.title} />
        {isDeckBuilderVideo && (
          <DeckBuilderBanner
            moduleTitle={moduleTitle}
            deckBuilderUrl={deckBuilderUrl}
          />
        )}

        {youtubeEmbedId ? (
          <VideoEmbed youtubeEmbedId={youtubeEmbedId} title={video.title} />
        ) : (
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl mb-2">Video not available</h3>
              <p className="text-gray-400">
                This video doesn’t have a valid YouTube link.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6">
          <VideoInfo video={video} />
        </div>

        {/* ── Main’s “related videos” and mobile tabs ── */}
        {isMobile ? (
          <VideoMobileTabs
            relatedVideos={relatedVideos}
            loading={loading}
          />
        ) : (
          <VideoRelatedList
            relatedVideos={relatedVideos}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}