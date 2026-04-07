function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return json({ ok: false, error: "D1 바인딩(DB)이 없습니다." }, 500);
    }

    const count = await env.DB.prepare("SELECT COUNT(*) AS cnt FROM stock").first();

    const sample = await env.DB.prepare(`
      SELECT id, barcode, name, option_text, qty, updated_at
      FROM stock
      ORDER BY id DESC
      LIMIT 10
    `).all();

    return json({
      ok: true,
      count: count?.cnt ?? 0,
      sample: sample?.results ?? [],
    });
  } catch (err) {
    return json({
      ok: false,
      error: String(err?.message || err),
    }, 500);
  }
}
