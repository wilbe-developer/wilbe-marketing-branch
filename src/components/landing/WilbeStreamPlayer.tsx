
import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause } from "lucide-react"
import { fetchVideos } from "@/services/videoService"

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

export default function WilbeStreamPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch videos from the same source as FoundersStories
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        const videosData = await fetchVideos()
        
        // Sort by created_at and take all published videos (same as FoundersStories)
        const sortedVideos = videosData
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        
        setVideos(sortedVideos)
      } catch (err) {
        console.error("Error fetching videos:", err)
        // Fallback to empty array if fetch fails
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  // Progress and video cycling logic
  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    if (isPlaying && videos.length > 0) {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Move to next video when progress reaches 100%
            setCurrentVideoIndex((prevIndex) => (prevIndex === videos.length - 1 ? 0 : prevIndex + 1))
            return 0
          }
          return prev + 1 // Progress every 500ms, so 100 steps = 50 seconds per video
        })
      }, 500)
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, videos.length])

  const handlePlayPause = useCallback(() => setIsPlaying(!isPlaying), [isPlaying])

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <div className="relative bg-black overflow-hidden shadow-2xl">
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
              <div className="absolute inset-0 bg-gray-800 animate-pulse" />
              <div className="absolute top-4 left-4">
                <div className="bg-red-600 px-3 py-1">
                  <span className="text-white text-xs font-bold uppercase tracking-wide">
                    LOADING...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If no videos available, show fallback
  if (videos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <div className="relative bg-black overflow-hidden shadow-2xl">
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
              <div className="absolute inset-0 bg-gray-800" />
              <div className="absolute top-4 left-4">
                <div className="bg-red-600 px-3 py-1">
                  <span className="text-white text-xs font-bold uppercase tracking-wide">
                    LIVE STREAM
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg">No videos available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentVideo = videos[currentVideoIndex]

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="relative bg-black overflow-hidden shadow-2xl">
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
            <img
              src={currentVideo.thumbnail_url || "/placeholder.svg"}
              alt={currentVideo.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg"
              }}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Live Stream Indicator */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1">
                <div className={`w-2 h-2 bg-white ${isPlaying ? "animate-pulse" : ""}`} />
                <span className="text-white text-xs font-bold uppercase tracking-wide">
                  LIVE STREAM
                </span>
              </div>
            </div>

            {/* Centered Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 w-full bg-white/20 h-1">
              <div
                className="bg-green-500 h-1 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current Program Info - Moved below the player */}
        <div className="bg-gray-900 p-4 mt-2">
          <div className="text-green-500 text-xs font-bold uppercase tracking-wide mb-1">NOW STREAMING</div>
          <h3 className="text-white font-bold text-lg leading-tight mb-2">
            {currentVideo.title}
          </h3>
          <p className="text-gray-300 text-sm">
            {currentVideo.description}
          </p>
          {currentVideo.presenter && (
            <p className="text-gray-400 text-xs mt-1">by {currentVideo.presenter}</p>
          )}
        </div>
      </div>
    </div>
  )
}
