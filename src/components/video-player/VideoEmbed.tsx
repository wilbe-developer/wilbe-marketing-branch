
import React from 'react';

interface VideoEmbedProps {
  youtubeEmbedId: string;
  title: string;
  autoplay?: boolean;
  controls?: boolean;
}

const VideoEmbed = ({ youtubeEmbedId, title, autoplay = false, controls = true }: VideoEmbedProps) => {
  const embedUrl = `https://www.youtube.com/embed/${youtubeEmbedId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoEmbed;
