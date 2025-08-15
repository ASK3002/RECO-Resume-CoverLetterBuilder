import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { downloadCoverLetterAsPDF } from '../utils/downloadUtils';

const CoverLetterContext = createContext();

export function useCoverLetter() {
  return useContext(CoverLetterContext);
}

const initialCoverLetterData = {
  jobTitle: '',
  companyName: '',
  hiringManager: '',
  jobDescription: '',
  content: {
    opening: '',
    body: '',
    closing: ''
  },
  template: 'professional',
  industry: 'technology',
  customizations: {
    tone: 'professional',
    length: 'medium',
    emphasis: 'experience'
  }
};

export function CoverLetterProvider({ children }) {
  const { currentUser } = useAuth();
  const [coverLetterData, setCoverLetterData] = useState(initialCoverLetterData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load cover letter data from Firestore
  useEffect(() => {
    const loadCoverLetterData = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'coverLetters', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setCoverLetterData({ ...initialCoverLetterData, ...docSnap.data() });
          }
        } catch (error) {
          console.error('Error loading cover letter data:', error);
        }
      }
      setLoading(false);
    };

    loadCoverLetterData();
  }, [currentUser]);

  // Save cover letter data to Firestore
  const saveCoverLetterData = async (data = coverLetterData) => {
    if (!currentUser) return;

    try {
      setSaving(true);
      const docRef = doc(db, 'coverLetters', currentUser.uid);
      await setDoc(docRef, data, { merge: true });
      console.log('Cover letter data saved successfully');
    } catch (error) {
      console.error('Error saving cover letter data:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Auto-save when data changes
  useEffect(() => {
    if (!loading && currentUser) {
      const timeoutId = setTimeout(() => {
        saveCoverLetterData();
      }, 1000); // Auto-save after 1 second of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [coverLetterData, loading, currentUser]);

  // Update job information
  const updateJobInfo = (field, value) => {
    setCoverLetterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update content sections
  const updateContent = (section, value) => {
    setCoverLetterData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: value
      }
    }));
  };

  // Update template
  const updateTemplate = (template) => {
    setCoverLetterData(prev => ({
      ...prev,
      template
    }));
  };

  // Update industry
  const updateIndustry = (industry) => {
    setCoverLetterData(prev => ({
      ...prev,
      industry
    }));
  };

  // Update customizations
  const updateCustomizations = (field, value) => {
    setCoverLetterData(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [field]: value
      }
    }));
  };

  // Reset cover letter data
  const resetCoverLetter = () => {
    setCoverLetterData(initialCoverLetterData);
  };

  // Generate full cover letter text
  const getFullCoverLetterText = () => {
    const { content } = coverLetterData;
    return `${content.opening}\n\n${content.body}\n\n${content.closing}`;
  };

  // Download cover letter as PDF
  const downloadCoverLetter = async () => {
    try {
      // Save to Firestore before downloading
      await saveCoverLetterData(coverLetterData);
      const fileName = await downloadCoverLetterAsPDF(coverLetterData, coverLetterData.template);
      return fileName;
    } catch (error) {
      console.error('Error downloading cover letter:', error);
      throw error;
    }
  };

  const value = {
    coverLetterData,
    loading,
    saving,
    updateJobInfo,
    updateContent,
    updateTemplate,
    updateIndustry,
    updateCustomizations,
    resetCoverLetter,
    saveCoverLetterData,
    getFullCoverLetterText,
    downloadCoverLetter
  };

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
}
