export default function ClassicTemplate({ data }) {
  const { personalInfo, workExperience, education, skills, projects, certifications, hobbies } = data;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8 text-sm leading-relaxed font-serif">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="text-gray-600 space-y-1">
          {personalInfo.address && (
            <div>{personalInfo.address}</div>
          )}
          {(personalInfo.city || personalInfo.state) && (
            <div>{personalInfo.city}{personalInfo.city && personalInfo.state && ', '}{personalInfo.state} {personalInfo.zipCode}</div>
          )}
          <div className="flex justify-center gap-4">
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
          </div>
          {(personalInfo.linkedin || personalInfo.website) && (
            <div className="flex justify-center gap-4">
              {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
              {personalInfo.website && <span>{personalInfo.website}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Professional Experience
          </h2>
          {workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div className="italic text-gray-700 mb-2">
                {exp.company}{exp.location && `, ${exp.location}`}
              </div>
              {exp.description && (
                <div className="text-gray-700 whitespace-pre-line ml-4">
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
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(edu.graduationDate)}
                </span>
              </div>
              <div className="italic text-gray-700 mb-1">
                {edu.institution}{edu.location && `, ${edu.location}`}
              </div>
              {edu.gpa && (
                <div className="text-gray-700 mb-1">GPA: {edu.gpa}</div>
              )}
              {edu.achievements && (
                <div className="text-gray-700 whitespace-pre-line ml-4">
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
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {skills.technical?.length > 0 && (
              <div>
                <strong className="text-gray-900">Technical Skills:</strong>
                <div className="text-gray-700">{skills.technical.join(', ')}</div>
              </div>
            )}
            {skills.soft?.length > 0 && (
              <div>
                <strong className="text-gray-900">Professional Skills:</strong>
                <div className="text-gray-700">{skills.soft.join(', ')}</div>
              </div>
            )}
          </div>
          {skills.languages?.length > 0 && (
            <div className="mt-2">
              <strong className="text-gray-900">Languages:</strong>{' '}
              <span className="text-gray-700">{skills.languages.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Notable Projects
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(project.startDate)} - {project.ongoing ? 'Ongoing' : formatDate(project.endDate)}
                </span>
              </div>
              {project.technologies && (
                <div className="italic text-gray-700 mb-2">{project.technologies}</div>
              )}
              {project.description && (
                <div className="text-gray-700 whitespace-pre-line ml-4">
                  {project.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Certifications
          </h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-gray-900">{cert.name}</span>
                <span className="text-gray-600 text-xs">{formatDate(cert.date)}</span>
              </div>
              <div className="italic text-gray-700">{cert.issuer}</div>
            </div>
          ))}
        </div>
      )}

      {/* Hobbies */}
      {hobbies?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Personal Interests
          </h2>
          <div className="text-gray-700">{hobbies.join(', ')}</div>
        </div>
      )}
    </div>
  );
}
