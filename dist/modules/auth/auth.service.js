import bcrypt from "bcrypt";
import { UsersRepository } from "../users/users.repository.js";
import { ApiError } from "../../utils/errors.js";
const SALT_ROUNDS = 10;
export class AuthService {
    /**
     * Register a new user
     */
    static async register(data) {
        // 1. Check if the email is already registered
        const existingUser = await UsersRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ApiError("A user with this email already exists", 400);
        }
        // 2. Hash the raw password strings securely
        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
        // 3. Save to database using the repository layer
        const newUser = await UsersRepository.create({
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
        });
        return newUser;
    }
    /**
     * Validate credentials for user login
     */
    static async login(email, password) {
        // 1. Find user by email
        const user = await UsersRepository.findByEmail(email);
        if (!user) {
            // Security Tip: Generic message prevents user enumeration attacks
            throw new ApiError("Invalid email or password credentials", 401);
        }
        // 2. Compare incoming raw password against stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new ApiError("Invalid email or password credentials", 401);
        }
        // 3. Sanitize user object (remove the password hash from memory)
        const { password_hash: _, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
//# sourceMappingURL=auth.service.js.map