-- الشركات
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  sector text,
  location text,
  about text,
  logo_url text,
  status text default 'pending',
  created_at timestamp default now()
);

-- الوظائف
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  title text,
  location text,
  contract_type text,
  description text,
  status text default 'active',
  created_at timestamp default now()
);

-- الباحثين
create table if not exists jobseekers (
  id uuid primary key default gen_random_uuid(),
  fullname text,
  email text,
  phone text,
  field text,
  experience int,
  resume_url text,
  status text default 'active',
  created_at timestamp default now()
);

-- الطلبات
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id),
  fullname text,
  email text,
  resume_url text,
  status text default 'received',
  created_at timestamp default now()
);

-- إعدادات الموقع
create table if not exists site_settings (
  id int primary key,
  brand_name text,
  primary_color text,
  secondary_color text,
  accent_color text,
  footer_message text,
  team_message text,
  team_values jsonb,
  contact_phone text,
  contact_email text,
  social_links jsonb,
  default_lang text,
  maintenance_mode boolean
);

insert into site_settings (
  id, brand_name, primary_color, secondary_color, accent_color,
  footer_message, team_message, team_values, contact_phone, contact_email,
  social_links, default_lang, maintenance_mode
) values (
  1, 'Takween', '#0b2c55', '#103a70', '#FFD700',
  '© 2025 منصة تكوين – جميع الحقوق محفوظة',
  'نحن في تكوين نؤمن بأن التوظيف رحلة إنسانية قبل أن يكون إجراءً إداريًا. مهمتنا أن نبني جسورًا عادلة بين الشركات والباحثين عبر تجربة بسيطة وآمنة.',
  '["الإنسانية","الشفافية","الابتكار","الاحترافية","الأثر الحقيقي"]',
  '+963 999 999 999',
  'info@takween.com',
  '{"facebook":"https://facebook.com/takween","instagram":"https://instagram.com/takween","linkedin":"https://linkedin.com/company/takween"}',
  'ar', false
) on conflict (id) do nothing;
