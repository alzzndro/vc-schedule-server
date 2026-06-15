import { pool } from "../../config/db.js";
export class SchedulesRepository {
    static async findAll() {
        const result = await pool.query(`
      SELECT s.id, s.room_id, r.name as room_name, s.subject, s.teacher, 
             s.day_of_week, s.start_time, s.end_time, s.created_by, s.created_at, s.updated_at
      FROM schedules s
      JOIN rooms r ON s.room_id = r.id
      ORDER BY s.day_of_week ASC, s.start_time ASC
    `);
        return result.rows;
    }
    static async findById(id) {
        const result = await pool.query(`SELECT s.id, s.room_id, r.name as room_name, s.subject, s.teacher, 
              s.day_of_week, s.start_time, s.end_time, s.created_by, s.created_at, s.updated_at
       FROM schedules s
       JOIN rooms r ON s.room_id = r.id
       WHERE s.id = $1`, [id]);
        return result.rows[0] || null;
    }
    static async findByRoomId(roomId) {
        const result = await pool.query(`SELECT s.id, s.room_id, r.name as room_name, s.subject, s.teacher, 
              s.day_of_week, s.start_time, s.end_time, s.created_by, s.created_at, s.updated_at
       FROM schedules s
       JOIN rooms r ON s.room_id = r.id
       WHERE s.room_id = $1
       ORDER BY s.day_of_week ASC, s.start_time ASC`, [roomId]);
        return result.rows;
    }
    static async findOverlapping(roomId, dayOfWeek, startTime, endTime, excludeScheduleId = null) {
        const query = `
      SELECT s.id, s.room_id, r.name as room_name, s.subject, s.teacher, 
             s.day_of_week, s.start_time, s.end_time
      FROM schedules s
      JOIN rooms r ON s.room_id = r.id
      WHERE s.room_id = $1
        AND s.day_of_week = $2
        AND (s.start_time < $4::TIME AND s.end_time > $3::TIME)
        AND ($5::UUID IS NULL OR s.id != $5::UUID)
    `;
        const result = await pool.query(query, [
            roomId,
            dayOfWeek,
            startTime,
            endTime,
            excludeScheduleId,
        ]);
        return result.rows;
    }
    static async create(data) {
        const { room_id, subject, teacher, day_of_week, start_time, end_time, created_by } = data;
        const result = await pool.query(`INSERT INTO schedules (room_id, subject, teacher, day_of_week, start_time, end_time, created_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id, room_id, subject, teacher, day_of_week, start_time, end_time, created_by, created_at, updated_at`, [room_id, subject, teacher, day_of_week, start_time, end_time, created_by]);
        return result.rows[0];
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        if (data.room_id !== undefined) {
            fields.push(`room_id = $${idx++}`);
            values.push(data.room_id);
        }
        if (data.subject !== undefined) {
            fields.push(`subject = $${idx++}`);
            values.push(data.subject);
        }
        if (data.teacher !== undefined) {
            fields.push(`teacher = $${idx++}`);
            values.push(data.teacher);
        }
        if (data.day_of_week !== undefined) {
            fields.push(`day_of_week = $${idx++}`);
            values.push(data.day_of_week);
        }
        if (data.start_time !== undefined) {
            fields.push(`start_time = $${idx++}`);
            values.push(data.start_time);
        }
        if (data.end_time !== undefined) {
            fields.push(`end_time = $${idx++}`);
            values.push(data.end_time);
        }
        if (fields.length === 0) {
            return this.findById(id);
        }
        values.push(id);
        const query = `
      UPDATE schedules
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING id, room_id, subject, teacher, day_of_week, start_time, end_time, created_by, created_at, updated_at
    `;
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const result = await pool.query(`DELETE FROM schedules WHERE id = $1`, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
//# sourceMappingURL=schedules.repository.js.map