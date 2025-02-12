import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Authorization header missing" });
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Authorization header format must be: Bearer <token>",
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token)
        return res
            .status(401)
            .json({ error: "Token missing in authorization header" });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(401).json({ error: "Invalid token" });
    }
};

export default authenticate;
