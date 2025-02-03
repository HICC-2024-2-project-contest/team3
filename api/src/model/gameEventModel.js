import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const gameEventSchema = mongoose.Schema({
    eventId: { type: String, required: true, unique: true },
    ruleId: { type: String, required: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    triggerTree: { type: Map, required: true },
    executeTree: { type: Map, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

postSchema.set("timestamps", true);
gameRuleSchema.pre("save", function (next) {
    if (!this.eventId) {
        this.eventId = uuidv4();
    }
    next();
});

export default mongoose.model("GameEvent", gameEventSchema);
