import { useState } from 'react';
import { ResumeProvider, useResume } from '../../contexts/ResumeContext';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import { FaEye, FaEdit, FaDownload, FaRedo, FaFileAlt, FaStar, FaLightbulb, FaRocket, FaGem } from 'react-icons/fa';
import { motion } from 'framer-motion';

function ResumeBuilderContent() {
  const [activeView, setActiveView] = useState('split'); // split, editor, preview
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [isDownloading, setIsDownloading] = useState(false);
  const { downloadResume, resetResume } = useResume();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadResume();
      alert('Resume downloaded successfully!');
    } catch (error) {
      alert('Failed to download resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset and start fresh? All current data will be lost.')) {
      resetResume();
      alert('Resume reset successfully! Starting fresh.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <motion.div 
          animate={{ y: [-8, 8, -8], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="text-6xl text-blue-500"
        >
          <FaFileAlt />
        </motion.div>
      </div>
      <div className="absolute top-40 right-20 opacity-10">
        <motion.div 
          animate={{ y: [10, -10, 10], rotate: [360, 180, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="text-7xl text-purple-500"
        >
          <FaStar />
        </motion.div>
      </div>
      <div className="absolute bottom-20 left-20 opacity-10">
        <motion.div 
          animate={{ y: [-12, 12, -12], x: [-4, 4, -4] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="text-5xl text-indigo-500"
        >
          <FaLightbulb />
        </motion.div>
      </div>
      <div className="absolute bottom-40 right-10 opacity-10">
        <motion.div 
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="text-8xl text-blue-600"
        >
          <FaRocket />
        </motion.div>
      </div>
      <div className="absolute top-1/2 right-8 opacity-8">
        <motion.div 
          animate={{ y: [-6, 6, -6], rotate: [0, 180, 360] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="text-9xl text-purple-400"
        >
          <FaGem />
        </motion.div>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center mb-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <FaFileAlt className="text-white text-xl" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Resume Builder</h1>
              </div>
              <p className="text-gray-600 text-lg font-medium ml-16">Create your professional resume with AI assistance</p>
            </motion.div>
            
            {/* View Toggle */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center space-x-4"
            >
              <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/30">
                <motion.button
                  onClick={() => setActiveView('editor')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeView === 'editor' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                  }`}
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => setActiveView('split')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeView === 'split' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                  }`}
                >
                  Split View
                </motion.button>
                <motion.button
                  onClick={() => setActiveView('preview')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeView === 'preview' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                  }`}
                >
                  <FaEye className="inline mr-2" />
                  Preview
                </motion.button>
              </div>
              
              <div className="flex space-x-3">
                <motion.button 
                  onClick={handleReset}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center shadow-lg font-semibold"
                >
                  <FaRedo className="mr-2" />
                  Reset
                </motion.button>
                <motion.button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold"
                >
                  <FaDownload className="mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download PDF'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Template Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10"
      >
        <TemplateSelector />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
      >
        <div className="flex gap-8">
          {/* Editor Panel */}
          {(activeView === 'editor' || activeView === 'split') && (
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden ${
                activeView === 'split' ? 'w-1/2' : 'w-full'
              }`}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <ResumeEditor 
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />
              </div>
            </motion.div>
          )}

          {/* Preview Panel */}
          {(activeView === 'preview' || activeView === 'split') && (
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden ${
                activeView === 'split' ? 'w-1/2' : 'w-full'
              }`}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <ResumePreview />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ResumeBuilder() {
  return (
    <ResumeProvider>
      <ResumeBuilderContent />
    </ResumeProvider>
  );
}
