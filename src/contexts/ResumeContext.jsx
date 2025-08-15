import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { downloadResumeAsPDF } from '../utils/downloadUtils';

const ResumeContext = createContext();

export function useResume() {
  return useContext(ResumeContext);
}

const initialResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  workExperience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: []
  },
  projects: [],
  certifications: [],
  hobbies: []
};

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();

  // Load resume data from Firestore
  useEffect(() => {
    if (currentUser) {
      loadResumeData();
    }
  }, [currentUser]);

  const loadResumeData = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'resumes', currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setResumeData(data.resumeData || initialResumeData);
        setSelectedTemplate(data.selectedTemplate || 'modern');
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResumeData = async (data = resumeData, template = selectedTemplate) => {
    if (!currentUser) return;
    
    try {
      setSaving(true);
      const docRef = doc(db, 'resumes', currentUser.uid);
      await setDoc(docRef, {
        resumeData: data,
        selectedTemplate: template,
        updatedAt: new Date(),
        userId: currentUser.uid
      }, { merge: true });
    } catch (error) {
      console.error('Error saving resume data:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    const newData = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const addWorkExperience = (experience) => {
    const newData = {
      ...resumeData,
      workExperience: [...resumeData.workExperience, { ...experience, id: Date.now() }]
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const updateWorkExperience = (id, updatedExperience) => {
    const newData = {
      ...resumeData,
      workExperience: resumeData.workExperience.map(exp => 
        exp.id === id ? { ...exp, ...updatedExperience } : exp
      )
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const removeWorkExperience = (id) => {
    const newData = {
      ...resumeData,
      workExperience: resumeData.workExperience.filter(exp => exp.id !== id)
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const addEducation = (education) => {
    const newData = {
      ...resumeData,
      education: [...resumeData.education, { ...education, id: Date.now() }]
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const updateEducation = (id, updatedEducation) => {
    const newData = {
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, ...updatedEducation } : edu
      )
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const removeEducation = (id) => {
    const newData = {
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const updateSkills = (category, skills) => {
    const newData = {
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: skills
      }
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const addProject = (project) => {
    const newData = {
      ...resumeData,
      projects: [...resumeData.projects, { ...project, id: Date.now() }]
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const updateProject = (id, updatedProject) => {
    const newData = {
      ...resumeData,
      projects: resumeData.projects.map(proj => 
        proj.id === id ? { ...proj, ...updatedProject } : proj
      )
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const removeProject = (id) => {
    const newData = {
      ...resumeData,
      projects: resumeData.projects.filter(proj => proj.id !== id)
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const addCertification = (certification) => {
    const newData = {
      ...resumeData,
      certifications: [...resumeData.certifications, { ...certification, id: Date.now() }]
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const updateCertification = (id, updatedCertification) => {
    const newData = {
      ...resumeData,
      certifications: resumeData.certifications.map(cert => 
        cert.id === id ? { ...cert, ...updatedCertification } : cert
      )
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const removeCertification = (id) => {
    const newData = {
      ...resumeData,
      certifications: resumeData.certifications.filter(cert => cert.id !== id)
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const updateHobbies = (hobbies) => {
    const newData = {
      ...resumeData,
      hobbies
    };
    setResumeData(newData);
    saveResumeData(newData);
  };

  const changeTemplate = (template) => {
    setSelectedTemplate(template);
    saveResumeData(resumeData, template);
  };

  // Download resume as PDF
  const downloadResume = async () => {
    try {
      // Save to Firestore before downloading
      await saveResumeData(resumeData, selectedTemplate);
      const fileName = await downloadResumeAsPDF(resumeData, selectedTemplate);
      return fileName;
    } catch (error) {
      console.error('Error downloading resume:', error);
      throw error;
    }
  };

  // Reset resume to initial state
  const resetResume = () => {
    setResumeData(initialResumeData);
    setSelectedTemplate('modern');
  };

  const value = {
    resumeData,
    selectedTemplate,
    loading,
    saving,
    updatePersonalInfo,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    updateHobbies,
    changeTemplate,
    saveResumeData,
    downloadResume,
    resetResume
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}
