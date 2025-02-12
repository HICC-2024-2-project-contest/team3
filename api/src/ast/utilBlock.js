import { evaluateExpression } from "./evaluator.js";
import { executeCommandSet } from "./commandSet.js";
import { LLMCall } from "../utils/LLMCall.js";

async function utilBlock(node, context) {
    const command = node.command;
    const args = await Promise.all(
        node.arguments.map((arg) => evaluateExpression(arg, context))
    );

    switch (command) {
        case "random": {
            const array = evaluateExpression(args[0], context);
            if (!Array.isArray(array)) {
                throw new Error(`Variable ${array} is not an array`);
            }
            return array[Math.floor(Math.random() * array.length)];
        }
        case "gameDiceRoll": {
            const sides = evaluateExpression(args[0], context);
            return Math.floor(Math.random() * sides) + 1;
        }
        case "gameAlert": {
            const message = evaluateExpression(args[0], context);
            return message;
        }
        case "gameRandom": {
            const array = evaluateExpression(args[0], context);
            if (!Array.isArray(array)) {
                throw new Error(`Variable ${array} is not an array`);
            }
            return array[Math.floor(Math.random() * array.length)];
        }
        case "min": {
            const value = evaluateExpression(args[0], context);
            if (!Array.isArray(value)) {
                throw new Error(`Variable ${value} is not an array`);
            }
            return Math.min(...value);
        }
        case "max": {
            const value = evaluateExpression(args[0], context);
            if (!Array.isArray(value)) {
                throw new Error(`Variable ${value} is not an array`);
            }
            return Math.max(...value);
        }
        case "length": {
            const value = args[0];
            if (!Array.isArray(value)) {
                throw new Error(`Variable ${value} is not an array`);
            }
            return value.length;
        }
        case "while": {
            while (evaluateExpression(node.condition, context)) {
                try {
                    await executeCommandSet(node.body, context);
                } catch (e) {
                    if (e === "break") {
                        break;
                    }
                    if (e === "continue") {
                        continue;
                    }
                    throw e;
                }
                return null;
            }
        }
        case "if": {
            if (evaluateExpression(node.condition, context)) {
                await executeCommandSet(node.body, context);
            } else if (node.elseBody) {
                await executeCommandSet(node.elseBody, context);
            }
            return null;
        }
        case "LLMCall": {
            const prompt = evaluateExpression(args[0], context);
            const response = await LLMCall(prompt);
            return response;
        }
        case "StringToNumber": {
            const value = evaluateExpression(args[0], context);
            return Number(value);
        }
        case "NumberToString": {
            const value = evaluateExpression(args[0], context);
            return String(value);
        }
        case "StringToBoolean": {
            const value = evaluateExpression(args[0], context);
            return Boolean(value);
        }
        case "BooleanToString": {
            const value = evaluateExpression(args[0], context);
            return String(value);
        }
        default:
            throw new Error(`Unknown command: ${command}`);
    }
}

export { utilBlock };
