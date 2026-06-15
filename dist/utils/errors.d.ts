export declare class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    details?: unknown;
    constructor(message: string, statusCode?: number, details?: unknown);
}
export declare const badRequest: (msg?: string, details?: unknown) => ApiError;
export declare const unauthorized: (msg?: string) => ApiError;
export declare const forbidden: (msg?: string) => ApiError;
export declare const notFound: (msg?: string) => ApiError;
