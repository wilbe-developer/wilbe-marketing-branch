
import { useState } from 'react';
import { useFAQs, FAQ } from '@/hooks/useFAQs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CommunitySidebar } from '@/components/community/CommunitySidebar';

const FAQsPage = () => {
  const { faqsByCategory, isLoading } = useFAQs();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter FAQs based on search query
  const filteredFaqsByCategory = searchQuery.trim() === '' 
    ? faqsByCategory 
    : Object.entries(faqsByCategory).reduce((acc, [category, faqs]) => {
        const filteredFaqs = faqs.filter(
          faq => 
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (filteredFaqs.length > 0) {
          acc[category] = filteredFaqs;
        }
        
        return acc;
      }, {} as Record<string, FAQ[]>);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <CommunitySidebar
        selectedTopic="faqs"
        onSelectTopic={(topic) => {
          if (topic !== 'faqs') {
            navigate(`/community?topic=${topic}`);
          }
        }}
        isMobile={isMobile}
      />
      
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
            Frequently Asked Questions
          </h1>
          <Button 
            onClick={() => navigate('/community/new')} 
            size={isMobile ? 'sm' : 'default'}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Ask a Question
          </Button>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search FAQs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-8">
          {Object.entries(filteredFaqsByCategory).length > 0 ? (
            Object.entries(filteredFaqsByCategory).map(([category, faqs]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-lg shadow-sm border p-4">
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">
                {searchQuery.trim() !== '' 
                  ? `No FAQs matching "${searchQuery}"`
                  : "No FAQs available at the moment."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
