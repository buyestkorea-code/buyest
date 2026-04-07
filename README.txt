Cloudflare Pages + D1 최종 구조

1. schema.sql 실행
2. Pages 프로젝트에 D1 바인딩 이름을 반드시 DB 로 연결
3. 아래 폴더 구조 그대로 업로드

functions/api/upload.js
functions/api/search.js
functions/api/debug.js
public/admin.html
public/index.html

경로 설명
- /admin.html : CSV 업로드 관리자 페이지
- /index.html : 바코드 조회 / 카메라 스캔 페이지
- /api/upload : 업로드 API 상태 확인
- /api/debug : DB 저장 상태 확인
- /api/search?barcode=바코드값 : 조회 API

중요
- 업로드는 stock 테이블 데이터를 전체 교체
- 비밀번호는 upload.js / admin.html 에서 현재 1234
