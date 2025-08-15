import { useResume } from '../../contexts/ResumeContext';
import { FaCheck } from 'react-icons/fa';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with accent colors',
    preview: '/templates/modern-preview.png',
    colors: ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600']
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout',
    preview: '/templates/classic-preview.png',
    colors: ['bg-gray-800', 'bg-blue-800', 'bg-green-800']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative professionals',
    preview: '/templates/creative-preview.png',
    colors: ['bg-pink-600', 'bg-orange-600', 'bg-teal-600']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with lots of white space',
    preview: '/templates/minimal-preview.png',
    colors: ['bg-gray-600', 'bg-slate-600']
  }
];

export default function TemplateSelector() {
  const { selectedTemplate, changeTemplate } = useResume();

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Choose Template</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => changeTemplate(template.id)}
              className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                selectedTemplate === template.id
                  ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {/* Compact Template Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  {selectedTemplate === template.id && (
                    <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
                      <FaCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Color Options */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {template.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full ${color} shadow-sm`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{template.description.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
