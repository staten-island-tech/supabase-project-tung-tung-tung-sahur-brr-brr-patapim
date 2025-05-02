import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjkjqvosqgduopywremy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2pxdm9zcWdkdW9weXdyZW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDA2NTYsImV4cCI6MjA1OTI3NjY1Nn0.OiPj-SLgHxVc7IFqLykiOM2z7MOLTkyvv161uJrSf5w';

export const supabase = createClient(supabaseUrl, supabaseKey);

// testing