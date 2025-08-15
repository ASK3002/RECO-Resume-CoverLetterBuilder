import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Download resume as PDF
export const downloadResumeAsPDF = async (resumeData, template = 'modern') => {
  try {
    // Create a temporary div with the resume content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '210mm'; // A4 width
    tempDiv.style.minHeight = '297mm'; // A4 height
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20mm';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    
    // Generate HTML content based on template
    tempDiv.innerHTML = generateResumeHTML(resumeData, template);
    
    document.body.appendChild(tempDiv);
    
    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Download the PDF
    const fileName = `${resumeData.personalInfo.firstName || 'Resume'}_${resumeData.personalInfo.lastName || 'Document'}_Resume.pdf`;
    pdf.save(fileName);
    
    // Clean up
    document.body.removeChild(tempDiv);
    
    return fileName;
  } catch (error) {
    console.error('Error downloading resume:', error);
    throw new Error('Failed to download resume. Please try again.');
  }
};

// Download cover letter as PDF
export const downloadCoverLetterAsPDF = async (coverLetterData, template = 'professional') => {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '210mm';
    tempDiv.style.minHeight = '297mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20mm';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    
    tempDiv.innerHTML = generateCoverLetterHTML(coverLetterData, template);
    
    document.body.appendChild(tempDiv);
    
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    const fileName = `${coverLetterData.companyName || 'Company'}_Cover_Letter.pdf`;
    pdf.save(fileName);
    
    document.body.removeChild(tempDiv);
    
    return fileName;
  } catch (error) {
    console.error('Error downloading cover letter:', error);
    throw new Error('Failed to download cover letter. Please try again.');
  }
};

