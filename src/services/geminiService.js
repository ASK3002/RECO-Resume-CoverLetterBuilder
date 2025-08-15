import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEN_AI_API_KEY);


class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateResumeContent(section, userInput, contextData = {}) {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompts = {
          summary: `Create a professional resume summary based on this information: ${userInput}. Make it concise, impactful, and tailored for job applications. Return only the summary text.`,
          
          workExperience: this.generateWorkExperiencePrompt ? this.generateWorkExperiencePrompt(userInput, contextData) : `Generate a professional work experience description for: ${userInput}. Include key responsibilities and achievements. Use bullet points and action verbs. Return only the formatted description.`,
          
          skills: this.generateSkillsPrompt ? this.generateSkillsPrompt(userInput, contextData) : `Based on this information: ${userInput}, suggest relevant professional skills. Categorize them into technical skills, soft skills, and tools/technologies. Return as a structured list.`,
          
          education: `Format this education information professionally: ${userInput}. Include degree, institution, graduation date, and any relevant achievements or coursework.`,
          
          projects: this.generateProjectsPrompt ? this.generateProjectsPrompt(userInput, contextData) : `Create a compelling project description for: ${userInput}. Include technologies used, your role, and key achievements. Make it concise and impactful.`,
          
          certifications: `Format this certification information: ${userInput}. Include certification name, issuing organization, date obtained, and relevance to career goals.`,
          
          hobbies: `Convert these hobbies/interests into professional resume format: ${userInput}. Make them relevant to workplace skills and personality traits.`,
          
          coverLetter: userInput
        };

        const prompt = prompts[section] || `Help improve this resume section: ${userInput}`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (error.message?.includes('503') || error.message?.includes('overloaded')) {
          if (attempt < maxRetries) {
            const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
            console.log(`Model overloaded. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            throw new Error('AI service is currently overloaded. Please try again in a few minutes.');
          }
        } else if (error.message?.includes('429')) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        } else {
          throw new Error('Failed to generate content. Please try again.');
        }
      }
    }
  }

  async generateCoverLetter(jobTitle, companyName, userBackground, jobDescription = '') {
    try {
      const prompt = `Write a professional cover letter for the position of ${jobTitle} at ${companyName}. 
      
      User background: ${userBackground}
      ${jobDescription ? `Job description: ${jobDescription}` : ''}
      
      The cover letter should be:
      - Professional and engaging
      - Tailored to the specific role and company
      - Highlight relevant skills and experience
      - Show enthusiasm for the position
      - Be approximately 3-4 paragraphs
      - Include proper formatting with placeholders for [Your Name], [Date], etc.
      
      Return only the cover letter content.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw new Error('Failed to generate cover letter. Please try again.');
    }
  }

  async improveSectionContent(currentContent, section) {
    try {
      const prompt = `Improve this ${section} section for a resume. Make it more professional, impactful, and ATS-friendly:

      Current content: ${currentContent}
      
      Please enhance it by:
      - Using stronger action verbs
      - Adding quantifiable achievements where possible
      - Improving clarity and conciseness
      - Making it more relevant to modern job requirements
      
      Return only the improved content.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error improving content:', error);
      throw new Error('Failed to improve content. Please try again.');
    }
  }

  async generateJobSpecificContent(section, content, jobTitle, jobDescription = '') {
    try {
      const prompt = `Tailor this ${section} section for a ${jobTitle} position:

      Current content: ${content}
      ${jobDescription ? `Job requirements: ${jobDescription}` : ''}
      
      Please customize it to:
      - Align with the specific job requirements
      - Use relevant keywords
      - Highlight most applicable skills and experience
      - Make it ATS-friendly
      
      Return only the tailored content.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating job-specific content:', error);
      throw new Error('Failed to generate tailored content. Please try again.');
    }
  }
}

const geminiService = new GeminiService();
export { geminiService };
export default geminiService;
