-- CloudStore Database Setup Script
-- Run this script in PostgreSQL to create the database and user

-- Create database
CREATE DATABASE cloudstore_db;

-- Create user (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
        CREATE USER postgres WITH PASSWORD 'cloudstore';
    END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cloudstore_db TO postgres;

-- Connect to the database
\c cloudstore_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO postgres;

-- Create uploads directory (this will be handled by the application)
-- The application will create the uploads folder automatically

-- Verify setup
SELECT current_database() as "Current Database";
SELECT current_user as "Current User";

-- Show tables (will be created by JPA/Hibernate)
\dt 