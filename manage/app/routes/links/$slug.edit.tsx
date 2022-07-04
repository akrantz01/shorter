import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Switch,
} from '@chakra-ui/react';
import { json, redirect } from '@remix-run/cloudflare';
import { useActionData, useLoaderData, useParams } from '@remix-run/react';

import Form from '~/components/Form';
import type { ActionFunction, LoaderFunction, ShortLink } from '~/lib/types';
import type { Validated } from '~/lib/validate';
import validate from '~/lib/validate';

export const action: ActionFunction = async ({ request, context }) => {
  const params = await request.formData();

  // Validate inputs
  const result = validate(params);
  if (result.errors) return json(result, { status: 400 });

  const { values } = result;

  // Get the link
  const link = await context.links.get<ShortLink>(values.slug, { type: 'json' });
  if (!link) throw new Response('not found', { status: 404 });

  // Update the values
  const updated = { ...link, url: values.url, enabled: params.get('enabled') === '' };
  await context.links.put(values.slug, JSON.stringify(updated));

  return redirect(`/links/${values.slug}`);
};

export const loader: LoaderFunction = async ({ params, context }) => {
  const slug = params.slug as string;
  const link = await context.links.get<ShortLink>(slug, { type: 'json' });

  if (link) return link;
  else throw new Response('not found', { status: 404 });
};

export default function Edit(): JSX.Element {
  const { slug } = useParams();
  const data = useLoaderData<ShortLink>();
  const result = useActionData<Validated>();

  return (
    <Form title="Editing short-link" description="Change details about the short-link" returnTo={`/links/${slug}`}>
      <FormControl isReadOnly>
        <FormLabel htmlFor="slug">Slug</FormLabel>
        <InputGroup>
          <InputLeftAddon children="wffl.link/" />
          <Input id="slug" name="slug" value={slug} />
        </InputGroup>
        <FormHelperText>To change the slug, you must re-create the short-link.</FormHelperText>
      </FormControl>

      <FormControl mt={{ base: 6, sm: 5 }} isRequired isInvalid={!!result?.errors?.url}>
        <FormLabel htmlFor="url">URL</FormLabel>
        <Input id="url" name="url" defaultValue={result?.values.url || data.url} />
        {result?.errors?.url && <FormErrorMessage>{result?.errors?.url}</FormErrorMessage>}
      </FormControl>

      <FormControl mt={{ base: 6, sm: 5 }} display="flex" alignItems="center">
        <FormLabel htmlFor="enabled" mb={0}>
          Enabled?
        </FormLabel>
        <Switch name="enabled" id="enabled" defaultChecked={data.enabled} />
      </FormControl>
    </Form>
  );
}
