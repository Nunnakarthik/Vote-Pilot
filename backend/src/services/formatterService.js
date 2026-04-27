/**
 * Formatter Service
 * Converts raw knowledge objects into structured markdown/text
 */

export const formatLocalResponse = (data) => {
  if (!data) return "I don't have specific data on that yet, but I can check for you!";

  let response = `### ${data.title}\n\n`;
  
  if (data.steps && data.steps.length > 0) {
    response += data.steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
  }

  if (data.tip) {
    response += `\n\n**💡 Tip:** ${data.tip}`;
  }

  return response;
};
