const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gameJudgeSchema = mongoose.Schema({
    judgeId: { type: String, required: true, unique: true },
    ruleId: { type: String, required: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    TriggerDescription: {type: String, required: true},
    executeTree: { type: Map, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gameJudgeSchema.pre('save', function (next) {
    if (!this.judgeId) {
        this.judgeId = uuidv4();
    }
    next();
});

module.exports = mongoose.model('GameJudge', gameJudgeSchema);