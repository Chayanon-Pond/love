-- SQL script สำหรับสร้าง admin authentication ใน Supabase

-- สร้าง table admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- สร้าง table admin_sessions สำหรับ token management
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for admin_users
CREATE POLICY "Allow public read access for admin_users" ON public.admin_users 
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access for admin_users" ON public.admin_users 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access for admin_users" ON public.admin_users 
    FOR UPDATE USING (true);

-- Policies for admin_sessions
CREATE POLICY "Allow public access for admin_sessions" ON public.admin_sessions 
    FOR ALL USING (true);

-- Function สำหรับ update updated_at
CREATE OR REPLACE FUNCTION public.update_admin_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger สำหรับ auto-update updated_at
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON public.admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_admin_updated_at_column();

-- Grant permissions
GRANT ALL ON public.admin_users TO anon;
GRANT ALL ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_sessions TO anon;
GRANT ALL ON public.admin_sessions TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- เพิ่ม admin user เริ่มต้น (password: admin123)
-- ใน production ควรเปลี่ยน password นี้
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;

-- ทำความสะอาด session ที่หมดอายุ (optional function)
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.admin_sessions 
    WHERE expires_at < NOW() OR is_active = false;
END;
$$ language 'plpgsql';
