
export default function BSFScreenshots() {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
        <div>
          <img 
            src="/lovable-uploads/07ca7619-e835-4216-b83e-b13ee865bdd6.png" 
            alt="Sprint Journey Dashboard Screenshot" 
            className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg border border-gray-200" 
            loading="lazy"
          />
          <p className="text-gray-600 text-xs mt-2 sm:mt-3 px-1">
            Tech tools to guide you when putting together the most investible proposition
          </p>
        </div>
        <div>
          <img 
            src="/lovable-uploads/dd3d3cc0-9511-45e0-ab92-cd673ffec128.png" 
            alt="BSF Class 13 gathering in Austin TX" 
            className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg border border-gray-200" 
            loading="lazy"
          />
          <p className="text-gray-600 text-xs mt-2 sm:mt-3 px-1">
            Austin TX sunset views for BSF Class 13 (Mar 2025)
          </p>
        </div>
      </div>
    </div>
  );
}
