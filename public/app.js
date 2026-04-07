let stockRows = [];
let html5QrCode = null;
let scannerOpen = false;

const barcodeInput = document.getElementById('barcodeInput');
const searchBtn = document.getElementById('searchBtn');
const dataStatus = document.getElementById('dataStatus');
const lastBarcode = document.getElementById('lastBarcode');
const resultCard = document.getElementById('resultCard');
const emptyCard = document.getElementById('emptyCard');
const emptyTitle = document.getElementById('emptyTitle');
const brandText = document.getElementById('brandText');
const groupTitle = document.getElementById('groupTitle');
const subTitle = document.getElementById('subTitle');
const sizeList = document.getElementById('sizeList');
const scanToggleBtn = document.getElementById('scanToggleBtn');
const stopScanBtn = document.getElementById('stopScanBtn');
const scannerWrap = document.getElementById('scannerWrap');

function normalize(value) {
  return String(value ?? '').trim();
}

function makeGroupKey(itemName) {
  const name = normalize(itemName);
  const idx = name.lastIndexOf('_');
  return idx === -1 ? name : name.slice(0, idx).trim();
}

function getSize(itemName) {
  const name = normalize(itemName);
  const idx = name.lastIndexOf('_');
  return idx === -1 ? '-' : name.slice(idx + 1).trim();
}

function getStatusClass(stock) {
  const qty = Number(stock) || 0;
  if (qty <= 0) return 'stock-out';
  if (qty <= 2) return 'stock-low';
  return 'stock-ok';
}

function getStatusText(stock) {
  const qty = Number(stock) || 0;
  if (qty <= 0) return '품절';
  if (qty <= 2) return '소량 남음';
  return '재고 있음';
}

function renderResult(result) {
  emptyCard.classList.add('hidden');
  resultCard.classList.remove('hidden');
  brandText.textContent = result.brand || '브랜드';
  groupTitle.textContent = result.groupKey;
  subTitle.textContent = '바코드 기준으로 같은 상품군의 사이즈 재고를 보여줍니다.';
  sizeList.innerHTML = result.rows.map(row => {
    const statusClass = getStatusClass(row.stock);
    const statusText = getStatusText(row.stock);
    return `
      <div class="size-item">
        <div>
          <div class="size-name">${row.size}</div>
          <div class="hint">바코드 ${row.barcode}</div>
        </div>
        <div class="size-stock ${statusClass}">
          <span class="stock-count">${row.stock}개</span>
          <span class="stock-label">${statusText}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderEmpty(message) {
  resultCard.classList.add('hidden');
  emptyCard.classList.remove('hidden');
  emptyTitle.textContent = message || '등록되지 않은 바코드입니다';
}

async function loadStockStatus() {
  try {
    const res = await fetch('/api/stock');
    if (!res.ok) throw new Error('재고 데이터 로딩 실패');
    const data = await res.json();
    stockRows = Array.isArray(data.rows) ? data.rows : [];
    dataStatus.textContent = `${stockRows.length}건 로딩 완료`;
  } catch (e) {
    console.error(e);
    dataStatus.textContent = '서버 데이터 로딩 실패';
  }
}

async function runSearch(rawBarcode) {
  const barcode = normalize(rawBarcode);
  if (!barcode) {
    alert('바코드 번호를 입력해 주세요.');
    return;
  }
  lastBarcode.textContent = barcode;

  try {
    const res = await fetch(`/api/search?barcode=${encodeURIComponent(barcode)}`);
    const data = await res.json();

    if (!res.ok) {
      renderEmpty(data.error || '조회 실패');
      return;
    }
    renderResult(data);
  } catch (error) {
    console.error(error);
    renderEmpty('서버 조회 중 오류가 발생했습니다');
  }
}

async function startScanner() {
  if (!window.Html5Qrcode) {
    alert('스캔 라이브러리를 불러오지 못했습니다.');
    return;
  }
  if (scannerOpen) return;

  scannerWrap.classList.remove('hidden');
  scanToggleBtn.classList.add('hidden');
  html5QrCode = new Html5Qrcode('reader');

  try {
    await html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: (w, h) => {
          const min = Math.min(w, h);
          return { width: Math.floor(min * 0.9), height: Math.floor(min * 0.45) };
        },
        experimentalFeatures: { useBarCodeDetectorIfSupported: true }
      },
      (decodedText) => {
        barcodeInput.value = decodedText;
        runSearch(decodedText);
        stopScanner();
      },
      () => {}
    );
    scannerOpen = true;
  } catch (error) {
    console.error(error);
    alert('카메라 실행에 실패했습니다. 직접 입력으로 조회해 주세요.');
    stopScanner();
  }
}

async function stopScanner() {
  if (html5QrCode) {
    try { await html5QrCode.stop(); } catch (e) {}
    try { await html5QrCode.clear(); } catch (e) {}
  }
  html5QrCode = null;
  scannerOpen = false;
  scannerWrap.classList.add('hidden');
  scanToggleBtn.classList.remove('hidden');
}

searchBtn.addEventListener('click', () => runSearch(barcodeInput.value));
barcodeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runSearch(barcodeInput.value);
});
scanToggleBtn.addEventListener('click', startScanner);
stopScanBtn.addEventListener('click', stopScanner);

loadStockStatus();
