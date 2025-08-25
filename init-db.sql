-- Initialize brands database
-- This script runs when the PostgreSQL container starts for the first time
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create brands table if it doesn't exist
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    owner VARCHAR(255) NOT NULL,
    lang VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);

-- Create index on owner for faster lookups
CREATE INDEX IF NOT EXISTS idx_brands_owner ON brands(owner);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_brands_status ON brands(status);

COMMENT ON TABLE brands IS 'Tabla de marcas comerciales con trazabilidad completa';
COMMENT ON COLUMN brands.id IS 'Identificador único de la marca';
COMMENT ON COLUMN brands.name IS 'Nombre de la marca';
COMMENT ON COLUMN brands.owner IS 'Propietario de la marca';
COMMENT ON COLUMN brands.lang IS 'Código de idioma ISO 639-1';
COMMENT ON COLUMN brands.status IS 'Estado de la marca';
COMMENT ON COLUMN brands.created_at IS 'Fecha y hora de creación';
COMMENT ON COLUMN brands.updated_at IS 'Fecha y hora de última actualización';
COMMENT ON COLUMN brands.deleted_at IS 'Fecha y hora de eliminación (soft delete)';

-- Insert some sample data
INSERT INTO brands (name, owner, lang, status) VALUES
    ('TechCorp', 'John Doe', 'en', 'active'),
    ('GreenEarth', 'Jane Smith', 'es', 'active'),
    ('FoodMaster', 'Mike Johnson', 'en', 'active')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_brands_updated_at 
    BEFORE UPDATE ON brands 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
