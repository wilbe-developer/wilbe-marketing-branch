
import { useState } from 'react';
import { useFAQs, FAQ } from '@/hooks/useFAQs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RequestCallButton } from '@/components/sprint/RequestCallButton';

export const FAQContent = () => {
  const { faqsByCategory, isLoading } = useFAQs();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get taskId from URL params if available
  const params = new URLSearchParams(location.search);
  const taskId = params.get('taskId');

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

  const handlePostQuestion = () => {
    if (taskId) {
      navigate(`/community?challenge=${taskId}`);
    } else {
      navigate("/community");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 space-y-4">
        {/* Action Buttons */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Need More Help?</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handlePostQuestion} variant="outline" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Post a Question
            </Button>
            <RequestCallButton />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search FAQs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
    </>
  );
};
