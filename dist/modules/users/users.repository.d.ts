export declare class UsersRepository {
    static findAll(): Promise<any[]>;
    static findByEmail(email: string): Promise<any>;
    static findById(userId: string): Promise<any>;
    static create(userData: {
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        role: string;
    }): Promise<any>;
    static updateProfile(userId: string, data: {
        firstName: string;
        lastName: string;
    }): Promise<any>;
    static updatePassword(userId: string, passwordHash: string): Promise<any>;
}
