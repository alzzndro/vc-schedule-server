export declare class AuthService {
    /**
     * Register a new user
     */
    static register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
    }): Promise<any>;
    /**
     * Validate credentials for user login
     */
    static login(email: string, password: string): Promise<any>;
}
