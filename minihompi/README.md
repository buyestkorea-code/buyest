# 승목이의 비밀기지 (미니홈피)

Vite + React 기반 모바일 전용 미니홈피. GitHub Pages 로 배포되고, 데이터는 Supabase 에 저장됩니다.

## 처음 설정하기

1. Supabase 연결: `supabase/SETUP_KR.md` 를 따라 프로젝트를 만들고 `supabase/schema.sql` 을 실행하세요.
2. 로컬 개발 시 `.env.example` 을 복사해 `.env` 를 만들고 값을 채워주세요.
3. GitHub Pages 자동 배포를 위해 저장소 Settings > Secrets 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_AR_MISSION_URL` 을 등록하세요.

## 로컬 개발

```bash
cd minihompi
npm install
npm run dev
```

## 배포

`main` 브랜치에 `minihompi/` 폴더 변경사항을 push 하면 `.github/workflows/deploy.yml` 이 자동으로 빌드하고 GitHub Pages 에 배포합니다.

배포 주소: `https://<github-user>.github.io/buyest/`

## 폴더 구조

- `src/pages` - 화면 단위 페이지 (대문/일기장/사진첩/미션/미니룸/캐릭터/메모장/프로필/방명록)
- `src/components` - 페이지별 UI 컴포넌트
- `src/hooks` - Supabase 데이터 fetch/CRUD 훅
- `src/contexts` - 포인트/레벨, 테마 스킨 전역 상태
- `src/config/arMission.js` - AR 미션 외부 사이트 주소 설정
- `supabase/schema.sql` - DB 테이블 및 RLS 정책
