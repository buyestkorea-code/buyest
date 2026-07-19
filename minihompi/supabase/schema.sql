-- 승목이 미니홈피 Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 이 파일 전체를 붙여넣고 Run 하세요.
-- 로그인 없이 가족만 사용하는 개인 사이트이므로, anon(공개) 키로 읽기/쓰기가
-- 모두 가능하도록 RLS 정책을 열어둡니다. (URL은 외부에 공유하지 마세요)

-- =========================================================
-- 1. 프로필 / 대문
-- =========================================================
create table if not exists profile (
  id int primary key default 1,
  nickname text default '승목이',
  school text default '',
  grade text default '',
  class_no text default '',
  student_no text default '',
  favorites jsonb default '["", "", ""]'::jsonb,
  avatar_url text,
  cover_url text,
  title_text text default '승목이의 비밀기지',
  mood_emoji text default '😊',
  theme_skin text default 'pink',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into profile (id) values (1) on conflict (id) do nothing;

create table if not exists visitor_log (
  id bigint generated always as identity primary key,
  visit_date date not null,
  count int not null default 0,
  unique (visit_date)
);

-- =========================================================
-- 2. 포인트 / 레벨
-- =========================================================
create table if not exists user_stats (
  id int primary key default 1,
  level int not null default 1,
  total_points int not null default 0,
  current_points int not null default 0,
  updated_at timestamptz default now(),
  constraint single_row_stats check (id = 1)
);
insert into user_stats (id) values (1) on conflict (id) do nothing;

create table if not exists points_ledger (
  id bigint generated always as identity primary key,
  delta int not null,
  reason text,
  source text,
  created_at timestamptz default now()
);

-- =========================================================
-- 3. 일기장
-- =========================================================
create table if not exists diary_entries (
  id bigint generated always as identity primary key,
  entry_date date not null,
  content text default '',
  weather text default '☀️',
  mood_emoji text default '😊',
  doodle_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (entry_date)
);

-- =========================================================
-- 4. 사진첩
-- =========================================================
create table if not exists albums (
  id bigint generated always as identity primary key,
  name text not null,
  cover_photo_id bigint,
  created_at timestamptz default now()
);

create table if not exists photos (
  id bigint generated always as identity primary key,
  album_id bigint references albums(id) on delete cascade,
  storage_path text not null,
  thumb_path text not null,
  caption text default '',
  created_at timestamptz default now()
);

-- =========================================================
-- 5. 오늘의 미션 (AR)
-- =========================================================
create table if not exists missions_log (
  id bigint generated always as identity primary key,
  mission_date date not null,
  completed_at timestamptz default now(),
  streak_count int not null default 1,
  unique (mission_date)
);

-- =========================================================
-- 6. 미니룸
-- =========================================================
create table if not exists miniroom_catalog (
  id bigint generated always as identity primary key,
  name text not null unique,
  image_url text,
  price int not null default 0,
  category text default 'furniture'
);

create table if not exists miniroom_inventory (
  id bigint generated always as identity primary key,
  item_id bigint references miniroom_catalog(id) on delete cascade,
  acquired_at timestamptz default now()
);

create table if not exists miniroom_layout (
  id bigint generated always as identity primary key,
  inventory_id bigint references miniroom_inventory(id) on delete cascade,
  x real not null default 50,
  y real not null default 50,
  z_index int not null default 1,
  rotation real not null default 0,
  updated_at timestamptz default now(),
  unique (inventory_id)
);

-- =========================================================
-- 7. 캐릭터 키우기 (다마고치)
-- =========================================================
create table if not exists pet_state (
  id int primary key default 1,
  stage text not null default 'egg', -- egg | hatchling | grown | sparkle
  hunger int not null default 80,
  cleanliness int not null default 80,
  happiness int not null default 80,
  care_count int not null default 0,
  equipped_outfit_id bigint,
  skin text not null default 'mascot', -- mascot | blob
  last_tick_at timestamptz default now(),
  constraint single_row_pet check (id = 1)
);
insert into pet_state (id) values (1) on conflict (id) do nothing;

create table if not exists pet_catalog (
  id bigint generated always as identity primary key,
  name text not null unique,
  type text not null, -- food | outfit | toy
  image_url text,
  price int not null default 0,
  effect jsonb default '{}'::jsonb
);

create table if not exists pet_inventory (
  id bigint generated always as identity primary key,
  item_id bigint references pet_catalog(id) on delete cascade,
  quantity int not null default 1,
  acquired_at timestamptz default now()
);

-- =========================================================
-- 8. 메모장
-- =========================================================
create table if not exists memos (
  id bigint generated always as identity primary key,
  content text default '',
  color text default '#ffe9b0',
  x real not null default 40,
  y real not null default 40,
  created_at timestamptz default now()
);

-- =========================================================
-- 9. 방명록
-- =========================================================
create table if not exists guestbook (
  id bigint generated always as identity primary key,
  author_name text not null,
  message text not null,
  created_at timestamptz default now()
);

-- =========================================================
-- RLS: 전체 공개 읽기/쓰기 허용 (가족용 개인 사이트)
-- =========================================================
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'profile', 'visitor_log', 'user_stats', 'points_ledger',
      'diary_entries', 'albums', 'photos', 'missions_log',
      'miniroom_catalog', 'miniroom_inventory', 'miniroom_layout',
      'pet_state', 'pet_catalog', 'pet_inventory',
      'memos', 'guestbook'
    ])
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "public_all" on %I;', t);
    execute format('create policy "public_all" on %I for all using (true) with check (true);', t);
  end loop;
