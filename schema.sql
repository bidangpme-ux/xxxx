-- ==============================================================================
-- WartaKarsa - PostgreSQL Database Schema for CasaOS & Self-Hosted Deployments
-- ==============================================================================

-- 1. Metadata and system state table
CREATE TABLE IF NOT EXISTS system_meta (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Program Categories Table
CREATE TABLE IF NOT EXISTS program_categories (
    name VARCHAR(150) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2b. Activity Categories Table (Kategori Kegiatan)
CREATE TABLE IF NOT EXISTS activity_categories (
    name VARCHAR(150) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Flagship Programs 2025-2029 Table
CREATE TABLE IF NOT EXISTS flagship_programs (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(100) NOT NULL,
    title VARCHAR(300) NOT NULL,
    category VARCHAR(150) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Publications & Journals Table
CREATE TABLE IF NOT EXISTS publications (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    category VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    date VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Instagram-Style Photo Feed Table
CREATE TABLE IF NOT EXISTS instagram_photos (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    category VARCHAR(150) NOT NULL,
    date VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Log of deleted default & custom IDs to prevent unwanted restoration
CREATE TABLE IF NOT EXISTS deleted_items_log (
    id VARCHAR(100) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. App Users Table
CREATE TABLE IF NOT EXISTS app_users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(150) NOT NULL,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast search & filtering
CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(category);
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
CREATE INDEX IF NOT EXISTS idx_publications_date ON publications(date DESC);
CREATE INDEX IF NOT EXISTS idx_programs_category ON flagship_programs(category);
CREATE INDEX IF NOT EXISTS idx_instagram_date ON instagram_photos(date DESC);
CREATE INDEX IF NOT EXISTS idx_deleted_items_entity ON deleted_items_log(entity_type);
CREATE INDEX IF NOT EXISTS idx_users_username ON app_users(username);
