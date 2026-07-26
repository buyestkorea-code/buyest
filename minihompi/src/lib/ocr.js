import { recognize } from 'tesseract.js'

// 사진 속 영어 글자를 인식합니다. (Tesseract.js, 무료/오픈소스, 클라이언트에서 실행)
export async function recognizeEnglishText(imageFile) {
  const { data } = await recognize(imageFile, 'eng')
  return (data?.text || '').trim()
}
