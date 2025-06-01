
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, MessageCircle, Share2 } from "lucide-react"

const socialPosts = [
  {
    id: 1,
    platform: "LinkedIn",
    content: "Exciting news! Our portfolio company just raised $25M Series A to scale their carbon capture technology. The future of climate tech is bright! 🌱",
    likes: 234,
    comments: 45,
    shares: 12,
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    platform: "Twitter",
    content: "Key takeaway from today's BSF session: The best scientific breakthroughs happen when you combine deep expertise with entrepreneurial thinking. #ScienceEntrepreneurship",
    likes: 89,
    comments: 23,
    shares: 34,
    date: "2024-01-14",
    image: null
  },
  {
    id: 3,
    platform: "Instagram",
    content: "Behind the scenes at our latest founder interview. Dr. Maria Rodriguez shares her journey from PhD to $100M company! 📹",
    likes: 156,
    comments: 28,
    shares: 19,
    date: "2024-01-13",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

export default function SocialMediaSection() {
  return (
    <section id="social" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900">SOCIAL FEED</h2>
          <Button variant="outline" className="hidden md:flex">
            Follow Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPosts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.platform}
                  </Badge>
                  <span className="text-gray-500 text-xs">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
                
                {post.image && (
                  <div className="mb-3 aspect-video rounded-lg overflow-hidden">
                    <img
                      src={post.image}
                      alt="Social media post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <p className="text-gray-900 text-sm mb-4 leading-relaxed">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="h-4 w-4" />
                      <span>{post.shares}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Post
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline">
            Follow Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
