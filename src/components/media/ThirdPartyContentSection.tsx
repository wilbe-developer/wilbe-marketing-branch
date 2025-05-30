
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink } from "lucide-react"

const thirdPartyContent = [
  {
    id: 1,
    title: "Nature: Breakthrough in Gene Therapy Delivery",
    source: "Nature Biotechnology",
    summary: "New lipid nanoparticle design shows 10x improvement in targeting specific cell types.",
    url: "#",
    category: "Research",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "TechCrunch: $500M Climate Tech Fund Launched",
    source: "TechCrunch",
    summary: "New fund specifically targets early-stage climate technologies with strong scientific foundations.",
    url: "#",
    category: "Funding",
    date: "2024-01-14",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Science: AI Accelerates Drug Discovery Timeline",
    source: "Science Magazine",
    summary: "Machine learning models reduce drug discovery timeline from years to months.",
    url: "#",
    category: "Research",
    date: "2024-01-13",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Forbes: The Rise of Science-Based Startups",
    source: "Forbes",
    summary: "Why investors are increasingly betting on companies founded by scientists and engineers.",
    url: "#",
    category: "Industry",
    date: "2024-01-12",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

export default function ThirdPartyContentSection() {
  return (
    <section id="news" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900">INDUSTRY NEWS</h2>
          <Button variant="outline" className="hidden md:flex">
            More News
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {thirdPartyContent.map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="p-4 md:w-2/3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{article.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-500 text-xs font-medium">{article.source}</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs">
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline">
            More News
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
