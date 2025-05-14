import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjkjqvosqgduopywremy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2pxdm9zcWdkdW9weXdyZW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDA2NTYsImV4cCI6MjA1OTI3NjY1Nn0.OiPj-SLgHxVc7IFqLykiOM2z7MOLTkyvv161uJrSf5w';

export const supabase = createClient(supabaseUrl, supabaseKey);


export async function getUserIdByEmail(email: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('user_emails')
      .select('id') // Adjust if your user ID is named differently
      .eq('email', email)
      .single()  // Get a single row (assuming the email is unique)
  
    if (error || !data) {
      console.error('Error fetching user ID:', error)
      return null
    }
  
    return data.id
  }
  
export async function deleteUserByEmail(email: string): Promise<boolean> {
    const userId = await getUserIdByEmail(email)
  
    if (!userId) {
      console.log(`No user found with email: ${email}`)
      return false
    }
  
    // Now delete the user by user_id using the Admin API
    const { error } = await supabase.auth.admin.deleteUser(userId)
  
    if (error) {
      console.error('Failed to delete user:', error.message)
      return false
    }
  
    console.log(`User with email "${email}" deleted successfully.`)
    return true
  }
  
// testing