import mongoose from "mongoose";
import GameRule from "../model/gameRuleModel.js";
import Game from "../model/gameModel.js";
import { mongoConfig } from "../config/database.js";

mongoose
    .connect(mongoConfig.uri, mongoConfig.options)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

async function createDefaultContext(ruleId, gameId) {
    const gameRule = await GameRule.findOne({ ruleId: ruleId });
    const game = await Game.findOne({ gameId: gameId });
    return {
        global: {
            globalVariables: gameRule.globalVariables,
            customEntityConfig: gameRule.customEntityConfig,
            customItemConfig: gameRule.customItemConfig,
            metaData: game.metaData,
        },
        flags: {},
    };
}

export { createDefaultContext };
