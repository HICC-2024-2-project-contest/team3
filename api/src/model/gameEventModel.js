const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gameEventSchema = mongoose.Schema({
    eventId: { type: String, required: true, unique: true },
    ruleId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },

    trigger: { type: String, required: true },


    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});