export async function onRequestPost({ request, env }) {
  try {
    const pw = request.headers.get("x-password");
    if (pw !== "1234") {
      return json(
        { ok: false, error: "비밀번호가 틀렸습니다." },
        401
      );
    }

    if (!env.DB) {
      return json(
        { ok: false, error: "D1 바인딩(DB)이 연결되지 않았습니다." },
        500
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return json(
        { ok: false, error: "JSON 요청만 허용됩니다." },
        400
      );
    }

    const body = await request.json();
    const headers = Array.isArray(body.headers) ? body.headers : [];
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const chunkIndex = Number(body.chunkIndex ?? 0);
    const totalChunks = Number(body.totalChunks ?? 1);
    const replaceAll = Boolean(body.replaceAll);

    if (!headers.length) {
      return json(
        { ok: false, error: "headers 값이 없습니다." },
        400
      );
    }

    if (!rows.length) {
      return json(
        { ok: false, error: "rows 값이 없습니다." },
        400
      );
    }

    // 첫 청크일 때 전체 비우기
    if (replaceAll) {
      await env.DB.prepare(`DELETE FROM stock`).run();
    }

    // 필요한 컬럼명 추정
    const colProductCode = findHeader(headers, [
      "product_code", "상품코드", "품번", "model", "MODEL", "code", "CODE"
    ]);
    const colProductName = findHeader(headers, [
      "product_name", "상품명", "name", "NAME"
    ]);
    const colOption = findHeader(headers, [
      "option", "옵션", "size", "사이즈", "SIZE"
    ]);
    const colQty = findHeader(headers, [
      "qty", "수량", "stock", "재고", "재고수량", "INV. QTY"
    ]);
    const colPrice = findHeader(headers, [
      "price", "판매가", "가격", "금액", "UNIT PRICE"
    ]);
    const colLocation = findHeader(headers, [
      "location", "재고위치", "위치"
    ]);
    const colBrand = findHeader(headers, [
      "brand", "브랜드", "BRAND"
    ]);

    const stmt = env.DB.prepare(`
      INSERT INTO stock (
        product_code,
        product_name,
        option_value,
        qty,
        price,
        location,
        brand,
        raw_json,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    const batch = [];

    for (const row of rows) {
      const productCode = getCell(row, colProductCode);
      const productName = getCell(row, colProductName);
      const optionValue = getCell(row, colOption);
      const qty = toInt(getCell(row, colQty));
      const price = toNumber(getCell(row, colPrice));
      const location = getCell(row, colLocation);
      const brand = getCell(row, colBrand);

      batch.push(
        stmt.bind(
          productCode,
          productName,
          optionValue,
          qty,
          price,
          location,
          brand,
          JSON.stringify(row)
        )
      );
    }

    if (batch.length > 0) {
      await env.DB.batch(batch);
    }

    const countResult = await env.DB.prepare(
      `SELECT COUNT(*) as cnt FROM stock`
    ).first();

    return json({
      ok: true,
      message: `청크 ${chunkIndex + 1}/${totalChunks} 업로드 완료`,
      inserted: batch.length,
      totalInDb: countResult?.cnt ?? 0
    });
  } catch (e) {
    return json(
      {
        ok: false,
        error: e?.message || String(e),
        stack: e?.stack || null
      },
      500
    );
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function findHeader(headers, candidates) {
  const lowered = headers.map(h => String(h || "").trim().toLowerCase());
  for (const candidate of candidates) {
    const idx = lowered.indexOf(String(candidate).trim().toLowerCase());
    if (idx !== -1) return headers[idx];
  }
  return null;
}

function getCell(row, key) {
  if (!key) return "";
  return String(row?.[key] ?? "").trim();
}

function toInt(value) {
  const n = parseInt(String(value || "").replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function toNumber(value) {
  const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}