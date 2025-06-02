
import { BlogPost } from "@/data/blogPosts";
import { Calendar, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    navigate(`/blog/${post.slug}`);
  };

  return (
    <article 
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            console.log(`Failed to load image: ${post.featuredImage}`);
            e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop";
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-gray-700 transition-colors">
          {post.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="text-sm font-medium text-gray-900 hover:text-gray-700">
            Read more →
          </span>
        </div>
      </div>
    </article>
  );
}
