const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gameEndingSchema = mongoose.Schema({
    endingId: { type: String, required: true, unique: true },
    ruleId: { type: String, required: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    triggerTree: { type: Map, required: true },
    executeTree: { type: Map, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gameEndingSchema.pre('save', function (next) {
    if (!this.endingId) {
        this.endingId = uuidv4();
    }
    next();
});

module.exports = mongoose.model('GameEnding', gameEndingSchema);