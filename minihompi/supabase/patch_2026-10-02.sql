-- 2026-10-02 패치: 도감 메뉴 신규 추가
-- SQL Editor 에서 새 쿼리로 실행하세요.

create table if not exists encyclopedia_entries (
  id bigint generated always as identity primary key,
  category text not null default '기타',
  entry_no int not null default 1,
  name text not null,
  details text default '',
  doodle_path text,
  created_at timestamptz default now()
);

alter table encyclopedia_entries enable row level security;
drop policy if exists "public_all" on encyclopedia_entries;
create policy "public_all" on encyclopedia_entries for all using (true) with check (true);
