const OpenAI = require('openai');
const env = require('../config/env');
const { RESPOND_TOOL_NAME, RESPOND_TOOL_SCHEMA } = require('./respondTool');

function createLLMClient({ apiKey = env.OPENAI_API_KEY, model = env.MODEL_NAME, client } = {}) {
  const openai = client || new OpenAI({ apiKey });

  async function chatTurn({ systemPrompt, history = [], message }) {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({
        role: m.role === 'customer' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await openai.chat.completions.create({
      model,
      messages,
      tools: [RESPOND_TOOL_SCHEMA],
      tool_choice: { type: 'function', function: { name: RESPOND_TOOL_NAME } },
    });

    const toolCalls = response.choices[0].message.tool_calls;
    if (!toolCalls || toolCalls.length === 0) {
      throw new Error('LLM response did not include the expected respond_to_customer tool call');
    }

    const toolCall = toolCalls[0];
    let extracted;
    try {
      extracted = JSON.parse(toolCall.function.arguments);
    } catch (err) {
      throw new Error(`Failed to parse LLM tool-call arguments as JSON: ${err.message}`);
    }
    return extracted;
  }

  return { chatTurn };
}

module.exports = { createLLMClient };
