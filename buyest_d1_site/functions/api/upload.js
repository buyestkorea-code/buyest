export async function onRequest(context) {
  return new Response("UPLOAD_OK", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}