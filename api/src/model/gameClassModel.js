import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const gameClassSchema = mongoose.Schema({
    classId: { type: String, required: true, unique: true },
    ruleId: { type: String, required: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    // thinking...

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gameRuleSchema.pre("save", function (next) {
    if (!this.classId) {
        this.classId = uuidv4();
    }
    next();
});

export default mongoose.model("GameClass", gameClassSchema);
