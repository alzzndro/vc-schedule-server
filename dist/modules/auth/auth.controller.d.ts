import type { Request, Response } from "express";
export declare const registerHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const loginHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const logoutHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const refreshTokensHandler: (req: Request, res: Response) => void;
