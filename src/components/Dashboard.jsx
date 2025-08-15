import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUser, FaFileAlt, FaEnvelope, FaFolderOpen, FaEye, FaDownload, FaPlus,
  FaRocket, FaStar, FaUsers, FaChartLine, FaAward, FaBrain, FaLightbulb,
  FaShieldAlt, FaClock, FaGlobe, FaArrowRight, FaCheck, FaPlay
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { downloadResumeAsPDF, downloadCoverLetterAsPDF } from '../utils/downloadUtils';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchRecentDocuments();
    }
  }, [currentUser]);

  const fetchRecentDocuments = async () => {
    try {
      setLoading(true);
      const docs = [];

      // Fetch recent resumes
      try {
        const resumesQuery = query(
          collection(db, 'resumes'),
          where('userId', '==', currentUser.uid),
          limit(3)
        );
        const resumesSnapshot = await getDocs(resumesQuery);
        resumesSnapshot.forEach(doc => {
          const data = doc.data();
          docs.push({
            id: doc.id,
            type: 'resume',
            ...data,
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        });
      } catch (error) {
        console.error('Error fetching recent resumes:', error);
      }

      // Fetch recent cover letters
      try {
        const coverLettersQuery = query(
          collection(db, 'coverLetters'),
          where('userId', '==', currentUser.uid),
          limit(3)
        );
        const coverLettersSnapshot = await getDocs(coverLettersQuery);
        coverLettersSnapshot.forEach(doc => {
          const data = doc.data();
          docs.push({
            id: doc.id,
            type: 'coverletter',
            ...data,
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        });
      } catch (error) {
        console.error('Error fetching recent cover letters:', error);
      }

      // Sort by updated date and take top 4
      docs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setRecentDocuments(docs.slice(0, 4));
    } catch (error) {
      console.error('Error fetching recent documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (document) => {
    try {
      if (document.type === 'resume') {
        await downloadResumeAsPDF(document, document.selectedTemplate || 'modern');
        alert('Resume downloaded successfully!');
      } else {
        await downloadCoverLetterAsPDF(document, document.template || 'professional');
        alert('Cover letter downloaded successfully!');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const getDocumentTitle = (document) => {
    if (document.type === 'resume') {
      const { firstName, lastName } = document.personalInfo || {};
      return `${firstName || 'Untitled'} ${lastName || 'Resume'}`.trim() || 'Untitled Resume';
    } else {
      return `${document.companyName || 'Untitled'} Cover Letter`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Build Your Dream Career
              <span className="block text-yellow-300">With AI-Powered Tools</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
            >
              Create professional resumes and compelling cover letters in minutes with our intelligent AI assistant. 
              Stand out from the competition and land your dream job.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
                to="/resume-builder" 
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
              >
                <FaRocket className="mr-3" />
                Start Building Resume
              </Link>
              <Link 
                to="/cover-letter" 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <FaEnvelope className="mr-3" />
                Create Cover Letter
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl"
          >
            <FaStar />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <motion.div 
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-8xl"
          >
            <FaLightbulb />
          </motion.div>
        </div>
      </motion.div>

      {/* Welcome Back Section for Logged Users */}
      {currentUser && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}! 👋
            </h2>
            <p className="text-gray-600 text-lg">
              Ready to continue building your professional future? Your documents are waiting.
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/resume-builder" className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 block h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FaFileAlt className="h-8 w-8 text-white" />
                </div>
                <FaArrowRight className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">Create New Resume</h3>
              <p className="text-gray-600 mb-6 text-lg">Build a professional resume from scratch with AI assistance</p>
              <div className="flex items-center text-blue-600 font-semibold">
                <FaPlay className="mr-2" />
                Get Started
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/cover-letter" className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 block h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FaEnvelope className="h-8 w-8 text-white" />
                </div>
                <FaArrowRight className="text-green-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">Create Cover Letter</h3>
              <p className="text-gray-600 mb-6 text-lg">Write a compelling cover letter tailored to your job</p>
              <div className="flex items-center text-green-600 font-semibold">
                <FaPlay className="mr-2" />
                Get Started
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/my-documents" className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 block h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FaFolderOpen className="h-8 w-8 text-white" />
                </div>
                <FaArrowRight className="text-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">My Documents</h3>
              <p className="text-gray-600 mb-6 text-lg">View and manage all your created documents</p>
              <div className="flex items-center text-purple-600 font-semibold">
                <FaPlay className="mr-2" />
                View All
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powered by cutting-edge AI technology to give you the competitive edge in your job search
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 text-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBrain className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Content</h3>
            <p className="text-gray-600">
              Generate professional content tailored to your industry with our advanced AI assistant
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 text-center"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaAward className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Templates</h3>
            <p className="text-gray-600">
              Choose from multiple industry-specific templates designed by career experts
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 text-center"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaClock className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Save Time</h3>
            <p className="text-gray-600">
              Create professional documents in minutes, not hours. Focus on what matters most
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 text-center"
          >
            <div className="bg-gradient-to-r from-red-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is encrypted and secure. We never share your personal information
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 text-center"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaChartLine className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your document creation progress and manage all files in one place
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 text-center"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaGlobe className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Global Standards</h3>
            <p className="text-gray-600">
              Templates and formats that meet international hiring standards and ATS requirements
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Professionals Worldwide</h2>
            <p className="text-xl text-blue-100">
              Join thousands of successful job seekers who landed their dream jobs
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="text-white"
            >
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Resumes Created</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="text-white"
            >
              <div className="text-4xl font-bold mb-2">25K+</div>
              <div className="text-blue-200">Cover Letters</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="text-white"
            >
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-200">Success Rate</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="text-white"
            >
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-200">User Rating</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Recent Documents Section for Logged Users */}
      {currentUser && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900">Your Recent Documents</h3>
              <Link to="/my-documents" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 flex items-center font-semibold">
                <FaFolderOpen className="mr-2" />
                View All Documents
              </Link>
            </div>
        
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Loading your documents...</p>
              </div>
            ) : recentDocuments.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaFileAlt className="h-12 w-12 text-blue-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h4>
                <p className="text-gray-600 mb-8 text-lg">Create your first professional document and take the next step in your career</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/resume-builder"
                    className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 flex items-center font-semibold"
                  >
                    <FaFileAlt className="mr-2" />
                    Create Resume
                  </Link>
                  <Link 
                    to="/cover-letter"
                    className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 flex items-center font-semibold"
                  >
                    <FaEnvelope className="mr-2" />
                    Create Cover Letter
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentDocuments.map((document, index) => (
                  <motion.div 
                    key={document.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-xl mr-4 ${
                          document.type === 'resume' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        }`}>
                          {document.type === 'resume' ? (
                            <FaFileAlt className="h-6 w-6" />
                          ) : (
                            <FaEnvelope className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-1">
                            {getDocumentTitle(document)}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Updated {document.updatedAt?.toLocaleDateString() || 'Unknown date'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        document.type === 'resume'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {document.type === 'resume' ? 'Resume' : 'Cover Letter'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link
                        to={document.type === 'resume' ? '/resume-builder' : '/cover-letter'}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        <FaEye className="mr-2" />
                        View & Edit
                      </Link>
                      <button
                        onClick={() => handleDownloadDocument(document)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Call to Action Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Land Your Dream Job?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of professionals who have successfully transformed their careers with our AI-powered tools
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link 
              to="/resume-builder" 
              className="bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center"
            >
              <FaRocket className="mr-3 text-xl" />
              Start Building Now
            </Link>
            <div className="flex items-center text-white">
              <div className="flex -space-x-2 mr-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                  <FaStar className="text-yellow-600" />
                </div>
                <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                  <FaStar className="text-yellow-600" />
                </div>
                <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                  <FaStar className="text-yellow-600" />
                </div>
              </div>
              <div>
                <div className="font-bold">4.9/5 Rating</div>
                <div className="text-purple-200 text-sm">From 10,000+ users</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
