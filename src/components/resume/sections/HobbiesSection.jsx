import { useState } from 'react';
import { useResume } from '../../../contexts/ResumeContext';
import geminiService from '../../../services/geminiService';
import { FaPlus, FaTimes, FaRobot, FaSpinner } from 'react-icons/fa';

export default function HobbiesSection() {
  const { resumeData, updateHobbies } = useResume();
  const [newHobby, setNewHobby] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const addHobby = () => {
    if (newHobby.trim()) {
      const currentHobbies = resumeData.hobbies || [];
      updateHobbies([...currentHobbies, newHobby.trim()]);
      setNewHobby('');
    }
  };

  const removeHobby = (index) => {
    const currentHobbies = resumeData.hobbies || [];
    const updatedHobbies = currentHobbies.filter((_, i) => i !== index);
    updateHobbies(updatedHobbies);
  };

  const generateHobbies = async () => {
    try {
      setAiLoading(true);
      const personalInfo = resumeData.personalInfo;
      const workExperience = resumeData.workExperience;
      const currentHobbies = resumeData.hobbies || [];
      
      const userInfo = `
        Professional Summary: ${personalInfo.summary || 'Not provided'}
        Work Experience: ${workExperience.map(exp => `${exp.jobTitle} at ${exp.company}`).join(', ')}
        Current hobbies: ${currentHobbies.join(', ') || 'None listed'}
      `;
      
      const generatedHobbies = await geminiService.generateResumeContent('hobbies', userInfo);
      
      // Parse the generated hobbies and add them
      const hobbiesArray = generatedHobbies.split(',').map(hobby => hobby.trim()).filter(hobby => hobby);
      const uniqueHobbies = [...new Set([...currentHobbies, ...hobbiesArray])];
      updateHobbies(uniqueHobbies);
    } catch (error) {
      alert('Failed to generate hobbies. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Hobbies & Interests</h2>
          <p className="text-gray-600">Add personal interests that showcase your personality</p>
        </div>
        <button
          onClick={generateHobbies}
          disabled={aiLoading}
          className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {aiLoading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            <FaRobot className="mr-2" />
          )}
          {aiLoading ? 'Generating...' : 'AI Suggest'}
        </button>
      </div>

      {/* Add New Hobby */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHobby()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Photography, Hiking, Chess, Cooking..."
          />
          <button
            onClick={addHobby}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-1" />
            Add
          </button>
        </div>

        {/* Hobbies List */}
        <div className="flex flex-wrap gap-2">
          {(resumeData.hobbies || []).map((hobby, index) => (
            <div
              key={index}
              className="flex items-center bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{hobby}</span>
              <button
                onClick={() => removeHobby(index)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {(resumeData.hobbies || []).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hobbies added yet</p>
            <p className="text-sm">Add interests that show your personality and soft skills</p>
          </div>
        )}
      </div>

      {/* Hobbies Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">💡 Hobbies Tips</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Choose hobbies that demonstrate valuable soft skills</li>
          <li>• Include activities that show leadership, teamwork, or creativity</li>
          <li>• Avoid controversial topics or overly personal information</li>
          <li>• Keep it professional and relevant to your career goals</li>
          <li>• Consider hobbies that relate to your industry or target role</li>
        </ul>
      </div>
    </div>
  );
}
