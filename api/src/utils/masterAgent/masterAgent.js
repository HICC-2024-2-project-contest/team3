import redis from "redis";
import { redisConfig } from "../../config/database.js";
import { LLMCall } from "./LLMCall.js";
import { memorySearch } from "./memory/memorySearch.js";

const redisClient = redis.createClient(redisConfig);
(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis connection error:", error);
    }
})();

async function getImportance() {
    const prompt = "";
    const importace = await LLMCall(prompt);
    const importance = parseInt(importace);
    if (importance < 1 || importance > 10) {
        return getImportance();
    } else {
        return importance;
    }
}

async function masterAgent(gameId, prompt) {
    const memorySearch = memorySearch(prompt);
    const promptFinal = "" + memorySearch;
    const response = await LLMCall(promptFinal);
    const memorySegment = {
        time: new Date(),
        content: response,
        importance: getImportance,
    };
    await redisClient.rPush(`agent:${gameId}`, JSON.stringify(memorySegment));
    return response;
}

export { masterAgent };
