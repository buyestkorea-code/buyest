# 도감 사진 AI 변환 켜기 (선택 사항)

지금은 사진을 올리면 무료 필터로 도감 그림체를 만들어요. 아래 단계를 따라오시면
진짜 AI(구글 Gemini)가 사진을 새로 그려주는 방식으로 업그레이드돼요.
**이 설정을 안 하셔도 앱은 그대로 잘 동작해요** (무료 필터가 계속 사용돼요).

## 1. 구글 AI Studio에서 API 키 만들기
1. https://aistudio.google.com/apikey 접속 → 구글 계정으로 로그인
2. "Create API key" 클릭 → 새 키 생성
3. 이미지 생성 모델은 결제(빌링) 계정 연결을 요구할 수 있어요. 화면 안내를 따라 등록해주세요.
4. 생성된 키 값(긴 문자열)을 복사해두세요.
   - 참고: 이미지 1장 변환에 대략 수십 원 정도의 비용이 들어요 (정확한 금액은 구글 AI Studio 요금 안내에서 확인해주세요).

## 2. Supabase에 Edge Function 만들기
1. https://supabase.com/dashboard/project/iiosooqpuwchvgfptizd/functions 접속
2. "Create a new function" (또는 "Deploy a new function") 클릭
3. 함수 이름을 정확히 `stylize-photo` 로 입력
4. 코드 편집기가 열리면, 이 저장소의 `supabase/functions/stylize-photo/index.ts` 파일 내용을
   전부 복사해서 붙여넣기
5. "Deploy" 버튼 클릭

## 3. API 키를 비밀값(Secret)으로 등록하기
1. https://supabase.com/dashboard/project/iiosooqpuwchvgfptizd/settings/functions 접속
2. "Secrets" 섹션에서 "Add new secret" 클릭
3. Name: `GEMINI_API_KEY`
4. Value: 1번에서 복사해둔 구글 API 키 값
5. 저장

## 4. 확인하기
앱의 "도감" 메뉴 → "사진으로 등록" → 사진 선택
"🤖 AI가 도감 그림으로 그려주는 중..." 이라는 문구가 뜨면 정상적으로 연결된 거예요.
(몇 초 정도 걸려요) 완료되면 "✨ AI가 새로 그려줬어요" 라고 표시돼요.

혹시 AI 연결에 문제가 생겨도 자동으로 무료 필터로 바뀌니 기능이 멈추지는 않아요.
