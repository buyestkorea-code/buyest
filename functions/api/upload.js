export async function onRequest() {
  return new Response("UPLOAD_OK", {
    headers: { "Content-Type": "text/plain" }
  });
}
