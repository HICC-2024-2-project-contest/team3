import express from "express";
import { authenticate } from "../utils/authenticater.js";
import {
    getRule,
    createRule,
    updateRule,
    deleteRule,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getJudge,
    createJudge,
    updateJudge,
    deleteJudge,
    getClass,
    createClass,
    updateClass,
    deleteClass,
    getEnding,
    createEnding,
    updateEnding,
    deleteEnding,
    getEntity,
    createEntity,
    updateEntity,
    deleteEntity,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/:ruleId", getRule);
router.post("", authenticate, createRule);
router.put("/:ruleId", authenticate, updateRule);
router.delete("/:ruleId", authenticate, deleteRule);

router.get("/:ruleId/events/:eventId", getEvent);
router.post("/:ruleId/events", authenticate, createEvent);
router.put("/:ruleId/events/:eventId", authenticate, updateEvent);
router.delete("/:ruleId/events/:eventId", authenticate, deleteEvent);

router.get("/:ruleId/judges/:judgeId", getJudge);
router.post("/:ruleId/judges", authenticate, createJudge);
router.put("/:ruleId/judges/:judgeId", authenticate, updateJudge);
router.delete("/:ruleId/judges/:judgeId", authenticate, deleteJudge);

router.get("/:ruleId/classes/:classId", getClass);
router.post("/:ruleId/classes", authenticate, createClass);
router.put("/:ruleId/classes/:classId", authenticate, updateClass);
router.delete("/:ruleId/classes/:classId", authenticate, deleteClass);

router.get("/:ruleId/endings/:endingId", getEnding);
router.post("/:ruleId/endings", authenticate, createEnding);
router.put("/:ruleId/endings/:endingId", authenticate, updateEnding);
router.delete("/:ruleId/endings/:endingId", authenticate, deleteEnding);

router.get("/:ruleId/entities/:entityId", getEntity);
router.post("/:ruleId/entities", authenticate, createEntity);
router.put("/:ruleId/entities/:entityId", authenticate, updateEntity);
router.delete("/:ruleId/entities/:entityId", authenticate, deleteEntity);

export default router;
