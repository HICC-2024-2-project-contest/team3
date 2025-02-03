import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import redis from "redis";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { redisConfig, mongoConfig } from "../config/database.js";
import gameRule from "../model/gameRuleModel.js";
import gameEvent from "../model/gameEventModel.js";
import gameJudge from "../model/gameJudgeModel.js";
import gameClass from "../model/gameClassModel.js";
import gameEnding from "../model/gameEndingModel.js";

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
        const rule = await gameRule.findOne({ ruleId });
        if (!rule) {
            return res.status(404).json({ message: "Rule not found" });
        }

        return res.status(200).json(rule);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Rule 생성
export const createRule = async (req, res) => {
    try {
        const {
            title,
            description,
            background,
            additionalInformation,
            eventList,
            judgeList,
            classList,
            endingList,
            exampleScenarios,
            isPublic,
            isPublished,
        } = req.body;

        // 필수 필드 체크 (예: title, additionalInformation)
        if (!title || !additionalInformation) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newRule = new GameRule({
            title,
            description,
            background,
            additionalInformation,
            eventList,
            judgeList,
            classList,
            endingList,
            exampleScenarios,
            isPublic,
            isPublished,
            // 작성자는 JWT 토큰의 userId 사용
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

// Rule 업데이트
export const updateRule = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const rule = await GameRule.findOne({ ruleId });
        if (!rule) return res.status(404).json({ message: "Rule not found" });

        // 작성자(authorId)와 요청자(userId)가 일치하는지 확인
        if (rule.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const {
            title,
            description,
            background,
            additionalInformation,
            eventList,
            judgeList,
            classList,
            endingList,
            exampleScenarios,
            isPublic,
            isPublished,
        } = req.body;

        // 전달된 필드만 업데이트
        if (title !== undefined) rule.title = title;
        if (description !== undefined) rule.description = description;
        if (background !== undefined) rule.background = background;
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
        // updatedAt은 timestamps 옵션에 의해 자동 관리되지만 직접 갱신도 가능
        rule.updatedAt = Date.now();

        await rule.save();
        return res.status(200).json({ message: "Rule updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Rule 삭제
export const deleteRule = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const rule = await GameRule.findOne({ ruleId });
        if (!rule) return res.status(404).json({ message: "Rule not found" });

        // 작성자(authorId)와 요청자(userId) 체크
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

// ──────────────────────────────
// Event 관련 Controller 함수
// ──────────────────────────────

// Event 조회
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

// Event 생성
export const createEvent = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const { title, description, triggerTree, executeTree } = req.body;

        // 필수 필드 체크
        if (!title || !triggerTree || !executeTree) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 해당 Rule이 존재하는지, 그리고 요청한 사용자가 Rule 작성자인지 확인
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

// Event 업데이트
export const updateEvent = async (req, res) => {
    try {
        const { ruleId, eventId } = req.params;
        const event = await GameEvent.findOne({ ruleId, eventId });
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Event 수정 권한 체크: 해당 Rule의 작성자여야 함
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

// Event 삭제
export const deleteEvent = async (req, res) => {
    try {
        const { ruleId, eventId } = req.params;
        const event = await GameEvent.findOne({ ruleId, eventId });
        if (!event) return res.status(404).json({ message: "Event not found" });

        // 삭제 권한 체크: Rule의 작성자여야 함
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
