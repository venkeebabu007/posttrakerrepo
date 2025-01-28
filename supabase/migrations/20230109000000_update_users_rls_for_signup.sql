-- Enable RLS on the clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to insert new clients
CREATE POLICY "Allow authenticated users to insert clients" ON clients
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create a policy that allows users to select their own clients
CREATE POLICY "Allow users to select their own clients" ON clients
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create a policy that allows users to update their own clients
CREATE POLICY "Allow users to update their own clients" ON clients
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own clients
CREATE POLICY "Allow users to delete their own clients" ON clients
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

