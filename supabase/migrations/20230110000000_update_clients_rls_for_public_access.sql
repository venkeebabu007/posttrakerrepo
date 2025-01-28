-- Drop the existing RLS policies for the clients table
DROP POLICY IF EXISTS "Allow authenticated users to insert clients" ON clients;
DROP POLICY IF EXISTS "Allow users to select their own clients" ON clients;
DROP POLICY IF EXISTS "Allow users to update their own clients" ON clients;
DROP POLICY IF EXISTS "Allow users to delete their own clients" ON clients;

-- Create a new policy that allows public access to insert clients
CREATE POLICY "Allow public to insert clients" ON clients
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create a policy that allows public access to select all clients
CREATE POLICY "Allow public to select all clients" ON clients
  FOR SELECT
  TO public
  USING (true);

-- Create a policy that allows public access to update all clients
CREATE POLICY "Allow public to update all clients" ON clients
  FOR UPDATE
  TO public
  USING (true);

-- Create a policy that allows public access to delete all clients
CREATE POLICY "Allow public to delete all clients" ON clients
  FOR DELETE
  TO public
  USING (true);

-- Alter the clients table to make the user_id column nullable
ALTER TABLE clients ALTER COLUMN user_id DROP NOT NULL;

