-- Create psa_reports table
CREATE TABLE psa_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anwender TEXT NOT NULL,
  prueferName TEXT,
  ort TEXT,
  datum DATE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE psa_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own reports" ON psa_reports
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own reports" ON psa_reports
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own reports" ON psa_reports
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own reports" ON psa_reports
  FOR DELETE USING (auth.uid() = created_by);
