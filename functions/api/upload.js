export async function onRequestPost({ request, env }) {
  try {
    if (!env || !env.STOCK_KV) {
      return new Response(
        "KV 연결 안됨: Pages 프로젝트 Settings > Bindings 에서 STOCK_KV 확인",
        { status: 500 }
      );
    }

    const pw = request.headers.get("x-password");
    if (pw !== "1234") {
      return new Response("비밀번호 틀림", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response("파일이 없습니다.", { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    function decodeBytes(bytes, encoding) {
      return new TextDecoder(encoding).decode(bytes);
    }

    function looksKoreanHeader(text) {
      return (
        text.includes("분류명") &&
        text.includes("품목명") &&
        text.includes("바코드") &&
        text.includes("재고량")
      );
    }

    let text = "";
    try {
      text = decodeBytes(bytes, "utf-8");
    } catch (_) {}

    if (!looksKoreanHeader(text)) {
      try {
        text = decodeBytes(bytes, "euc-kr");
      } catch (_) {}
    }

    if (!text || !text.trim()) {
      return new Response("파일 내용이 비어 있습니다.", { status: 400 });
    }

    const lines = text
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .map(v => v.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return new Response("CSV 줄 수가 너무 적습니다.", { status: 400 });
    }

    function parseCsvLine(line) {
      const result = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        const next = line[i + 1];

        if (ch === '"') {
          if (inQuotes && next === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }

      result.push(current.trim());
      return result;
    }

    let headerIndex = -1;
    let headerCols = [];

    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const cols = parseCsvLine(lines[i]);
      if (
        cols.includes("분류명") &&
        cols.includes("품목명") &&
        cols.includes("바코드") &&
        cols.includes("재고량")
      ) {
        headerIndex = i;
        headerCols = cols;
        break;
      }
    }

    if (headerIndex === -1) {
      return new Response(
        "헤더를 찾지 못했습니다. CSV를 UTF-8 또는 EUC-KR로 저장했는지 확인하세요.",
        { status: 400 }
      );
    }

    const idxBrand = headerCols.indexOf("분류명");
    const idxName = headerCols.indexOf("품목명");
    const idxBarcode = headerCols.indexOf("바코드");
    const idxStock = headerCols.indexOf("재고량");

    function parseName(nameRaw) {
      const name = String(nameRaw || "").trim();
      if (!name) return null;

      const parts = name.split("_").map(v => v.trim()).filter(Boolean);

      let group = "";
      let size = "";

      if (parts.length >= 3) {
        group = parts[parts.length - 2];
        size = parts[parts.length - 1];
      } else if (parts.length === 2) {
        group = parts[0];
        size = parts[1];
      } else {
        return null;
      }

      if (!group || !size) return null;

      return { group, size };
    }

    const groups = {};
    let savedBarcodeCount = 0;
    let savedGroupCount = 0;
    let skippedCount = 0;

    for (let i = headerIndex + 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);

      const brand = (cols[idxBrand] || "").trim();
      const name = (cols[idxName] || "").trim();
      const barcode = (cols[idxBarcode] || "").trim();
      const stockRaw = (cols[idxStock] || "").trim();

      if (!barcode || !name) {
        skippedCount++;
        continue;
      }

      const parsed = parseName(name);
      if (!parsed) {
        skippedCount++;
        continue;
      }

      const stock = Number(String(stockRaw).replace(/[^0-9\-]/g, "")) || 0;
      const { group, size } = parsed;

      await env.STOCK_KV.put(
        "barcode:" + barcode,
        JSON.stringify({ brand, group, size })
      );
      savedBarcodeCount++;

      if (!groups[group]) {
        groups[group] = { brand, sizes: {} };
      }
      groups[group].sizes[size] = stock;
    }

    for (const groupCode of Object.keys(groups)) {
      await env.STOCK_KV.put(
        "group:" + groupCode,
        JSON.stringify(groups[groupCode])
      );
      savedGroupCount++;
    }

    return new Response(
      `업로드 완료
바코드 저장: ${savedBarcodeCount}건
묶음코드 저장: ${savedGroupCount}건
건너뜀: ${skippedCount}건`,
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      "서버 오류: " + (err && err.message ? err.message : String(err)),
      { status: 500 }
    );
  }
}