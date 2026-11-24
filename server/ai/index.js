const provider = process.env.AI_PROVIDER || "gemini";

let ai;
if (provider === "openai") {
  ai = require("./openai");
} else if (provider === "claude") {
  ai = require("./claude");
} else {
  ai = require("./gemini");
}

console.log(`AI provider: ${provider}`);

module.exports = ai;
