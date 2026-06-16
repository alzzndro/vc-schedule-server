import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log("⏳ Initializing database schema...");

    // 1. Create extension for range checks and UUIDs
    await client.query(`CREATE EXTENSION IF NOT EXISTS btree_gist;`);

    // 2. Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'public')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 3. Create rooms table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        capacity INTEGER DEFAULT 30,
        type VARCHAR(50) DEFAULT 'Regular',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 4. Create sections table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Seed Default Section if it doesn't exist
    const defaultSectionCheck = await client.query(`SELECT id FROM sections WHERE name = $1`, ["Default Section"]);
    let defaultSectionId: string;
    if (defaultSectionCheck.rows.length === 0) {
      const defaultSecRes = await client.query(`
        INSERT INTO sections (name)
        VALUES ($1)
        RETURNING id
      `, ["Default Section"]);
      defaultSectionId = defaultSecRes.rows[0].id;
      console.log("✅ Seeded default section: Default Section");
    } else {
      defaultSectionId = defaultSectionCheck.rows[0].id;
    }

    // 5. Create schedules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
        subject VARCHAR(255) NOT NULL,
        teacher VARCHAR(255) NOT NULL,
        day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 6), -- 1=Mon, 6=Sat
        start_time TIME NOT NULL CHECK (start_time >= '07:00:00' AND start_time <= '21:00:00'),
        end_time TIME NOT NULL CHECK (end_time > start_time AND end_time <= '21:00:00'),
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Perform safe migration for schedules to add section_id
    const sectionIdCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'schedules' AND column_name = 'section_id'
    `);

    if (sectionIdCheck.rows.length === 0) {
      console.log("⏳ Migrating schedules table: adding section_id...");
      // Add section_id as nullable first
      await client.query(`ALTER TABLE schedules ADD COLUMN section_id UUID;`);
      
      // Set existing rows to point to default section
      await client.query(`UPDATE schedules SET section_id = $1 WHERE section_id IS NULL;`, [defaultSectionId]);
      
      // Alter column to be NOT NULL
      await client.query(`ALTER TABLE schedules ALTER COLUMN section_id SET NOT NULL;`);
      
      // Add foreign key constraint
      await client.query(`
        ALTER TABLE schedules 
        ADD CONSTRAINT schedules_section_id_fkey 
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE;
      `);
      console.log("✅ Migration successful: section_id column added to schedules table.");
    }

    // Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_schedules_room_day ON schedules(room_id, day_of_week);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_schedules_section_day ON schedules(section_id, day_of_week);`);

    // 5. Check if admin exists, if not seed it
    const adminCheck = await client.query(`SELECT * FROM users WHERE email = $1`, ["admin@school.edu"]);
    if (adminCheck.rows.length === 0) {
      const adminPasswordHash = await bcrypt.hash("admin123", 10);
      await client.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5)
      `, ["admin@school.edu", adminPasswordHash, "System", "Admin", "admin"]);
      console.log("✅ Seeded admin user: admin@school.edu / admin123");
    }

    // 6. Check if rooms exist, if not seed a few
    const roomsCheck = await client.query(`SELECT * FROM rooms LIMIT 1`);
    if (roomsCheck.rows.length === 0) {
      const seededRooms = [
        { name: "Room 101", capacity: 40, type: "Regular Classroom" },
        { name: "Room 102", capacity: 35, type: "Regular Classroom" },
        { name: "Science Lab A", capacity: 25, type: "Laboratory" },
        { name: "Computer Lab B", capacity: 30, type: "Laboratory" },
        { name: "Grand Hall", capacity: 150, type: "Lecture Hall" },
      ];

      for (const room of seededRooms) {
        await client.query(`
          INSERT INTO rooms (name, capacity, type)
          VALUES ($1, $2, $3)
        `, [room.name, room.capacity, room.type]);
      }
      console.log("✅ Seeded default classrooms");
    }

    console.log("🎉 Database initialization completed successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
};

// Execute if run directly
seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
