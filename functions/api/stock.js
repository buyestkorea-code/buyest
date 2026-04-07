export async function onRequestGet(context) {
  const raw = await context.env.STOCK_KV.get('stock_data');
  const rows = raw ? JSON.parse(raw) : [];
  return Response.json({ rows });
}
