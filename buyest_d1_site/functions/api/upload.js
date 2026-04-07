export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      ok: true,
      method: "GET",
      route: "/api/upload",
      message: "alive"
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
}

export async function onRequestPost({ request }) {
  try {
    const raw = await request.text();

    return new Response(
      JSON.stringify({
        ok: true,
        method: "POST",
        route: "/api/upload",
        length: raw.length,
        preview: raw.slice(0, 200)
      }),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: e?.message || String(e)
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    );
  }
}