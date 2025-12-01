import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://hfwkpsbqslemxlbkdpes.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmd2twc2Jxc2xlbXhsYmtkcGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDA0MjMsImV4cCI6MjA4MDE3NjQyM30.5BweQaFVOPRAl_MHYPJoAcgw1zJDi5ORL7jWNyEidVk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);