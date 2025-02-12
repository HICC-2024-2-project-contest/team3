import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const gameSchema = new mongoose.Schema({
    gameId: { type: String, required: true },
    gameName: { type: String, required: true },
    gameDescription: { type: String, default: "" },
    userLimit: { type: Number, required: true },
    ruleId: { type: String, required: true, ref: "GameRule" },
    masterUserId: { type: String, required: true },
    userId: { type: Array, required: true },
    metaData: { type: Map, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gameSchema.set("timestamps", true);
gameSchema.pre("save", function (next) {
    if (!this.gameId) {
        this.gameId = uuidv4();
    }
    next();
});

export default mongoose.model("Game", gameSchema);
