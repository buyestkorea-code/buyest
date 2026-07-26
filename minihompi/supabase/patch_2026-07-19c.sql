-- 2026-07-19 세 번째 패치: 번역 단어장/게임 진행도 테이블 + 미니룸·펫 아이템 추가
-- SQL Editor 에서 새 쿼리로 실행하세요.

-- 번역기에서 저장하는 단어장
create table if not exists vocab_words (
  id bigint generated always as identity primary key,
  word_en text not null unique,
  word_ko text not null,
  source text default 'text',
  created_at timestamptz default now()
);

-- 게임 스테이지 진행도 (카드 짝맞추기 등)
create table if not exists game_progress (
  game_key text primary key,
  level int not null default 1
);

alter table vocab_words enable row level security;
drop policy if exists "public_all" on vocab_words;
create policy "public_all" on vocab_words for all using (true) with check (true);

alter table game_progress enable row level security;
drop policy if exists "public_all" on game_progress;
create policy "public_all" on game_progress for all using (true) with check (true);

-- 미니룸 아이템 추가 (계절/파티/학교 테마)
insert into miniroom_catalog (name, image_url, price, category) values
  ('크리스마스 트리', null, 26, 'deco'),
  ('눈사람 인형', null, 18, 'deco'),
  ('벚꽃 화분', null, 16, 'deco'),
  ('파티 풍선', null, 14, 'deco'),
  ('파티 가랜드', null, 15, 'deco'),
  ('생일 케이크', null, 15, 'deco'),
  ('책가방', null, 16, 'deco'),
  ('칠판', null, 28, 'furniture'),
  ('지구본', null, 20, 'deco'),
  ('수족관', null, 45, 'furniture')
on conflict (name) do nothing;

-- 캐릭터 상점 아이템 추가
insert into pet_catalog (name, type, image_url, price, effect) values
  ('아이스크림', 'food', null, 10, '{"hunger": 10, "happiness": 15}'),
  ('샐러드', 'food', null, 8, '{"hunger": 25}'),
  ('축구공', 'toy', null, 9, '{"happiness": 22}'),
  ('퍼즐', 'toy', null, 9, '{"happiness": 18}'),
  ('멜빵바지', 'outfit', null, 20, '{}'),
  ('스카프', 'outfit', null, 16, '{}')
on conflict (name) do nothing;
