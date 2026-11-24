const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Pho Filet assistant. Vietnamese restaurant, San Antonio TX.
9910 TX-1604 Loop, 78254. Phone: (210) 520-5630.
Hours: Mon closed, Tue–Sat 11am–9pm, Sun 11am–8:30pm.
Menu: Appetizers $8.50 (Spring Rolls, Egg-Rolls, Crab Rangoon, Pot Stickers, Edamame). Pho $15.95–16.95 (Beef, Chicken, Vegetable, Shrimp). Vermicelli $15.95–16.95. Plates w/ rice $15.95–16.95. Fried Rice $15.95–16.95. Lo Mein $15.95–16.95. Banh Mi $9.50. Vegetarian options available (tofu +$1–2). Boba $6.99, Coffee $4.99, Tea $4.99, Soda $2.75.
Rules: Only answer restaurant questions. For allergies, recommend calling. Be concise and friendly. Redirect unrelated questions.`;

async function chat(userMessage, conversationHistory = []) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
  });

  // Convert history to Gemini format: { role: "user"|"model", parts: [{ text }] }
  const history = conversationHistory.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const chatSession = model.startChat({ history });
  const result = await chatSession.sendMessage(userMessage);

  return {
    reply: result.response.text(),
    usage: {
      inputTokens: result.response.usageMetadata?.promptTokenCount ?? 0,
      outputTokens: result.response.usageMetadata?.candidatesTokenCount ?? 0,
    },
  };
}

module.exports = { chat };
