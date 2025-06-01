
import MediaNavigation from "@/components/media/MediaNavigation"
import MediaHeroSection from "@/components/media/MediaHeroSection"
import FeaturedVideoSection from "@/components/media/FeaturedVideoSection"
import PodcastSection from "@/components/media/PodcastSection"
import SocialMediaSection from "@/components/media/SocialMediaSection"
import ImageGallerySection from "@/components/media/ImageGallerySection"
import ThirdPartyContentSection from "@/components/media/ThirdPartyContentSection"
import NewsletterSignup from "@/components/media/NewsletterSignup"
import MediaFooter from "@/components/media/MediaFooter"

export default function MediaLandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <MediaNavigation />
      <MediaHeroSection />
      <FeaturedVideoSection />
      <PodcastSection />
      <SocialMediaSection />
      <ImageGallerySection />
      <ThirdPartyContentSection />
      <NewsletterSignup />
      <MediaFooter />
    </div>
  )
}
