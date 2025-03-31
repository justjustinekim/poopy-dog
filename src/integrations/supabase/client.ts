
// This file contains the Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://innpsmqpjsopnsoropfy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlubnBzbXFwanNvcG5zb3JvcGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMDQ4NTAsImV4cCI6MjA1ODY4MDg1MH0.tMjvATK0xZlLw9aTbk3rssgduHuAke3u07Z1j1YgbA8";
const REDIRECT_URL = "https://poopydog.app/log";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    detectSessionInUrl: true,
  }
});
