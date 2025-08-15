import { useState } from 'react';
import { useCoverLetter } from '../contexts/CoverLetterContext';
import { geminiService } from '../services/geminiService';
import CoverLetterTemplates from './coverletter/CoverLetterTemplates';
import { FaRobot, FaCopy, FaEye, FaDownload, FaEdit, FaRedo, FaEnvelope, FaStar, FaHeart, FaGem, FaPen, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function CoverLetterBuilder() {
  const { coverLetterData, updateJobInfo, updateContent, updateTemplate, updateIndustry, updateCustomizations, downloadCoverLetter, resetCoverLetter } = useCoverLetter();
  const [activeTab, setActiveTab] = useState('job-info');
  const [aiLoading, setAiLoading] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const templates = [
    { id: 'professional', name: 'Professional', description: 'Clean and formal design' },
    { id: 'modern', name: 'Modern', description: 'Contemporary with subtle colors' },
    { id: 'creative', name: 'Creative', description: 'Bold and expressive design' },
    { id: 'executive', name: 'Executive', description: 'Premium and sophisticated' }
  ];

  const industries = [
    { id: 'technology', name: 'Technology' },
    { id: 'finance', name: 'Finance' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'education', name: 'Education' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'consulting', name: 'Consulting' },
    { id: 'retail', name: 'Retail' },
    { id: 'manufacturing', name: 'Manufacturing' }
  ];

  const generateCoverLetterContent = async (section) => {
    try {
      setAiLoading(section);
      
      // Prepare context from resume data
      const userBackground = `
        Name: ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}
        Professional Summary: ${resumeData.personalInfo.summary || 'Not provided'}
        Work Experience: ${resumeData.workExperience.map(exp => `${exp.jobTitle} at ${exp.company}`).join(', ')}
        Skills: ${Object.values(resumeData.skills).flat().join(', ')}
        Education: ${resumeData.education.map(edu => `${edu.degree} from ${edu.institution}`).join(', ')}
        Projects: ${resumeData.projects.map(proj => proj.name).join(', ')}
      `;

      let generatedContent;
      
      if (section === 'full') {
        generatedContent = await geminiService.generateCoverLetter(
          coverLetterData.jobTitle,
          coverLetterData.companyName,
          userBackground,
          coverLetterData.jobDescription
        );
        
        // Parse the full cover letter into sections
        const paragraphs = generatedContent.split('\n\n').filter(p => p.trim());
        if (paragraphs.length >= 3) {
          updateContent('opening', paragraphs[0]);
          updateContent('body', paragraphs.slice(1, -1).join('\n\n'));
          updateContent('closing', paragraphs[paragraphs.length - 1]);
        } else {
          updateContent('body', generatedContent);
        }
      } else {
        // Generate specific section
        const sectionPrompts = {
          opening: `Write a compelling opening paragraph for a cover letter for the position of ${coverLetterData.jobTitle} at ${coverLetterData.companyName}. Make it engaging and show enthusiasm for the role.`,
          body: `Write the main body paragraphs for a cover letter for ${coverLetterData.jobTitle} at ${coverLetterData.companyName}. Highlight relevant experience and skills. User background: ${userBackground}`,
          closing: `Write a strong closing paragraph for a cover letter for ${coverLetterData.jobTitle} at ${coverLetterData.companyName}. Include a call to action and professional sign-off.`
        };

        generatedContent = await geminiService.generateResumeContent('coverLetter', sectionPrompts[section]);
        updateContent(section, generatedContent);
      }
    } catch (error) {
      alert(`Failed to generate ${section} content. ${error.message}`);
    } finally {
      setAiLoading(null);
    }
  };

  const getFullCoverLetterText = () => {
    return `${coverLetterData.content.opening}\n\n${coverLetterData.content.body}\n\n${coverLetterData.content.closing}`;
  };

  const copyToClipboard = () => {
    const fullText = getFullCoverLetterText();
    navigator.clipboard.writeText(fullText);
    alert('Cover letter copied to clipboard!');
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadCoverLetter();
      alert('Cover letter downloaded successfully!');
    } catch (error) {
      alert('Failed to download cover letter. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset and start fresh? All current data will be lost.')) {
      resetCoverLetter();
      setActiveTab('job-info');
      alert('Cover letter reset successfully! Starting fresh.');
    }
  };

  const tabs = [
    { id: 'job-info', name: 'Job Information', icon: FaEdit },
    { id: 'content', name: 'Content', icon: FaEdit },
    { id: 'templates', name: 'Templates', icon: FaEye },
    { id: 'preview', name: 'Preview', icon: FaEye }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-teal-600/5 to-cyan-600/5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-16 left-12 opacity-10">
        <motion.div 
          animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="text-7xl text-emerald-500"
        >
          <FaEnvelope />
        </motion.div>
      </div>
      <div className="absolute top-32 right-16 opacity-10">
        <motion.div 
          animate={{ y: [12, -12, 12], rotate: [360, 180, 0] }}
          transition={{ duration: 11, repeat: Infinity }}
          className="text-8xl text-teal-500"
        >
          <FaStar />
        </motion.div>
      </div>
      <div className="absolute bottom-24 left-20 opacity-10">
        <motion.div 
          animate={{ y: [-14, 14, -14], x: [-6, 6, -6] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="text-6xl text-cyan-500"
        >
          <FaHeart />
        </motion.div>
      </div>
      <div className="absolute bottom-32 right-14 opacity-10">
        <motion.div 
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="text-7xl text-emerald-600"
        >
          <FaGem />
        </motion.div>
      </div>
      <div className="absolute top-1/2 right-6 opacity-8">
        <motion.div 
          animate={{ y: [-8, 8, -8], rotate: [0, 180, 360] }}
          transition={{ duration: 13, repeat: Infinity }}
          className="text-9xl text-teal-400"
        >
          <FaPen />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center mb-2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-14 h-14 rounded-xl flex items-center justify-center mr-4 shadow-xl">
                  <FaEnvelope className="text-white text-2xl" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Cover Letter Builder</h1>
              </div>
              <p className="text-gray-600 text-lg font-medium ml-18">Create professional cover letters with AI assistance</p>
            </motion.div>
            <motion.button 
              onClick={handleReset}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center shadow-lg font-semibold"
            >
              <FaRedo className="mr-2" />
              Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-lg border border-white/30"
        >
          <nav className="flex space-x-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className={`py-3 px-6 rounded-xl font-semibold text-sm flex items-center transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-white/50'
                  }`}
                >
                  <Icon className="mr-2" />
                  {tab.name}
                </motion.button>
              );
            })}
          </nav>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
          {/* Job Information Tab */}
          {activeTab === 'job-info' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Job Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={coverLetterData.jobTitle}
                      onChange={(e) => updateJobInfo('jobTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={coverLetterData.companyName}
                      onChange={(e) => updateJobInfo('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Company Inc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hiring Manager (Optional)
                  </label>
                  <input
                    type="text"
                    value={coverLetterData.hiringManager}
                    onChange={(e) => updateJobInfo('hiringManager', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={coverLetterData.industry}
                    onChange={(e) => updateIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {industries.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description (Optional)
                  </label>
                  <textarea
                    value={coverLetterData.jobDescription}
                    onChange={(e) => updateJobInfo('jobDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Paste the job description here for better AI-generated content..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => generateCoverLetterContent('full')}
                    disabled={aiLoading === 'full' || !coverLetterData.jobTitle || !coverLetterData.companyName}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {aiLoading === 'full' ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaRobot className="mr-2" />
                    )}
                    {aiLoading === 'full' ? 'Generating...' : 'Generate Full Cover Letter'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Opening Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Opening Paragraph</h3>
                  <button
                    onClick={() => generateCoverLetterContent('opening')}
                    disabled={aiLoading === 'opening'}
                    className="flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {aiLoading === 'opening' ? (
                      <FaSpinner className="animate-spin mr-1" />
                    ) : (
                      <FaRobot className="mr-1" />
                    )}
                    {aiLoading === 'opening' ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <textarea
                  value={coverLetterData.content.opening}
                  onChange={(e) => updateContent('opening', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Write your opening paragraph here..."
                />
              </div>

              {/* Body Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Body Paragraphs</h3>
                  <button
                    onClick={() => generateCoverLetterContent('body')}
                    disabled={aiLoading === 'body'}
                    className="flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {aiLoading === 'body' ? (
                      <FaSpinner className="animate-spin mr-1" />
                    ) : (
                      <FaRobot className="mr-1" />
                    )}
                    {aiLoading === 'body' ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <textarea
                  value={coverLetterData.content.body}
                  onChange={(e) => updateContent('body', e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Write your main body paragraphs here..."
                />
              </div>

              {/* Closing Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Closing Paragraph</h3>
                  <button
                    onClick={() => generateCoverLetterContent('closing')}
                    disabled={aiLoading === 'closing'}
                    className="flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {aiLoading === 'closing' ? (
                      <FaSpinner className="animate-spin mr-1" />
                    ) : (
                      <FaRobot className="mr-1" />
                    )}
                    {aiLoading === 'closing' ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <textarea
                  value={coverLetterData.content.closing}
                  onChange={(e) => updateContent('closing', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Write your closing paragraph here..."
                />
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Choose Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => updateTemplate(template.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      coverLetterData.template === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <p className="text-gray-600 text-sm">{template.description}</p>
                  </div>
                ))}
              </div>

              {/* Customization Options */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone
                    </label>
                    <select
                      value={coverLetterData.customizations.tone}
                      onChange={(e) => updateCustomizations('tone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="formal">Formal</option>
                      <option value="enthusiastic">Enthusiastic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length
                    </label>
                    <select
                      value={coverLetterData.customizations.length}
                      onChange={(e) => updateCustomizations('length', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emphasis
                    </label>
                    <select
                      value={coverLetterData.customizations.emphasis}
                      onChange={(e) => updateCustomizations('emphasis', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="experience">Experience</option>
                      <option value="skills">Skills</option>
                      <option value="education">Education</option>
                      <option value="projects">Projects</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaCopy className="mr-2" />
                    Copy
                  </button>
                  <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaDownload className="mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-8 rounded-lg">
                  <div className="mb-6">
                    <p className="text-right text-gray-600 mb-4">[Date]</p>
                    <div className="mb-4">
                      {coverLetterData.hiringManager && (
                        <p>{coverLetterData.hiringManager}</p>
                      )}
                      <p>{coverLetterData.companyName}</p>
                    </div>
                    <p>Dear {coverLetterData.hiringManager || 'Hiring Manager'},</p>
                  </div>
                  
                  {coverLetterData.content.opening && (
                    <p className="mb-4 whitespace-pre-wrap">{coverLetterData.content.opening}</p>
                  )}
                  
                  {coverLetterData.content.body && (
                    <div className="mb-4 whitespace-pre-wrap">{coverLetterData.content.body}</div>
                  )}
                  
                  {coverLetterData.content.closing && (
                    <p className="mb-6 whitespace-pre-wrap">{coverLetterData.content.closing}</p>
                  )}
                  
                  <div>
                    <p>Sincerely,</p>
                    <p className="mt-4">[Your Name]</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => generateCoverLetterContent('full')}
                disabled={aiLoading === 'full' || !coverLetterData.jobTitle || !coverLetterData.companyName}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {aiLoading === 'full' ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaRobot className="mr-2" />
                )}
                Generate Full Letter
              </button>
              
              <button
                onClick={() => setActiveTab('preview')}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaEye className="mr-2" />
                Preview
              </button>
              
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaCopy className="mr-2" />
                Copy to Clipboard
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Completion Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Job Info</span>
                  <span className={coverLetterData.jobTitle && coverLetterData.companyName ? 'text-green-600' : 'text-gray-400'}>
                    {coverLetterData.jobTitle && coverLetterData.companyName ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Opening</span>
                  <span className={coverLetterData.content.opening ? 'text-green-600' : 'text-gray-400'}>
                    {coverLetterData.content.opening ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Body</span>
                  <span className={coverLetterData.content.body ? 'text-green-600' : 'text-gray-400'}>
                    {coverLetterData.content.body ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Closing</span>
                  <span className={coverLetterData.content.closing ? 'text-green-600' : 'text-gray-400'}>
                    {coverLetterData.content.closing ? '✓' : '○'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </div>
  );
}
