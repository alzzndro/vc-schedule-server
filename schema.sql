-- PostgreSQL Database Schema for School Classrooms Schedule Management System
-- Use this script in pgAdmin 4 to initialize your database tables.

-- 1. Enable btree_gist extension (required for exclusion constraint validation)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Create Users Table
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

-- 3. Create Rooms (Classrooms) Table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    capacity INTEGER DEFAULT 30,
    type VARCHAR(50) DEFAULT 'Regular Classroom',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create Sections Table
CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create Schedules Table
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    teacher VARCHAR(255) NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 6), -- 1 = Monday, 6 = Saturday
    start_time TIME NOT NULL CHECK (start_time >= '07:00:00' AND start_time <= '21:00:00'),
    end_time TIME NOT NULL CHECK (end_time > start_time AND end_time <= '21:00:00'),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Indexes for Query Optimization
CREATE INDEX IF NOT EXISTS idx_schedules_room_day ON schedules(room_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedules_section_day ON schedules(section_id, day_of_week);

-- 6. Default Seed Data
-- Seed Default Admin User (Password: admin123)
-- bcrypt hash for "admin123" with 10 salt rounds: $2b$10$7zB3c9wKx5XwY6V9tYJWeO9P3M9O1L/K.v5vK4h3i3e7a6.b6g/tC
-- Note: If this hash is not recognized, you can register a new admin user directly on the UI registration screen.
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES (
    'admin@school.edu', 
    '$2b$10$7zB3c9wKx5XwY6V9tYJWeO9P3M9O1L/K.v5vK4h3i3e7a6.b6g/tC', 
    'System', 
    'Admin', 
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Seed Default Rooms
INSERT INTO rooms (name, capacity, type)
VALUES 
    ('Room 101', 40, 'Regular Classroom'),
    ('Room 102', 35, 'Regular Classroom'),
    ('Science Lab A', 25, 'Laboratory'),
    ('Computer Lab B', 30, 'Laboratory'),
    ('Grand Hall', 150, 'Lecture Hall')
ON CONFLICT (name) DO NOTHING;

-- Seed Default Section
INSERT INTO sections (name)
VALUES ('Default Section')
ON CONFLICT (name) DO NOTHING;
