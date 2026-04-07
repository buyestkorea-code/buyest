export async function onRequest({ env }) {
  return new Response(
    JSON.stringify({
      hasDB: !!env.DB,
      envKeys: Object.keys(env || {})
    }, null, 2),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}