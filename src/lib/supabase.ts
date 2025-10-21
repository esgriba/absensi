import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          name: string;
          nis: string;
          class: string;
          qr_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          nis: string;
          class: string;
          qr_code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          nis?: string;
          class?: string;
          qr_code?: string;
          created_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          time: string;
          status: 'hadir' | 'telat';
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          date?: string;
          time?: string;
          status?: 'hadir' | 'telat';
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          date?: string;
          time?: string;
          status?: 'hadir' | 'telat';
          created_at?: string;
        };
      };
    };
  };
};
