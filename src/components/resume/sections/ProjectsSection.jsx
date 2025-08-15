import { useState } from 'react';
import { useResume } from '../../../contexts/ResumeContext';
import geminiService from '../../../services/geminiService';
import { FaPlus, FaTrash, FaRobot, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';

export default function ProjectsSection() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const [showAddForm, setShowAddForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: '',
    link: '',
    github: '',
    startDate: '',
    endDate: '',
    ongoing: false
  });

  const handleAddProject = () => {
    if (newProject.name && newProject.description) {
      addProject(newProject);
      setNewProject({
        name: '',
        description: '',
        technologies: '',
        link: '',
        github: '',
        startDate: '',
        endDate: '',
        ongoing: false
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateProject = (id, field, value) => {
    updateProject(id, { [field]: value });
  };

  const enhanceProject = async (project) => {
    try {
      setAiLoading(project.id);
      const projectInfo = `Project: ${project.name}. 
      Technologies: ${project.technologies || 'Not specified'}. 
      Current description: ${project.description}
      Project Link: ${project.link || 'Not provided'}
      GitHub: ${project.github || 'Not provided'}
      Duration: ${project.startDate} to ${project.ongoing ? 'Present' : project.endDate}`;
      
      // Pass full resume context for better AI generation
      const contextData = {
        personalInfo: resumeData.personalInfo,
        skills: resumeData.skills,
        workExperience: resumeData.workExperience,
        education: resumeData.education
      };
      
      const enhancedDescription = await geminiService.generateResumeContent('projects', projectInfo, contextData);
      updateProject(project.id, { description: enhancedDescription });
    } catch (error) {
      alert('Failed to enhance project description. Please try again.');
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
          <p className="text-gray-600">Showcase your personal and professional projects</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Project
        </button>
      </div>

      {/* Add New Project Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Project</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E-commerce Website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <input
                type="text"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, Node.js, MongoDB"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Link
              </label>
              <input
                type="url"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://myproject.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository
              </label>
              <input
                type="url"
                value={newProject.github}
                onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="month"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="month"
                value={newProject.endDate}
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                disabled={newProject.ongoing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newProject.ongoing}
                onChange={(e) => setNewProject({ ...newProject, ongoing: e.target.checked, endDate: e.target.checked ? '' : newProject.endDate })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">This is an ongoing project</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe the project, your role, key features, and achievements..."
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
              onClick={handleAddProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Project
            </button>
          </div>
        </div>
      )}

      {/* Existing Projects */}
      <div className="space-y-4">
        {resumeData.projects.map((project) => (
          <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleUpdateProject(project.id, 'name', e.target.value)}
                  className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
                  placeholder="Project Name"
                />
                <input
                  type="text"
                  value={project.technologies}
                  onChange={(e) => handleUpdateProject(project.id, 'technologies', e.target.value)}
                  className="text-blue-600 text-sm bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
                  placeholder="Technologies used"
                />
              </div>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <FaTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Project Link</label>
                <div className="flex">
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => handleUpdateProject(project.id, 'link', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://project.com"
                  />
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">GitHub Repository</label>
                <div className="flex">
                  <input
                    type="url"
                    value={project.github}
                    onChange={(e) => handleUpdateProject(project.id, 'github', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/user/repo"
                  />
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gray-800 text-white rounded-r-lg hover:bg-gray-900"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="month"
                value={project.startDate}
                onChange={(e) => handleUpdateProject(project.id, 'startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="month"
                value={project.endDate}
                onChange={(e) => handleUpdateProject(project.id, 'endDate', e.target.value)}
                disabled={project.ongoing}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={project.ongoing}
                  onChange={(e) => handleUpdateProject(project.id, 'ongoing', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Ongoing project</span>
              </label>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <button
                  onClick={() => enhanceProject(project)}
                  disabled={aiLoading === project.id}
                  className="flex items-center px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  {aiLoading === project.id ? (
                    <FaSpinner className="animate-spin mr-1" />
                  ) : (
                    <FaRobot className="mr-1" />
                  )}
                  {aiLoading === project.id ? 'Enhancing...' : 'AI Enhance'}
                </button>
              </div>
              <textarea
                value={project.description}
                onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe the project, your role, and key achievements..."
              />
            </div>
          </div>
        ))}
      </div>

      {resumeData.projects.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No projects added yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first project
          </button>
        </div>
      )}
    </div>
  );
}
