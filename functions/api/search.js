function normalize(value) {
  return String(value ?? '').trim();
}

function makeGroupKey(itemName) {
  const name = normalize(itemName);
  const idx = name.lastIndexOf('_');
  return idx === -1 ? name : name.slice(0, idx).trim();
}

function getSize(itemName) {
  const name = normalize(itemName);
  const idx = name.lastIndexOf('_');
  return idx === -1 ? '-' : name.slice(idx + 1).trim();
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const barcode = normalize(url.searchParams.get('barcode'));

  if (!barcode) {
    return Response.json({ error: '바코드가 비어 있습니다.' }, { status: 400 });
  }

  const raw = await context.env.STOCK_KV.get('stock_data');
  const rows = raw ? JSON.parse(raw) : [];

  const target = rows.find(row => normalize(row.barcode) === barcode);
  if (!target) {
    return Response.json({ error: '등록되지 않은 바코드입니다.' }, { status: 404 });
  }

  const groupKey = makeGroupKey(target.item);
  const grouped = rows
    .filter(row => makeGroupKey(row.item) === groupKey)
    .map(row => ({
      brand: row.brand,
      item: row.item,
      barcode: row.barcode,
      stock: Number(row.stock) || 0,
      size: getSize(row.item)
    }))
    .sort((a, b) => a.size.localeCompare(b.size, undefined, { numeric: true, sensitivity: 'base' }));

  return Response.json({
    brand: target.brand,
    groupKey,
    rows: grouped
  });
}
