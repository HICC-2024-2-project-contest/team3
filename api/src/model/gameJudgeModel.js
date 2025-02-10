import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const gameJudgeSchema = mongoose.Schema({
    judgeId: { type: String, required: true, unique: true },
    ruleId: { type: String, required: true, ref: "GameRule" },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    triggerDescription: { type: String, required: true },
    executeTree: { type: Map, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gameJudgeSchema.set("timestamps", true);
gameJudgeSchema.pre("save", function (next) {
    if (!this.judgeId) {
        this.judgeId = uuidv4();
    }
    next();
});

export default mongoose.model("GameJudge", gameJudgeSchema);
