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

    // Create instructors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS instructors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create subjects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) UNIQUE NOT NULL,
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

    // Seed Default Instructor if it doesn't exist
    const defaultInstructorCheck = await client.query(`SELECT id FROM instructors WHERE name = $1`, ["Default Instructor"]);
    let defaultInstructorId: string;
    if (defaultInstructorCheck.rows.length === 0) {
      const defaultInstRes = await client.query(`
        INSERT INTO instructors (name)
        VALUES ($1)
        RETURNING id
      `, ["Default Instructor"]);
      defaultInstructorId = defaultInstRes.rows[0].id;
      console.log("✅ Seeded default instructor: Default Instructor");
    } else {
      defaultInstructorId = defaultInstructorCheck.rows[0].id;
    }

    // Seed Default Subject if it doesn't exist
    const defaultSubjectCheck = await client.query(`SELECT id FROM subjects WHERE name = $1`, ["Default Subject"]);
    let defaultSubjectId: string;
    if (defaultSubjectCheck.rows.length === 0) {
      const defaultSubjRes = await client.query(`
        INSERT INTO subjects (name)
        VALUES ($1)
        RETURNING id
      `, ["Default Subject"]);
      defaultSubjectId = defaultSubjRes.rows[0].id;
      console.log("✅ Seeded default subject: Default Subject");
    } else {
      defaultSubjectId = defaultSubjectCheck.rows[0].id;
    }

    // 5. Create schedules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
        section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
        instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE NOT NULL,
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
        day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 6), -- 1=Mon, 6=Sat
        start_time TIME NOT NULL CHECK (start_time >= '07:00:00' AND start_time <= '21:00:00'),
        end_time TIME NOT NULL CHECK (end_time > start_time AND end_time <= '21:00:00'),
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Perform safe migration for schedules to add section_id (if upgrading existing databases)
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

    // Perform safe migration for schedules to add instructor_id (if upgrading existing databases)
    const instructorIdCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'schedules' AND column_name = 'instructor_id'
    `);

    if (instructorIdCheck.rows.length === 0) {
      console.log("⏳ Migrating schedules table: adding instructor_id and migrating teacher data...");
      
      // 1. Add instructor_id as nullable first
      await client.query(`ALTER TABLE schedules ADD COLUMN instructor_id UUID;`);
      
      // 2. Fetch all unique non-empty teachers currently in schedules
      const teachersQuery = await client.query(`
        SELECT DISTINCT teacher 
        FROM schedules 
        WHERE teacher IS NOT NULL AND TRIM(teacher) != ''
      `);
      
      // 3. Insert them into instructors table and map them
      for (const row of teachersQuery.rows) {
        const teacherName = row.teacher.trim();
        // Insert teacher into instructors if not present
        await client.query(`
          INSERT INTO instructors (name)
          VALUES ($1)
          ON CONFLICT (name) DO NOTHING
        `, [teacherName]);
        
        // Get the instructor ID
        const instRes = await client.query(`SELECT id FROM instructors WHERE name = $1`, [teacherName]);
        const instId = instRes.rows[0].id;
        
        // Update schedules matching this teacher name
        await client.query(`
          UPDATE schedules 
          SET instructor_id = $1 
          WHERE teacher = $2
        `, [instId, row.teacher]);
      }
      
      // 4. Set any remaining null instructor_ids to default instructor
      await client.query(`
        UPDATE schedules 
        SET instructor_id = $1 
        WHERE instructor_id IS NULL
      `, [defaultInstructorId]);
      
      // 5. Make instructor_id NOT NULL
      await client.query(`ALTER TABLE schedules ALTER COLUMN instructor_id SET NOT NULL;`);
      
      // 6. Add foreign key constraint
      await client.query(`
        ALTER TABLE schedules 
        ADD CONSTRAINT schedules_instructor_id_fkey 
        FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE;
      `);

      // 7. Drop the old teacher column
      await client.query(`ALTER TABLE schedules DROP COLUMN IF EXISTS teacher;`);
      
      console.log("✅ Migration successful: instructor_id column added and teacher data migrated.");
    }

    // Perform safe migration for schedules to add subject_id (if upgrading existing databases)
    const subjectIdCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'schedules' AND column_name = 'subject_id'
    `);

    if (subjectIdCheck.rows.length === 0) {
      console.log("⏳ Migrating schedules table: adding subject_id and migrating subject data...");
      
      // 1. Add subject_id as nullable first
      await client.query(`ALTER TABLE schedules ADD COLUMN subject_id UUID;`);
      
      // 2. Fetch all unique non-empty subjects currently in schedules
      const subjectsQuery = await client.query(`
        SELECT DISTINCT subject 
        FROM schedules 
        WHERE subject IS NOT NULL AND TRIM(subject) != ''
      `);
      
      // 3. Insert them into subjects table and map them
      for (const row of subjectsQuery.rows) {
        const subjectName = row.subject.trim();
        // Insert subject into subjects if not present
        await client.query(`
          INSERT INTO subjects (name)
          VALUES ($1)
          ON CONFLICT (name) DO NOTHING
        `, [subjectName]);
        
        // Get the subject ID
        const subjRes = await client.query(`SELECT id FROM subjects WHERE name = $1`, [subjectName]);
        const subjId = subjRes.rows[0].id;
        
        // Update schedules matching this subject name
        await client.query(`
          UPDATE schedules 
          SET subject_id = $1 
          WHERE subject = $2
        `, [subjId, row.subject]);
      }
      
      // 4. Set any remaining null subject_ids to default subject
      await client.query(`
        UPDATE schedules 
        SET subject_id = $1 
        WHERE subject_id IS NULL
      `, [defaultSubjectId]);
      
      // 5. Make subject_id NOT NULL
      await client.query(`ALTER TABLE schedules ALTER COLUMN subject_id SET NOT NULL;`);
      
      // 6. Add foreign key constraint
      await client.query(`
        ALTER TABLE schedules 
        ADD CONSTRAINT schedules_subject_id_fkey 
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE;
      `);

      // 7. Drop the old subject column
      await client.query(`ALTER TABLE schedules DROP COLUMN IF EXISTS subject;`);
      
      console.log("✅ Migration successful: subject_id column added and subject data migrated.");
    }

    // Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_schedules_room_day ON schedules(room_id, day_of_week);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_schedules_section_day ON schedules(section_id, day_of_week);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_schedules_instructor_day ON schedules(instructor_id, day_of_week);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_schedules_subject_day ON schedules(subject_id, day_of_week);`);

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
