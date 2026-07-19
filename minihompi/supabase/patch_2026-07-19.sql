-- 2026-07-19 패치: 상점 아이템 확충, 캐릭터 스킨 컬럼 추가, 포인트 3000점 지급
-- SQL Editor 에서 새 쿼리로 실행하세요.

-- 기존 테이블에 유니크 제약 추가 (중복 방지)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'miniroom_catalog_name_key') then
    alter table miniroom_catalog add constraint miniroom_catalog_name_key unique (name);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'pet_catalog_name_key') then
    alter table pet_catalog add constraint pet_catalog_name_key unique (name);
  end if;
end $$;

-- 캐릭터 스킨 컬럼 추가
alter table pet_state add column if not exists skin text not null default 'mascot';

-- 미니룸 상점 아이템 추가
insert into miniroom_catalog (name, image_url, price, category) values
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

-- 캐릭터 상점 아이템 추가
insert into pet_catalog (name, type, image_url, price, effect) values
  ('초코케이크', 'food', null, 12, '{"hunger": 40, "happiness": 10}'),
  ('주스', 'food', null, 6, '{"hunger": 15}'),
  ('피자', 'food', null, 15, '{"hunger": 45}'),
  ('샴푸', 'toy', null, 7, '{"cleanliness": 30}'),
  ('훌라후프', 'toy', null, 10, '{"happiness": 20}'),
  ('그림책', 'toy', null, 8, '{"happiness": 15}'),
  ('분홍 원피스', 'outfit', null, 22, '{}'),
  ('마법사 모자', 'outfit', null, 24, '{}'),
  ('왕관', 'outfit', null, 30, '{}'),
  ('안경', 'outfit', null, 15, '{}'),
  ('나비 날개', 'outfit', null, 26, '{}')
on conflict (name) do nothing;

-- 포인트 3000점 지급
update user_stats
set total_points = total_points + 3000,
    current_points = current_points + 3000
where id = 1;

update user_stats
set level = floor(total_points::numeric / 100) + 1
where id = 1;
