-- Initialize brands database
-- This script runs when the PostgreSQL container starts for the first time

-- Create brands table if it doesn't exist
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    owner VARCHAR(255) NOT NULL,
    registration_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);

-- Create index on owner for faster lookups
CREATE INDEX IF NOT EXISTS idx_brands_owner ON brands(owner);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_brands_status ON brands(status);

-- Insert some sample data
INSERT INTO brands (name, description, owner, registration_date, status) VALUES
    ('TechCorp', 'Technology and software solutions', 'John Doe', '2024-01-15', 'active'),
    ('GreenEarth', 'Eco-friendly products and services', 'Jane Smith', '2024-02-20', 'active'),
    ('FoodMaster', 'Gourmet food and catering services', 'Mike Johnson', '2024-03-10', 'active')
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
