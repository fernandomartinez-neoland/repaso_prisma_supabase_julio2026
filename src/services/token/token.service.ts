// importaciones
import jwt from "jsonwebtoken";
import "dotenv/config";

export function createToken(info: {}) {
  const tokenKey = process.env.tokenkey!;
  return jwt.sign({ data: info }, tokenKey, { expiresIn: "1m" });
}
