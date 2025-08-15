import { useCoverLetter } from '../../contexts/CoverLetterContext';

export default function CoverLetterTemplates() {
  const { coverLetterData } = useCoverLetter();

  const getTemplateStyles = () => {
    const baseStyles = "max-w-4xl mx-auto bg-white p-8 shadow-lg";
    
    switch (coverLetterData.template) {
      case 'modern':
        return `${baseStyles} border-l-4 border-blue-500`;
      case 'creative':
        return `${baseStyles} bg-gradient-to-br from-purple-50 to-blue-50`;
      case 'executive':
        return `${baseStyles} border border-gray-300`;
      default: // professional
        return baseStyles;
    }
  };

  const getHeaderStyles = () => {
    switch (coverLetterData.template) {
      case 'modern':
        return "text-2xl font-bold text-blue-600 mb-6";
      case 'creative':
        return "text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6";
      case 'executive':
        return "text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2";
      default:
        return "text-2xl font-bold text-gray-900 mb-6";
    }
  };

  const getTextStyles = () => {
    switch (coverLetterData.template) {
      case 'modern':
        return "text-gray-700 leading-relaxed";
      case 'creative':
        return "text-gray-800 leading-relaxed";
      case 'executive':
        return "text-gray-900 leading-relaxed font-medium";
      default:
        return "text-gray-800 leading-relaxed";
    }
  };

  return (
    <div className={getTemplateStyles()}>
      {/* Header */}
      <div className="mb-8">
        <div className="text-right text-gray-600 mb-4">
          {new Date().toLocaleDateString()}
        </div>
        
        <div className="mb-6">
          {coverLetterData.hiringManager && (
            <p className={getTextStyles()}>{coverLetterData.hiringManager}</p>
          )}
          <p className={getTextStyles()}>{coverLetterData.companyName}</p>
        </div>
        
        <p className={getTextStyles()}>
          Dear {coverLetterData.hiringManager || 'Hiring Manager'},
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {coverLetterData.content.opening && (
          <p className={`${getTextStyles()} whitespace-pre-wrap`}>
            {coverLetterData.content.opening}
          </p>
        )}
        
        {coverLetterData.content.body && (
          <div className={`${getTextStyles()} whitespace-pre-wrap`}>
            {coverLetterData.content.body}
          </div>
        )}
        
        {coverLetterData.content.closing && (
          <p className={`${getTextStyles()} whitespace-pre-wrap`}>
            {coverLetterData.content.closing}
          </p>
        )}
      </div>

      {/* Signature */}
      <div className="mt-8">
        <p className={getTextStyles()}>Sincerely,</p>
        <p className={`${getTextStyles()} mt-4 font-semibold`}>[Your Name]</p>
      </div>
    </div>
  );
}
