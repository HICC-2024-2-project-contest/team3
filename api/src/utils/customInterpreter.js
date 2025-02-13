/* AST Interpreter for custom language */
/*
Sample AST:
{
  type: "Program",
  body: [
    // 예: Trigger를 위한 LogicBlock Statement
    {
      type: "Statement",
      block: {
        type: "LogicBlock",
        expression: {
          // 예시: score >= 100 인지 체크
          type: "BinaryExpression",
          operator: ">=",
          left: { type: "Identifier", value: "Global.score" },
          right: { type: "Literal", value: 100 }
        }
      }
    },
    // 조건이 만족되었을 때 실행할 ExecuteBlock 및 UtilBlock Statement
    {
      type: "Statement",
      block: {
        type: "ExecuteBlock",
        command: "flag make",
        arguments: [
          { type: "Literal", value: "levelUp" },
          { type: "Literal", value: true }
        ]
      }
    },
    {
      type: "Statement",
      block: {
        type: "UtilBlock",
        command: "gameAlert",
        arguments: [
          { type: "Literal", value: "축하합니다! 레벨 업 하셨습니다." }
        ]
      }
    }
    // 기타 추가 Statement들...
  ]
}
*/

import mongoose from "mongoose";

async function evaluateExpression(node, context) {
    switch (node.type) {
        case "BinaryExpression":
            const left = await evaluateExpression(node.left, context);
            const right = await evaluateExpression(node.right, context);
            switch (node.operator) {
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
                case "&&":
                    return left && right;
                case "||":
                    return left || right;
            }
            break;
        case "Identifier":
            return context[node.value];
        case "Literal":
            return node.value;
    }
}
