import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaFileAlt, FaHome, FaEnvelope } from 'react-icons/fa';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-200">
              Resume Builder
            </Link>
          </div>
          
          {/* Navigation Links */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <FaHome className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/resume-builder"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                  isActive('/resume-builder') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <FaFileAlt className="h-4 w-4" />
                <span>Resume Builder</span>
              </Link>
              
              <Link
                to="/cover-letter"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                  isActive('/cover-letter') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <FaEnvelope className="h-4 w-4" />
                <span>Cover Letter</span>
              </Link>
              
              <Link
                to="/my-documents"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                  isActive('/my-documents') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <FaFileAlt className="h-4 w-4" />
                <span>My Documents</span>
              </Link>
            </div>
          )}
          
          {/* User Menu */}
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUser className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700 hidden sm:block">
                  {currentUser?.displayName || currentUser?.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
