// 도감 사진을 AI로 "도감 삽화" 스타일로 다시 그려주는 Edge Function
// Google Gemini 이미지 생성 모델을 사용합니다.
// 필요한 비밀값: GEMINI_API_KEY (Supabase 대시보드 > Edge Functions > Secrets 에서 등록)

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const MODEL = 'gemini-2.5-flash-image'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!GEMINI_API_KEY) {
    return json({ error: 'GEMINI_API_KEY가 설정되지 않았어요.' }, 500)
  }

  let body: { image?: string; mimeType?: string; name?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: '요청 형식이 올바르지 않아요.' }, 400)
  }

  const { image, mimeType, name } = body
  if (!image) {
    return json({ error: '이미지가 없어요.' }, 400)
  }

  const prompt =
    '이 사진을 어린이용 "관찰 도감" 삽화 스타일로 다시 그려줘. ' +
    '포켓몬 도감 카드처럼 선명한 검은 윤곽선, 밝고 또렷한 색, 깔끔한 평면 일러스트 느낌으로. ' +
    `사진 속 대상(${name || '이 사물'})의 생김새와 특징은 최대한 그대로 유지하고, 배경은 단순하게 정리해줘. ` +
    '사진처럼 보이지 않게, 손으로 그린 그림책 삽화처럼 만들어줘. 정사각형에 가까운 구도로.'

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType: mimeType || 'image/png', data: image } },
              ],
            },
          ],
        }),
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      return json({ error: `AI 변환 요청이 실패했어요: ${errText.slice(0, 300)}` }, 502)
    }

    const data = await geminiRes.json()
    const parts = data?.candidates?.[0]?.content?.parts || []
    const imagePart = parts.find((p: { inlineData?: { data?: string } }) => p.inlineData?.data)

    if (!imagePart) {
      return json({ error: 'AI가 이미지를 만들지 못했어요.' }, 502)
    }

    return json({
      image: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
    })
  } catch (e) {
    return json({ error: `오류가 발생했어요: ${String(e)}` }, 500)
  }
})
