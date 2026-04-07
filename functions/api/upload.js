export async function onRequest() {
  return new Response(
    JSON.stringify(
      {
        ok: true,
        test: "upload route alive"
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
}