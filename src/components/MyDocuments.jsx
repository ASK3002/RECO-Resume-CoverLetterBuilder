import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaFileAlt, FaEnvelope, FaDownload, FaTrash, FaEye } from 'react-icons/fa';
import { downloadResumeAsPDF, downloadCoverLetterAsPDF } from '../utils/downloadUtils';

export default function MyDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, resumes, coverletters

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docs = [];

      // Fetch resumes - try without orderBy first to avoid index issues
      try {
        const resumesQuery = query(
          collection(db, 'resumes'),
          where('userId', '==', user.uid)
        );
        const resumesSnapshot = await getDocs(resumesQuery);
        resumesSnapshot.forEach(doc => {
          const data = doc.data();
          docs.push({
            id: doc.id,
            type: 'resume',
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        });
      } catch (resumeError) {
        console.error('Error fetching resumes:', resumeError);
      }

      // Fetch cover letters - try without orderBy first to avoid index issues
      try {
        const coverLettersQuery = query(
          collection(db, 'coverLetters'),
          where('userId', '==', user.uid)
        );
        const coverLettersSnapshot = await getDocs(coverLettersQuery);
        coverLettersSnapshot.forEach(doc => {
          const data = doc.data();
          docs.push({
            id: doc.id,
            type: 'coverletter',
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        });
      } catch (coverLetterError) {
        console.error('Error fetching cover letters:', coverLetterError);
      }

      // Sort by updated date
      docs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setDocuments(docs);
      console.log('Fetched documents:', docs); // Debug log
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (docId, type) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const collectionName = type === 'resume' ? 'resumes' : 'coverLetters';
      await deleteDoc(doc(db, collectionName, docId));
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
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

  const getDocumentSubtitle = (document) => {
    if (document.type === 'resume') {
      return document.personalInfo?.email || 'No email provided';
    } else {
      return document.jobTitle || 'No job title specified';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    if (filter === 'resumes') return doc.type === 'resume';
    if (filter === 'coverletters') return doc.type === 'coverletter';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
          <p className="text-gray-600">Manage your resumes and cover letters</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              All Documents ({documents.length})
            </button>
            <button
              onClick={() => setFilter('resumes')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'resumes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Resumes ({documents.filter(d => d.type === 'resume').length})
            </button>
            <button
              onClick={() => setFilter('coverletters')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'coverletters'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Cover Letters ({documents.filter(d => d.type === 'coverletter').length})
            </button>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <FaFileAlt className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't created any documents yet."
                : `You don't have any ${filter === 'resumes' ? 'resumes' : 'cover letters'} yet.`
              }
            </p>
            <div className="space-x-4">
              <a
                href="/resume-builder"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaFileAlt className="mr-2" />
                Create Resume
              </a>
              <a
                href="/cover-letter"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaEnvelope className="mr-2" />
                Create Cover Letter
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {/* Document Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    document.type === 'resume' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {document.type === 'resume' ? (
                      <FaFileAlt className="h-6 w-6" />
                    ) : (
                      <FaEnvelope className="h-6 w-6" />
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    document.type === 'resume'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {document.type === 'resume' ? 'Resume' : 'Cover Letter'}
                  </span>
                </div>

                {/* Document Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {getDocumentTitle(document)}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {getDocumentSubtitle(document)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Updated {document.updatedAt?.toLocaleDateString() || 'Unknown'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <a
                      href={document.type === 'resume' ? '/resume-builder' : '/cover-letter'}
                      className="flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      <FaEye className="mr-1" />
                      View
                    </a>
                    <button
                      onClick={() => handleDownloadDocument(document)}
                      className="flex items-center px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      <FaDownload className="mr-1" />
                      Download
                    </button>
                  </div>
                  <button
                    onClick={() => deleteDocument(document.id, document.type)}
                    className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
