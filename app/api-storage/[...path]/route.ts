import { NextRequest, NextResponse } from "next/server";

const BACKEND_ORIGIN = (
  process.env.STORAGE_PROXY_URL ||
  process.env.BACKEND_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const safePath = path.map(encodeURIComponent).join("/");
    const upstreamUrl = `${BACKEND_ORIGIN}/storage/${safePath}${req.nextUrl.search}`;

    const upstream = await fetch(upstreamUrl, {
      cache: "no-store",
      headers: {
        Accept: req.headers.get("accept") || "image/*,*/*;q=0.8",
      },
    });

    if (!upstream.ok || !upstream.body) {
      return new NextResponse(null, { status: upstream.status });
    }

    const headers = new Headers();
    const contentType = upstream.headers.get("content-type");
    const contentLength = upstream.headers.get("content-length");
    const lastModified = upstream.headers.get("last-modified");
    const etag = upstream.headers.get("etag");

    if (contentType) headers.set("content-type", contentType);
    if (contentLength) headers.set("content-length", contentLength);
    if (lastModified) headers.set("last-modified", lastModified);
    if (etag) headers.set("etag", etag);
    headers.set("cache-control", "public, max-age=300, stale-while-revalidate=86400");

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Storage Proxy Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function HEAD(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const response = await GET(req, context);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}
