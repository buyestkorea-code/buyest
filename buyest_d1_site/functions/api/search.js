export async function onRequestGet({ request, env }) {
  try {
    if (!env || !env.DB) {
      return Response.json(
        { error: "D1 연결 안됨: Pages Settings > Bindings 에서 DB 확인" },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const barcode = (url.searchParams.get("barcode") || "").trim();

    if (!barcode) {
      return Response.json({ error: "바코드를 입력하세요." }, { status: 400 });
    }

    const row = await env.DB
      .prepare(`SELECT brand, group_code, size FROM stock WHERE barcode = ? LIMIT 1`)
      .bind(barcode)
      .first();

    if (!row) {
      return Response.json({ error: "해당 바코드를 찾지 못했습니다." }, { status: 404 });
    }

    const list = await env.DB
      .prepare(`SELECT size, stock_qty FROM stock WHERE group_code = ? ORDER BY size`)
      .bind(row.group_code)
      .all();

    return Response.json({
      brand: row.brand,
      group_code: row.group_code,
      scanned_size: row.size,
      items: list.results || []
    });
  } catch (err) {
    return Response.json(
      { error: "조회 오류: " + (err?.message || String(err)) },
      { status: 500 }
    );
  }
}