// Generate Resume HTML
const generateResumeHTML = (resumeData, template) => {
  const { personalInfo, workExperience, education, skills, projects, certifications, hobbies } = resumeData;
  
  const templateStyles = {
    modern: {
      headerBg: '#3B82F6',
      headerText: '#FFFFFF',
      accentColor: '#3B82F6',
      textColor: '#374151'
    },
    professional: {
      headerBg: '#1F2937',
      headerText: '#FFFFFF',
      accentColor: '#1F2937',
      textColor: '#374151'
    },
    creative: {
      headerBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      headerText: '#FFFFFF',
      accentColor: '#667eea',
      textColor: '#374151'
    }
  };
  
  const style = templateStyles[template] || templateStyles.modern;
  
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: ${style.textColor};">
      <!-- Header -->
      <div style="background: ${style.headerBg}; color: ${style.headerText}; padding: 30px; margin: -20mm -20mm 20px -20mm; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${personalInfo.firstName} ${personalInfo.lastName}</h1>
        <div style="margin-top: 10px; font-size: 14px;">
          ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
          ${personalInfo.phone ? `<span style="margin-left: 20px;">${personalInfo.phone}</span>` : ''}
          ${personalInfo.city ? `<span style="margin-left: 20px;">${personalInfo.city}, ${personalInfo.state}</span>` : ''}
        </div>
      </div>
      
      <!-- Summary -->
      ${personalInfo.summary ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: ${style.accentColor}; border-bottom: 2px solid ${style.accentColor}; padding-bottom: 5px; margin-bottom: 15px;">Professional Summary</h2>
          <p style="margin: 0; text-align: justify;">${personalInfo.summary}</p>
        </div>
      ` : ''}
      
      <!-- Work Experience -->
      ${workExperience.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: ${style.accentColor}; border-bottom: 2px solid ${style.accentColor}; padding-bottom: 5px; margin-bottom: 15px;">Work Experience</h2>
          ${workExperience.map(exp => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${exp.jobTitle}</h3>
                <span style="font-size: 14px; color: #6B7280;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style="margin-bottom: 10px; font-weight: 600; color: ${style.accentColor};">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
              ${exp.description ? `<div style="white-space: pre-wrap; text-align: justify;">${exp.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Education -->
      ${education.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: ${style.accentColor}; border-bottom: 2px solid ${style.accentColor}; padding-bottom: 5px; margin-bottom: 15px;">Education</h2>
          ${education.map(edu => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${edu.degree}</h3>
                <span style="font-size: 14px; color: #6B7280;">${edu.graduationDate}</span>
              </div>
              <div style="color: ${style.accentColor}; font-weight: 600;">${edu.institution}${edu.location ? ` • ${edu.location}` : ''}</div>
              ${edu.gpa ? `<div style="margin-top: 5px;">GPA: ${edu.gpa}</div>` : ''}
              ${edu.achievements ? `<div style="margin-top: 5px; white-space: pre-wrap;">${edu.achievements}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Skills -->
      ${Object.keys(skills).some(key => skills[key]?.length > 0) ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: ${style.accentColor}; border-bottom: 2px solid ${style.accentColor}; padding-bottom: 5px; margin-bottom: 15px;">Skills</h2>
          ${Object.entries(skills).filter(([key, value]) => value?.length > 0).map(([category, skillList]) => `
            <div style="margin-bottom: 10px;">
              <strong style="text-transform: capitalize;">${category.replace(/([A-Z])/g, ' $1').trim()}:</strong>
              <span style="margin-left: 10px;">${skillList.join(', ')}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Projects -->
      ${projects.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: ${style.accentColor}; border-bottom: 2px solid ${style.accentColor}; padding-bottom: 5px; margin-bottom: 15px;">Projects</h2>
          ${projects.map(project => `
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${project.name}</h3>
              ${project.technologies ? `<div style="color: ${style.accentColor}; font-weight: 600; margin-bottom: 5px;">Technologies: ${project.technologies}</div>` : ''}
              ${project.description ? `<div style="white-space: pre-wrap; text-align: justify;">${project.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
};

// Generate Cover Letter HTML
const generateCoverLetterHTML = (coverLetterData, template) => {
  const templateStyles = {
    professional: {
      headerColor: '#1F2937',
      accentColor: '#1F2937',
      textColor: '#374151'
    },
    modern: {
      headerColor: '#3B82F6',
      accentColor: '#3B82F6',
      textColor: '#374151'
    },
    creative: {
      headerColor: '#667eea',
      accentColor: '#667eea',
      textColor: '#374151'
    },
    executive: {
      headerColor: '#000000',
      accentColor: '#000000',
      textColor: '#374151'
    }
  };
  
  const style = templateStyles[template] || templateStyles.professional;
  
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.8; color: ${style.textColor}; max-width: 170mm;">
      <!-- Date -->
      <div style="text-align: right; margin-bottom: 30px; color: #6B7280;">
        ${new Date().toLocaleDateString()}
      </div>
      
      <!-- Recipient -->
      <div style="margin-bottom: 30px;">
        ${coverLetterData.hiringManager ? `<div style="font-weight: bold;">${coverLetterData.hiringManager}</div>` : ''}
        <div style="font-weight: bold;">${coverLetterData.companyName}</div>
      </div>
      
      <!-- Salutation -->
      <div style="margin-bottom: 25px;">
        Dear ${coverLetterData.hiringManager || 'Hiring Manager'},
      </div>
      
      <!-- Content -->
      <div style="margin-bottom: 25px;">
        ${coverLetterData.content.opening ? `<p style="margin-bottom: 20px; text-align: justify;">${coverLetterData.content.opening}</p>` : ''}
        ${coverLetterData.content.body ? `<div style="margin-bottom: 20px; white-space: pre-wrap; text-align: justify;">${coverLetterData.content.body}</div>` : ''}
        ${coverLetterData.content.closing ? `<p style="margin-bottom: 20px; text-align: justify;">${coverLetterData.content.closing}</p>` : ''}
      </div>
      
      <!-- Signature -->
      <div style="margin-top: 40px;">
        <div>Sincerely,</div>
        <div style="margin-top: 30px; font-weight: bold;">[Your Name]</div>
      </div>
    </div>
  `;
};
