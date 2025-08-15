export default function ModernTemplate({ data }) {
  const { personalInfo, workExperience, education, skills, projects, certifications, hobbies } = data;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.city && personalInfo.state && (
            <span>{personalInfo.city}, {personalInfo.state}</span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 text-blue-600">
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} className="hover:underline">
              LinkedIn
            </a>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} className="hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">
            Work Experience
          </h2>
          {workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div className="text-blue-600 font-medium mb-2">
                {exp.company} {exp.location && `• ${exp.location}`}
              </div>
              {exp.description && (
                <div className="text-gray-700 whitespace-pre-line">
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(edu.graduationDate)}
                </span>
              </div>
              <div className="text-blue-600 font-medium mb-1">
                {edu.institution} {edu.location && `• ${edu.location}`}
              </div>
              {edu.gpa && (
                <div className="text-gray-700 mb-1">GPA: {edu.gpa}</div>
              )}
              {edu.relevantCoursework && (
                <div className="text-gray-700 mb-1">
                  <strong>Relevant Coursework:</strong> {edu.relevantCoursework}
                </div>
              )}
              {edu.achievements && (
                <div className="text-gray-700 whitespace-pre-line">
                  {edu.achievements}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0 || skills.languages?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">
            Skills
          </h2>
          {skills.technical?.length > 0 && (
            <div className="mb-2">
              <strong className="text-gray-900">Technical:</strong>{' '}
              <span className="text-gray-700">{skills.technical.join(' • ')}</span>
            </div>
          )}
          {skills.soft?.length > 0 && (
            <div className="mb-2">
              <strong className="text-gray-900">Soft Skills:</strong>{' '}
              <span className="text-gray-700">{skills.soft.join(' • ')}</span>
            </div>
          )}
          {skills.languages?.length > 0 && (
            <div className="mb-2">
              <strong className="text-gray-900">Languages:</strong>{' '}
              <span className="text-gray-700">{skills.languages.join(' • ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">
            Projects
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(project.startDate)} - {project.ongoing ? 'Ongoing' : formatDate(project.endDate)}
                </span>
              </div>
              {project.technologies && (
                <div className="text-blue-600 font-medium mb-2">{project.technologies}</div>
              )}
              {project.description && (
                <div className="text-gray-700 whitespace-pre-line mb-2">
                  {project.description}
                </div>
              )}
              <div className="flex gap-4 text-xs">
                {project.link && (
                  <a href={project.link} className="text-blue-600 hover:underline">
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} className="text-blue-600 hover:underline">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">
            Certifications
          </h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(cert.date)}
                </span>
              </div>
              <div className="text-blue-600 font-medium">{cert.issuer}</div>
              {cert.credentialId && (
                <div className="text-gray-700 text-xs">
                  Credential ID: {cert.credentialId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hobbies */}
      {hobbies?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-blue-200 pb-1">
            Interests
          </h2>
          <div className="text-gray-700">{hobbies.join(' • ')}</div>
        </div>
      )}
    </div>
  );
}
