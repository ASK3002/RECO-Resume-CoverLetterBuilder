export default function MinimalTemplate({ data }) {
  const { personalInfo, workExperience, education, skills, projects, certifications, hobbies } = data;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-12 text-sm leading-loose max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="flex flex-wrap gap-8 text-gray-600 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.city && personalInfo.state && (
            <span>{personalInfo.city}, {personalInfo.state}</span>
          )}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} className="text-gray-600 hover:text-gray-900">
              LinkedIn
            </a>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} className="text-gray-600 hover:text-gray-900">
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-12">
          <p className="text-gray-700 leading-relaxed text-base font-light">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">
            Experience
          </h2>
          {workExperience.map((exp, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                  <div className="text-gray-600 font-light">{exp.company}</div>
                </div>
                <div className="text-gray-500 text-xs font-light">
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
              {exp.description && (
                <div className="text-gray-700 whitespace-pre-line font-light leading-relaxed">
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <div className="text-gray-600 font-light">{edu.institution}</div>
                </div>
                <div className="text-gray-500 text-xs font-light">
                  {formatDate(edu.graduationDate)}
                </div>
              </div>
              {edu.gpa && (
                <div className="text-gray-700 font-light">GPA: {edu.gpa}</div>
              )}
              {edu.achievements && (
                <div className="text-gray-700 whitespace-pre-line font-light leading-relaxed mt-2">
                  {edu.achievements}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0 || skills.languages?.length > 0) && (
        <div className="mb-12">
          <h2 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">
            Skills
          </h2>
          <div className="space-y-4">
            {skills.technical?.length > 0 && (
              <div>
                <span className="text-gray-900 font-medium mr-4">Technical</span>
                <span className="text-gray-700 font-light">{skills.technical.join(' · ')}</span>
              </div>
            )}
            {skills.soft?.length > 0 && (
              <div>
                <span className="text-gray-900 font-medium mr-4">Professional</span>
                <span className="text-gray-700 font-light">{skills.soft.join(' · ')}</span>
              </div>
            )}
            {skills.languages?.length > 0 && (
              <div>
                <span className="text-gray-900 font-medium mr-4">Languages</span>
                <span className="text-gray-700 font-light">{skills.languages.join(' · ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">
            Projects
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <div className="text-gray-500 text-xs font-light">
                  {formatDate(project.startDate)} — {project.ongoing ? 'Ongoing' : formatDate(project.endDate)}
                </div>
              </div>
              {project.technologies && (
                <div className="text-gray-600 font-light mb-2">{project.technologies}</div>
              )}
              {project.description && (
                <div className="text-gray-700 whitespace-pre-line font-light leading-relaxed">
                  {project.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">
            Certifications
          </h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <div className="text-gray-600 font-light">{cert.issuer}</div>
                </div>
                <div className="text-gray-500 text-xs font-light">
                  {formatDate(cert.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hobbies */}
      {hobbies?.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">
            Interests
          </h2>
          <div className="text-gray-700 font-light">{hobbies.join(' · ')}</div>
        </div>
      )}
    </div>
  );
}
