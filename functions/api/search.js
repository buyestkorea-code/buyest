export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const barcodeData = await env.STOCK_KV.get("barcode:" + code, "json");
  if (!barcodeData) {
    return new Response(JSON.stringify({ error: "없음" }), { headers: { "Content-Type": "application/json" } });
  }

  const group = await env.STOCK_KV.get("group:" + barcodeData.group, "json");

  return new Response(JSON.stringify({
    brand: barcodeData.brand,
    group_code: barcodeData.group,
    scanned_size: barcodeData.size,
    sizes: group.sizes
  }), {
    headers: { "Content-Type": "application/json" }
  });
}