import { useState } from 'react';
import { useResume } from '../../../contexts/ResumeContext';
import geminiService from '../../../services/geminiService';
import { FaPlus, FaTrash, FaRobot, FaSpinner } from 'react-icons/fa';

export default function WorkExperienceSection() {
  const { resumeData, addWorkExperience, updateWorkExperience, removeWorkExperience } = useResume();
  const [showAddForm, setShowAddForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(null);
  const [newExperience, setNewExperience] = useState({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleAddExperience = () => {
    if (newExperience.jobTitle && newExperience.company) {
      addWorkExperience(newExperience);
      setNewExperience({
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateExperience = (id, field, value) => {
    updateWorkExperience(id, { [field]: value });
  };

  const generateDescription = async (experience) => {
    try {
      setAiLoading(experience.id);
      const jobInfo = `Job Title: ${experience.jobTitle} at ${experience.company}. 
      Location: ${experience.location || 'Not specified'}. 
      Current description: ${experience.description || 'No current description'}`;
      
      // Pass full resume context for better AI generation
      const contextData = {
        personalInfo: resumeData.personalInfo,
        skills: resumeData.skills,
        projects: resumeData.projects,
        education: resumeData.education
      };
      
      const generatedDescription = await geminiService.generateResumeContent('workExperience', jobInfo, contextData);
      updateWorkExperience(experience.id, { description: generatedDescription });
    } catch (error) {
      alert('Failed to generate description. Please try again.');
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
          <p className="text-gray-600">Add your professional work history</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Experience
        </button>
      </div>

      {/* Add New Experience Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Work Experience</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={newExperience.jobTitle}
                onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={newExperience.location}
                onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="month"
                value={newExperience.startDate}
                onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="month"
                value={newExperience.endDate}
                onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                disabled={newExperience.current}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newExperience.current}
                onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked, endDate: e.target.checked ? '' : newExperience.endDate })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">I currently work here</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe your key responsibilities and achievements..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddExperience}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Experience
            </button>
          </div>
        </div>
      )}

      {/* Existing Experiences */}
      <div className="space-y-4">
        {resumeData.workExperience.map((experience) => (
          <div key={experience.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={experience.jobTitle}
                  onChange={(e) => handleUpdateExperience(experience.id, 'jobTitle', e.target.value)}
                  className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
                  placeholder="Job Title"
                />
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) => handleUpdateExperience(experience.id, 'company', e.target.value)}
                  className="text-gray-700 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
                  placeholder="Company Name"
                />
              </div>
              <button
                onClick={() => removeWorkExperience(experience.id)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <FaTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={experience.location}
                onChange={(e) => handleUpdateExperience(experience.id, 'location', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Location"
              />
              <input
                type="month"
                value={experience.startDate}
                onChange={(e) => handleUpdateExperience(experience.id, 'startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="month"
                value={experience.endDate}
                onChange={(e) => handleUpdateExperience(experience.id, 'endDate', e.target.value)}
                disabled={experience.current}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={experience.current}
                  onChange={(e) => handleUpdateExperience(experience.id, 'current', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Current position</span>
              </label>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <button
                  onClick={() => generateDescription(experience)}
                  disabled={aiLoading === experience.id}
                  className="flex items-center px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  {aiLoading === experience.id ? (
                    <FaSpinner className="animate-spin mr-1" />
                  ) : (
                    <FaRobot className="mr-1" />
                  )}
                  {aiLoading === experience.id ? 'Generating...' : 'AI Enhance'}
                </button>
              </div>
              <textarea
                value={experience.description}
                onChange={(e) => handleUpdateExperience(experience.id, 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe your key responsibilities and achievements..."
              />
            </div>
          </div>
        ))}
      </div>

      {resumeData.workExperience.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No work experience added yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first work experience
          </button>
        </div>
      )}
    </div>
  );
}
