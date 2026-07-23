import type { Context } from "@netlify/edge-functions";

function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  return accept
    .split(",")
    .some((part) => part.trim().split(";")[0].trim() === "text/markdown");
}

function markdownPath(pathname: string): string {
  if (pathname === "/") return "/index.md";
  if (pathname.endsWith("/")) return `${pathname}index.md`;
  if (pathname.endsWith(".md")) return pathname;
  return `${pathname}/index.md`;
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export default async function markdownNegotiation(
  request: Request,
  context: Context,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return context.next();
  }

  if (!wantsMarkdown(request.headers.get("Accept"))) {
    return context.next();
  }

  const url = new URL(request.url);
  const mdUrl = new URL(markdownPath(url.pathname), url.origin);

  const mdResponse = await context.rewrite(mdUrl.toString());
  if (mdResponse.status === 404) {
    const llmsUrl = new URL("/llms.txt", url.origin);
    const llmsResponse = await context.rewrite(llmsUrl.toString());
    if (llmsResponse.status !== 200) {
      return context.next();
    }

    const llmsBody = request.method === "HEAD" ? null : await llmsResponse.text();
    const headers = new Headers({
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
    });
    if (llmsBody) {
      headers.set("x-markdown-tokens", String(estimateTokens(llmsBody)));
    }
    return new Response(llmsBody, { status: 200, headers });
  }

  if (mdResponse.status !== 200) {
    return context.next();
  }

  const body = request.method === "HEAD" ? null : await mdResponse.text();
  const headers = new Headers(mdResponse.headers);
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Vary", "Accept");
  if (body) {
    headers.set("x-markdown-tokens", String(estimateTokens(body)));
  }
  headers.delete("Content-Disposition");

  return new Response(body, { status: 200, headers });
}
