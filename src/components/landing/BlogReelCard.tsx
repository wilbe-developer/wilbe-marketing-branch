
import { BlogPost } from "@/data/blogPosts";
import { Calendar, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogReelCardProps {
  post: BlogPost;
}

export default function BlogReelCard({ post }: BlogReelCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    navigate(`/blog/${post.slug}`);
  };

  return (
    <article 
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] min-w-[320px] max-w-[320px]"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="w-full h-40 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop";
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-medium">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{post.readTime} min read</span>
          </div>
          <span className="text-xs font-medium text-gray-900 hover:text-gray-700">
            Read more →
          </span>
        </div>
      </div>
    </article>
  );
}
