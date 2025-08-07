-- SQL script สำหรับสร้าง table proposals ใน Supabase

-- สร้าง table proposals
CREATE TABLE IF NOT EXISTS public.proposals (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT,
    answered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- สร้าง RLS (Row Level Security) policies
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Policy สำหรับให้ทุกคนอ่านได้
CREATE POLICY "Allow public read access" ON public.proposals 
    FOR SELECT USING (true);

-- Policy สำหรับให้ทุกคนเพิ่มข้อมูลได้
CREATE POLICY "Allow public insert access" ON public.proposals 
    FOR INSERT WITH CHECK (true);

-- Policy สำหรับให้ทุกคนแก้ไขได้
CREATE POLICY "Allow public update access" ON public.proposals 
    FOR UPDATE USING (true);

-- สร้าง function สำหรับ update updated_at automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- สร้าง trigger สำหรับ auto-update updated_at
CREATE TRIGGER update_proposals_updated_at 
    BEFORE UPDATE ON public.proposals 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.proposals TO anon;
GRANT ALL ON public.proposals TO authenticated;
GRANT USAGE ON SEQUENCE public.proposals_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.proposals_id_seq TO authenticated;
