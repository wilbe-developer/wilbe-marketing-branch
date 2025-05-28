import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  ArrowRight,
  Menu,
  Search,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Calendar,
  Microscope,
  Shield,
  Building,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import LandingNavigation from "@/components/landing/LandingNavigation"
import TickerStrips from "@/components/landing/TickerStrips"
import HeroSection from "@/components/landing/HeroSection"
import WilbeStreamPlayer from "@/components/landing/WilbeStreamPlayer"
import FoundersStories from "@/components/landing/FoundersStories"
import LandingFooter from "@/components/landing/LandingFooter"

export default function LandingPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showSchedule, setShowSchedule] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Video playlist
  const videoPlaylist = [
    {
      id: 1,
      title: "From PhD to $100M: Dr. Maria Rodriguez's Journey",
      duration: "24:30",
      thumbnail:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Founder Stories",
      description: "How a failed cancer drug became revolutionary gene therapy",
    },
    {
      id: 2,
      title: "CRISPR's $50B Market: Dr. Jennifer Doudna Interview",
      duration: "18:45",
      thumbnail:
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Science Deep Dive",
      description: "The future of gene editing and biotechnology startups",
    },
    {
      id: 3,
      title: "Pitch Perfect: Biotech Edition Masterclass",
      duration: "32:15",
      thumbnail:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Masterclass",
      description: "5 pitch deck mistakes that kill science startups",
    },
    {
      id: 4,
      title: "Inside a $50M Biotech Lab Tour",
      duration: "15:20",
      thumbnail:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Lab Tours",
      description: "Exclusive behind-the-scenes at cutting-edge research facilities",
    },
    {
      id: 5,
      title: "Climate Tech Scaling: Climeworks Case Study",
      duration: "28:10",
      thumbnail:
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Case Studies",
      description: "From lab breakthrough to $110M Series C funding",
    },
    {
      id: 6,
      title: "Building Teams Over Technology",
      duration: "8:42",
      thumbnail:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "CEO Insights",
      description: "Dr. Tim Fell on what investors really fund",
    },
    {
      id: 7,
      title: "From Vision to Execution",
      duration: "12:15",
      thumbnail:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Scaling",
      description: "Dr. Christoph Gebald on growth rounds vs early stage",
    },
    {
      id: 8,
      title: "Hiring for Values First",
      duration: "15:30",
      thumbnail:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Culture",
      description: "Dr. Karsten Temme on building startup culture",
    },
  ]

  // Program schedule
  const programSchedule = [
    {
      time: "9:00 AM",
      title: "Morning Science Brief",
      type: "Live",
      duration: "30 min",
      description: "Daily roundup of breakthrough research and startup news",
    },
    {
      time: "10:00 AM",
      title: "Founder Spotlight Series",
      type: "Live",
      duration: "45 min",
      description: "In-depth interviews with scientist entrepreneurs",
    },
    {
      time: "11:00 AM",
      title: "Lab Tours & Demos",
      type: "Recorded",
      duration: "25 min",
      description: "Inside the world's most innovative research facilities",
    },
    {
      time: "12:00 PM",
      title: "Pitch Practice Live",
      type: "Live",
      duration: "60 min",
      description: "Real founders pitch to real investors with live feedback",
    },
    {
      time: "2:00 PM",
      title: "Science Deep Dive",
      type: "Recorded",
      duration: "40 min",
      description: "Technical discussions on cutting-edge research",
    },
    {
      time: "3:30 PM",
      title: "Capital Connect",
      type: "Live",
      duration: "30 min",
      description: "VCs discuss investment trends and opportunities",
    },
    {
      time: "5:00 PM",
      title: "Tools & Resources Workshop",
      type: "Recorded",
      duration: "35 min",
      description: "Hands-on tutorials for entrepreneur tools",
    },
    {
      time: "7:00 PM",
      title: "Community Unscripted",
      type: "Live",
      duration: "45 min",
      description: "Raw, honest conversations about the founder journey",
    },
  ]

  const currentVideo = videoPlaylist[currentVideoIndex]

  // Simulate video progress
  useEffect(() => {
    if (isPlaying && !isLive) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Move to next video
            setCurrentVideoIndex((prevIndex) => (prevIndex === videoPlaylist.length - 1 ? 0 : prevIndex + 1))
            return 0
          }
          return prev + 0.5
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [isPlaying, isLive, videoPlaylist.length])

  // Live countdown timer
  const [timeToLive, setTimeToLive] = useState({
    minutes: Math.floor(Math.random() * 15) + 1,
    seconds: Math.floor(Math.random() * 60),
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToLive((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        } else {
          // Reset timer when it reaches 0
          return { minutes: Math.floor(Math.random() * 15) + 1, seconds: Math.floor(Math.random() * 60) }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index)
    setProgress(0)
    setIsLive(false)
  }

  const getCurrentTime = () => {
    if (isLive) return "LIVE"
    const totalSeconds =
      Number.parseInt(currentVideo.duration.split(":")[0]) * 60 + Number.parseInt(currentVideo.duration.split(":")[1])
    const currentSeconds = Math.floor((progress / 100) * totalSeconds)
    const minutes = Math.floor(currentSeconds / 60)
    const seconds = currentSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const [scrollPosition, setScrollPosition] = useState(0)
  const foundersStoriesRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)

  const handleScroll = (scrollOffset: number, ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset
    }
  }

  const handleMouseWheel = (e: any, ref: React.RefObject<HTMLDivElement>) => {
    e.preventDefault()
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .ticker-content {
          display: flex;
          width: 200%;
        }
        html, body {
          font-family: Helvetica, Arial, sans-serif;
        }
      `}</style>
      {/* Navigation */}
      <LandingNavigation />

      {/* Community Asks Ticker Strip */}
      <TickerStrips />

      {/* Main Hero Section with Video Player */}
      <section className="bg-black text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <HeroSection />
            <WilbeStreamPlayer />
          </div>
        </div>
      </section>

      <FoundersStories />

      {/* Wilbe Capital Portfolio */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Wilbe Capital Portfolio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We invest in the world's most promising scientist entrepreneurs. Meet some of our portfolio founders who
              are transforming industries through science.
            </p>
          </div>

          <div className="relative mb-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold uppercase tracking-wide text-gray-900">Founder Spotlights</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleScroll(-300, portfolioRef)}
                  className="bg-gray-200 hover:bg-gray-300 p-2"
                >
                  <ArrowRight className="w-5 h-5 transform rotate-180" />
                </button>
                <button onClick={() => handleScroll(300, portfolioRef)} className="bg-gray-200 hover:bg-gray-300 p-2">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                className="flex space-x-6"
                ref={portfolioRef}
                onWheel={(e) => handleMouseWheel(e, portfolioRef)}
              >
                {/* Portfolio Company 1 - Biotech */}
                <div className="flex-shrink-0 w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group hover:bg-gray-900">
                  <div className="relative h-40">
                    <img
                      src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                      alt="Synthace"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-xl">Dr. Tim Fell</h3>
                      <p className="text-gray-300 text-sm">CEO & Co-Founder, Synthace</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-green-600 text-white border-0 uppercase tracking-wide text-xs">
                        Biotech
                      </Badge>
                      <span className="text-gray-600 text-sm font-bold group-hover:text-gray-300">Series B • $38M</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                      "We're automating lab workflows to accelerate scientific discovery. Our digital experiment
                      platform is transforming life sciences R&D."
                    </p>
                    <p className="text-gray-600 text-sm italic group-hover:text-gray-300">
                      Former academic at Imperial College London
                    </p>
                  </div>
                </div>

                {/* Portfolio Company 2 - Climate Tech */}
                <div className="flex-shrink-0 w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group hover:bg-gray-900">
                  <div className="relative h-40">
                    <img
                      src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                      alt="Climeworks"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-xl">Dr. Christoph Gebald</h3>
                      <p className="text-gray-300 text-sm">CEO & Co-Founder, Climeworks</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-blue-600 text-white border-0 uppercase tracking-wide text-xs">
                        Climate Tech
                      </Badge>
                      <span className="text-gray-600 text-sm font-bold group-hover:text-gray-300">
                        Series C • $110M
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                      "Our direct air capture technology is removing CO2 from the atmosphere at scale. We're leading the
                      fight against climate change."
                    </p>
                    <p className="text-gray-600 text-sm italic group-hover:text-gray-300">
                      PhD in Mechanical Engineering from ETH Zurich
                    </p>
                  </div>
                </div>

                {/* Portfolio Company 3 - AgTech */}
                <div className="flex-shrink-0 w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group hover:bg-gray-900">
                  <div className="relative h-40">
                    <img
                      src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                      alt="Pivot Bio"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-xl">Dr. Karsten Temme</h3>
                      <p className="text-gray-300 text-sm">CEO & Co-Founder, Pivot Bio</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-yellow-600 text-white border-0 uppercase tracking-wide text-xs">
                        AgTech
                      </Badge>
                      <span className="text-gray-600 text-sm font-bold group-hover:text-gray-300">
                        Series D • $430M
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                      "Our nitrogen-fixing microbes are replacing synthetic fertilizers with biological solutions,
                      revolutionizing sustainable agriculture."
                    </p>
                    <p className="text-gray-600 text-sm italic group-hover:text-gray-300">
                      PhD in Bioengineering from UC Berkeley
                    </p>
                  </div>
                </div>

                {/* Portfolio Company 4 - MedTech */}
                <div className="flex-shrink-0 w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group hover:bg-gray-900">
                  <div className="relative h-40">
                    <img
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                      alt="Oxford Nanopore"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-xl">Dr. Gordon Sanghera</h3>
                      <p className="text-gray-300 text-sm">CEO, Oxford Nanopore</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-purple-600 text-white border-0 uppercase tracking-wide text-xs">
                        MedTech
                      </Badge>
                      <span className="text-gray-600 text-sm font-bold group-hover:text-gray-300">
                        IPO • $5B Valuation
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                      "Our DNA/RNA sequencing technology enables real-time, portable genetic analysis for research and
                      healthcare applications."
                    </p>
                    <p className="text-gray-600 text-sm italic group-hover:text-gray-300">
                      PhD in Bioelectronic Technology from Oxford
                    </p>
                  </div>
                </div>

                {/* Portfolio Company 5 - BioGenesis */}
                <div className="flex-shrink-0 w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group hover:bg-gray-900">
                  <div className="relative h-40">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="BioGenesis"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-xl">Dr. Maria Rodriguez</h3>
                      <p className="text-gray-300 text-sm">CEO & Founder, BioGenesis</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-red-600 text-white border-0 uppercase tracking-wide text-xs">
                        Gene Therapy
                      </Badge>
                      <span className="text-gray-600 text-sm font-bold group-hover:text-gray-300">
                        Series A • $100M
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                      "We pivoted from a failed cancer drug to revolutionary gene therapy. Our platform is now
                      transforming treatment for rare genetic disorders."
                    </p>
                    <p className="text-gray-600 text-sm italic group-hover:text-gray-300">
                      Former researcher at Harvard Medical School
                    </p>
                  </div>
                </div>

                {/* Portfolio Company 6 - NeuroLink */}
                <div className="flex-shrink-0 w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group hover:bg-gray-900">
                  <div className="relative h-40">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="NeuroLink"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-xl">Dr. Sarah Chen</h3>
                      <p className="text-gray-300 text-sm">CEO, NeuroLink Therapeutics</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-orange-600 text-white border-0 uppercase tracking-wide text-xs">
                        Neuroscience
                      </Badge>
                      <span className="text-gray-600 text-sm font-bold group-hover:text-gray-300">Series B • $75M</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                      "We're developing breakthrough treatments for neurodegenerative diseases using our proprietary
                      brain-computer interface technology."
                    </p>
                    <p className="text-gray-600 text-sm italic group-hover:text-gray-300">
                      PhD in Neuroscience from Stanford University
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 uppercase tracking-wide font-bold"
            >
              View Full Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Wilbe Labs */}
      <section className="py-20 bg-gradient-to-br from-yellow-400/30 via-yellow-500/30 to-yellow-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              <span className="text-6xl">Wilbe</span> LABS
            </h2>
            <p className="text-xl text-gray-900 max-w-3xl mx-auto">
              Premium lab spaces designed for scientist entrepreneurs. From wet labs to dry labs, we provide the
              infrastructure you need to turn your research into reality.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Modern biotech laboratory"
                className="w-full h-96 object-cover shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Badge className="mb-3 bg-yellow-500 text-gray-900 border-0 uppercase tracking-wide text-xs">
                  Featured Lab
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-2">Cambridge Biotech Hub</h3>
                <p className="text-gray-200 text-sm">State-of-the-art wet lab facilities with BSL-2 certification</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Lab Space That Works For You
                </h3>
                <p className="text-gray-900 text-lg leading-relaxed mb-6">
                  Access premium laboratory facilities without the overhead. Our labs are equipped with cutting-edge
                  equipment and designed for maximum productivity and collaboration.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center flex-shrink-0">
                    <Building className="h-4 w-4 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Flexible Terms</h4>
                    <p className="text-gray-800 text-sm">From daily access to long-term leases</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center flex-shrink-0">
                    <Microscope className="h-4 w-4 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Premium Equipment</h4>
                    <p className="text-gray-800 text-sm">Access to $2M+ worth of lab equipment</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Community</h4>
                    <p className="text-gray-800 text-sm">Network with fellow scientist entrepreneurs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Compliance Ready</h4>
                    <p className="text-gray-800 text-sm">BSL-1/2 certified with full safety protocols</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-wide px-8"
                >
                  Browse Lab Spaces
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold uppercase tracking-wide px-8"
                >
                  Schedule Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scientists First */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-gray-900 mr-4" />
              <h2 className="text-5xl font-bold text-gray-900 uppercase tracking-wide">Scientists First</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              An advocacy movement born in 2020 at the core of the Wilbe spirit, aimed at freeing all 8.8 million
              scientists in the world from predatory practices within academia, business and politics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white border border-gray-200 hover:border-gray-400 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-8 w-8 text-gray-900 mr-3" />
                  <Badge className="bg-gray-900 text-white text-xs">TTO NEGOTIATION</Badge>
                </div>
                <h3 className="text-xl font-bold mb-3">TTO Negotiation</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Securing unprecedented licensing terms and helping the whole ecosystem progress away from legacy
                  mindsets.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Stanford Reform</span>
                    <span className="font-bold text-gray-900">15% → 5% equity</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">MIT Policy Change</span>
                    <span className="font-bold text-gray-900">$50K → $10K fees</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">UC System Update</span>
                    <span className="font-bold text-gray-900">2-year → 6-month terms</span>
                  </div>
                </div>
                <Button size="sm" className="bg-gray-900 hover:bg-black text-white w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:border-gray-400 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-gray-900 mr-3" />
                  <Badge className="bg-gray-900 text-white text-xs">WHISTLEBLOWING</Badge>
                </div>
                <h3 className="text-xl font-bold mb-3">WilbeLeaks</h3>
                <p className="text-gray-600 text-sm mb-4">
                  A platform to report in confidence behaviour within academia that hinders the development of
                  scientists and from there research and plan community action.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-bold text-sm">247 REPORTS FILED</span>
                  <Button size="sm" className="bg-gray-900 hover:bg-black text-white">
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:border-gray-400 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-gray-900 mr-3" />
                  <Badge className="bg-gray-900 text-white text-xs">COMMUNITY</Badge>
                </div>
                <h3 className="text-xl font-bold mb-3">Become an Ambassador</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join our volunteer team and become a Wilbe ambassador in your region (US and Europe).
                </p>
                <div className="mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Wilbe ambassadors team"
                    className="w-full h-24 object-cover"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white w-full"
                >
                  Join Team
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-900 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl font-bold mb-4 text-white">Support our advocacy work</h3>
                <p className="text-gray-300 mb-6">
                  Our flagship Scientists First t-shirt is available to all scientists and supporters of our work. All
                  proceeds go on to fund the work of our advocacy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold">
                    Buy T-Shirt
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-900 font-bold"
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              <div className="relative h-64 lg:h-auto">
                <img
                  src="/scientists-first-team.png"
                  alt="Scientists First advocacy team"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
