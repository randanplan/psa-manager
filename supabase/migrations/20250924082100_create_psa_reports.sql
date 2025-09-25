-- Migration für psa_reports-Tabelle
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabelle erstellen
DROP TABLE IF EXISTS psa_reports;
CREATE TABLE psa_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anwender TEXT NOT NULL,
  prueferName TEXT,
  ort TEXT,
  datum TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW(),
  createdBy UUID REFERENCES auth.users(id),
  updatedBy UUID REFERENCES auth.users(id)
);

-- Trigger für updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_psa_reports_updated_at
  BEFORE UPDATE ON psa_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS aktivieren
ALTER TABLE psa_reports ENABLE ROW LEVEL SECURITY;

-- RLS-Policies
CREATE POLICY "Users can view own reports" ON psa_reports
  FOR SELECT TO authenticated
  USING (auth.uid() = createdBy);

CREATE POLICY "Users can insert own reports" ON psa_reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = createdBy);

CREATE POLICY "Users can update own reports" ON psa_reports
  FOR UPDATE TO authenticated
  USING (auth.uid() = createdBy)
  WITH CHECK (auth.uid() = createdBy);

CREATE POLICY "Users can delete own reports" ON psa_reports
  FOR DELETE TO authenticated
  USING (auth.uid() = createdBy);