import { createClient } from '@supabase/supabase-js';
//const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
//const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabaseUrl ='https://elayyirzfehtdibdrpfv.supabase.co'

const supabaseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsYXl5aXJ6ZmVodGRpYmRycGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTY4OTEsImV4cCI6MjA1NzI3Mjg5MX0.mTZv-EGhlGA8bxyF_XTLhrCxV5GiA7phrdNjoRslpYs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

