import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building, Microscope, Users, Shield } from "lucide-react";
import LabFeatureItem from "./LabFeatureItem";

export default function WilbeLabsSection() {
  const labFeatures = [
    {
      icon: Building,
      title: "Flexible Terms",
      description: "From daily access to long-term leases"
    },
    {
      icon: Microscope,
      title: "Premium Equipment",
      description: "Access to $2M+ worth of lab equipment"
    },
    {
      icon: Users,
      title: "Community",
      description: "Network with fellow scientist entrepreneurs"
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description: "BSL-1/2 certified with full safety protocols"
    }
  ];

  const deliveredLabs = [
    {
      name: "UCL's IDEALondon",
      location: "London, UK",
      image: "/lovable-uploads/dc5b5559-aaec-44a3-a59b-5b38bd6a9477.png",
      description: "Modern biotech incubator in central London"
    },
    {
      name: "Milvus Advanced",
      location: "Oxford, UK", 
      image: "/lovable-uploads/dc5b5559-aaec-44a3-a59b-5b38bd6a9477.png",
      description: "State-of-the-art research facility"
    },
    {
      name: "Origen",
      location: "Bristol, UK",
      image: "/lovable-uploads/dc5b5559-aaec-44a3-a59b-5b38bd6a9477.png",
      description: "Industrial-scale laboratory complex"
    },
    {
      name: "CarpeCarbon",
      location: "Turin, Italy",
      image: "/lovable-uploads/dc5b5559-aaec-44a3-a59b-5b38bd6a9477.png",
      description: "Climate tech innovation hub"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-400/30 via-yellow-500/30 to-yellow-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            <span className="text-6xl">Wilbe</span> LABS: SECURE THE RIGHT LAB FOR YOUR TEAM
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Premium lab spaces designed for scientist entrepreneurs. From wet labs to dry labs, we provide the
            infrastructure you need to turn your research into reality.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Modern biotech laboratory"
              className="w-full h-96 object-cover shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge className="mb-3 bg-yellow-500 text-gray-900 border-0 uppercase tracking-wide text-xs">
                Featured Lab
              </Badge>
              <h3 className="text-2xl font-bold text-white mb-2">Cambridge Biotech Hub</h3>
              <p className="text-gray-200 text-sm">State-of-the-art wet lab facilities with BSL-2 certification</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Lab Space That Works For You
              </h3>
              <p className="text-gray-900 text-lg leading-relaxed mb-6">
                Access premium laboratory facilities without the overhead. Our labs are equipped with cutting-edge
                equipment and designed for maximum productivity and collaboration.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {labFeatures.map((feature, index) => (
                <LabFeatureItem
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-wide px-8"
              >
                Browse Lab Spaces
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold uppercase tracking-wide px-8"
              >
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Labs Delivered and Under Management
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our portfolio of successfully delivered and actively managed laboratory spaces across Europe, 
              supporting scientist entrepreneurs at every stage of their journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveredLabs.map((lab, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={lab.image}
                    alt={`${lab.name} laboratory facility`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-1">{lab.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{lab.location}</p>
                  <p className="text-xs text-gray-500">{lab.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
