import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useAdvocacyImage } from "@/hooks/useAdvocacyImage";
import { advocacyCards } from "@/data/advocacyCards";
import AdvocacyCard from "./AdvocacyCard";
import AdvocacyComingSoonDialog from "@/components/common/AdvocacyComingSoonDialog";
export default function ScientistsFirstSection() {
  const advocacyImageUrl = useAdvocacyImage();
  const [isAdvocacyDialogOpen, setIsAdvocacyDialogOpen] = useState(false);
  const [advocacyDialogType, setAdvocacyDialogType] = useState<'support' | 'share'>('support');
  const handleSupportClick = () => {
    setAdvocacyDialogType('support');
    setIsAdvocacyDialogOpen(true);
  };
  const handleShareClick = () => {
    setAdvocacyDialogType('share');
    setIsAdvocacyDialogOpen(true);
  };
  return <>
      <section id="scientists-first" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 md:mb-6">
              <Shield className="h-8 w-8 md:h-12 md:w-12 text-gray-900 mb-2 sm:mb-0 sm:mr-4" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 uppercase tracking-wide text-center">
                Scientists First: The movement
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">Born in 2020 out of the frustration of venture operators seeing too many scientists unable to unlock their full potential. Determined to free all 8.8 million scientists from the politics of legacy academia, industry and government and accelerate the rate of application of science in the real world.</p>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mt-3 md:mt-4 leading-relaxed">Scientists First is the rallying cry of all our community work as we continue pressing universities and policy makers to improve the way that scientists can perform in the century ahead.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {advocacyCards.map(card => <AdvocacyCard key={card.id} card={card} />)}
          </div>

          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-6 sm:p-8 lg:p-12">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 text-white">Support our advocacy work</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4 md:mb-6 leading-relaxed">
                  Our flagship Scientists First t-shirt is available to all scientists and supporters of our work. All
                  proceeds go on to fund the work of our advocacy.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-sm sm:text-base" onClick={handleSupportClick}>
                    I'm With You ✊
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleShareClick} className="border-white hover:bg-white font-bold text-sm sm:text-base text-black">
                    Tell a Friend ✍️
                  </Button>
                </div>
              </div>

              <div className="relative h-48 sm:h-64 lg:h-auto">
                <img src={advocacyImageUrl || "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/images/scientists-first-advocacy-team.png"} alt="Scientists First advocacy team wearing t-shirts" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdvocacyComingSoonDialog isOpen={isAdvocacyDialogOpen} onClose={() => setIsAdvocacyDialogOpen(false)} type={advocacyDialogType} />
    </>;
}