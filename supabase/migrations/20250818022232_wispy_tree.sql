/*
  # Create locations table for production

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `name` (text, location name)
      - `address` (text, full address)
      - `city` (text, city name)
      - `country` (text, country name)
      - `phone` (text, contact phone)
      - `email` (text, contact email)
      - `status` (text, active/inactive)
      - `worker_count` (integer, number of workers)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `locations` table
    - Add policies for authenticated users to read locations
    - Add policies for admins to manage locations

  3. Indexes
    - Add index on status for filtering
    - Add index on city for location-based queries
*/

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'UAE',
  phone text,
  email text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  worker_count integer DEFAULT 0 CHECK (worker_count >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Policies for locations
CREATE POLICY "All authenticated users can read locations"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert locations"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update locations"
  ON locations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete locations"
  ON locations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS locations_status_idx ON locations(status);
CREATE INDEX IF NOT EXISTS locations_city_idx ON locations(city);
CREATE INDEX IF NOT EXISTS locations_country_idx ON locations(country);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();