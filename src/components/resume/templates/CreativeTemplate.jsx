export default function CreativeTemplate({ data }) {
  const { personalInfo, workExperience, education, skills, projects, certifications, hobbies } = data;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8 text-sm leading-relaxed bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-pink-100">
          <div>
            {personalInfo.email && <div>📧 {personalInfo.email}</div>}
            {personalInfo.phone && <div>📱 {personalInfo.phone}</div>}
          </div>
          <div>
            {personalInfo.city && personalInfo.state && (
              <div>📍 {personalInfo.city}, {personalInfo.state}</div>
            )}
            <div className="flex gap-4 mt-2">
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} className="text-pink-200 hover:text-white">
                  LinkedIn
                </a>
              )}
              {personalInfo.website && (
                <a href={personalInfo.website} className="text-pink-200 hover:text-white">
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-bold text-pink-600 mb-3 flex items-center">
            <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed italic">{personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                Experience
              </h2>
              {workExperience.map((exp, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                      <div className="text-purple-600 font-medium">{exp.company}</div>
                    </div>
                    <div className="text-right text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 whitespace-pre-line text-sm">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-bold text-pink-600 mb-4 flex items-center">
                <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                Projects
              </h2>
              {projects.map((project, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{project.name}</h3>
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {formatDate(project.startDate)} - {project.ongoing ? 'Ongoing' : formatDate(project.endDate)}
                    </div>
                  </div>
                  {project.technologies && (
                    <div className="text-pink-600 text-sm font-medium mb-2">{project.technologies}</div>
                  )}
                  {project.description && (
                    <div className="text-gray-700 whitespace-pre-line text-sm">
                      {project.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          {(skills.technical?.length > 0 || skills.soft?.length > 0 || skills.languages?.length > 0) && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                Skills
              </h2>
              {skills.technical?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">Technical</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.technical.map((skill, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.soft?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.soft.map((skill, index) => (
                      <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.languages?.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Languages</h3>
                  <div className="text-gray-700 text-sm">{skills.languages.join(' • ')}</div>
                </div>
              )}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-bold text-pink-600 mb-4 flex items-center">
                <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                Education
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                  <div className="text-purple-600 font-medium text-sm">{edu.institution}</div>
                  <div className="text-gray-600 text-xs">{formatDate(edu.graduationDate)}</div>
                  {edu.gpa && <div className="text-gray-700 text-xs">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                Certifications
              </h2>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
                  <div className="text-pink-600 text-sm">{cert.issuer}</div>
                  <div className="text-gray-600 text-xs">{formatDate(cert.date)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Hobbies */}
          {hobbies?.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-bold text-pink-600 mb-4 flex items-center">
                <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                Interests
              </h2>
              <div className="flex flex-wrap gap-1">
                {hobbies.map((hobby, index) => (
                  <span key={index} className="bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
