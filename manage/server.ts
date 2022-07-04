import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';

interface Environment {
  links: KVNamespace;
}

const handleRequest = createPagesFunctionHandler<Environment>({
  build,
  // eslint-disable-next-line no-undef
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => context.env,
});

export function onRequest(context: EventContext<Environment, any, any>) {
  return handleRequest(context);
}
