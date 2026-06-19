import { pool } from "../../config/db.js";
import { Instructor, CreateInstructorInput, UpdateInstructorInput } from "./instructors.types.js";

export class InstructorsRepository {
  static async findAll(): Promise<Instructor[]> {
    const result = await pool.query(`
      SELECT id, name, created_at, updated_at
      FROM instructors
      ORDER BY name ASC
    `);
    return result.rows;
  }

  static async findById(id: string): Promise<Instructor | null> {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at FROM instructors WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<Instructor | null> {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at FROM instructors WHERE name = $1`,
      [name]
    );
    return result.rows[0] || null;
  }

  static async create(data: CreateInstructorInput): Promise<Instructor> {
    const { name } = data;
    const result = await pool.query(
      `INSERT INTO instructors (name, updated_at)
       VALUES ($1, NOW())
       RETURNING id, name, created_at, updated_at`,
      [name]
    );
    return result.rows[0];
  }

  static async update(id: string, data: UpdateInstructorInput): Promise<Instructor | null> {
    const { name } = data;
    const result = await pool.query(
      `UPDATE instructors
       SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, created_at, updated_at`,
      [name, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM instructors WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
