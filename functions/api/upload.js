function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function onRequestGet({ env }) {
  return json({
    ok: true,
    route: "/api/upload",
    version: "2026-04-08-debug-read-v1",
    hasDB: !!env.DB,
    envKeys: Object.keys(env || {}),
  });
}

export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();
    const password = String(form.get("password") || "");
    const file = form.get("file");

    if (password !== "1234") {
      return json({ ok: false, error: "비밀번호가 틀렸습니다." }, 401);
    }

    if (!file || typeof file === "string") {
      return json({ ok: false, error: "파일이 없습니다." }, 400);
    }

    const ab = await file.arrayBuffer();

    let utf8 = "";
    let euckr = "";
    let utf8Error = null;
    let euckrError = null;

    try {
      utf8 = new TextDecoder("utf-8", { fatal: true }).decode(ab);
    } catch (e) {
      utf8Error = String(e?.message || e);
    }

    try {
      euckr = new TextDecoder("euc-kr", { fatal: false }).decode(ab);
    } catch (e) {
      euckrError = String(e?.message || e);
    }

    const text = euckr || utf8 || new TextDecoder("utf-8").decode(ab);

    const normalized = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    const lines = normalized.split("\n");

    return json({
      ok: true,
      mode: "debug-upload-read",
      version: "2026-04-08-debug-read-v1",
      hasDB: !!env.DB,
      fileName: file.name || "",
      byteLength: ab.byteLength,
      utf8Error,
      euckrError,
      first200Utf8: utf8 ? utf8.slice(0, 200) : null,
      first200EucKr: euckr ? euckr.slice(0, 200) : null,
      lineCount: lines.length,
      first5Lines: lines.slice(0, 5),
    });
  } catch (err) {
    return json({
      ok: false,
      error: "debug upload failed",
      detail: String(err?.message || err),
    }, 500);
  }
}