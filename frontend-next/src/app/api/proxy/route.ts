export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url") || "";

  if (!rawUrl) {
    return new Response("Missing url", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  const allowedOrigin = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  let allowed: URL;
  try {
    allowed = new URL(allowedOrigin);
  } catch {
    allowed = new URL("http://localhost:8000");
  }

  // Restrict proxy to the configured API origin and typical upload paths.
  const sameOrigin = target.origin === allowed.origin;
  const allowedPath = target.pathname.startsWith("/uploads/") || target.pathname.startsWith("/static/");

  if (!sameOrigin || !allowedPath) {
    return new Response("Forbidden", { status: 403 });
  }

  const res = await fetch(target.toString());

  if (!res.ok) {
    return new Response(`Upstream error: ${res.status}`, { status: 502 });
  }

  const ct = res.headers.get("content-type") || "application/octet-stream";
  const cd = res.headers.get("content-disposition");

  const headers = new Headers();
  headers.set("content-type", ct);
  if (cd) headers.set("content-disposition", cd);
  headers.set("cache-control", "private, max-age=60");

  return new Response(res.body, {
    status: 200,
    headers,
  });
}
