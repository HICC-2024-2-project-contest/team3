import express from "express";
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
router.post("", createRule);
router.put("/:ruleId", updateRule);
router.delete("/:ruleId", deleteRule);

router.get("/:ruleId/events/:eventId", getEvent);
router.post("/:ruleId/events", createEvent);
router.put("/:ruleId/events/:eventId", updateEvent);
router.delete("/:ruleId/events/:eventId", deleteEvent);

router.get("/:ruleId/judges/:judgeId", getJudge);
router.post("/:ruleId/judges", createJudge);
router.put("/:ruleId/judges/:judgeId", updateJudge);
router.delete("/:ruleId/judges/:judgeId", deleteJudge);

router.get("/:ruleId/classes/:classId", getClass);
router.post("/:ruleId/classes", createClass);
router.put("/:ruleId/classes/:classId", updateClass);
router.delete("/:ruleId/classes/:classId", deleteClass);

router.get("/:ruleId/endings/:endingId", getEnding);
router.post("/:ruleId/endings", createEnding);
router.put("/:ruleId/endings/:endingId", updateEnding);
router.delete("/:ruleId/endings/:endingId", deleteEnding);

router.get("/:ruleId/entities/:entityId", getEntity);
router.post("/:ruleId/entities", createEntity);
router.put("/:ruleId/entities/:entityId", updateEntity);
router.delete("/:ruleId/entities/:entityId", deleteEntity);

export default router;
