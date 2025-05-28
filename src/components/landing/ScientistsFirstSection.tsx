
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useAdvocacyImage } from "@/hooks/useAdvocacyImage";
import { advocacyCards } from "@/data/advocacyCards";
import AdvocacyCard from "./AdvocacyCard";

export default function ScientistsFirstSection() {
  const advocacyImageUrl = useAdvocacyImage();

  return (
    <section className="py-20 bg-white">
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
          {advocacyCards.map((card) => (
            <AdvocacyCard key={card.id} card={card} />
          ))}
        </div>

        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-4 text-white">Support our advocacy work</h3>
              <p className="text-gray-300 mb-6">
                Our flagship Scientists First t-shirt is available to all scientists and supporters of our work. All
                proceeds go on to fund the work of our advocacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold">
                  I'm With You ✊
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-gray-900 hover:bg-white hover:text-gray-900 font-bold"
                >
                  Tell a Friend ✍️
                </Button>
              </div>
            </div>

            <div className="relative h-64 lg:h-auto">
              <img
                src={advocacyImageUrl || "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/images/scientists-first-advocacy-team.png"}
                alt="Scientists First advocacy team wearing t-shirts"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
