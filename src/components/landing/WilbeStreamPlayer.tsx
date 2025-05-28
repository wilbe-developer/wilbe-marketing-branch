
import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, Bell } from "lucide-react"
import { fetchVideos } from "@/services/videoService"
import { Button } from "@/components/ui/button"

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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Next live event (mock data - replace with real event data)
  const nextEvent = {
    title: "AI in Drug Discovery Panel",
    date: "2025-06-15T18:00:00Z",
    speakers: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
    description: "Join leading scientists discussing the latest breakthroughs in AI-powered drug discovery"
  }

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

  // Countdown timer for next event
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date(nextEvent.date).getTime()
      const now = new Date().getTime()
      const difference = eventDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [nextEvent.date])

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

  const handleReminderRequest = () => {
    // This would typically send a request to your backend
    alert("Reminder set! We'll notify you before the event starts.")
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
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
      <div className="space-y-4">
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
    <div className="space-y-4">
      {/* Video Player */}
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
      </div>

      {/* Current Video Description */}
      <div className="bg-gray-900 border border-gray-800 p-4">
        <h3 className="text-white font-semibold text-lg mb-2">{currentVideo.title}</h3>
        {currentVideo.presenter && (
          <p className="text-gray-400 text-sm mb-2">Presenter: {currentVideo.presenter}</p>
        )}
        {currentVideo.description && (
          <p className="text-gray-300 text-sm">{currentVideo.description}</p>
        )}
      </div>

      {/* Compact Next Live Event Section */}
      <div className="bg-gray-900 border border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="text-green-500 text-xs font-bold uppercase tracking-wide">
              NEXT LIVE EVENT
            </h3>
          </div>
        </div>
        
        <h4 className="text-white font-semibold text-base mb-2">{nextEvent.title}</h4>
        
        <div className="flex items-center space-x-2 text-gray-400 text-xs mb-3">
          <span>{nextEvent.speakers.join(", ")}</span>
        </div>

        {/* Compact Countdown Timer */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex space-x-1">
            <div className="text-center">
              <div className="bg-green-600 text-white text-sm font-bold py-1 px-2 rounded">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-xs mt-1">D</div>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white text-sm font-bold py-1 px-2 rounded">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-xs mt-1">H</div>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white text-sm font-bold py-1 px-2 rounded">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-xs mt-1">M</div>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white text-sm font-bold py-1 px-2 rounded">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-xs mt-1">S</div>
            </div>
          </div>
          
          {/* Reminder Button */}
          <Button 
            onClick={handleReminderRequest}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white font-medium text-xs px-3 py-1"
          >
            <Bell className="w-3 h-3 mr-1" />
            Remind Me
          </Button>
        </div>
      </div>
    </div>
  )
}
