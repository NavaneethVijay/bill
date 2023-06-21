
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://fzcaawjrngvepsaygruf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6Y2Fhd2pybmd2ZXBzYXlncnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY4MzUzODEsImV4cCI6MjAwMjQxMTM4MX0.f8gqU6CxYok2MxTxX6CAxNLKJvO6NqWzaZG7HuL_q_Y')
export default supabase;