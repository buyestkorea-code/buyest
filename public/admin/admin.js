const excelFile = document.getElementById('excelFile');
const uploadBtn = document.getElementById('uploadBtn');
const statusText = document.getElementById('statusText');
const rowCount = document.getElementById('rowCount');
const preview = document.getElementById('preview');
const adminPassword = document.getElementById('adminPassword');

function normalize(v) {
  return String(v ?? '').trim();
}

uploadBtn.addEventListener('click', async () => {
  const file = excelFile.files?.[0];
  const password = adminPassword.value.trim();

  if (!password) {
    alert('관리자 비밀번호를 입력해 주세요.');
    return;
  }
  if (!file) {
    alert('엑셀 파일을 선택해 주세요.');
    return;
  }

  try {
    statusText.textContent = '엑셀 읽는 중';
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const mapped = rows
      .map(row => ({
        brand: normalize(row['분류명']),
        item: normalize(row['품목명']),
        barcode: normalize(row['바코드']),
        stock: Number(row['재고량']) || 0
      }))
      .filter(row => row.brand && row.item && row.barcode);

    rowCount.textContent = `${mapped.length}건`;
    preview.textContent = JSON.stringify(mapped.slice(0, 20), null, 2);

    statusText.textContent = '서버 저장 중';
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password
      },
      body: JSON.stringify({ rows: mapped })
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || '업로드 실패');
    }

    statusText.textContent = `업로드 완료 (${result.count}건 저장)`;
    alert(`업로드 완료: ${result.count}건 저장됨`);
  } catch (error) {
    console.error(error);
    statusText.textContent = '실패';
    alert(error.message || '업로드 중 오류가 발생했습니다.');
  }
});
