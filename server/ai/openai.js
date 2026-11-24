// TODO: Implement when switching to OpenAI
// npm install openai
// Same interface as claude.js: chat(userMessage, conversationHistory) => { reply, usage }

async function chat(userMessage, conversationHistory = []) {
  throw new Error("OpenAI provider not yet implemented. Set AI_PROVIDER=claude in .env");
}

module.exports = { chat };
