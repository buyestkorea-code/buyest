export async function onRequestPost({ request, env }) {
  try {
    if (!env || !env.DB) {
      return Response.json(
        { error: "D1 연결 안됨: Pages Settings > Bindings 에서 DB 확인" },
        { status: 500 }
      );
    }

    const pw = request.headers.get("x-password");
    if (pw !== "1234") {
      return Response.json({ error: "비밀번호 틀림" }, { status: 401 });
    }

    const body = await request.json();
    const rows = Array.isArray(body?.rows) ? body.rows : [];
    const replace = !!body?.replace;

    if (!rows.length) {
      return Response.json({ error: "전송된 데이터가 없습니다." }, { status: 400 });
    }

    if (replace) {
      await env.DB.prepare(`DELETE FROM stock`).run();
    }

    const stmts = rows.map((r) =>
      env.DB.prepare(`
        INSERT INTO stock (barcode, brand, group_code, size, stock_qty)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(barcode) DO UPDATE SET
          brand = excluded.brand,
          group_code = excluded.group_code,
          size = excluded.size,
          stock_qty = excluded.stock_qty
      `).bind(
        String(r.barcode || "").trim(),
        String(r.brand || "").trim(),
        String(r.group_code || "").trim(),
        String(r.size || "").trim(),
        Number(r.stock_qty || 0)
      )
    );

    await env.DB.batch(stmts);

    return Response.json({
      ok: true,
      saved: rows.length,
      message: "청크 저장 완료"
    });
  } catch (err) {
    return Response.json(
      { error: "업로드 오류: " + (err?.message || String(err)) },
      { status: 500 }
    );
  }
}
