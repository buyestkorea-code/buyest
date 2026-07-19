// 오늘의 미션(AR 숙제) 외부 사이트 주소.
// .env 파일의 VITE_AR_MISSION_URL 값을 사용합니다. (.env.example 참고)
// 주소가 정해지면 .env 에 VITE_AR_MISSION_URL=실제주소 를 넣고 다시 배포하면 됩니다.
export const AR_MISSION_URL = import.meta.env.VITE_AR_MISSION_URL || 'https://login.renaissance.com/10956735-9bde-4cb1-ab1c-7dba1060d593?state=16ea2b66-66cd-413f-8240-aed1d77458c6'

export const AR_MISSION_POINTS = 20
