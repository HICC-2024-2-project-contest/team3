const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gameRuleSchema = mongoose.Schema({
    ruleId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true, default: "" },
    authorId: { type: String, required: true },

    eventList: { type: Array, default: [] },
    judgeList: { type: Array, default: [] },
    classList: { type: Array, default: [] },
    additionalRuleList: { type: Array, default: [] },

    background: String, 
    exampleScenarios: { type: Array, default: [] },
    additionalInfomation: { type: Map, of: String, default: {} },

    isPublic: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gameRuleSchema.pre('save', function (next) {
    if (!this.ruleId) {
        this.ruleId = uuidv4();
    }
    next();
});

module.exports = mongoose.model('GameRule', gameRuleSchema);