import redis from "redis";
import mongoose from "mongoose";
import { createDefaultContext } from "../ast/createContext.js";
import { executeCommandSet } from "../ast/commandSet.js";
import Game from "../model/gameModel.js";
import GameRule from "../model/gameRuleModel.js";
import GameEvent from "../model/gameEventModel.js";
import GameJudge from "../model/gameJudgeModel.js";
import { mongoConfig, redisConfig } from "../config/database.js";

mongoose
    .connect(mongoConfig.uri, mongoConfig.options)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const redisClient = redis.createClient(redisConfig);
(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis connection error:", error);
    }
})();

async function gameContextSave(gameId, context) {
    await redisClient.set(`gameContext:${gameId}`, JSON.stringify(context));
}

async function gameContextLoad(gameId) {
    const context = await redisClient.get(`gameContext:${gameId}`);
    return JSON.parse(context);
}

async function isJudgePassed(trigger) {}

async function gameEventProcess(gameId) {
    const game = await Game.findOne({ gameId: gameId });
    const ruleId = game.ruleId;
    const events = await GameEvent.find({ ruleId: ruleId });
    for (const event of events) {
        const context = await gameContextLoad(gameId);
        const triggerAST = event.triggerTree;
        const executeAST = event.executeTree;
        const isTriggerPassed = await executeCommandSet(triggerAST, context);
        if (isTriggerPassed) {
            await executeCommandSet(executeAST, context);
        }
    }
}

async function gameJudgeProcess(gameId) {
    const game = await Game.findOne({ gameId: gameId });
    const ruleId = game.ruleId;
    const judges = await GameJudge.find({ ruleId: ruleId });
    for (const judge of judges) {
        const context = await gameContextLoad(gameId);
        const triggerAST = judge.triggerTree;
        const executeAST = judge.executeTree;
        const triggerPassed = await executeCommandSet(triggerAST, context);
        if (triggerPassed) {
            await executeCommandSet(executeAST, context);
        }
    }
}
