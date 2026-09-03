// importaciones
import jwt from "jsonwebtoken";
import "dotenv/config";
const tokenKey = process.env.tokenkey;
export function createToken(info) {
    return jwt.sign({ data: info }, tokenKey, { expiresIn: "20m" });
}
export function verifyToken(token) {
    return jwt.verify(token, tokenKey);
}
