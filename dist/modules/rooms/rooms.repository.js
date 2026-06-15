import { pool } from "../../config/db.js";
export class RoomsRepository {
    static async findAll() {
        const result = await pool.query(`
      SELECT id, name, capacity, type, created_at, updated_at
      FROM rooms
      ORDER BY name ASC
    `);
        return result.rows;
    }
    static async findById(id) {
        const result = await pool.query(`SELECT id, name, capacity, type, created_at, updated_at FROM rooms WHERE id = $1`, [id]);
        return result.rows[0] || null;
    }
    static async findByName(name) {
        const result = await pool.query(`SELECT id, name, capacity, type, created_at, updated_at FROM rooms WHERE name = $1`, [name]);
        return result.rows[0] || null;
    }
    static async create(data) {
        const { name, capacity = 30, type = "Regular" } = data;
        const result = await pool.query(`INSERT INTO rooms (name, capacity, type, updated_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, name, capacity, type, created_at, updated_at`, [name, capacity, type]);
        return result.rows[0];
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        if (data.name !== undefined) {
            fields.push(`name = $${idx++}`);
            values.push(data.name);
        }
        if (data.capacity !== undefined) {
            fields.push(`capacity = $${idx++}`);
            values.push(data.capacity);
        }
        if (data.type !== undefined) {
            fields.push(`type = $${idx++}`);
            values.push(data.type);
        }
        if (fields.length === 0) {
            return this.findById(id);
        }
        values.push(id);
        const query = `
      UPDATE rooms
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING id, name, capacity, type, created_at, updated_at
    `;
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const result = await pool.query(`DELETE FROM rooms WHERE id = $1`, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
//# sourceMappingURL=rooms.repository.js.map