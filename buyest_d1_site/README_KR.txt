BUYEST D1 버전

파일 구조
- index.html
- admin.html
- functions/api/search.js
- functions/api/upload-chunk.js
- schema.sql

설정 순서
1) Cloudflare > Storage & Databases > D1 > Create database
2) schema.sql 실행
3) Pages 프로젝트 > Settings > Bindings > Add > D1 database
4) Variable name = DB
5) 배포 후 /admin.html 에서 CSV 업로드
6) 고객은 / 에서 바코드 조회
