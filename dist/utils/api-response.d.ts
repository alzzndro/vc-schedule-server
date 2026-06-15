export declare class ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
    constructor({ success, message, data, meta, }: {
        success?: boolean;
        message: string;
        data?: T;
        meta?: Record<string, unknown>;
    });
}
