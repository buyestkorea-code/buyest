BUYEST KIDS - Cloudflare 한 사이트 버전

이 버전은:
- 고객용 재고조회 페이지 (/)
- 관리자용 업로드 페이지 (/admin)
- 업로드된 재고를 Cloudflare KV에 저장
- 고객은 항상 최신 데이터를 조회

중요:
1) 이 버전은 Cloudflare Pages Functions + KV 를 사용합니다.
2) Cloudflare 대시보드의 'Upload assets' 드래그앤드롭 방식만으로는 /functions 디렉토리가 동작하지 않습니다.
3) 배포는 아래 둘 중 하나로 해야 합니다.
   - GitHub 연동 배포 (권장)
   - Wrangler CLI 배포

필수 Cloudflare 설정:
1. Pages 프로젝트 생성
2. KV namespace 생성
3. Pages 프로젝트 > Settings > Bindings > Add > KV namespace
4. Variable name 을 STOCK_KV 로 설정
5. Redeploy

KV에는 아래 key로 저장됩니다.
- key: stock_data

관리자 사용 순서:
1. /admin 접속
2. 비밀번호 입력
3. 엑셀 선택
4. 업로드
5. 업로드 성공 후 고객 페이지에서 바로 조회 가능

고객 사용 순서:
1. 메인 페이지 접속
2. 바코드 직접 입력 또는 카메라 스캔
3. 같은 그룹 상품의 사이즈별 재고 조회

기본 관리자 비밀번호:
buyest2026

반드시 바꿔서 쓰세요.
functions/api/admin/upload.js 파일 안의 ADMIN_PASSWORD 값을 수정하면 됩니다.
