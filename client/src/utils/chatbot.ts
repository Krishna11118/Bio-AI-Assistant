import companyInfo from '../data/company.txt?raw';

export function generateResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi')) {
    return "Hello! I'm the Krishna's assistant. How can I help you today?";
  }
  
  if (message.includes('services') || message.includes('what do you do')) {
    return companyInfo.split('Services:')[1].split('Contact:')[0].trim();
  }
  
  if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
    return companyInfo.split('Contact:')[1].trim();
  }
  
  if (message.includes('location') || message.includes('where')) {
    const location = companyInfo.split('Location:')[1].split('\n')[0].trim();
    return `We are located in ${location}`;
  }
  
  if (message.includes('employees') || message.includes('team')) {
    const employees = companyInfo.split('Employees:')[1].split('\n')[0].trim();
    return `We have ${employees} employees working at Krishna's.`;
  }

  return "I'm not sure about that. Would you like to know about our services, location, or contact information?";
}