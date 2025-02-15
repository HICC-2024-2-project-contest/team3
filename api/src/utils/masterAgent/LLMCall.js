import {} from "@google/generative-ai";

async function LLMCall(prompt) {
    const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    return result.response.text()
}

export { LLMCall };
