// routes/gameRoutes.js
import express from "express";
import {
    // Rule 관련 컨트롤러 함수
    getRule,
    createRule,
    updateRule,
    deleteRule,
    // Event 관련 컨트롤러 함수
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    // Judge 관련 컨트롤러 함수
    getJudge,
    createJudge,
    updateJudge,
    deleteJudge,
    // Class 관련 컨트롤러 함수
    getClass,
    createClass,
    updateClass,
    deleteClass,
    // Ending 관련 컨트롤러 함수
    getEnding,
    createEnding,
    updateEnding,
    deleteEnding,
    // Entity 관련 컨트롤러 함수
    getEntity,
    createEntity,
    updateEntity,
    deleteEntity,
} from "../controllers/gameController.js"; // 실제 컨트롤러 파일 경로로 수정

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
