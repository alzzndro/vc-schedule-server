import { UsersRepository } from "./users.repository.js";
import { notFound } from "../../utils/errors.js";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/errors.js";
const saltRounds = process.env.SALT_ROUNDS || 10;
export class UsersService {
    static async getAllUsers() {
        return UsersRepository.findAll();
    }
    static async getUserById(id) {
        const user = await UsersRepository.findById(id);
        if (!user) {
            throw notFound("User not found");
        }
        return user;
    }
    static async updateProfile(userId, data) {
        // Verify user exists first
        await this.getUserById(userId);
        return UsersRepository.updateProfile(userId, data);
    }
    static async updatePassword(userId, data) {
        const user = await this.getUserById(userId);
        // 1. Verify the current password matches what's in the database
        const isMatch = await bcrypt.compare(data.currentPass, user.password_hash);
        if (!isMatch) {
            throw new ApiError("The current password you provided is incorrect", 400);
        }
        // 2. Hash the new password string securely
        const hashedNewPassword = await bcrypt.hash(data.newPass, saltRounds);
        // 3. Commit update
        await UsersRepository.updatePassword(userId, hashedNewPassword);
    }
}
//# sourceMappingURL=users.service.js.map