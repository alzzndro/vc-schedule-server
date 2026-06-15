import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_fallback";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_fallback";

export interface TokenPayload {
  userId: string;
  role?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn:
      (process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]) || "15m",
  };

  // We cast payload as an object to satisfy overload signatures cleanly
  return jwt.sign({ ...payload }, ACCESS_SECRET, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn:
      (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]) || "7d",
  };

  return jwt.sign({ ...payload }, REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};
