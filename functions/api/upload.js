export async function onRequestPost({ request, env }) {

  const pw = request.headers.get("x-password");
  if (pw !== "1234") {
    return new Response("비밀번호 틀림");
  }

  const formData = await request.formData();
  const file = formData.get("file");

  const text = await file.text();
  const lines = text.split("\n");

  let groups = {};

  for (let i = 2; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 5) continue;

    const brand = cols[0];
    const name = cols[1];
    const barcode = cols[3];
    const stock = parseInt(cols[4]) || 0;

    if (!barcode) continue;

    let parts = name.split("_");
    let group = "";
    let size = "";

    if (parts.length === 3) {
      group = parts[1];
      size = parts[2];
    } else if (parts.length === 2) {
      group = parts[0];
      size = parts[1];
    } else {
      continue;
    }

    await env.STOCK_KV.put(
      "barcode:" + barcode,
      JSON.stringify({ brand, group, size })
    );

    if (!groups[group]) {
      groups[group] = { brand, sizes: {} };
    }

    groups[group].sizes[size] = stock;
  }

  for (const g in groups) {
    await env.STOCK_KV.put("group:" + g, JSON.stringify(groups[g]));
  }

  return new Response("업로드 완료");
}