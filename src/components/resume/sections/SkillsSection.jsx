import { useState } from 'react';
import { useResume } from '../../../contexts/ResumeContext';
import geminiService from '../../../services/geminiService';
import { FaPlus, FaTimes, FaRobot, FaSpinner } from 'react-icons/fa';

export default function SkillsSection() {
  const { resumeData, updateSkills } = useResume();
  const [newSkill, setNewSkill] = useState({ technical: '', soft: '', languages: '' });
  const [aiLoading, setAiLoading] = useState(null);

  const addSkill = (category) => {
    if (newSkill[category].trim()) {
      const currentSkills = resumeData.skills[category] || [];
      updateSkills(category, [...currentSkills, newSkill[category].trim()]);
      setNewSkill({ ...newSkill, [category]: '' });
    }
  };

  const removeSkill = (category, index) => {
    const currentSkills = resumeData.skills[category] || [];
    const updatedSkills = currentSkills.filter((_, i) => i !== index);
    updateSkills(category, updatedSkills);
  };

  const generateSkills = async (category) => {
    try {
      setAiLoading(category);
      const currentSkills = resumeData.skills[category] || [];
      
      const userInfo = `
        Category: ${category} skills
        Current skills: ${currentSkills.join(', ') || 'None listed'}
        Professional Summary: ${resumeData.personalInfo.summary || 'Not provided'}
        Work Experience: ${resumeData.workExperience.map(exp => `${exp.jobTitle} at ${exp.company}`).join(', ')}
        Projects: ${resumeData.projects.map(proj => proj.title).join(', ')}
        Education: ${resumeData.education.map(edu => edu.degree).join(', ')}
      `;
      
      // Pass full resume context for better AI generation
      const contextData = {
        personalInfo: resumeData.personalInfo,
        workExperience: resumeData.workExperience,
        projects: resumeData.projects,
        education: resumeData.education
      };
      
      const generatedSkills = await geminiService.generateResumeContent('skills', userInfo, contextData);
      
      // Parse the generated skills and add them
      const skillsArray = generatedSkills.split(/[,\n•-]/).map(skill => skill.trim()).filter(skill => skill && skill.length > 1);
      const uniqueSkills = [...new Set([...currentSkills, ...skillsArray])];
      updateSkills(category, uniqueSkills);
    } catch (error) {
      alert('Failed to generate skills. Please try again.');
    } finally {
      setAiLoading(null);
    }
  };

  const skillCategories = [
    {
      key: 'technical',
      label: 'Technical Skills',
      placeholder: 'JavaScript, Python, React, Node.js...',
      description: 'Programming languages, frameworks, tools, and technologies'
    },
    {
      key: 'soft',
      label: 'Soft Skills',
      placeholder: 'Leadership, Communication, Problem Solving...',
      description: 'Personal attributes and interpersonal skills'
    },
    {
      key: 'languages',
      label: 'Languages',
      placeholder: 'English (Native), Spanish (Fluent)...',
      description: 'Spoken languages and proficiency levels'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills</h2>
        <p className="text-gray-600">Add your professional skills and competencies</p>
      </div>

      {skillCategories.map((category) => (
        <div key={category.key} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{category.label}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
            <button
              onClick={() => generateSkills(category.key)}
              disabled={aiLoading === category.key}
              className="flex items-center px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              {aiLoading === category.key ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaRobot className="mr-2" />
              )}
              {aiLoading === category.key ? 'Generating...' : 'AI Suggest'}
            </button>
          </div>

          {/* Add New Skill */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill[category.key]}
              onChange={(e) => setNewSkill({ ...newSkill, [category.key]: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && addSkill(category.key)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={category.placeholder}
            />
            <button
              onClick={() => addSkill(category.key)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-1" />
              Add
            </button>
          </div>

          {/* Skills List */}
          <div className="flex flex-wrap gap-2">
            {(resumeData.skills[category.key] || []).map((skill, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(category.key, index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {(resumeData.skills[category.key] || []).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No {category.label.toLowerCase()} added yet</p>
              <p className="text-sm">Add skills manually or use AI suggestions</p>
            </div>
          )}
        </div>
      ))}

      {/* Skills Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Skills Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include both hard and soft skills relevant to your target role</li>
          <li>• Use specific technologies and tools rather than generic terms</li>
          <li>• For languages, include proficiency levels (e.g., "Spanish - Fluent")</li>
          <li>• Keep skills current and remove outdated technologies</li>
        </ul>
      </div>
    </div>
  );
}
