import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxwpvpqatisvkpgpstst.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d3B2cHFhdGlzdmtwZ3BzdHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjAyODcsImV4cCI6MjA2MzA5NjI4N30.M-arHnx7-p1Tyl8PbIglg5RhJg0ENG196_Gyc3J-r2I'

export let supabase = createClient(supabaseUrl, supabaseKey);