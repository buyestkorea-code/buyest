function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function normalizeBarcode(v) {
  return String(v || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}

export async function onRequestGet({ request, env }) {
  try {
    if (!env.DB) {
      return json({ ok: false, error: "D1 바인딩(DB)이 없습니다." }, 500);
    }

    const url = new URL(request.url);
    const barcode = normalizeBarcode(url.searchParams.get("barcode"));

    if (!barcode) {
      return json({ ok: false, error: "barcode 파라미터가 필요합니다." }, 400);
    }

    const rows = await env.DB.prepare(`
      SELECT barcode, name, option_text, qty, updated_at
      FROM stock
      WHERE REPLACE(REPLACE(TRIM(barcode), ' ', ''), '-', '') = ?
      ORDER BY id DESC
      LIMIT 20
    `).bind(barcode).all();

    const items = rows?.results || [];

    return json({
      ok: true,
      found: items.length > 0,
      barcode,
      items,
    });
  } catch (err) {
    return json({
      ok: false,
      error: "조회 실패",
      detail: String(err?.message || err),
    }, 500);
  }
}
