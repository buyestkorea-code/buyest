export async function onRequest({ env }) {
  return new Response(
    JSON.stringify(
      {
        hasDB: !!env.DB,
        envKeys: Object.keys(env || {}),
        dbType: env.DB ? typeof env.DB : null
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