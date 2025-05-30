
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink } from "lucide-react"

const thirdPartyContent = [
  {
    id: 1,
    title: "Nature: Breakthrough in Gene Therapy Delivery Shows 10x Improvement",
    source: "Nature Biotechnology",
    summary: "New lipid nanoparticle design demonstrates unprecedented targeting efficiency for specific cell types, opening new therapeutic possibilities.",
    url: "#",
    category: "Research",
    date: "2024-01-15",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Andreessen Horowitz Launches $500M Climate Tech Fund",
    source: "TechCrunch",
    summary: "New fund specifically targets early-stage climate technologies with strong scientific foundations and commercial potential.",
    url: "#",
    category: "Funding",
    date: "2024-01-14",
    readTime: "5 min read"
  },
  {
    id: 3,
    title: "AI Reduces Drug Discovery Timeline from Years to Months",
    source: "Science Magazine",
    summary: "Machine learning models demonstrate ability to predict molecular behavior and optimize drug candidates.",
    url: "#",
    category: "Research",
    date: "2024-01-13",
    readTime: "12 min read"
  },
  {
    id: 4,
    title: "The Rise of Science-Based Startups: Why Investors Are Betting Big",
    source: "Forbes",
    summary: "Analysis of why investors are increasingly drawn to companies founded by scientists and engineers.",
    url: "#",
    category: "Industry",
    date: "2024-01-12",
    readTime: "6 min read"
  }
];

export default function ThirdPartyContentSection() {
  return (
    <section id="news" className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b-2 border-black">INDUSTRY NEWS</h2>
          <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 text-sm font-medium">
            MORE NEWS
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {thirdPartyContent.map((article, index) => (
            <article key={article.id} className={`${index === 0 ? 'md:col-span-2' : ''} border-b border-gray-200 pb-6`}>
              <div className={`${index === 0 ? 'md:flex md:gap-6' : ''}`}>
                <div className={`${index === 0 ? 'md:w-2/3' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium">{article.source.toUpperCase()}</span>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-3 leading-tight ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                    {article.title}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed mb-3 ${index === 0 ? 'text-base' : 'text-sm'}`}>
                    {article.summary}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{new Date(article.date).toLocaleDateString().toUpperCase()}</span>
                    <span>•</span>
                    <span>{article.readTime.toUpperCase()}</span>
                  </div>
                </div>
                {index === 0 && (
                  <div className="md:w-1/3 mt-4 md:mt-0">
                    <img
                      src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
