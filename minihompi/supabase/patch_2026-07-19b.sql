-- 2026-07-19 두 번째 패치: 미니룸 아이템 추가 (인형류 포함)
-- SQL Editor 에서 새 쿼리로 실행하세요. (이전 patch_2026-07-19.sql 을 먼저 실행했어야 합니다)

insert into miniroom_catalog (name, image_url, price, category) values
  ('병아리 인형', null, 18, 'deco'),
  ('블롭 인형', null, 20, 'deco'),
  ('화분', null, 14, 'deco'),
  ('벽 포스터', null, 16, 'deco'),
  ('전신거울', null, 32, 'furniture'),
  ('옷걸이', null, 20, 'furniture'),
  ('벽시계', null, 14, 'deco'),
  ('무드등', null, 18, 'deco'),
  ('텐트', null, 38, 'furniture'),
  ('트램폴린', null, 40, 'furniture'),
  ('그네', null, 36, 'furniture')
on conflict (name) do nothing;
