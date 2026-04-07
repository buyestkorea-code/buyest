export async function onRequestGet({ request, env }) {
  try {
    if (!env.DB) {
      return json({ ok: false, error: 'D1 바인딩(DB)이 연결되지 않았습니다.' }, 500);
    }

    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();

    if (!q) {
      return json({ ok: false, error: '검색어가 없습니다.' }, 400);
    }

    const keyword = `%${q}%`;

    const { results } = await env.DB.prepare(`
      SELECT
        product_code,
        product_name,
        option_value,
        qty,
        price,
        location,
        brand,
        updated_at
      FROM stock
      WHERE product_code LIKE ?
         OR product_name LIKE ?
         OR option_value LIKE ?
         OR location LIKE ?
         OR brand LIKE ?
      ORDER BY updated_at DESC, id DESC
      LIMIT 200
    `).bind(keyword, keyword, keyword, keyword, keyword).all();

    return json({
      ok: true,
      count: results?.length ?? 0,
      items: results ?? []
    });
  } catch (e) {
    return json({
      ok: false,
      error: e?.message || String(e),
      stack: e?.stack || null
    }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
