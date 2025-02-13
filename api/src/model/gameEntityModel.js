import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const gameEntitySchema = mongoose.Schema({
    entityId: { type: String, required: true, unique: true },
    ruleId: { type: String, required: true, ref: "GameRule" },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    status: { type: Array, default: [] }, // {"statusId": "statusName", statusDescription: "statusDescription", MaxValue: 100, MinValue: 0}
    inventory: { type: Array, default: [] }, // {"itemId": "itemName", itemDescription: "itemDescription", MaxValue: 100, MinValue: 0}
    equipment: { type: Array, default: [] },
    isNPC: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gameEntitySchema.set("timestamps", true);
gameEntitySchema.pre("save", function (next) {
    if (!this.entityId) {
        this.entityId = uuidv4();
    }
    next();
});

export default mongoose.model("GameEntity", gameEntitySchema);
