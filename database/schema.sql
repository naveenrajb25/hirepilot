create table users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  user_type text not null check (user_type in ('candidate', 'recruiter')),
  created_at timestamptz default now()
);

create table candidate_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  full_name text not null,
  phone text,
  city text,
  education text,
  experience_level text,
  preferred_job_role text,
  linkedin_profile text,
  github_link text,
  skills text[] default '{}',
  languages_known text[] default '{}',
  recruiter_ready_summary text,
  visibility_rank int default 0,
  created_at timestamptz default now()
);

create table recruiter_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  recruiter_name text not null,
  phone text not null,
  company_name text not null,
  company_website text not null,
  company_location text not null,
  company_size text not null,
  industry text not null,
  hiring_roles text[] not null default '{}',
  gst_or_registration text,
  created_at timestamptz default now()
);

create table resumes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidate_profiles(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  uploaded_at timestamptz default now()
);

create table portfolio_links (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidate_profiles(id) on delete cascade,
  title text,
  url text not null,
  link_type text default 'project'
);

create table interview_sessions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidate_profiles(id) on delete cascade,
  role text not null,
  status text default 'started',
  started_at timestamptz default now(),
  completed_at timestamptz
);

create table interview_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references interview_sessions(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz default now()
);

create table scorecards (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidate_profiles(id) on delete cascade,
  interview_session_id uuid references interview_sessions(id) on delete set null,
  overall_score int not null,
  communication_score int,
  technical_domain_score int,
  confidence_score int,
  problem_solving_score int,
  resume_strength_score int,
  portfolio_strength_score int,
  strengths text[] default '{}',
  weaknesses text[] default '{}',
  improvement_roadmap text[] default '{}',
  recruiter_recommendation text,
  created_at timestamptz default now()
);

create table recruiter_shortlists (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid references recruiter_profiles(id) on delete cascade,
  candidate_id uuid references candidate_profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (recruiter_id, candidate_id)
);

create table recruiter_notes (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid references recruiter_profiles(id) on delete cascade,
  candidate_id uuid references candidate_profiles(id) on delete cascade,
  note text not null,
  created_at timestamptz default now()
);

create table subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_inr int,
  billing_cycle text,
  features text[] default '{}'
);

create table recruiter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid references recruiter_profiles(id) on delete cascade,
  plan_id uuid references subscription_plans(id),
  status text default 'active',
  starts_at timestamptz default now(),
  ends_at timestamptz
);

create table candidate_paid_services (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidate_profiles(id) on delete cascade,
  service_name text not null,
  status text default 'requested',
  created_at timestamptz default now()
);

alter table candidate_profiles
  add column if not exists email_verified boolean default false,
  add column if not exists candidate_account_status text default 'pending_verification' check (candidate_account_status in ('pending_verification', 'active', 'suspended')),
  add column if not exists onboarding_completed boolean default false,
  add column if not exists candidate_status text default 'pending' check (candidate_status in ('pending', 'verified', 'featured', 'hidden', 'suspended')),
  add column if not exists is_verified boolean default false,
  add column if not exists is_featured boolean default false,
  add column if not exists is_visible_to_recruiters boolean default true,
  add column if not exists admin_notes text,
  add column if not exists availability text,
  add column if not exists expected_salary text,
  add column if not exists ats_resume_score int default 0,
  add column if not exists linkedin_score int default 0,
  add column if not exists ai_interview_score int default 0,
  add column if not exists overall_readiness_score int default 0;

alter table recruiter_profiles
  add column if not exists email_verified boolean default false,
  add column if not exists recruiter_account_status text default 'pending_verification' check (recruiter_account_status in ('pending_verification', 'pending_admin_approval', 'active', 'rejected')),
  add column if not exists recruiter_status text default 'pending' check (recruiter_status in ('pending', 'approved', 'rejected', 'active', 'inactive', 'suspended')),
  add column if not exists is_approved boolean default false,
  add column if not exists can_view_contacts boolean default false,
  add column if not exists can_download_resumes boolean default false,
  add column if not exists admin_notes text;

alter table interview_sessions
  add column if not exists is_flagged boolean default false,
  add column if not exists flag_reason text,
  add column if not exists admin_notes text;

create table if not exists admin_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists pricing_plans (
  id uuid primary key default gen_random_uuid(),
  plan_name text not null,
  plan_type text not null check (plan_type in ('one-time', 'monthly', 'enterprise')),
  price numeric,
  razorpay_payment_link text,
  profile_view_limit int,
  validity_days int,
  contact_view_limit int,
  resume_download_limit int,
  featured_candidate_access boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists candidate_services (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  description text,
  price numeric,
  razorpay_payment_link text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists recruiter_plans (
  id uuid primary key default gen_random_uuid(),
  plan_name text not null,
  price numeric,
  validity_days int,
  profile_view_limit int default 2,
  contact_view_limit int default 0,
  resume_download_limit int default 0,
  razorpay_payment_link text,
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  user_type text check (user_type in ('candidate', 'recruiter')),
  payment_for text not null,
  amount numeric,
  razorpay_payment_link text,
  payment_reference_id text,
  email_used text,
  phone_used text,
  screenshot_path text,
  status text default 'pending_verification' check (status in ('pending_verification', 'paid', 'failed', 'refunded')),
  admin_notes text,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidate_profiles(id) on delete set null,
  service_id uuid references candidate_services(id) on delete set null,
  payment_id uuid references payments(id) on delete set null,
  status text default 'pending_payment' check (status in ('pending_payment', 'pending_verification', 'unlocked', 'completed', 'cancelled')),
  request_payload jsonb default '{}',
  report_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_reports (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidate_profiles(id) on delete cascade,
  report_type text not null check (report_type in ('resume_ats', 'linkedin_optimization', 'interview_questions', 'interview_score', 'overall_scorecard')),
  status text default 'processing' check (status in ('processing', 'published', 'needs_review')),
  score int,
  report jsonb default '{}',
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists recruiter_usage_logs (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid references recruiter_profiles(id) on delete cascade,
  action_type text not null,
  candidate_id uuid references candidate_profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table recruiter_subscriptions
  add column if not exists payment_id uuid references payments(id) on delete set null,
  add column if not exists profile_view_limit int default 2,
  add column if not exists contact_view_limit int default 0,
  add column if not exists resume_download_limit int default 0,
  add column if not exists profile_views_used int default 0,
  add column if not exists contact_views_used int default 0,
  add column if not exists resume_downloads_used int default 0;

create table if not exists candidate_visibility_settings (
  id uuid primary key default gen_random_uuid(),
  minimum_score_for_visibility int default 70,
  featured_candidate_boost int default 20,
  hide_suspended_candidates boolean default true,
  hide_hidden_candidates boolean default true,
  updated_at timestamptz default now()
);

create table if not exists admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_username text not null,
  action_type text not null,
  entity_type text not null,
  entity_id text not null,
  details text,
  created_at timestamptz default now()
);

create table if not exists auth_verification_logs (
  id uuid primary key default gen_random_uuid(),
  user_type text not null check (user_type in ('candidate', 'recruiter')),
  email text not null,
  verification_method text not null,
  verified_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists candidate_profiles_admin_visibility_idx
  on candidate_profiles (is_visible_to_recruiters, is_featured, candidate_status);

create index if not exists recruiter_profiles_admin_status_idx
  on recruiter_profiles (recruiter_status, is_approved);

create index if not exists admin_activity_logs_created_at_idx
  on admin_activity_logs (created_at desc);
