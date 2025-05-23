
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type FAQ = {
  id: string;
  category: string;
  order_index: number;
  question: string;
  answer: string;
  related_task_id?: string;
  created_at: string;
  updated_at: string;
};

export const useFAQs = (taskId?: string) => {
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs', taskId],
    queryFn: async () => {
      let query = supabase
        .from('bsf_faqs')
        .select('*')
        .order('category')
        .order('order_index');
      
      // If task ID is provided, get task-specific FAQs first
      if (taskId) {
        const { data: taskSpecificFaqs, error: taskError } = await supabase
          .from('bsf_faqs')
          .select('*')
          .eq('related_task_id', taskId)
          .order('order_index');
          
        if (taskError) {
          console.error('Error fetching task-specific FAQs:', taskError);
        }
        
        // Then get general FAQs
        const { data: generalFaqs, error: generalError } = await query;
        
        if (generalError) {
          console.error('Error fetching general FAQs:', generalError);
          throw generalError;
        }
        
        // Combine and deduplicate
        const combinedFaqs = [...(taskSpecificFaqs || []), ...(generalFaqs || [])];
        const uniqueFaqs = combinedFaqs.filter((faq, index, self) => 
          index === self.findIndex(f => f.id === faq.id)
        );
        
        return uniqueFaqs as FAQ[];
      }
      
      // If no task ID, just get all FAQs
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching FAQs:', error);
        throw error;
      }
      
      return data as FAQ[];
    }
  });

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return {
    faqs,
    faqsByCategory,
    isLoading
  };
};
