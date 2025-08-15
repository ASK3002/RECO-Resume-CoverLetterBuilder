import { useResume } from '../../contexts/ResumeContext';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

export default function ResumePreview() {
  const { resumeData, selectedTemplate } = useResume();

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate data={resumeData} />;
      case 'classic':
        return <ClassicTemplate data={resumeData} />;
      case 'creative':
        return <CreativeTemplate data={resumeData} />;
      case 'minimal':
        return <MinimalTemplate data={resumeData} />;
      default:
        return <ModernTemplate data={resumeData} />;
    }
  };

  return (
    <div className="h-full">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
        <p className="text-sm text-gray-600">See your resume update in real-time</p>
      </div>
      
      <div className="p-4 bg-gray-100 h-full overflow-auto">
        <div className="bg-white shadow-lg mx-auto" style={{ 
          width: '100%',
          maxWidth: '600px',
          minHeight: '800px',
          padding: '16px',
          textAlign: 'justify'
        }}>
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
