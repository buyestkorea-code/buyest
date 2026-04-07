function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function normalizeHeader(h) {
  return String(h || "")
    .replace(/\uFEFF/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/["']/g, "");
}

function cleanText(v) {
  return String(v ?? "").replace(/\uFEFF/g, "").trim();
}

function toInt(v) {
  const s = String(v ?? "").replace(/[^\d-]/g, "");
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : 0;
}

function detectDelimiter(text) {
  const lines = text.split(/\r\n|\n|\r/).filter(v => v.trim() !== "");
  const firstFew = lines.slice(0, 5).join("\n");
  const counts = [
    { d: ",", n: (firstFew.match(/,/g) || []).length },
    { d: ";", n: (firstFew.match(/;/g) || []).length },
    { d: "\t", n: (firstFew.match(/\t/g) || []).length },
    { d: "|", n: (firstFew.match(/\|/g) || []).length },
  ].sort((a, b) => b.n - a.n);

  return counts[0].n > 0 ? counts[0].d : ",";
}

function parseCSV(text) {
  const delimiter = detectDelimiter(text);
  const rows = [];

  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && ch === delimiter) {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell);
      cell = "";

      const hasSomeValue = row.some(v => String(v).trim() !== "");
      if (hasSomeValue) rows.push(row);

      row = [];
      continue;
    }

    cell += ch;
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell);
    const hasSomeValue = row.some(v => String(v).trim() !== "");
    if (hasSomeValue) rows.push(row);
  }

  if (!rows.length) {
    return { delimiter, headers: [], items: [] };
  }

  // 헤더 후보를 직접 찾는다.
  // "바코드", "품목명", "재고량", "품목코드" 같은 값이 있는 행을 우선 헤더로 사용
  const headerKeywords = [
    "barcode", "바코드",
    "name", "품목명", "상품명",
    "qty", "재고량", "재고", "수량",
    "품목코드", "상품코드", "code"
  ].map(normalizeHeader);

  let headerIndex = -1;
  let bestScore = -1;

  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const normalized = rows[i].map(normalizeHeader);
    let score = 0;
    for (const cell of normalized) {
      if (headerKeywords.includes(cell)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      headerIndex = i;
    }
  }

  if (headerIndex < 0) headerIndex = 0;

  const headers = rows[headerIndex].map(normalizeHeader);
  const items = [];

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const cols = rows[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j] || `col_${j}`] = cleanText(cols[j] || "");
    }
    items.push(obj);
  }

  return { delimiter, headers, items, headerIndex };
}

function pickValue(row, keys) {
  for (const key of keys) {
    const k = normalizeHeader(key);
    if (row[k] !== undefined && String(row[k]).trim() !== "") {
      return String(row[k]).trim();
    }
  }
  return "";
}

function mapRow(raw) {
  const barcode = pickValue(raw, [
    "barcode",
    "바코드",
    "바코드번호",
    "ean",
    "jan",
    "code",
    "상품코드",
    "품목코드",
    "코드",
    "model",
    "모델",
    "모델명",
  ]);

  const name = pickValue(raw, [
    "name",
    "상품명",
    "품목명",
    "품명",
    "productname",
    "itemname",
    "상품이름",
  ]);

  const option_text = pickValue(raw, [
    "option",
    "옵션",
    "size",
    "사이즈",
    "color",
    "색상",
    "분류명",
  ]);

  const qty = toInt(
    pickValue(raw, [
      "qty",
      "수량",
      "재고",
      "재고량",
      "재고수량",
      "stock",
      "inventory",
      "invqty",
    ])
  );

  return {
    barcode: cleanText(barcode).replace(/\s+/g, ""),
    name: cleanText(name),
    option_text: cleanText(option_text),
    qty,
    raw_json: JSON.stringify(raw),
  };
}

async function readUploadedFileText(file) {
  const ab = await file.arrayBuffer();

  // 1차: UTF-8
  try {
    const utf8 = new TextDecoder("utf-8", { fatal: true }).decode(ab);
    return utf8;
  } catch (_) {}

  // 2차: EUC-KR/CP949 대체
  // 브라우저/런타임에서 euc-kr 지원되는 경우 사용
  try {
    const euckr = new TextDecoder("euc-kr", { fatal: true }).decode(ab);
    return euckr;
  } catch (_) {}

  // 3차: 실패 시 강제 UTF-8 fallback
  return new TextDecoder("utf-8").decode(ab);
}

export async function onRequestGet({ env }) {
  return json({
    ok: true,
    route: "/api/upload",
    hasDB: !!env.DB,
    envKeys: Object.keys(env || {}),
  });
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) {
      return json({ ok: false, error: "D1 바인딩(DB)이 없습니다." }, 500);
    }

    const form = await request.formData();
    const password = String(form.get("password") || "");
    const file = form.get("file");

    if (password !== "1234") {
      return json({ ok: false, error: "비밀번호가 틀렸습니다." }, 401);
    }

    if (!file || typeof file === "string") {
      return json({ ok: false, error: "파일이 없습니다." }, 400);
    }

    const text = await readUploadedFileText(file);

    if (!text || !text.trim()) {
      return json({
        ok: false,
        error: "파일 내용이 비어 있습니다.",
      }, 400);
    }

    const parsed = parseCSV(text);

    if (!parsed.items.length) {
      return json({
        ok: false,
        error: "CSV 데이터가 부족합니다.",
        debug: {
          headerIndex: parsed.headerIndex,
          headers: parsed.headers,
          preview: text.slice(0, 300),
        },
      }, 400);
    }

    const mapped = parsed.items
      .map(mapRow)
      .filter(r => r.barcode);

    if (!mapped.length) {
      return json({
        ok: false,
        error: "유효한 바코드 데이터가 없습니다.",
        debug: {
          headerIndex: parsed.headerIndex,
          headers: parsed.headers,
          firstRow: parsed.items[0] || null,
        },
      }, 400);
    }

    await env.DB.prepare("DELETE FROM stock").run();

    const chunkSize = 200;
    let inserted = 0;

    for (let i = 0; i < mapped.length; i += chunkSize) {
      const chunk = mapped.slice(i, i + chunkSize);

      const statements = chunk.map(item =>
        env.DB.prepare(`
          INSERT INTO stock (barcode, name, option_text, qty, raw_json, updated_at)
          VALUES (?, ?, ?, ?, ?, datetime('now'))
        `).bind(
          item.barcode,
          item.name,
          item.option_text,
          item.qty,
          item.raw_json
        )
      );

      await env.DB.batch(statements);
      inserted += chunk.length;
    }

    const count = await env.DB.prepare("SELECT COUNT(*) AS cnt FROM stock").first();

    return json({
      ok: true,
      message: "업로드 완료",
      inserted,
      totalInDb: count?.cnt ?? inserted,
      debug: {
        headerIndex: parsed.headerIndex,
        headers: parsed.headers,
        firstMapped: mapped[0] || null,
      },
    });
  } catch (err) {
    return json({
      ok: false,
      error: "업로드 실패",
      detail: String(err?.message || err),
    }, 500);
  }
}