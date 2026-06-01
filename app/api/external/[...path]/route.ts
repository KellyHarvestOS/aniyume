import { NextRequest, NextResponse } from "next/server";

const BASE_URL = (process.env.BACKEND_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

export async function handleProxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const searchParams = req.nextUrl.search;

    const publicPrefixes = [
      "anime",
      "episodes",
      "tags",
      "schedule",
    ];

    // Authenticated anime sub-routes must NOT be rewritten to the public catalog.
    const privateAnimeRoute = /^anime\/[^/]+\/(status|user-status|episodes-watched)(\/|$)/.test(pathStr);

    const normalizedPath = pathStr.startsWith("public/") || privateAnimeRoute
      ? pathStr
      : publicPrefixes.some((prefix) => pathStr === prefix || pathStr.startsWith(`${prefix}/`))
        ? `public/${pathStr}`
        : pathStr;

    const isPrivate = !normalizedPath.startsWith("public/");

    const finalUrl = `${BASE_URL}/${normalizedPath}${searchParams}`;

    let token = req.headers.get("authorization") || "";
    if (token && !token.startsWith("Bearer ")) {
      token = `Bearer ${token}`;
    }

    const contentType = req.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");

    if (isMultipart) {
      const upstreamHeaders = new Headers(req.headers);
      if (token) upstreamHeaders.set("Authorization", token);
      upstreamHeaders.delete("host");

      const upstreamReq = new Request(finalUrl, {
        method: req.method,
        headers: upstreamHeaders,
        body: req.body,
        // @ts-expect-error Node fetch requires duplex when streaming multipart bodies.
        duplex: "half",
      });

      const response = await fetch(upstreamReq);
      const text = await response.text();

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      return NextResponse.json(data, { status: response.status });
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(token ? { Authorization: token } : {}),
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      headers["Content-Type"] = "application/json";
    }

    let revalidateTime = 0;

    if (req.method === "GET" && !isPrivate) {
      if (normalizedPath.includes("search")) {
        revalidateTime = 300;
      } else if (normalizedPath.includes("schedule")) {
        revalidateTime = 1800;
      } else {
        revalidateTime = 3600;
      }
    }

    const options: RequestInit = {
      method: req.method,
      headers,
    };

    if (revalidateTime > 0) {
      options.next = { revalidate: revalidateTime };
    } else {
      options.cache = "no-store";
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      const body = await req.text();
      if (body) options.body = body;
    }

    const response = await fetch(finalUrl, options);
    const text = await response.text();

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    const nextResponse = NextResponse.json(data, { status: response.status });

    if (revalidateTime > 0) {
      nextResponse.headers.set(
        "Cache-Control",
        `public, s-maxage=${revalidateTime}, stale-while-revalidate=59`
      );
    } else {
      nextResponse.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Proxy Error",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export {
  handleProxy as GET,
  handleProxy as POST,
  handleProxy as PATCH,
  handleProxy as DELETE,
  handleProxy as PUT,
};
