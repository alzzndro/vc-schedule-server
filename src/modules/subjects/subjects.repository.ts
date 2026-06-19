import { pool } from "../../config/db.js";
import { Subject, CreateSubjectInput, UpdateSubjectInput } from "./subjects.types.js";

export class SubjectsRepository {
  static async findAll(): Promise<Subject[]> {
    const result = await pool.query(`
      SELECT id, name, created_at, updated_at
      FROM subjects
      ORDER BY name ASC
    `);
    return result.rows;
  }

  static async findById(id: string): Promise<Subject | null> {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at FROM subjects WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<Subject | null> {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at FROM subjects WHERE name = $1`,
      [name]
    );
    return result.rows[0] || null;
  }

  static async create(data: CreateSubjectInput): Promise<Subject> {
    const { name } = data;
    const result = await pool.query(
      `INSERT INTO subjects (name, updated_at)
       VALUES ($1, NOW())
       RETURNING id, name, created_at, updated_at`,
      [name]
    );
    return result.rows[0];
  }

  static async update(id: string, data: UpdateSubjectInput): Promise<Subject | null> {
    const { name } = data;
    const result = await pool.query(
      `UPDATE subjects
       SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, created_at, updated_at`,
      [name, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM subjects WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
