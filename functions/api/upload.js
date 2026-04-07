function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function toInt(v) {
  const n = parseInt(String(v ?? "").replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

async function readFileText(file) {
  const ab = await file.arrayBuffer();

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(ab);
  } catch (_) {}

  try {
    return new TextDecoder("euc-kr", { fatal: false }).decode(ab);
  } catch (_) {}

  return new TextDecoder("utf-8").decode(ab);
}

function parseLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export async function onRequestGet({ env }) {
  return json({
    ok: true,
    route: "/api/upload",
    version: "2026-04-08-fixed-kids-stock-v2",
    hasDB: !!env.DB
  });
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) {
      return json({ ok: false, error: "D1 바인딩(DB)이 없습니다." }, 500);
    }

    const form = await request.formData();
    const password = String(form.get("password") || "");
    const file = form.get("file");

    if (password !== "1234") {
      return json({ ok: false, error: "비밀번호가 틀렸습니다." }, 401);
    }

    if (!file || typeof file === "string") {
      return json({ ok: false, error: "파일이 없습니다." }, 400);
    }

    const text = await readFileText(file);
    const lines = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .filter(v => v.trim() !== "");

    if (lines.length < 2) {
      return json({
        ok: false,
        error: "CSV 데이터가 부족합니다.",
        debug: {
          version: "2026-04-08-fixed-kids-stock-v2",
          lineCount: lines.length,
          preview: lines.slice(0, 5)
        }
      }, 400);
    }

    // 제목행이 있으면 1행을 헤더로, 없으면 0행을 헤더로
    let headerRowIndex = 0;
    const firstLine = lines[0];
    const secondLine = lines[1] || "";

    if (firstLine.includes("상세재고현황") && secondLine.includes("바코드")) {
      headerRowIndex = 1;
    }

    const headers = parseLine(lines[headerRowIndex]).map(v => String(v).trim());

    const idxCategory = headers.indexOf("분류명");
    const idxName = headers.indexOf("품목명");
    const idxCode = headers.indexOf("품목코드");
    const idxBarcode = headers.indexOf("바코드");
    const idxQty = headers.indexOf("재고량");

    if (idxBarcode < 0 || idxName < 0 || idxQty < 0) {
      return json({
        ok: false,
        error: "헤더를 찾지 못했습니다.",
        debug: {
          version: "2026-04-08-fixed-kids-stock-v2",
          headerRowIndex,
          headers,
          preview: lines.slice(0, 5)
        }
      }, 400);
    }

    const mapped = [];

    for (let i = headerRowIndex + 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);

      const barcode = String(cols[idxBarcode] || "").trim().replace(/\s+/g, "");
      if (!barcode) continue;

      const name = String(cols[idxName] || "").trim();
      const qty = toInt(cols[idxQty] || "");
      const category = idxCategory >= 0 ? String(cols[idxCategory] || "").trim() : "";
      const itemCode = idxCode >= 0 ? String(cols[idxCode] || "").trim() : "";

      mapped.push({
        barcode,
        name,
        option_text: category,
        qty,
        raw_json: JSON.stringify({
          category,
          name,
          itemCode,
          barcode,
          qty
        })
      });
    }

    if (!mapped.length) {
      return json({
        ok: false,
        error: "유효한 바코드 데이터가 없습니다.",
        debug: {
          version: "2026-04-08-fixed-kids-stock-v2",
          headerRowIndex,
          headers
        }
      }, 400);
    }

    await env.DB.prepare("DELETE FROM stock").run();

    const chunkSize = 200;
    for (let i = 0; i < mapped.length; i += chunkSize) {
      const chunk = mapped.slice(i, i + chunkSize);
      const statements = chunk.map(item =>
        env.DB.prepare(`
          INSERT INTO stock (barcode, name, option_text, qty, raw_json, updated_at)
          VALUES (?, ?, ?, ?, ?, datetime('now'))
        `).bind(
          item.barcode,
          item.name,
          item.option_text,
          item.qty,
          item.raw_json
        )
      );
      await env.DB.batch(statements);
    }

    const count = await env.DB.prepare("SELECT COUNT(*) AS cnt FROM stock").first();

    return json({
      ok: true,
      message: "업로드 완료",
      inserted: mapped.length,
      totalInDb: count?.cnt ?? mapped.length,
      debug: {
        version: "2026-04-08-fixed-kids-stock-v2",
        headerRowIndex,
        headers,
        firstMapped: mapped[0]
      }
    });
  } catch (err) {
    return json({
      ok: false,
      error: "업로드 실패",
      detail: String(err?.message || err)
    }, 500);
  }
}