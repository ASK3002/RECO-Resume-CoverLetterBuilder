import { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import PersonalInfoSection from './sections/PersonalInfoSection';
import WorkExperienceSection from './sections/WorkExperienceSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificationsSection from './sections/CertificationsSection';
import HobbiesSection from './sections/HobbiesSection';
import { FaUser, FaBriefcase, FaGraduationCap, FaCogs, FaProjectDiagram, FaCertificate, FaHeart } from 'react-icons/fa';

const sections = [
  { id: 'personalInfo', label: 'Personal Information', icon: FaUser },
  { id: 'workExperience', label: 'Work Experience', icon: FaBriefcase },
  { id: 'education', label: 'Education', icon: FaGraduationCap },
  { id: 'skills', label: 'Skills', icon: FaCogs },
  { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
  { id: 'certifications', label: 'Certifications', icon: FaCertificate },
  { id: 'hobbies', label: 'Hobbies & Interests', icon: FaHeart }
];

export default function ResumeEditor({ activeSection, setActiveSection }) {
  const { saving } = useResume();

  const renderSection = () => {
    switch (activeSection) {
      case 'personalInfo':
        return <PersonalInfoSection />;
      case 'workExperience':
        return <WorkExperienceSection />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'certifications':
        return <CertificationsSection />;
      case 'hobbies':
        return <HobbiesSection />;
      default:
        return <PersonalInfoSection />;
    }
  };

  return (
    <div className="h-full">
      {/* Section Navigation - Moved to Top */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/30 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Resume Sections</h3>
          {/* Save Status */}
          {saving && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Saving...
            </div>
          )}
        </div>
        
        {/* Horizontal Section Navigation */}
        <nav className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80 hover:text-blue-600 shadow-md'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Section Content - Full Width */}
      <div className="p-6">
        {renderSection()}
      </div>
    </div>
  );
}
