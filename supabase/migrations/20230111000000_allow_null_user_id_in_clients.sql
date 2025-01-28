-- Allow null values in the user_id column of the clients table
ALTER TABLE clients ALTER COLUMN user_id DROP NOT NULL;

-- Update the RLS policy to allow inserting clients with or without user_id
DROP POLICY IF EXISTS "Allow public to insert clients" ON clients;
CREATE POLICY "Allow public to insert clients" ON clients
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure other policies are in place
DROP POLICY IF EXISTS "Allow public to select all clients" ON clients;
CREATE POLICY "Allow public to select all clients" ON clients
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow public to update all clients" ON clients;
CREATE POLICY "Allow public to update all clients" ON clients
  FOR UPDATE
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow public to delete all clients" ON clients;
CREATE POLICY "Allow public to delete all clients" ON clients
  FOR DELETE
  TO public
  USING (true);

