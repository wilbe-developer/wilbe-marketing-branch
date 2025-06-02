
import { BlogPost } from "@/data/blogPosts";
import { Calendar, Clock, User, Tag } from "lucide-react";
import { parseMarkdown } from "@/utils/markdownUtils";

interface BlogPostContentProps {
  post: BlogPost;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Split content by double line breaks to create paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => (
      <p 
        key={index} 
        className="mb-6 text-gray-700 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(paragraph) }}
      />
    ));
  };

  return (
    <article className="bg-white">
      {/* Featured Image */}
      <div className="mb-8">
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
          {post.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600 border-b border-gray-200 pb-6">
        <div className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          <span className="font-medium">{post.author}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          <span>{formatDate(post.date)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          <span>{post.readTime} min read</span>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        {formatContent(post.content)}
      </div>

      {/* Tags */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center mb-4">
          <Tag className="h-5 w-5 mr-2 text-gray-600" />
          <span className="font-medium text-gray-900">Tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span 
              key={tag}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
