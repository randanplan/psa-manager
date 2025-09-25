create table public.psa_reports (
  id uuid not null default gen_random_uuid (),
  anwender text not null,
  "prueferName" text null,
  ort text null,
  datum timestamp with time zone null default now(),
  items jsonb null,
  "createdAt" timestamp with time zone null default now(),
  "updatedAt" timestamp with time zone null,
  "createdBy" uuid null,
  "updatedBy" uuid null,
  constraint psa_reports_pkey primary key (id),
  constraint psa_reports_createdBy_fkey foreign KEY ("createdBy") references auth.users (id)
) TABLESPACE pg_default;

create index IF not exists idx_psa_reports_createdBy on public.psa_reports using btree ("createdBy") TABLESPACE pg_default;

create index IF not exists idx_psa_reports_datum on public.psa_reports using btree (datum) TABLESPACE pg_default;