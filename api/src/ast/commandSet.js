import { executeBlock } from "./executeBlock.js";
import { evaluateExpression } from "./evaluator.js";
import { utilBlock } from "./utilBlock.js";

async function executeCommandSet(commandSetNode, context) {
    for (const node of commandSetNode.commands) {
        if (node.block) {
            const block = node.block;
            switch (block.type) {
                case "LogicBlock":
                    if (
                        !(await evaluateExpression(block.expression, context))
                    ) {
                        return false;
                    }
                    break;
                case "ExecuteBlock":
                    await executeBlock(block, context);
                    break;
                case "UtilBlock":
                    await utilBlock(block, context);
                    break;
                default:
                    throw new Error(`Unknown block type: ${block.type}`);
            }
        }
    }
    return true;
}

export { executeCommandSet };