end $$;

-- =========================================================
-- Storage 버킷: photos, avatars, doodles (모두 공개 버킷)
-- 대시보드에서 수동으로 만들어도 되지만, SQL로 한 번에 생성합니다.
-- =========================================================
insert into storage.buckets (id, name, public)
values
  ('photos', 'photos', true),
  ('avatars', 'avatars', true),
  ('doodles', 'doodles', true)
on conflict (id) do nothing;

drop policy if exists "public_all_objects" on storage.objects;
create policy "public_all_objects" on storage.objects
  for all
  using (bucket_id in ('photos', 'avatars', 'doodles'))
  with check (bucket_id in ('photos', 'avatars', 'doodles'));

-- =========================================================
-- 시드 데이터: 미니룸/펫 상점 기본 아이템
-- =========================================================
insert into miniroom_catalog (name, image_url, price, category) values
  ('분홍 침대', null, 30, 'furniture'),
  ('책상 세트', null, 40, 'furniture'),
  ('곰인형', null, 15, 'deco'),
  ('작은 어항', null, 25, 'deco'),
  ('러그', null, 20, 'floor'),
  ('핑크 소파', null, 45, 'furniture'),
  ('2단 침대', null, 50, 'furniture'),
  ('책장', null, 35, 'furniture'),
  ('TV', null, 40, 'furniture'),
  ('컴퓨터 책상', null, 45, 'furniture'),
  ('피아노', null, 55, 'furniture'),
  ('옷장', null, 42, 'furniture'),
  ('스탠드 조명', null, 18, 'deco'),
  ('액자', null, 12, 'deco'),
  ('꽃병', null, 15, 'deco'),
  ('별 조명 가랜드', null, 20, 'deco'),
  ('캐노피 커튼', null, 28, 'deco'),
  ('장난감 상자', null, 16, 'deco'),
  ('카펫(하트무늬)', null, 22, 'floor')
on conflict (name) do nothing;

insert into pet_catalog (name, type, image_url, price, effect) values
  ('사과', 'food', null, 5, '{"hunger": 20}'),
  ('간식바', 'food', null, 8, '{"hunger": 35}'),
  ('초코케이크', 'food', null, 12, '{"hunger": 40, "happiness": 10}'),
  ('주스', 'food', null, 6, '{"hunger": 15}'),
  ('피자', 'food', null, 15, '{"hunger": 45}'),
  ('비누방울', 'toy', null, 6, '{"cleanliness": 25}'),
  ('샴푸', 'toy', null, 7, '{"cleanliness": 30}'),
  ('공놀이', 'toy', null, 6, '{"happiness": 25}'),
  ('훌라후프', 'toy', null, 10, '{"happiness": 20}'),
  ('그림책', 'toy', null, 8, '{"happiness": 15}'),
  ('노란 리본', 'outfit', null, 20, '{}'),
  ('별무늬 모자', 'outfit', null, 25, '{}'),
  ('분홍 원피스', 'outfit', null, 22, '{}'),
  ('마법사 모자', 'outfit', null, 24, '{}'),
  ('왕관', 'outfit', null, 30, '{}'),
  ('안경', 'outfit', null, 15, '{}'),
  ('나비 날개', 'outfit', null, 26, '{}')
on conflict (name) do nothing;
