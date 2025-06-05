
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to community page with FAQs topic selected
    navigate('/community?topic=faqs', { replace: true });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

export default FAQsPage;
