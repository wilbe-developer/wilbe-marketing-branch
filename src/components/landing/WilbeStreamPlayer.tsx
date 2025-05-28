
import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Calendar } from "lucide-react"
import { videoPlaylist } from "@/data/videoPlaylist"

export default function WilbeStreamPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Live countdown timer - only update once per second
  const [timeToLive, setTimeToLive] = useState({
    minutes: Math.floor(Math.random() * 15) + 1,
    seconds: Math.floor(Math.random() * 60),
  })

  // Optimized progress update - less frequent updates
  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    if (isPlaying && !isLive) {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentVideoIndex((prevIndex) => (prevIndex === videoPlaylist.length - 1 ? 0 : prevIndex + 1))
            return 0
          }
          return prev + 1 // Slower progress updates
        })
      }, 500) // Less frequent updates
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, isLive])

  // Countdown timer - update once per second only
  useEffect(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    countdownIntervalRef.current = setInterval(() => {
      setTimeToLive((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        } else {
          return { minutes: Math.floor(Math.random() * 15) + 1, seconds: Math.floor(Math.random() * 60) }
        }
      })
    }, 1000)

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [])

  const currentVideo = videoPlaylist[currentVideoIndex]

  const handlePlayPause = useCallback(() => setIsPlaying(!isPlaying), [isPlaying])
  const handleMute = useCallback(() => setIsMuted(!isMuted), [isMuted])
  const handleLiveToggle = useCallback(() => setIsLive(!isLive), [isLive])

  const getCurrentTime = useCallback(() => {
    if (isLive) return "LIVE"
    const totalSeconds = Number.parseInt(currentVideo.duration.split(":")[0]) * 60 + Number.parseInt(currentVideo.duration.split(":")[1])
    const currentSeconds = Math.floor((progress / 100) * totalSeconds)
    const minutes = Math.floor(currentSeconds / 60)
    const seconds = currentSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }, [isLive, currentVideo.duration, progress])

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="relative bg-black overflow-hidden shadow-2xl">
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
            <img
              src={currentVideo.thumbnail}
              alt={currentVideo.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Live Indicator */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1">
                <div className={`w-2 h-2 bg-white ${isLive ? "animate-pulse" : ""}`} />
                <span className="text-white text-xs font-bold uppercase tracking-wide">
                  {isLive ? "LIVE" : "PLAYLIST"}
                </span>
              </div>
              <div className="bg-black/70 backdrop-blur-sm px-3 py-1">
                <span className="text-white text-xs font-medium">Wilbe STREAM</span>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePlayPause}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-white" />
                    ) : (
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={handleMute}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-white" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-white" />
                    )}
                  </button>
                  <div className="text-white text-sm font-medium">
                    {getCurrentTime()} / {isLive ? "LIVE" : currentVideo.duration}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <a
                    href="https://wilbe.com/tv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors uppercase tracking-wide"
                  >
                    Full Screen
                  </a>
                  <button
                    onClick={handleLiveToggle}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors uppercase tracking-wide"
                  >
                    {isLive ? "Switch to Playlist" : "Go Live"}
                  </button>
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Maximize className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="w-full bg-white/20 h-1">
                <div
                  className="bg-green-500 h-1 transition-all duration-200"
                  style={{ width: isLive ? "100%" : `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Program Info */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm p-3 max-w-xs">
              <div className="text-green-500 text-xs font-bold uppercase tracking-wide mb-1">NOW PLAYING</div>
              <h3 className="text-white font-bold text-sm leading-tight mb-1">
                {isLive ? "Live: Founder Spotlight Series" : currentVideo.title}
              </h3>
              <p className="text-gray-300 text-xs">
                {isLive ? "Dr. Maria Rodriguez discusses her $100M journey" : currentVideo.description}
              </p>
            </div>
          </div>

          {/* Wilbe Stream Branding */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <div className="bg-green-500 p-2">
              <Play className="h-4 w-4 text-black" />
            </div>
            <div>
              <div className="text-white font-bold text-sm uppercase tracking-wide">Wilbe STREAM</div>
              <div className="text-gray-300 text-xs">24/7 Scientist Entrepreneur Content</div>
            </div>
          </div>
        </div>

        {/* Compact Up Next Panel */}
        <div className="bg-gray-900 p-4 mt-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming Events
              </h3>
              <button className="text-green-500 text-xs font-medium hover:text-green-400 transition-colors">
                Full Schedule →
              </button>
            </div>

            <div className="bg-red-600 p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-xs font-bold uppercase tracking-wide flex items-center mb-1">
                    <div className="w-1.5 h-1.5 bg-white animate-pulse mr-2"></div>
                    LIVE IN {timeToLive.minutes}:{String(timeToLive.seconds).padStart(2, "0")}
                  </div>
                  <h4 className="text-white font-bold text-sm">Science Deep Dive</h4>
                  <p className="text-red-100 text-xs">Dr. Jennifer Doudna on CRISPR</p>
                </div>
                <button className="text-red-100 text-xs hover:text-white transition-colors">Remind Me</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
