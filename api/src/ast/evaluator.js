async function evaluateExpression(node, context) {
    switch (node.type) {
        case "Literal":
            return node.value;
        case "Identifier":
            return resolveIdentifier(node.value, context);
        case "BinaryExpression": {
            const left = evaluateExpression(node.left, context);
            const right = evaluateExpression(node.right, context);
            return evaluateBinary(node.operator, left, right);
        }
        case "UnaryExpression": {
            const operand = evaluateExpression(node.operand, context);
            return evaluateUnary(node.operator, operand);
        }
        default:
            throw new Error(`Unknown expression type: ${node.type}`);
    }
}

async function resolveIdentifier(identifier, context) {
    if (identifier.startsWith("global.")) {
        return identifier.split(".").reduce((obj, key) => obj[key], context);
    }
    return identifier.split(".").reduce((obj, key) => obj[key], context.flags);
}

async function evaluateBinary(operator, left, right) {
    switch (operator) {
        case "==":
            return left === right;
        case "!=":
            return left !== right;
        case ">":
            return left > right;
        case "<":
            return left < right;
        case ">=":
            return left >= right;
        case "<=":
            return left <= right;
        case "AND":
            return left && right;
        case "OR":
            return left || right;
        case "+":
            return left + right;
        case "-":
            return left - right;
        default:
            throw new Error(`Unknown binary operator: ${operator}`);
    }
}

async function evaluateUnary(operator, operand) {
    switch (operator) {
        case "NOT":
            return !operand;
        default:
            throw new Error(`Unknown unary operator: ${operator}`);
    }
}

export { evaluateExpression };
