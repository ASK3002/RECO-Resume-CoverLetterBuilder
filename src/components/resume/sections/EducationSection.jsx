import { useState } from 'react';
import { useResume } from '../../../contexts/ResumeContext';
import geminiService from '../../../services/geminiService';
import { FaPlus, FaTrash, FaRobot, FaSpinner } from 'react-icons/fa';

export default function EducationSection() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
  const [showAddForm, setShowAddForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(null);
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    location: '',
    graduationDate: '',
    gpa: '',
    relevantCoursework: '',
    achievements: ''
  });

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      addEducation(newEducation);
      setNewEducation({
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: '',
        relevantCoursework: '',
        achievements: ''
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateEducation = (id, field, value) => {
    updateEducation(id, { [field]: value });
  };

  const enhanceEducation = async (education) => {
    try {
      setAiLoading(education.id);
      const educationInfo = `Degree: ${education.degree} from ${education.institution}. 
      Location: ${education.location || 'Not specified'}. 
      GPA: ${education.gpa || 'Not specified'}.
      Graduation Date: ${education.graduationDate || 'Not specified'}.
      Coursework: ${education.relevantCoursework || 'Not specified'}.
      Current achievements: ${education.achievements || 'No current achievements'}`;
      
      // Pass full resume context for better AI generation
      const contextData = {
        personalInfo: resumeData.personalInfo,
        skills: resumeData.skills,
        workExperience: resumeData.workExperience,
        projects: resumeData.projects
      };
      
      const enhancedAchievements = await geminiService.generateResumeContent('education', educationInfo, contextData);
      updateEducation(education.id, { achievements: enhancedAchievements });
    } catch (error) {
      alert('Failed to enhance education details. Please try again.');
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Education</h2>
          <p className="text-gray-600">Add your educational background</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Education
        </button>
      </div>

      {/* Add New Education Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Education</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree *
              </label>
              <input
                type="text"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution *
              </label>
              <input
                type="text"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="University Name"
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
                value={newEducation.location}
                onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Date
              </label>
              <input
                type="month"
                value={newEducation.graduationDate}
                onChange={(e) => setNewEducation({ ...newEducation, graduationDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={newEducation.gpa}
                onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3.8/4.0"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relevant Coursework
            </label>
            <textarea
              value={newEducation.relevantCoursework}
              onChange={(e) => setNewEducation({ ...newEducation, relevantCoursework: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Data Structures, Algorithms, Database Systems..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements & Honors
            </label>
            <textarea
              value={newEducation.achievements}
              onChange={(e) => setNewEducation({ ...newEducation, achievements: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Dean's List, Magna Cum Laude, Academic scholarships..."
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
              onClick={handleAddEducation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Education
            </button>
          </div>
        </div>
      )}

      {/* Existing Education */}
      <div className="space-y-4">
        {resumeData.education.map((education) => (
          <div key={education.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={education.degree}
                  onChange={(e) => handleUpdateEducation(education.id, 'degree', e.target.value)}
                  className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
                  placeholder="Degree"
                />
                <input
                  type="text"
                  value={education.institution}
                  onChange={(e) => handleUpdateEducation(education.id, 'institution', e.target.value)}
                  className="text-gray-700 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
                  placeholder="Institution"
                />
              </div>
              <button
                onClick={() => removeEducation(education.id)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <FaTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={education.location}
                onChange={(e) => handleUpdateEducation(education.id, 'location', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Location"
              />
              <input
                type="month"
                value={education.graduationDate}
                onChange={(e) => handleUpdateEducation(education.id, 'graduationDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={education.gpa}
                onChange={(e) => handleUpdateEducation(education.id, 'gpa', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="GPA"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relevant Coursework
              </label>
              <textarea
                value={education.relevantCoursework}
                onChange={(e) => handleUpdateEducation(education.id, 'relevantCoursework', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="List relevant courses..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Achievements & Honors
                </label>
                <button
                  onClick={() => enhanceEducation(education)}
                  disabled={aiLoading === education.id}
                  className="flex items-center px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  {aiLoading === education.id ? (
                    <FaSpinner className="animate-spin mr-1" />
                  ) : (
                    <FaRobot className="mr-1" />
                  )}
                  {aiLoading === education.id ? 'Enhancing...' : 'AI Enhance'}
                </button>
              </div>
              <textarea
                value={education.achievements}
                onChange={(e) => handleUpdateEducation(education.id, 'achievements', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Academic achievements, honors, scholarships..."
              />
            </div>
          </div>
        ))}
      </div>

      {resumeData.education.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No education added yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your education
          </button>
        </div>
      )}
    </div>
  );
}
