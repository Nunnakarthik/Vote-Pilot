/**
 * Chat API Service
 * Handles communication with the FastAPI backend (Python)
 */

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Send user message to the backend
 * @param {string} message - The user query
 * @param {string} userLevel - beginner | intermediate | advanced
 * @returns {Promise<Object>} - { reply, source, intent }
 */
export async function sendMessageToBackend(message, userLevel = 'beginner') {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, userLevel }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to connect to backend server');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
