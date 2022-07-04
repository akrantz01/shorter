import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { withEmotionCache } from '@emotion/react';
import type { LinksFunction, MetaFunction } from '@remix-run/cloudflare';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { ReactNode } from 'react';
import { useContext, useEffect } from 'react';

import Layout from '~/components/Layout';
import NotFound from '~/components/NotFound';
import { ClientStyleContext, ServerStyleContext } from '~/lib/context';

interface DocumentProps {
  children: ReactNode;
}

const Document = withEmotionCache(({ children }: DocumentProps, emotionCache): JSX.Element => {
  const clientStyleData = useContext(ClientStyleContext);
  const serverStyleData = useContext(ServerStyleContext);

  // Only executed on client
  useEffect(() => {
    // Re-link sheet container
    emotionCache.sheet.container = document.head;

    // Re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => (emotionCache.sheet as any)._insertTag(tag));

    // Reset cache to reapply global styles
    clientStyleData?.reset();
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style key={key} data-emotion={`${key} ${ids.join(' ')}`} dangerouslySetInnerHTML={{ __html: css }} />
        ))}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
});

interface BaseProps {
  children: ReactNode;
}

function Base({ children }: BaseProps): JSX.Element {
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          backgroundColor: 'gray.200',
          height: '100%',
        },
      },
    },
  });

  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Layout>{children}</Layout>
      </ChakraProvider>
    </Document>
  );
}

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
  },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Shorter',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <Base>
      <Outlet />
    </Base>
  );
}

export function CatchBoundary(): JSX.Element {
  return (
    <Base>
      <NotFound />
    </Base>
  );
}
