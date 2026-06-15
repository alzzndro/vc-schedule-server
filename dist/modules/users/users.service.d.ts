export declare class UsersService {
    static getAllUsers(): Promise<any[]>;
    static getUserById(id: string): Promise<any>;
    static updateProfile(userId: string, data: {
        firstName: string;
        lastName: string;
    }): Promise<any>;
    static updatePassword(userId: string, data: {
        currentPass: string;
        newPass: string;
    }): Promise<void>;
}
