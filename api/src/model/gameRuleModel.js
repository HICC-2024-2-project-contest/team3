import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const gameRuleSchema = mongoose.Schema({
    ruleId: { type: String, required: true, unique: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },
    authorId: { type: String, required: true },

    eventList: { type: Array, default: [] }, // Array of eventUUID
    judgeList: { type: Array, default: [] }, // Array of judgeUUID
    classList: { type: Array, default: [] }, // Array of classUUID
    endingList: { type: Array, default: [] }, // Array of endingUUID

    background: { type: String, default: "" },
    exampleScenarios: { type: Array, default: [] },
    additionalInfomation: { type: Map },

    isPublic: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

postSchema.set("timestamps", true);
gameRuleSchema.pre("save", function (next) {
    if (!this.ruleId) {
        this.ruleId = uuidv4();
    }
    next();
});

export default mongoose.model("GameRule", gameRuleSchema);
