export async function onRequestPost(context) {
  const sample = [
    { brand: '막스마라', item: '행_2525496011 033_34', barcode: '10028939', stock: 1 },
    { brand: '막스마라', item: '행_2525496011 033_36', barcode: '10028940', stock: 1 },
    { brand: '막스마라', item: '행_2525496012 065_38', barcode: '10028983', stock: 1 }
  ];
  await context.env.STOCK_KV.put('stock_data', JSON.stringify(sample));
  return Response.json({ ok: true, count: sample.length });
}
