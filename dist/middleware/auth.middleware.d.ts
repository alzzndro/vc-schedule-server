import type { Request, Response, NextFunction } from "express";
export declare const authenticateUser: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Role authorization guard.
 * @param allowedRoles - An array of strings representing the roles permitted to access the route.
 */
export declare const authorizeRoles: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
