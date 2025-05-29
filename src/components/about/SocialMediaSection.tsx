
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, Youtube, ExternalLink, Instagram } from "lucide-react";

export default function SocialMediaSection() {
  const socialPlatforms = [
    {
      name: "LinkedIn",
      handle: "@wilbe",
      url: "https://linkedin.com/company/wilbe",
      icon: Linkedin,
      description: "Professional updates, company news, and industry insights",
      followerCount: "10K+",
      color: "from-blue-600 to-blue-800",
      stats: {
        posts: "500+",
        engagement: "High",
        focus: "Professional Network"
      }
    },
    {
      name: "YouTube",
      handle: "@wilbescience",
      url: "https://youtube.com/@wilbescience",
      icon: Youtube,
      description: "Educational content, founder stories, and deep tech insights",
      followerCount: "5K+",
      color: "from-red-600 to-red-800",
      stats: {
        videos: "100+",
        watchTime: "10K+ hours",
        focus: "Educational Content"
      }
    },
    {
      name: "X (Twitter)",
      handle: "@wilbe_science",
      url: "https://x.com/wilbe_science",
      icon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
        </svg>
      ),
      description: "Real-time updates, quick insights, and community engagement",
      followerCount: "3K+",
      color: "from-gray-800 to-black",
      stats: {
        tweets: "1K+",
        engagement: "Growing",
        focus: "Community Updates"
      }
    },
    {
      name: "Instagram",
      handle: "@wilbe_science",
      url: "https://instagram.com/wilbe_science",
      icon: Instagram,
      description: "Behind-the-scenes content, visual stories, and community highlights",
      followerCount: "2K+",
      color: "from-purple-600 to-pink-600",
      stats: {
        posts: "200+",
        engagement: "Growing",
        focus: "Visual Storytelling"
      }
    }
  ];

  const socialContent = [
    {
      title: "Founder Spotlights",
      description: "Weekly features highlighting scientist entrepreneurs in our community",
      platforms: ["LinkedIn", "YouTube"]
    },
    {
      title: "Industry Insights",
      description: "Analysis of trends in deep tech, biotech, and scientific entrepreneurship",
      platforms: ["LinkedIn", "X"]
    },
    {
      title: "Educational Series",
      description: "How-to guides for scientist founders on building companies",
      platforms: ["YouTube", "LinkedIn"]
    },
    {
      title: "Community Highlights",
      description: "Celebrating achievements and milestones from our network",
      platforms: ["All Platforms"]
    }
  ];

  return (
    <section id="social-media-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-red-600 text-white border-0 uppercase tracking-wide text-sm">
            Social Media & Content
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Follow Our Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay connected with the latest updates, insights, and stories from the scientist entrepreneur community. 
            Follow us across platforms for different types of content and engagement.
          </p>
        </div>

        {/* Social Platforms */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {socialPlatforms.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className={`h-32 bg-gradient-to-r ${platform.color} flex items-center justify-center relative`}>
                  <IconComponent className="h-12 w-12 text-white" />
                  <div className="absolute top-4 right-4 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {platform.followerCount}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{platform.name}</h3>
                    <span className="text-gray-500 text-sm">{platform.handle}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{platform.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    {Object.entries(platform.stats).map(([key, value]) => (
                      <div key={key} className="bg-white p-2 rounded border">
                        <div className="font-medium text-gray-900 capitalize">{key}</div>
                        <div className="text-gray-600">{value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <Button asChild className="w-full">
                    <a href={platform.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      Follow
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Types */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gray-800 text-white border-0 uppercase tracking-wide text-sm">
            Content We Share
          </Badge>
          <h3 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            What You'll Find
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our content strategy focuses on providing value to the scientist entrepreneur community 
            through educational, inspirational, and practical content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {socialContent.map((content, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-gray-900 mb-2">{content.title}</h4>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">{content.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Available on:</span>
                <div className="flex gap-1">
                  {content.platforms.map((platform, idx) => (
                    <Badge key={idx} className="bg-gray-200 text-gray-700 border-0 text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg text-white">
          <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide">
            Join the Conversation
          </h3>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Be part of the global community of scientist entrepreneurs. Share your story, 
            learn from others, and help build the future of scientific innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Share Your Story
            </Button>
            <Button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-pink-600 transition-colors">
              Join Our Newsletter
            </Button>
          </div>
        </div>

        {/* Hashtag Section */}
        <div className="mt-16 text-center">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Use Our Hashtag</h4>
          <div className="text-3xl font-bold text-gray-600 mb-2">#ScientistsFirst</div>
          <p className="text-gray-500 text-sm">
            Tag us in your posts and use #ScientistsFirst to be featured in our community highlights
          </p>
        </div>
      </div>
    </section>
  );
}
