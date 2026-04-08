-- Team Management RLS Policies
-- Company admins can insert/update/delete users in their own company

-- Allow admins to insert new users (invite flow)
CREATE POLICY "Admins can insert company users" ON users
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM users
      WHERE id = auth.uid()
      AND role = 'company_admin'
    )
  );

-- Allow admins to update users in their company
CREATE POLICY "Admins can update company users" ON users
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE id = auth.uid()
      AND role = 'company_admin'
    )
  );

-- Allow admins to delete users from their company
CREATE POLICY "Admins can delete company users" ON users
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE id = auth.uid()
      AND role = 'company_admin'
    )
  );
