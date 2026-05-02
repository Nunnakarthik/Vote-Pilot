/**
 * Formatter Service
 * Converts raw knowledge objects into structured markdown/text.
 *
 * @param {Object|null} data - The raw knowledge data object.
 * @param {string} data.title - The title of the topic.
 * @param {string[]} [data.steps] - An array of actionable steps.
 * @param {string} [data.tip] - An optional tip or reminder.
 * @returns {string} The formatted markdown string.
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
