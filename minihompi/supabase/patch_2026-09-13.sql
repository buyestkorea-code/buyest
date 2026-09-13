-- 2026-09-13 패치: 중학생 업그레이드 (일정관리 신규 + 여우 인형/틴 감성 미니룸 아이템 추가)
-- SQL Editor 에서 새 쿼리로 실행하세요.

-- 일정관리(플래너) 테이블
create table if not exists planner_items (
  id bigint generated always as identity primary key,
  title text not null,
  item_date date not null,
  category text not null default 'todo', -- todo | homework | exam | event
  done boolean not null default false,
  created_at timestamptz default now()
);

alter table planner_items enable row level security;
drop policy if exists "public_all" on planner_items;
create policy "public_all" on planner_items for all using (true) with check (true);

-- 미니룸 신규 아이템 (여우 인형 + 틴 감성 아이템)
insert into miniroom_catalog (name, image_url, price, category) values
  ('여우 인형', null, 22, 'deco'),
  ('게이밍 헤드셋', null, 25, 'deco'),
  ('게이밍 의자', null, 30, 'furniture'),
  ('레트로 게임기', null, 28, 'deco'),
  ('빈백 소파', null, 26, 'furniture'),
  ('어쿠스틱 기타', null, 24, 'deco'),
  ('다트보드', null, 18, 'deco'),
  ('LED 무드바', null, 20, 'deco'),
  ('후드티 옷걸이', null, 15, 'deco'),
  ('스니커즈 진열장', null, 22, 'furniture'),
  ('힙합 포스터', null, 14, 'deco'),
  ('블루투스 스피커', null, 20, 'deco'),
  ('폴라로이드 클립', null, 12, 'deco'),
  ('스케이트보드', null, 22, 'deco'),
  ('농구공', null, 14, 'deco'),
  ('만화책 더미', null, 13, 'deco'),
  ('캡모자', null, 12, 'deco'),
  ('스트릿 백팩', null, 16, 'deco'),
  ('무선 이어폰', null, 18, 'deco'),
  ('미니 냉장고', null, 24, 'furniture'),
  ('다이어리 플래너', null, 14, 'deco'),
  ('✨ 홀로그램 턴테이블', null, 90, 'deco'),
  ('✨ 네온 사인 조명', null, 70, 'deco'),
  ('✨ 프리미엄 게이밍 셋업', null, 180, 'furniture')
on conflict (name) do nothing;
