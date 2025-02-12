import { evaluateExpression } from "./evaluator.js";

async function isLiteral(node) {
    return node.type === "Literal";
}

async function executeBlock(node, context) {
    const command = node.command;
    const args = await Promise.all(
        node.arguments.map((arg) => evaluateExpression(arg, context))
    );

    switch (command) {
        case "calculate": {
            let [left, right] = args;
            if (!(isLiteral(left) && isLiteral(right))) {
                throw new Error("Both arguments must be literals");
            }
            left = evaluateExpression(left, context);
            right = evaluateExpression(right, context);
            const operator = node.operator;
            switch (operator) {
                case "+":
                    return left + right;
                case "-":
                    return left - right;
                case "*":
                    return left * right;
                case "/":
                    return left / right;
                case "%":
                    return left % right;
                case "^":
                    return Math.pow(left, right);
                case "//":
                    return Math.floor(left / right);
                default:
                    throw new Error(`Unknown operator: ${operator}`);
            }
        }
        case "flagMake": {
            let [flagName, flagValue] = args;
            if (!isLiteral(flagName))
                throw new Error("Flag name must be a literal");

            flagName = evaluateExpression(flagName, context);
            flagValue = evaluateExpression(flagValue, context);
            context.flags = context.flags || {};
            context.flags[flagName] = flagValue;
            return flagValue;
        }
        case "flagDestroy": {
            let [flagName] = args;
            if (!isLiteral(flagName))
                throw new Error("Flag name must be a literal");

            flagName = evaluateExpression(flagName, context);
            if (!context.flags || !context.flags[flagName]) {
                throw new Error(`Flag ${flagName} is not defined`);
            }
            delete context.flags[flagName];
            return null;
        }
        case "flag": {
            let [flagName] = args;
            if (!isLiteral(flagName))
                throw new Error("Flag name must be a literal");
            flagName = evaluateExpression(flagName, context);
            if (!context.flags || !context.flags[flagName]) {
                throw new Error(`Flag ${flagName} is not defined`);
            }
            return context.flags[flagName];
        }
        // TODO: Prototype Pollution Defense
        case "change": {
            // Ex: change global.foo.bar 3 -> global.foo.bar = 3 / change flag.foo 3 -> flag.foo = 3
            let [variableName, value] = args;
            if (!isLiteral(variableName))
                throw new Error("Variable name must be a literal");
            variableName = evaluateExpression(variableName, context);
            value = evaluateExpression(value, context);
            // Global 프로퍼티로 접근할 경우
            context.Global = context.Global || {};
            if (variableName.startsWith("global.")) {
                variableName.split(".").reduce((obj, key, index, arr) => {
                    if (index === arr.length - 1) {
                        obj[key] = value;
                    } else {
                        obj[key] = obj[key] || {};
                    }
                    return obj[key];
                }, context);
            }
            // flag로 만든 변수일 경우
            context.flags = context.flags || {};
            variableName.split(".").reduce((obj, key, index, arr) => {
                if (index === arr.length - 1) {
                    obj[key] = value;
                } else {
                    obj[key] = obj[key] || {};
                }
                return obj[key];
            }, context.flags);
        }
        case "arrayAdd": {
            let [array, value, number] = args;
            array = evaluateExpression(arrayName, context);
            value = evaluateExpression(value, context);
            number = evaluateExpression(number, context);
            if (!Array.isArray(array)) {
                throw new Error(`Variable ${arrayName} is not an array`);
            }
            array.splice(number, 0, value);
            return array;
        }
        case "arrayRemove": {
            let [array, number] = args;
            array = evaluateExpression(arrayName, context);
            number = evaluateExpression(number, context);
            if (number < 0 || number >= array.length) {
                throw new Error(`Index ${number} is out of bounds`);
            }
            if (!Array.isArray(array)) {
                throw new Error(`Variable ${arrayName} is not an array`);
            }
            array.splice(number, 1);
            return array;
        }
    }
}

export { executeBlock };
