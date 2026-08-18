-- 2026-08-18 패치: 다마고치 시간 경과 레벨업 + 미니룸 테마(벽지/바닥) 기능 추가
-- SQL Editor 에서 새 쿼리로 실행하세요.

-- 캐릭터가 태어난(리셋된) 시각을 기록해서, 시간이 지나면 자동으로 진화하도록 함
alter table pet_state add column if not exists born_at timestamptz default now();

-- 미니룸 벽지/바닥 테마 설정용 테이블
create table if not exists miniroom_settings (
  id int primary key default 1,
  wallpaper text not null default 'peach',
  floor text not null default 'wood',
  constraint single_row_room_settings check (id = 1)
);
insert into miniroom_settings (id) values (1) on conflict (id) do nothing;

alter table miniroom_settings enable row level security;
drop policy if exists "public_all" on miniroom_settings;
create policy "public_all" on miniroom_settings for all using (true) with check (true);
