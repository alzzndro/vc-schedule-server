import { pool } from "../../config/db.js";
export class UsersRepository {
    static async findAll() {
        const result = await pool.query(`
      SELECT id, email, first_name, last_name, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);
        return result.rows;
    }
    static async findByEmail(email) {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
            email,
        ]);
        return result.rows[0];
    }
    static async findById(userId) {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
            userId,
        ]);
        return result.rows[0];
    }
    static async create(userData) {
        const { email, passwordHash, firstName, lastName, role } = userData;
        const result = await pool.query(`INSERT INTO users (email, password_hash, first_name, last_name, role, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, email, first_name, last_name, role, created_at, updated_at`, [email, passwordHash, firstName, lastName, role]);
        return result.rows[0];
    }
    static async updateProfile(userId, data) {
        const { firstName, lastName } = data;
        const result = await pool.query(`UPDATE users 
       SET first_name = $1, last_name = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, email, first_name, last_name, role, created_at, updated_at`, [firstName, lastName, userId]);
        return result.rows[0];
    }
    static async updatePassword(userId, passwordHash) {
        const result = await pool.query(`UPDATE users 
       SET password_hash = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id`, [passwordHash, userId]);
        return result.rows[0];
    }
}
//# sourceMappingURL=users.repository.js.map