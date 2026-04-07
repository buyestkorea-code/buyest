export async function onRequest() {
  return new Response("SEARCH_OK", {
    headers: { "Content-Type": "text/plain" }
  });
}
