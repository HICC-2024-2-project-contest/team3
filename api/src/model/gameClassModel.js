const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gameClassSchema = mongoose.Schema({
    classId: { type: String, required: true, unique: true },
    ruleId: { type: String, required: true },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    // thinking...

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gameRuleSchema.pre('save', function (next) {
    if (!this.classId) {
        this.classId = uuidv4();
    }
    next();
});

module.exports = mongoose.model('GameClass', gameClassSchema);