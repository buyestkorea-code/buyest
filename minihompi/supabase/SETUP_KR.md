# Supabase 연결하기 (처음이어도 괜찮아요)

## 1. Supabase 프로젝트 만들기
1. https://supabase.com 접속 → "Start your project" → GitHub 계정으로 로그인
2. "New project" 클릭
   - Name: `seungmok-minihompi` (아무 이름이나 가능)
   - Database Password: 아무 비밀번호나 정해서 **꼭 메모**해두기
   - Region: `Northeast Asia (Seoul)` 선택
3. 1~2분 기다리면 프로젝트가 생성됩니다.

## 2. URL / anon key 확인하기
1. 왼쪽 메뉴에서 톱니바퀴 아이콘 **Project Settings** 클릭
2. **API** 메뉴 클릭
3. 아래 두 값을 복사해두세요.
   - `Project URL` (예: `https://abcd1234.supabase.co`)
   - `anon public` 키 (긴 문자열, `Project API keys` 항목)

이 두 값이 앞으로 이 프로젝트의 "열쇠"입니다.

## 3. 테이블 만들기 (SQL 실행)
1. 왼쪽 메뉴에서 **SQL Editor** 클릭 → "New query"
2. 이 폴더의 `schema.sql` 파일 내용을 전부 복사해서 붙여넣기
3. 우측 하단 **Run** 버튼 클릭
4. "Success" 라고 뜨면 완료! (왼쪽 **Table Editor** 메뉴에서 표들이 생긴 걸 확인할 수 있어요)

## 4. Storage 버킷 만들기 (사진 저장용)
1. 왼쪽 메뉴 **Storage** 클릭
2. "New bucket" 으로 아래 3개를 각각 만들기 (모두 **Public bucket** 체크 ✅)
   - `photos` (사진첩 사진)
   - `avatars` (대문 배경/프로필 사진)
   - `doodles` (그림일기)

## 5. 값 입력하기
### 로컬(내 컴퓨터)에서 개발할 때
`minihompi/.env.example` 파일을 복사해서 `minihompi/.env` 파일을 만들고, 2번에서 복사한 값을 채워넣으세요.

```
VITE_SUPABASE_URL=https://abcd1234.supabase.co
VITE_SUPABASE_ANON_KEY=긴-anon-key-값
VITE_AR_MISSION_URL=(AR 사이트 주소, 나중에 채워도 됨)
```

### GitHub Pages 자동 배포용 (필수)
GitHub Actions가 빌드할 때 이 값들을 읽을 수 있도록 저장소에 **Secrets** 로 등록해야 합니다.

1. GitHub 저장소 페이지 → **Settings** → **Secrets and variables** → **Actions**
2. "New repository secret" 으로 아래 3개를 각각 추가
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_AR_MISSION_URL`
3. 저장 후 `main` 브랜치에 push 하면 자동으로 다시 빌드/배포됩니다.

이 값들을 알려주시면 제가 대신 GitHub Secrets 에 등록해드릴 수도 있어요.
