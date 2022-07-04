import type { AppData, DataFunctionArgs } from '@remix-run/cloudflare';

interface AppContext {
  links: KVNamespace;
}

interface FunctionArgs extends DataFunctionArgs {
  context: AppContext;
}

export interface ActionFunction {
  (args: FunctionArgs): Promise<Response> | Response | Promise<AppData> | AppData;
}

export interface LoaderFunction {
  (args: FunctionArgs): Promise<Response> | Response | Promise<AppData> | AppData;
}

export interface ShortLink {
  usages: number;
  enabled: boolean;
  url: string;
}
