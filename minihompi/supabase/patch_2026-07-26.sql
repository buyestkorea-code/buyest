-- 2026-07-26 패치: 레어(고가) 프리미엄 아이템 대량 추가
-- SQL Editor 에서 새 쿼리로 실행하세요.

-- 미니룸 레어 아이템 (60~300P)
insert into miniroom_catalog (name, image_url, price, category) values
  ('✨ 황금 왕관 장식', null, 120, 'deco'),
  ('✨ 유니콘 인형', null, 90, 'deco'),
  ('✨ 무지개 미끄럼틀', null, 150, 'furniture'),
  ('✨ 보석 상자', null, 70, 'deco'),
  ('✨ 로얄 왕좌', null, 200, 'furniture'),
  ('✨ 분수대', null, 180, 'deco'),
  ('✨ 성 모양 침대', null, 250, 'furniture'),
  ('✨ 우주선 모형', null, 160, 'deco'),
  ('✨ 용 인형', null, 130, 'deco'),
  ('✨ 마법 지팡이', null, 60, 'deco'),
  ('✨ 별자리 액자', null, 75, 'deco'),
  ('✨ 다이아몬드 샹들리에', null, 220, 'furniture'),
  ('✨ 골드 트로피', null, 65, 'deco'),
  ('✨ 미니 수영장', null, 260, 'furniture'),
  ('✨ 레인보우 커튼', null, 85, 'deco'),
  ('✨ 그랜드 피아노', null, 300, 'furniture'),
  ('✨ 드래곤 알', null, 95, 'deco'),
  ('✨ 마법 융단', null, 140, 'floor'),
  ('✨ 별빛 텐트', null, 170, 'furniture'),
  ('✨ 황금 리트리버 인형', null, 100, 'deco')
on conflict (name) do nothing;

-- 캐릭터 레어 아이템 (30~150P)
insert into pet_catalog (name, type, image_url, price, effect) values
  ('✨ 스페셜 케이크', 'food', null, 40, '{"hunger": 60, "happiness": 30}'),
  ('✨ 황금 사과', 'food', null, 35, '{"hunger": 50, "happiness": 20}'),
  ('✨ 마법 물약', 'toy', null, 45, '{"happiness": 50}'),
  ('✨ 반짝이는 공', 'toy', null, 35, '{"happiness": 35, "cleanliness": 10}'),
  ('✨ 프리미엄 샴푸', 'toy', null, 30, '{"cleanliness": 50}'),
  ('✨ 다이아몬드 왕관', 'outfit', null, 150, '{}'),
  ('✨ 용 날개 옷', 'outfit', null, 130, '{}'),
  ('✨ 황금 옷', 'outfit', null, 110, '{}'),
  ('✨ 유니콘 뿔', 'outfit', null, 90, '{}'),
  ('✨ 마법사 로브', 'outfit', null, 100, '{}'),
  ('✨ 슈퍼히어로 망토', 'outfit', null, 80, '{}')
on conflict (name) do nothing;
