import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import redis from "redis";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { redisConfig, mongoConfig } from "../config/database.js";
import GameRule from "../model/gameRuleModel.js";
import GameEvent from "../model/gameEventModel.js";
import GameJudge from "../model/gameJudgeModel.js";
import GameClass from "../model/gameClassModel.js";
import GameEnding from "../model/gameEndingModel.js";
import GameEntity from "../model/gameEntityModel.js";

const redisClient = redis.createClient(redisConfig);
(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis connection error:", error);
    }
})();

mongoose
    .connect(mongoConfig.uri, mongoConfig.options)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

export const getRule = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const rule = await GameRule.findOne({ ruleId });
        if (!rule) {
            return res.status(404).json({ message: "Rule not found" });
        }

        return res.status(200).json(rule);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createRule = async (req, res) => {
    try {
        const {
            title,
            description,
            background,
            globalVariables,
            customEntityConfig,
            customItemConfig,
            additionalInformation,
            eventList,
            judgeList,
            classList,
            endingList,
            exampleScenarios,
            isPublic,
            isPublished,
        } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newRule = new GameRule({
            ruleId: uuidv4(),
            title,
            description,
            background,
            globalVariables,
            customEntityConfig,
            customItemConfig,
            additionalInformation,
            eventList,
            judgeList,
            classList,
            endingList,
            exampleScenarios,
            isPublic,
            isPublished,
            authorId: req.user.userId,
        });
        await newRule.save();
        return res.status(201).json({
            message: "Rule created successfully",
            ruleId: newRule.ruleId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateRule = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const rule = await GameRule.findOne({ ruleId });
        if (!rule) return res.status(404).json({ message: "Rule not found" });

        if (rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const {
            title,
            description,
            background,
            globalVariables,
            customEntityConfig,
            customItemConfig,
            additionalInformation,
            eventList,
            judgeList,
            classList,
            endingList,
            exampleScenarios,
            isPublic,
            isPublished,
        } = req.body;

        if (title !== undefined) rule.title = title;
        if (description !== undefined) rule.description = description;
        if (background !== undefined) rule.background = background;
        if (globalVariables !== undefined)
            rule.globalVariables = globalVariables;
        if (customEntityConfig !== undefined)
            rule.customEntityConfig = customEntityConfig;
        if (customItemConfig !== undefined)
            rule.customItemConfig = customItemConfig;
        if (additionalInformation !== undefined)
            rule.additionalInformation = additionalInformation;
        if (eventList !== undefined) rule.eventList = eventList;
        if (judgeList !== undefined) rule.judgeList = judgeList;
        if (classList !== undefined) rule.classList = classList;
        if (endingList !== undefined) rule.endingList = endingList;
        if (exampleScenarios !== undefined)
            rule.exampleScenarios = exampleScenarios;
        if (isPublic !== undefined) rule.isPublic = isPublic;
        if (isPublished !== undefined) rule.isPublished = isPublished;
        rule.updatedAt = Date.now();

        await rule.save();
        return res.status(200).json({ message: "Rule updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteRule = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const rule = await GameRule.findOne({ ruleId });
        if (!rule) return res.status(404).json({ message: "Rule not found" });

        if (rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await GameRule.deleteOne({ ruleId });
        return res.status(200).json({ message: "Rule deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getEvent = async (req, res) => {
    try {
        const { ruleId, eventId } = req.params;
        const event = await GameEvent.findOne({ ruleId, eventId });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const { title, description, triggerTree, executeTree } = req.body;

        if (!title || !triggerTree || !executeTree) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const rule = await GameRule.findOne({ ruleId });
        if (!rule) return res.status(404).json({ message: "Rule not found" });
        if (rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const newEvent = new GameEvent({
            ruleId,
            title,
            description,
            triggerTree,
            executeTree,
        });
        await newEvent.save();
        return res.status(201).json({
            message: "Event created successfully",
            eventId: newEvent.eventId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { ruleId, eventId } = req.params;
        const event = await GameEvent.findOne({ ruleId, eventId });
        if (!event) return res.status(404).json({ message: "Event not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { title, description, triggerTree, executeTree } = req.body;
        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (triggerTree !== undefined) event.triggerTree = triggerTree;
        if (executeTree !== undefined) event.executeTree = executeTree;
        event.updatedAt = Date.now();

        await event.save();
        return res.status(200).json({ message: "Event updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { ruleId, eventId } = req.params;
        const event = await GameEvent.findOne({ ruleId, eventId });
        if (!event) return res.status(404).json({ message: "Event not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await GameEvent.deleteOne({ ruleId, eventId });
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getJudge = async (req, res) => {
    try {
        const { ruleId, judgeId } = req.params;
        const judge = await GameJudge.findOne({ ruleId, judgeId });
        if (!judge) {
            return res.status(404).json({ message: "Judge not found" });
        }
        return res.status(200).json(judge);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createJudge = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const { title, description, triggerDescription, executeTree } =
            req.body;

        if (!title || !triggerDescription || !executeTree) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const rule = await GameRule.findOne({ ruleId });
        if (!rule) return res.status(404).json({ message: "Rule not found" });
        if (rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const newJudge = new GameJudge({
            ruleId,
            title,
            description,
            triggerDescription,
            executeTree,
        });
        await newJudge.save();
        return res.status(201).json({
            message: "Judge created successfully",
            judgeId: newJudge.judgeId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateJudge = async (req, res) => {
    try {
        const { ruleId, judgeId } = req.params;
        const judge = await GameJudge.findOne({ ruleId, judgeId });
        if (!judge) return res.status(404).json({ message: "Judge not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { title, description, triggerDescription, executeTree } =
            req.body;
        if (title !== undefined) judge.title = title;
        if (description !== undefined) judge.description = description;
        if (triggerDescription !== undefined)
            judge.triggerDescription = triggerDescription;
        if (executeTree !== undefined) judge.executeTree = executeTree;
        judge.updatedAt = Date.now();

        await judge.save();
        return res.status(200).json({ message: "Judge updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteJudge = async (req, res) => {
    try {
        const { ruleId, judgeId } = req.params;
        const judge = await GameJudge.findOne({ ruleId, judgeId });
        if (!judge) return res.status(404).json({ message: "Judge not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await GameJudge.deleteOne({ ruleId, judgeId });
        return res.status(200).json({ message: "Judge deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getClass = async (req, res) => {
    try {
        const { ruleId, classId } = req.params;
        const classObj = await GameClass.findOne({ ruleId, classId });
        if (!classObj) {
            return res.status(404).json({ message: "Class not found" });
        }
        return res.status(200).json(classObj);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createClass = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const { title, description, status } = req.body;

        if (!title || !status) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const rule = await GameRule.findOne({ ruleId });
        if (!rule) return res.status(404).json({ message: "Rule not found" });
        if (rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const newClass = new GameClass({
            ruleId,
            title,
            description,
            status,
        });
        await newClass.save();
        return res.status(201).json({
            message: "Class created successfully",
            classId: newClass.classId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateClass = async (req, res) => {
    try {
        const { ruleId, classId } = req.params;
        const classObj = await GameClass.findOne({ ruleId, classId });
        if (!classObj)
            return res.status(404).json({ message: "Class not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { title, description, status } = req.body;
        if (title !== undefined) classObj.title = title;
        if (description !== undefined) classObj.description = description;
        if (status !== undefined) classObj.status = status;
        classObj.updatedAt = Date.now();

        await classObj.save();
        return res.status(200).json({ message: "Class updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteClass = async (req, res) => {
    try {
        const { ruleId, classId } = req.params;
        const classObj = await GameClass.findOne({ ruleId, classId });
        if (!classObj)
            return res.status(404).json({ message: "Class not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await GameClass.deleteOne({ ruleId, classId });
        return res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getEnding = async (req, res) => {
    try {
        const { ruleId, endingId } = req.params;
        const ending = await GameEnding.findOne({ ruleId, endingId });
        if (!ending) {
            return res.status(404).json({ message: "Ending not found" });
        }
        return res.status(200).json(ending);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createEnding = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const { title, description, triggerTree, executeTree } = req.body;

        if (!title || !triggerTree || !executeTree) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const rule = await GameRule.findOne({ ruleId });
        if (!rule) return res.status(404).json({ message: "Rule not found" });
        if (rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const newEnding = new GameEnding({
            ruleId,
            title,
            description,
            triggerTree,
            executeTree,
        });
        await newEnding.save();
        return res.status(201).json({
            message: "Ending created successfully",
            endingId: newEnding.endingId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateEnding = async (req, res) => {
    try {
        const { ruleId, endingId } = req.params;
        const ending = await GameEnding.findOne({ ruleId, endingId });
        if (!ending)
            return res.status(404).json({ message: "Ending not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { title, description, triggerTree, executeTree } = req.body;
        if (title !== undefined) ending.title = title;
        if (description !== undefined) ending.description = description;
        if (triggerTree !== undefined) ending.triggerTree = triggerTree;
        if (executeTree !== undefined) ending.executeTree = executeTree;
        ending.updatedAt = Date.now();

        await ending.save();
        return res.status(200).json({ message: "Ending updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteEnding = async (req, res) => {
    try {
        const { ruleId, endingId } = req.params;
        const ending = await GameEnding.findOne({ ruleId, endingId });
        if (!ending)
            return res.status(404).json({ message: "Ending not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await GameEnding.deleteOne({ ruleId, endingId });
        return res.status(200).json({ message: "Ending deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getEntity = async (req, res) => {
    try {
        const { ruleId, entityId } = req.params;
        const entity = await GameEntity.findOne({ ruleId, entityId });
        if (!entity) {
            return res.status(404).json({ message: "Entity not found" });
        }
        return res.status(200).json(entity);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createEntity = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const { title, description, status, inventory, equipment, isNPC } =
            req.body;

        if (!title || !status) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const rule = await GameRule.findOne({ ruleId });
        if (!rule) return res.status(404).json({ message: "Rule not found" });
        if (rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const newEntity = new GameEntity({
            ruleId,
            title,
            description,
            status,
            inventory,
            equipment,
            isNPC,
        });
        await newEntity.save();
        return res.status(201).json({
            message: "Entity created successfully",
            entityId: newEntity.entityId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateEntity = async (req, res) => {
    try {
        const { ruleId, entityId } = req.params;
        const entity = await GameEntity.findOne({ ruleId, entityId });
        if (!entity)
            return res.status(404).json({ message: "Entity not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { title, description, status, inventory, equipment, isNPC } =
            req.body;
        if (title !== undefined) entity.title = title;
        if (description !== undefined) entity.description = description;
        if (status !== undefined) entity.status = status;
        if (inventory !== undefined) entity.inventory = inventory;
        if (equipment !== undefined) entity.equipment = equipment;
        if (isNPC !== undefined) entity.isNPC = isNPC;
        entity.updatedAt = Date.now();

        await entity.save();
        return res.status(200).json({ message: "Entity updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteEntity = async (req, res) => {
    try {
        const { ruleId, entityId } = req.params;
        const entity = await GameEntity.findOne({ ruleId, entityId });
        if (!entity)
            return res.status(404).json({ message: "Entity not found" });

        const rule = await GameRule.findOne({ ruleId });
        if (!rule || rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await GameEntity.deleteOne({ ruleId, entityId });
        return res.status(200).json({ message: "Entity deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
