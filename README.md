# BUYEST Cloudflare Pages + D1 재고 조회 사이트

## 폴더 구조

```text
/
  buyest_d1_site/
    index.html
    admin.html
  functions/
    api/
      upload.js
      search.js
  schema.sql
```

## Cloudflare Pages 설정

### 1. GitHub 업로드
이 폴더 전체를 GitHub 저장소 루트에 그대로 업로드

### 2. Pages 연결
- Framework preset: None
- Build command: 비움
- Build output directory: `buyest_d1_site`
- Root directory: 비움

### 3. D1 생성
Cloudflare > Storage & Databases > D1 에서 DB 생성

### 4. schema.sql 적용
D1 콘솔에서 `schema.sql` 내용을 실행

### 5. Pages에 D1 바인딩 연결
Pages 프로젝트 > Settings > Functions > D1 bindings
- Variable name: `DB`
- Database: 방금 만든 D1 선택

## 관리자 비밀번호
현재 기본값은 `1234`

변경 위치:
- `functions/api/upload.js`
  - `if (pw !== '1234')`

## 사용 방법
1. `/admin.html` 접속
2. 비밀번호 입력
3. CSV 업로드
4. 첫 청크 업로드 시 기존 stock 전체 삭제 후 새로 등록
5. `/` 에서 검색

## CSV 권장 형식
첫 줄 헤더 포함 CSV

자동 인식 후보 헤더:
- 상품코드: `product_code`, `상품코드`, `품번`, `model`, `code`
- 상품명: `product_name`, `상품명`, `name`
- 옵션: `option`, `옵션`, `size`, `사이즈`
- 수량: `qty`, `수량`, `stock`, `재고`, `재고수량`, `INV. QTY`
- 가격: `price`, `판매가`, `가격`, `금액`, `UNIT PRICE`
- 위치: `location`, `재고위치`, `위치`
- 브랜드: `brand`, `브랜드`, `BRAND`

## 주의
- `functions/api/upload.js` 는 JSON 방식 업로드만 받음
- `admin.html`도 JSON으로 전송하도록 이미 맞춰져 있음
- 업로드 오류가 나면 먼저 D1 바인딩 이름이 `DB`인지 확인
