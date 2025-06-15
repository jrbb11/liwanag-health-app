import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

/**
 * Formats a user message with context for GPT
 * @param {string} message - The user's message
 * @param {Object} context - Additional context (hospital, procedure, etc.)
 * @returns {string} Formatted message for GPT
 */
export function formatMessageForGPT(message, context = {}) {
  let formattedMessage = message;

  // Add hospital context if available
  if (context.hospital) {
    formattedMessage += `\n\nHospital Context:\nName: ${context.hospital.name}\nType: ${context.hospital.type}\nPhilHealth: ${context.hospital.philhealth}`;
  }

  // Add procedure context if available
  if (context.procedure) {
    formattedMessage += `\n\nProcedure Context:\nName: ${context.procedure.name}\nCategory: ${context.procedure.category}\nBase Cost: ₱${context.procedure.baseCost.public.toLocaleString()} - ₱${context.procedure.baseCost.private.toLocaleString()}\nPhilHealth Coverage: ₱${context.procedure.philhealthCoverage.toLocaleString()}`;
  }

  return formattedMessage;
}

/**
 * Gets a response from GPT
 * @param {string} message - The formatted message to send to GPT
 * @param {Object} options - Additional options (systemPrompt, etc.)
 * @returns {Promise<string>} GPT's response
 */
export async function getGPTResponse(message, options = {}) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: options.systemPrompt || "You are a helpful healthcare cost estimation assistant."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error getting GPT response:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}