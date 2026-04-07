const ADMIN_PASSWORD = 'buyest2026';

export async function onRequestPost(context) {
  const password = context.request.headers.get('x-admin-password') || '';

  if (password !== ADMIN_PASSWORD) {
    return Response.json({ error: '관리자 비밀번호가 틀렸습니다.' }, { status: 401 });
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  const rows = Array.isArray(body.rows) ? body.rows : null;
  if (!rows) {
    return Response.json({ error: 'rows 데이터가 없습니다.' }, { status: 400 });
  }

  const cleaned = rows
    .map(row => ({
      brand: String(row.brand ?? '').trim(),
      item: String(row.item ?? '').trim(),
      barcode: String(row.barcode ?? '').trim(),
      stock: Number(row.stock) || 0
    }))
    .filter(row => row.brand && row.item && row.barcode);

  await context.env.STOCK_KV.put('stock_data', JSON.stringify(cleaned));

  return Response.json({
    ok: true,
    count: cleaned.length
  });
}
