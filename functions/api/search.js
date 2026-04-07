function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function cleanBarcode(v) {
  return String(v || "").trim().replace(/\s+/g, "");
}

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    if (!env.DB) {
      return json({ ok: false, error: "D1 바인딩(DB)이 없습니다." }, 500);
    }

    const url = new URL(request.url);
    const barcode = cleanBarcode(url.searchParams.get("barcode"));

    if (!barcode) {
      return json({ ok: false, error: "barcode 파라미터가 필요합니다." }, 400);
    }

    const rows = await env.DB
      .prepare(`
        SELECT barcode, name, option_text, qty, updated_at
        FROM stock
        WHERE barcode = ?
        ORDER BY id DESC
      `)
      .bind(barcode)
      .all();

    const results = rows?.results || [];

    if (!results.length) {
      return json({
        ok: true,
        found: false,
        barcode,
        items: [],
      });
    }

    return json({
      ok: true,
      found: true,
      barcode,
      items: results,
    });
  } catch (err) {
    return json({
      ok: false,
      error: "조회 실패",
      detail: String(err?.message || err),
    }, 500);
  }
}