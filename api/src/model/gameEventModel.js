const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

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

gameRuleSchema.pre('save', function (next) {
    if (!this.eventId) {
        this.eventId = uuidv4();
    }
    next();
});

module.exports = mongoose.model('GameEvent', gameEventSchema);