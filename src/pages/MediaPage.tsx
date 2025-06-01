
import MediaNavigation from "@/components/media/MediaNavigation";
import MediaHeroSection from "@/components/media/MediaHeroSection";
import FeaturedVideoSection from "@/components/media/FeaturedVideoSection";
import PodcastSection from "@/components/media/PodcastSection";
import ThirdPartyContentSection from "@/components/media/ThirdPartyContentSection";
import ImageGallerySection from "@/components/media/ImageGallerySection";
import SocialMediaSection from "@/components/media/SocialMediaSection";
import NewsletterSignup from "@/components/media/NewsletterSignup";
import MediaFooter from "@/components/media/MediaFooter";

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-white">
      <MediaNavigation />
      <MediaHeroSection />
      <FeaturedVideoSection />
      <PodcastSection />
      <ThirdPartyContentSection />
      <ImageGallerySection />
      <SocialMediaSection />
      <NewsletterSignup />
      <MediaFooter />
    </div>
  );
}
