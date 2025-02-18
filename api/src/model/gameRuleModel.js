import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const gameRuleSchema = mongoose.Schema({
    ruleId: { type: String, required: true, unique: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },
    authorId: { type: String, required: true },

    eventList: { type: [String], default: [] }, // Array of eventUUID
    judgeList: { type: [String], default: [] }, // Array of judgeUUID
    classList: { type: [String], default: [] }, // Array of classUUID
    endingList: { type: [String], default: [] }, // Array of endingUUID
    entityList: { type: [String], default: [] }, // Array of entityUUID

    background: { type: String, default: "" },
    globalVariables: { type: Map, default: {} },
    customEntityConfig: { type: Map, default: {} },
    customItemConfig: { type: Map, default: {} },
    exampleScenarios: { type: Array, default: [] },
    additionalInformation: { type: Map },

    isPublic: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gameRuleSchema.set("timestamps", true);
gameRuleSchema.pre("save", function (next) {
    if (!this.ruleId) {
        this.ruleId = uuidv4();
    }
    next();
});

export default mongoose.model("GameRule", gameRuleSchema);
