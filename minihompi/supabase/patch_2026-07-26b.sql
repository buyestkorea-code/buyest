-- 2026-07-26 패치 (2): 방명록 새 글 알림 기능용 컬럼 추가
-- SQL Editor 에서 새 쿼리로 실행하세요.

alter table profile add column if not exists guestbook_seen_at timestamptz default now();
