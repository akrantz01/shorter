import Link from "@/link";

async function handle(request: Request, { LINKS, ROOT_REDIRECT }: Bindings): Promise<Response> {
  // Get the link id
  const { pathname } = new URL(request.url);
  const id = decodeURIComponent(pathname.substring(1));

  // Redirect if no ID
  if (id.length === 0) return Response.redirect(ROOT_REDIRECT);

  // Retrieve the link
  const link = await LINKS.get<Link>(id, { type: "json" });
  if (link === null || !link.enabled) return new Response("not found", { status: 404 });

  // Increment the usages
  link.usages += 1;
  await LINKS.put(id, JSON.stringify(link));

  return Response.redirect(link.url);
}

const worker: ExportedHandler<Bindings> = { fetch: handle };
export default worker;
